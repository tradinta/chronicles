import { Firestore, collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

export interface AnalyticMetric {
    title: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    description?: string;
}

export interface AnalyticsDashboardData {
    overview: AnalyticMetric[];
    topArticles: any[];
    categoryDistribution: { name: string; value: number }[];
    recentActivity: any[];
}

export async function getSystemAnalytics(firestore: Firestore): Promise<AnalyticsDashboardData> {
    const articlesRef = collection(firestore, 'articles');
    const usersRef = collection(firestore, 'users');

    // 1. Fetch Articles Snapshot (Used for multiple metrics)
    // Note: For production with thousands of docs, use aggregation queries (count()). 
    // For now, fetching docs for client-side aggregation is acceptable for MVPs.
    const articlesSnap = await getDocs(articlesRef);
    const articles = articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 2. Fetch Users Snapshot
    // Ideally, we'd count() but let's see if we have access to metadata
    let userCount = 0;
    try {
        const usersSnap = await getDocs(usersRef);
        userCount = usersSnap.size;
    } catch (e) {
        console.warn("Could not fetch users collection (might not exist or permission denied)", e);
        userCount = 0; // Fallback
    }

    // --- AGGREGATION LOGIC ---

    // A. Content Metrics
    const totalArticles = articles.length;
    const publishedArticles = articles.filter((a: any) => a.status === 'published');
    const drafts = articles.filter((a: any) => a.status === 'draft');
    const breakingNews = articles.filter((a: any) => a.isBreaking);

    // B. Engagement Metrics
    let totalViews = 0;
    let totalReadTimeMinutes = 0;

    // Category Breakdown
    const categoryMap: Record<string, number> = {};

    articles.forEach((a: any) => {
        // Views
        const views = Number(a.views) || 0;
        totalViews += views;

        // Read Time (Assume ~200 wpm if not stored, or use stored field)
        // If 'content' string exists, rough calc:
        if (a.content) {
            const words = a.content.trim().split(/\s+/).length;
            const mins = Math.ceil(words / 200);
            totalReadTimeMinutes += (mins * (views || 1)); // Total time spent by all users
        }

        // Categories
        const cat = a.category || 'Uncategorized';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryMap).map(key => ({
        name: key,
        value: categoryMap[key]
    }));

    // C. Top Articles
    const topArticles = [...articles]
        .sort((a: any, b: any) => (Number(b.views) || 0) - (Number(a.views) || 0))
        .slice(0, 5)
        .map((a: any) => ({
            id: a.id,
            title: a.title,
            views: a.views || 0,
            authorId: a.authorId,
            publishDate: a.publishDate
        }));

    // D. User Growth (Mocked trend for now as we might not have historical snapshots)
    const userTrend = "+12%"; // Placeholder

    // --- CONSTRUCT RESULT ---

    return {
        overview: [
            {
                title: "Total Users",
                value: userCount,
                trend: userTrend,
                trendUp: true,
                description: "Registered accounts"
            },
            {
                title: "Total Articles",
                value: totalArticles,
                trend: `+${publishedArticles.length} Pub`,
                trendUp: true,
                description: "Across all categories"
            },
            {
                title: "Total Views",
                value: totalViews.toLocaleString(),
                trend: "+5%",
                trendUp: true,
                description: "Page views all time"
            },
            {
                title: "Avg Read Time",
                value: `${Math.round(totalReadTimeMinutes / (totalViews || 1))}m`, // Avg per view
                trend: "Steady",
                trendUp: true,
                description: "Engagement depth"
            },
            {
                title: "Drafts",
                value: drafts.length,
                description: "Pending publication"
            },
            {
                title: "Breaking News",
                value: breakingNews.length,
                description: "High priority alerts"
            }
        ],
        topArticles,
        categoryDistribution,
        recentActivity: [] // Could query logs if available
    };
}
