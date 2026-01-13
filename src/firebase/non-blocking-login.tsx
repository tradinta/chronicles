
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FirebaseError,
  UserCredential
} from 'firebase/auth';

type AuthCallbacks = {
  onSuccess?: (userCredential: UserCredential) => void;
  onError?: (error: FirebaseError) => void;
};

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, { onSuccess, onError }: AuthCallbacks = {}): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(onSuccess)
    .catch(onError);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, { onSuccess, onError }: AuthCallbacks = {}): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .then(onSuccess)
    .catch(onError);
}
