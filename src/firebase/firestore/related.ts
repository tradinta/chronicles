import { Firestore, collection, query, where, getDocs, orderBy, limit, DocumentData } from 'firebase/firestore';

/**
 * Fetches related articles based on matching tags or category.
 * Uses a simple algorithm: prioritize articles with same tags, then same category.
 */
export async function getRelatedArticles(
    firestore: Firestore,
    currentArticleId: string,
    category: string,
    tags: string[] = [],
    limitCount: number = 4
): Promise<DocumentData[]> {
    const articlesRef = collection(firestore, 'articles');
    const results: DocumentData[] = [];
    const seenIds = new Set<string>([currentArticleId]);

    // First, try to find articles with matching tags
    if (tags.length > 0) {
        try {
            // Firestore array-contains-any is limited to 10 values
            const searchTags = tags.slice(0, 10);
            const tagQuery = query(
                articlesRef,
                where('status', '==', 'published'),
                where('tags', 'array-contains-any', searchTags),
                orderBy('publishDate', 'desc'),
                limit(limitCount * 2)
            );

            const tagSnapshot = await getDocs(tagQuery);
            tagSnapshot.docs.forEach(doc => {
                if (!seenIds.has(doc.id) && results.length < limitCount) {
                    seenIds.add(doc.id);
                    results.push({ id: doc.id, ...doc.data() });
                }
            });
        } catch (error) {
            console.warn('Tag-based related articles query failed:', error);
        }
    }

    // If we don't have enough, fill with category-based articles
    if (results.length < limitCount && category) {
        try {
            const categoryQuery = query(
                articlesRef,
                where('status', '==', 'published'),
                where('category', '==', category),
                orderBy('publishDate', 'desc'),
                limit(limitCount * 2)
            );

            const categorySnapshot = await getDocs(categoryQuery);
            categorySnapshot.docs.forEach(doc => {
                if (!seenIds.has(doc.id) && results.length < limitCount) {
                    seenIds.add(doc.id);
                    results.push({ id: doc.id, ...doc.data() });
                }
            });
        } catch (error) {
            console.warn('Category-based related articles query failed:', error);
        }
    }

    // If still not enough, get recent articles
    if (results.length < limitCount) {
        try {
            const recentQuery = query(
                articlesRef,
                where('status', '==', 'published'),
                orderBy('publishDate', 'desc'),
                limit(limitCount * 2)
            );

            const recentSnapshot = await getDocs(recentQuery);
            recentSnapshot.docs.forEach(doc => {
                if (!seenIds.has(doc.id) && results.length < limitCount) {
                    seenIds.add(doc.id);
                    results.push({ id: doc.id, ...doc.data() });
                }
            });
        } catch (error) {
            console.warn('Recent articles fallback query failed:', error);
        }
    }

    return results.slice(0, limitCount);
}
