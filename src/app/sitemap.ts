import { MetadataRoute } from 'next';
import { getFirebaseServer } from '@/lib/firebase-server';
import { getRecentArticles } from '@/firebase/firestore/articles';
import { getLiveEvents } from '@/firebase/firestore/live';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

// Categories for SEO
const CATEGORIES = [
    'technology',
    'politics',
    'business',
    'science',
    'health',
    'sports',
    'entertainment',
    'world',
    'opinion',
    'culture',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { firestore } = getFirebaseServer();

    // 1. Static Routes with SEO priority
    const staticRoutes = [
        { path: '', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/news', priority: 0.95, changeFrequency: 'hourly' as const },
        { path: '/live', priority: 0.95, changeFrequency: 'always' as const },
        { path: '/off-the-record', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/subscribe', priority: 0.7, changeFrequency: 'weekly' as const },
        { path: '/careers', priority: 0.5, changeFrequency: 'weekly' as const },
        { path: '/bookmarks', priority: 0.3, changeFrequency: 'weekly' as const },
        { path: '/legal/privacy-policy', priority: 0.2, changeFrequency: 'monthly' as const },
        { path: '/legal/terms-of-service', priority: 0.2, changeFrequency: 'monthly' as const },
        { path: '/legal/takedown', priority: 0.2, changeFrequency: 'monthly' as const },
    ].map((route) => ({
        url: `${SITE_URL}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    // 2. Category Routes
    const categoryRoutes = CATEGORIES.map((category) => ({
        url: `${SITE_URL}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // 3. Articles
    const articles = await getRecentArticles(firestore, 200);
    const articleRoutes = articles.map((article) => ({
        url: `${SITE_URL}/article/${article.slug || article.id}`,
        lastModified: article.publishDate?.toDate?.() || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // 4. Live Events
    const liveEvents = await getLiveEvents(firestore);
    const liveRoutes = liveEvents.map((event) => ({
        url: `${SITE_URL}/live/${event.slug}`,
        lastModified: event.startTime?.toDate?.() || new Date(),
        changeFrequency: 'always' as const,
        priority: event.status === 'live' ? 1.0 : 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...liveRoutes];
}

