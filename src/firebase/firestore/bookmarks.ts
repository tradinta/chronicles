
'use client';

import { doc, setDoc, deleteDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Adds an article to a user's bookmarks.
 * This is a non-blocking write operation.
 */
export function addBookmark(firestore: Firestore, userId: string, articleId: string, articleData: { title: string, publishDate: string, imageUrl: string }) {
  const bookmarkRef = doc(firestore, 'users', userId, 'bookmarks', articleId);
  const data = {
    articleId,
    ...articleData,
    savedDate: serverTimestamp(),
  };

  setDoc(bookmarkRef, data, { merge: true })
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: bookmarkRef.path,
          operation: 'create',
          requestResourceData: data,
        })
      );
    });
}

/**
 * Removes an article from a user's bookmarks.
 * This is a non-blocking write operation.
 */
export function removeBookmark(firestore: Firestore, userId: string, articleId: string) {
  const bookmarkRef = doc(firestore, 'users', userId, 'bookmarks', articleId);
  
  deleteDoc(bookmarkRef)
    .catch(error => {
      errorEmitter.emit(
        'permission-error',
        new FirestorePermissionError({
          path: bookmarkRef.path,
          operation: 'delete',
        })
      );
    });
}
