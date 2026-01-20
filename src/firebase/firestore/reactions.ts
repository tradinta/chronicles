import { Firestore, doc, setDoc, deleteDoc, getDoc, collection, query, orderBy, getDocs, serverTimestamp, increment, updateDoc } from 'firebase/firestore';

export type ReactionType = 'like' | 'love' | 'insightful' | 'surprised';

export interface Reaction {
    id?: string;
    articleId: string;
    userId: string;
    type: ReactionType;
    createdAt: any;
}

/**
 * Adds or updates a reaction on an article.
 * Uses a compound key of `userId_articleId` to ensure one reaction per user per article.
 */
export async function setReaction(
    firestore: Firestore,
    articleId: string,
    userId: string,
    type: ReactionType
): Promise<void> {
    const reactionId = `${userId}_${articleId}`;
    const reactionRef = doc(firestore, 'reactions', reactionId);

    // Check if reaction exists to update article count atomically
    const existing = await getDoc(reactionRef);

    await setDoc(reactionRef, {
        articleId,
        userId,
        type,
        createdAt: serverTimestamp(),
    });

    // If this is a new reaction (not an update), increment article reaction count
    if (!existing.exists()) {
        const articleRef = doc(firestore, 'articles', articleId);
        await updateDoc(articleRef, {
            [`reactions.${type}`]: increment(1),
            totalReactions: increment(1)
        });
    }
}

/**
 * Removes a reaction from an article.
 */
export async function removeReaction(firestore: Firestore, articleId: string, userId: string): Promise<void> {
    const reactionId = `${userId}_${articleId}`;
    const reactionRef = doc(firestore, 'reactions', reactionId);

    const existing = await getDoc(reactionRef);
    if (existing.exists()) {
        const type = existing.data().type as ReactionType;
        await deleteDoc(reactionRef);

        // Decrement article reaction count
        const articleRef = doc(firestore, 'articles', articleId);
        await updateDoc(articleRef, {
            [`reactions.${type}`]: increment(-1),
            totalReactions: increment(-1)
        });
    }
}

/**
 * Gets a user's reaction on an article, if any.
 */
export async function getUserReaction(firestore: Firestore, articleId: string, userId: string): Promise<ReactionType | null> {
    const reactionId = `${userId}_${articleId}`;
    const reactionRef = doc(firestore, 'reactions', reactionId);
    const snap = await getDoc(reactionRef);
    if (snap.exists()) {
        return snap.data().type as ReactionType;
    }
    return null;
}

/**
 * Gets reaction counts for an article.
 */
export async function getArticleReactions(firestore: Firestore, articleId: string): Promise<Record<ReactionType, number>> {
    const articleRef = doc(firestore, 'articles', articleId);
    const snap = await getDoc(articleRef);
    if (snap.exists()) {
        const reactions = snap.data().reactions || {};
        return {
            like: reactions.like || 0,
            love: reactions.love || 0,
            insightful: reactions.insightful || 0,
            surprised: reactions.surprised || 0,
        };
    }
    return { like: 0, love: 0, insightful: 0, surprised: 0 };
}
