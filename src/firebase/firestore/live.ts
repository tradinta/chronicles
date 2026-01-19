import {
    collection,
    addDoc,
    serverTimestamp,
    Firestore,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    getDoc,
    orderBy,
    limit,
    onSnapshot
} from 'firebase/firestore';

export type LiveEvent = {
    id?: string;
    title: string;
    slug: string;
    summary: string;
    status: 'upcoming' | 'live' | 'ended';
    coverImage?: string;
    startTime: any;
    endTime?: any;
    authorId: string;
};

export type LiveUpdate = {
    id?: string;
    content: string;
    type: 'text' | 'image' | 'breaking' | 'quote';
    timestamp: any;
    authorId: string;
    authorName?: string;
};

/**
 * Creates a new Live Event.
 */
export async function createLiveEvent(firestore: Firestore, eventData: Omit<LiveEvent, 'id' | 'startTime'>) {
    const eventsRef = collection(firestore, 'liveEvents');
    const data = {
        ...eventData,
        startTime: serverTimestamp(),
        createdAt: serverTimestamp(),
    };
    return addDoc(eventsRef, data);
}

/**
 * Fetches all Live Events, optionally filtered by status.
 */
export async function getLiveEvents(firestore: Firestore, status?: 'live' | 'ended' | 'upcoming') {
    const eventsRef = collection(firestore, 'liveEvents');
    let q = query(eventsRef, orderBy('createdAt', 'desc'));

    if (status) {
        q = query(eventsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LiveEvent));
}

/**
 * Fetches a single Live Event by Slug.
 */
export async function getLiveEventBySlug(firestore: Firestore, slug: string): Promise<LiveEvent | null> {
    const eventsRef = collection(firestore, 'liveEvents');
    const q = query(eventsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as LiveEvent;
}

/**
 * Updates a Live Event (e.g., ending it or changing title).
 */
export async function updateLiveEvent(firestore: Firestore, eventId: string, data: Partial<LiveEvent>) {
    const eventRef = doc(firestore, 'liveEvents', eventId);
    return updateDoc(eventRef, data);
}

/**
 * Pushes a new update to a Live Event.
 */
export async function pushLiveUpdate(firestore: Firestore, eventId: string, updateData: Omit<LiveUpdate, 'id' | 'timestamp'>) {
    const updatesRef = collection(firestore, `liveEvents/${eventId}/updates`);
    const data = {
        ...updateData,
        timestamp: serverTimestamp(),
    };
    return addDoc(updatesRef, data);
}

/**
 * Subscribes to updates for a specific Live Event.
 */
export function subscribeToLiveUpdates(firestore: Firestore, eventId: string, callback: (updates: LiveUpdate[]) => void) {
    const updatesRef = collection(firestore, `liveEvents/${eventId}/updates`);
    const q = query(updatesRef, orderBy('timestamp', 'desc'), limit(100));

    return onSnapshot(q, (snapshot) => {
        const updates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LiveUpdate));
        callback(updates);
    });
}
