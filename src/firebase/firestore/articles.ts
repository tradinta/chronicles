

import { collection, addDoc, serverTimestamp, Firestore, query, where, getDocs, doc, updateDoc, getDoc, DocumentData, orderBy, limit, Timestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type ArticleStatus = 'draft' | 'review' | 'published' | 'scheduled' | 'takedown';

export type ArticleData = {
  title: string;
  summary: string;
  slug: string;
  content: string;
  imageUrl: string;
  authorId: string;
  authorIds?: string[]; // Multi-author support
  category: string;
  tags: string[];
  status?: ArticleStatus;
  publishAt?: Date | null; // Scheduled publish time
  isBreaking?: boolean;
}

/**
 * Creates a new article in Firestore with workflow support.
 * Status defaults to 'draft'. Set to 'review' to submit for editorial review.
 */
export function createArticle(firestore: Firestore, articleData: ArticleData, options?: { status?: ArticleStatus }) {
  const articlesRef = collection(firestore, 'articles');

  const status = options?.status || articleData.status || 'draft';
  const isScheduled = status === 'scheduled' && articleData.publishAt;

  const data = {
    ...articleData,
    status,
    authorIds: articleData.authorIds || [articleData.authorId],
    publishDate: status === 'published' ? serverTimestamp() : null,
    scheduledPublishAt: isScheduled ? Timestamp.fromDate(articleData.publishAt!) : null,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp(),
    version: 1,
  };

  return addDoc(articlesRef, data)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: articlesRef.path,
          operation: 'create',
          requestResourceData: data,
        })
      );
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
 * Updates the status of an article (supports full publishing workflow).
 * If publishing, sets publishDate. If scheduling, sets scheduledPublishAt.
 */
export async function updateArticleStatus(
  firestore: Firestore,
  articleId: string,
  status: ArticleStatus,
  options?: { publishAt?: Date; incrementVersion?: boolean }
) {
  const articleRef = doc(firestore, 'articles', articleId);
  try {
    const updateData: any = { status, lastUpdated: serverTimestamp() };

    if (status === 'published') {
      updateData.publishDate = serverTimestamp();
      updateData.scheduledPublishAt = null;
    } else if (status === 'scheduled' && options?.publishAt) {
      updateData.scheduledPublishAt = Timestamp.fromDate(options.publishAt);
    }

    if (options?.incrementVersion) {
      // In a real app, you'd get the current version first
      // For now, we assume version tracking is handled separately
    }

    await updateDoc(articleRef, updateData);
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


/**
 * Fetches breaking news articles.
 */
export async function getBreakingNews(firestore: Firestore, limitCount: number = 5): Promise<DocumentData[]> {
  const articlesRef = collection(firestore, 'articles');
  try {
    const q = query(
      articlesRef,
      where("isBreaking", "==", true),
      where("status", "==", "published"),
      orderBy("publishDate", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // If index is missing, just return recent articles as fallback or empty
    console.warn("Error fetching breaking news (check indexes):", error);
    return [];
  }
}
