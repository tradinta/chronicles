import { Firestore, collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, limit, increment } from 'firebase/firestore';

export interface Comment {
    id?: string;
    articleId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: any;
    parentId?: string | null; // For threaded replies
    likes: number;
    isReported?: boolean;
    isHidden?: boolean;
}

/**
 * Adds a new comment to an article.
 */
export async function addComment(firestore: Firestore, commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Promise<string> {
    const commentsRef = collection(firestore, 'articles', commentData.articleId, 'comments');
    const docRef = await addDoc(commentsRef, {
        ...commentData,
        createdAt: serverTimestamp(),
        likes: 0,
        isReported: false,
        isHidden: false,
    });
    return docRef.id;
}

/**
 * Fetches all comments for an article, ordered by creation date.
 */
export async function getComments(firestore: Firestore, articleId: string): Promise<Comment[]> {
    const commentsRef = collection(firestore, 'articles', articleId, 'comments');
    const q = query(commentsRef, where('isHidden', '==', false), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
}

/**
 * Fetches replies to a specific comment.
 */
export async function getReplies(firestore: Firestore, articleId: string, parentId: string): Promise<Comment[]> {
    const commentsRef = collection(firestore, 'articles', articleId, 'comments');
    const q = query(commentsRef, where('parentId', '==', parentId), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
}

/**
 * Reports a comment for moderation.
 */
export async function reportComment(firestore: Firestore, articleId: string, commentId: string): Promise<void> {
    const commentRef = doc(firestore, 'articles', articleId, 'comments', commentId);
    await updateDoc(commentRef, { isReported: true });
}

/**
 * Hides a comment (admin action).
 */
export async function hideComment(firestore: Firestore, articleId: string, commentId: string): Promise<void> {
    const commentRef = doc(firestore, 'articles', articleId, 'comments', commentId);
    await updateDoc(commentRef, { isHidden: true });
}

/**
 * Likes a comment.
 */
export async function likeComment(firestore: Firestore, articleId: string, commentId: string): Promise<void> {
    const commentRef = doc(firestore, 'articles', articleId, 'comments', commentId);
    await updateDoc(commentRef, { likes: increment(1) });
}

/**
 * Deletes a comment (only by owner or admin).
 */
export async function deleteComment(firestore: Firestore, articleId: string, commentId: string): Promise<void> {
    const commentRef = doc(firestore, 'articles', articleId, 'comments', commentId);
    await deleteDoc(commentRef);
}
