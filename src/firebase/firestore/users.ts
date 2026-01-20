import { Firestore, collection, getDocs, doc, getDoc, updateDoc, query, orderBy, deleteDoc as firestoreDeleteDoc } from 'firebase/firestore';

export interface UserData {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'writer' | 'subscriber';
    status: 'active' | 'suspended' | 'banned' | 'deleted';
    joinDate: any;
    profileImageUrl?: string;
    contributions?: number;
    isShadowBanned?: boolean;
}

export async function getAllUsers(firestore: Firestore): Promise<UserData[]> {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, orderBy('joinDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
}

export async function updateUserRole(firestore: Firestore, userId: string, newRole: UserData['role']): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { role: newRole });
}

export async function updateUserStatus(firestore: Firestore, userId: string, newStatus: UserData['status']): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { status: newStatus });
}

export async function getUserById(firestore: Firestore, userId: string): Promise<UserData | null> {
    const userRef = doc(firestore, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as UserData;
    }
    return null;
}

export async function shadowBanUser(firestore: Firestore, userId: string, isBanned: boolean): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { isShadowBanned: isBanned });
}

export async function deleteUser(firestore: Firestore, userId: string): Promise<void> {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { status: 'deleted', deletedAt: new Date() });
}

export async function searchUsers(firestore: Firestore, searchTerm: string): Promise<UserData[]> {
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);
    const term = searchTerm.toLowerCase();
    return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as UserData))
        .filter(user =>
            (user.username?.toLowerCase().includes(term)) ||
            (user.email?.toLowerCase().includes(term))
        );
}

export async function getUserCountsByStatus(firestore: Firestore): Promise<Record<string, number>> {
    const usersRef = collection(firestore, 'users');
    const snapshot = await getDocs(usersRef);
    const counts: Record<string, number> = { active: 0, suspended: 0, banned: 0, deleted: 0 };
    snapshot.docs.forEach(doc => {
        const status = doc.data().status || 'active';
        counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
}
