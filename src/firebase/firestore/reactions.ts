import { Firestore, doc, runTransaction, getDoc, collection, query, orderBy, getDocs, serverTimestamp, increment, updateDoc } from 'firebase/firestore';

export type ReactionType = 'like' | 'love' | 'insightful' | 'surprised' | 'angry';

export interface Reaction {
    id?: string;
    articleId: string;
    userId: string;
    type: ReactionType;
    createdAt: any;
}

/**
 * Adds or updates a reaction on an article using a transaction to prevent race conditions.
 */
export async function setReaction(
    firestore: Firestore,
    articleId: string,
    userId: string,
    type: ReactionType
): Promise<void> {
    const reactionId = `${userId}_${articleId}`;
    const reactionRef = doc(firestore, 'reactions', reactionId);
    const articleRef = doc(firestore, 'articles', articleId);

    await runTransaction(firestore, async (transaction) => {
        const reactionDoc = await transaction.get(reactionRef);
        const articleDoc = await transaction.get(articleRef);

        if (!articleDoc.exists()) {
            throw new Error("Article does not exist!");
        }

        if (!reactionDoc.exists()) {
            // New reaction
            transaction.set(reactionRef, {
                articleId,
                userId,
                type,
                createdAt: serverTimestamp(),
            });

            // Increment new type and total
            transaction.update(articleRef, {
                [`reactions.${type}`]: increment(1),
                totalReactions: increment(1)
            });
        } else {
            // Updating existing reaction
            const oldType = reactionDoc.data().type as ReactionType;
            if (oldType !== type) {
                transaction.update(reactionRef, {
                    type,
                    createdAt: serverTimestamp(),
                });

                // Decrement old, increment new
                transaction.update(articleRef, {
                    [`reactions.${oldType}`]: increment(-1),
                    [`reactions.${type}`]: increment(1)
                });
            }
            // If type is same, do nothing
        }
    });
}

/**
 * Removes a reaction from an article using a transaction.
 */
export async function removeReaction(firestore: Firestore, articleId: string, userId: string): Promise<void> {
    const reactionId = `${userId}_${articleId}`;
    const reactionRef = doc(firestore, 'reactions', reactionId);
    const articleRef = doc(firestore, 'articles', articleId);

    await runTransaction(firestore, async (transaction) => {
        const reactionDoc = await transaction.get(reactionRef);

        if (reactionDoc.exists()) {
            const type = reactionDoc.data().type as ReactionType;

            transaction.delete(reactionRef);

            // Decrement counts
            transaction.update(articleRef, {
                [`reactions.${type}`]: increment(-1),
                totalReactions: increment(-1)
            });
        }
    });
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
            angry: reactions.angry || 0,
        };
    }
    return { like: 0, love: 0, insightful: 0, surprised: 0, angry: 0 };
}
