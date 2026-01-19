import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

export function getFirebaseServer() {
    // Just for server-side read usage
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    return { firestore };
}
