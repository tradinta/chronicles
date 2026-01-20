import { Firestore, collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, limit } from 'firebase/firestore';

export interface ArticleVersion {
    id?: string;
    articleId: string;
    version: number;
    content: string;
    title: string;
    summary: string;
    editedBy: string;
    editedAt: any;
    changeNote?: string;
}

/**
 * Saves a new version of an article to the versions subcollection.
 */
export async function saveArticleVersion(
    firestore: Firestore,
    articleId: string,
    versionData: Omit<ArticleVersion, 'id' | 'editedAt'>
): Promise<string> {
    const versionsRef = collection(firestore, 'articles', articleId, 'versions');
    const docRef = await addDoc(versionsRef, {
        ...versionData,
        editedAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Fetches all versions of an article, ordered by version number descending.
 */
export async function getArticleVersions(firestore: Firestore, articleId: string): Promise<ArticleVersion[]> {
    const versionsRef = collection(firestore, 'articles', articleId, 'versions');
    const q = query(versionsRef, orderBy('version', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleVersion));
}

/**
 * Fetches the latest version number for an article.
 */
export async function getLatestVersionNumber(firestore: Firestore, articleId: string): Promise<number> {
    const versionsRef = collection(firestore, 'articles', articleId, 'versions');
    const q = query(versionsRef, orderBy('version', 'desc'), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return 0;
    return snapshot.docs[0].data().version || 0;
}
