import { collection, query, where, limit, getDocs, Firestore, DocumentData } from 'firebase/firestore';

/**
 * Fetches a single article by its Slug field.
 * Isolated to avoid circular dependency/cache issues.
 */
export async function getArticleBySlug(firestore: Firestore, slug: string): Promise<DocumentData | null> {
    const articlesRef = collection(firestore, 'articles');
    try {
        const q = query(articlesRef, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } else {
            console.warn(`No article found with slug: ${slug}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching article by slug:", error);
        return null;
    }
}
