

import { collection, addDoc, serverTimestamp, Firestore, query, where, getDocs, doc, updateDoc, getDoc, DocumentData, orderBy, limit } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type ArticleData = {
  title: string;
  summary: string;
  slug: string;
  content: string;
  imageUrl: string;
  authorId: string;
  category: string;
  tags: string[];
}

/**
 * Creates a new article in Firestore.
 * This is a non-blocking write operation that returns a promise.
 */
export function createArticle(firestore: Firestore, articleData: ArticleData) {
  const articlesRef = collection(firestore, 'articles');

  const data = {
    ...articleData,
    status: 'published', // default status
    publishDate: serverTimestamp(),
  };

  // Return the promise so the caller can await it if needed
  return addDoc(articlesRef, data)
    .catch(error => {
      // Create and emit a contextual permission error
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: articlesRef.path,
          operation: 'create',
          requestResourceData: data,
        })
      );
      // Re-throw the original error to allow the caller's catch block to execute
      throw error;
    });
}

/**
 * Fetches all articles by a specific author.
 */
export function getArticlesByAuthor(firestore: Firestore, authorId: string) {
  const articlesRef = collection(firestore, 'articles');
  return query(articlesRef, where("authorId", "==", authorId));
}

/**
 * Updates an existing article in Firestore.
 */
export async function updateArticle(firestore: Firestore, articleId: string, articleData: Partial<ArticleData>) {
  const articleRef = doc(firestore, 'articles', articleId);
  try {
    await updateDoc(articleRef, {
      ...articleData,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: articleRef.path,
        operation: 'update',
        requestResourceData: articleData,
      })
    );
    throw error;
  }
}

/**
 * Fetches a single article by its ID.
 */
export async function getArticleById(firestore: Firestore, articleId: string): Promise<DocumentData | null> {
  const articleRef = doc(firestore, 'articles', articleId);
  try {
    const docSnap = await getDoc(articleRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.warn("No such document!");
      return null;
    }
  } catch (error) {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: articleRef.path,
        operation: 'get',
      })
    );
    throw error;
  }
}


/**
 * Updates the status of an article (e.g., for takedown).
 */
export async function updateArticleStatus(firestore: Firestore, articleId: string, status: 'published' | 'draft' | 'takedown') {
  const articleRef = doc(firestore, 'articles', articleId);
  try {
    await updateDoc(articleRef, { status });
  } catch (error) {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: articleRef.path,
        operation: 'update',
        requestResourceData: { status },
      })
    );
    throw error;
  }
}

/**
 * Fetches the most recent article marked as featured.
 */
export async function getFeaturedArticle(firestore: Firestore): Promise<DocumentData | null> {
  const articlesRef = collection(firestore, 'articles');
  // For now, let's just take the most recent published article as "featured" to keep it simple,
  const q = query(
    articlesRef,
    where("status", "==", "published"),
    orderBy("publishDate", "desc"),
    limit(1)
  );

  // Note: You need a composite index for this query if you filter by status and order by publishDate.
  // If it fails, check the console for the index creation link.

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  return null;
}

/**
 * Fetches the N most recent published articles.
 */
export async function getRecentArticles(firestore: Firestore, limitCount: number = 3): Promise<DocumentData[]> {
  const articlesRef = collection(firestore, 'articles');
  // Query ordered by date only to avoid composite index with status
  const q = query(
    articlesRef,
    orderBy("publishDate", "desc"),
    limit(limitCount + 5) // buffer for drafts
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((doc: any) => doc.status === 'published')
    .slice(0, limitCount);
}

/**
 * Fetches published articles by category.
 */
export async function getArticlesByCategory(firestore: Firestore, category: string, limitCount: number = 3): Promise<DocumentData[]> {
  const articlesRef = collection(firestore, 'articles');
  // Simplified query: Category + Date (might still need index, but status is removed)
  // If this fails, we might need to filter category in memory too, but let's try this first.
  const q = query(
    articlesRef,
    where("category", "==", category),
    orderBy("publishDate", "desc"),
    limit(limitCount + 5)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((doc: any) => doc.status === 'published')
    .slice(0, limitCount);
}

/**
 * Fetches all articles by a specific author (Async returning data).
 */
export async function getAuthorArticles(firestore: Firestore, authorId: string): Promise<DocumentData[]> {
  const articlesRef = collection(firestore, 'articles');
  const q = query(
    articlesRef,
    where("authorId", "==", authorId),
    orderBy("publishDate", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Fetches statistics for an author (Total articles, drafts, published, etc.).
 */
export async function getAuthorStats(firestore: Firestore, authorId: string) {
  const articlesRef = collection(firestore, 'articles');
  const q = query(articlesRef, where("authorId", "==", authorId));
  const querySnapshot = await getDocs(q);

  const totalArticles = querySnapshot.size;
  let publishedCount = 0;
  let draftCount = 0;
  let totalViews = 0;

  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.status === 'published') publishedCount++;
    else draftCount++;
    if (data.views) totalViews += Number(data.views) || 0;
  });

  return {
    totalArticles,
    publishedCount,
    draftCount,
    totalViews
  };
}

/**
 * Fetches a single article by its Slug field.
 */

