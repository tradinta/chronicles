import { Firestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs, serverTimestamp, limit, addDoc } from 'firebase/firestore';

/**
 * Tracks an article read in the user's reading history.
 */
export async function trackReadingHistory(
    firestore: Firestore,
    userId: string,
    articleId: string,
    articleData: { title: string; slug: string; imageUrl?: string; category?: string }
): Promise<void> {
    const historyRef = doc(firestore, 'users', userId, 'readingHistory', articleId);
    await setDoc(historyRef, {
        ...articleData,
        articleId,
        readAt: serverTimestamp(),
    }, { merge: true }); // Merge to update timestamp if already exists
}

/**
 * Fetches the user's reading history.
 */
export async function getReadingHistory(firestore: Firestore, userId: string, limitCount: number = 20): Promise<any[]> {
    const historyRef = collection(firestore, 'users', userId, 'readingHistory');
    const q = query(historyRef, orderBy('readAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Subscribes an email to the newsletter.
 */
export async function subscribeToNewsletter(firestore: Firestore, email: string, preferences?: { daily?: boolean; weekly?: boolean }): Promise<string> {
    const subscribersRef = collection(firestore, 'newsletter_subscribers');

    // Check if already subscribed (could also use email as doc ID for upsert)
    const docRef = await addDoc(subscribersRef, {
        email,
        preferences: preferences || { weekly: true },
        subscribedAt: serverTimestamp(),
        isActive: true,
    });

    return docRef.id;
}

/**
 * Unsubscribes an email from the newsletter.
 */
export async function unsubscribeFromNewsletter(firestore: Firestore, subscriberId: string): Promise<void> {
    const subRef = doc(firestore, 'newsletter_subscribers', subscriberId);
    await setDoc(subRef, { isActive: false }, { merge: true });
}
