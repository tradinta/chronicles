import { Firestore, collection, getDocs, doc, getDoc, updateDoc, query, orderBy, limit, where } from 'firebase/firestore';

export interface UserData {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'writer' | 'subscriber';
    status: 'active' | 'suspended' | 'banned';
    joinDate: any;
    profileImageUrl?: string;
    contributions?: number;
}

/**
 * Fetches all users, optionally ordered by a field.
 */
export async function getAllUsers(firestore: Firestore): Promise<UserData[]> {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, orderBy('joinDate', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
}

/**
 * Updates a user's role.
 */
export async function updateUserRole(firestore: Firestore, userId: string, newRole: UserData['role']): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { role: newRole });
}

/**
 * Updates a user's status (e.g. suspend or ban).
 */
export async function updateUserStatus(firestore: Firestore, userId: string, newStatus: UserData['status']): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { status: newStatus });
}

/**
 * Fetches a single user by ID.
 */
export async function getUserById(firestore: Firestore, userId: string): Promise<UserData | null> {
    const userRef = doc(firestore, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as UserData;
    }
    return null;
}
