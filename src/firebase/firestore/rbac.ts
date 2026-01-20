import { Firestore, doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

export type UserRole = 'admin' | 'editor' | 'writer' | 'subscriber';

export const ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    WRITER: 'writer',
    SUBSCRIBER: 'subscriber'
};

/**
 * Checks if a user has a specific role or higher permission level.
 * Hierarchy: admin > editor > writer > subscriber
 */
export async function getUserRole(firestore: Firestore, userId: string): Promise<UserRole | null> {
    try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().role as UserRole;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
}

export function canCreateStandardArticle(role?: UserRole): boolean {
    if (!role) return false;
    return ['admin', 'editor'].includes(role);
}

export function canCreateLiveEvent(role?: UserRole): boolean {
    if (!role) return false;
    return ['admin', 'editor'].includes(role);
}

export function canCreateOffTheRecord(role?: UserRole): boolean {
    if (!role) return false;
    return ['admin', 'editor'].includes(role);
}

export function canCreateEditorial(role?: UserRole): boolean {
    // Basic editorial (like a letter to editor) might be open to writers? 
    // For now, let's keep it restricted or open as per prompt "any logged in users can write an editorial"
    // Prompt says: "any logged in users can write an editorial"
    return true;
}

export function canAccessAdmin(role?: UserRole): boolean {
    if (!role) return false;
    return ['admin'].includes(role);
}
