
'use client';

import { collection, addDoc, serverTimestamp, Firestore, query, where, getDocs, doc, updateDoc, getDoc, DocumentData } from 'firebase/firestore';
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
