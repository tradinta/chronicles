
'use client';

import { collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type ArticleData = {
    title: string;
    summary: string;
    content: string;
    imageUrl: string;
    authorId: string;
    category: string;
}

/**
 * Creates a new article in Firestore.
 * This is a non-blocking write operation that returns a promise.
 */
export function createArticle(firestore: Firestore, articleData: ArticleData) {
  const articlesRef = collection(firestore, 'articles');
  
  const data = {
    ...articleData,
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
