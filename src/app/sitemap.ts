import { MetadataRoute } from 'next';
import { getFirebaseServer } from '@/lib/firebase-server';
import { getRecentArticles } from '@/firebase/firestore/articles';
import { getLiveEvents } from '@/firebase/firestore/live';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { firestore } = getFirebaseServer();
    const baseUrl = 'https://the-chronicles.vercel.app'; // Replace with actual domain

    // 1. Static Routes
    const routes = [
        '',
        '/news',
        '/live',
        '/off-the-record',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // 2. Articles
    const articles = await getRecentArticles(firestore, 100);
    const articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/article/${article.id}`, // using ID as slug is current logic? Or check if slug field exists
        lastModified: article.publishDate?.toDate?.() || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 3. Live Events
    const liveEvents = await getLiveEvents(firestore);
    const liveRoutes = liveEvents.map((event) => ({
        url: `${baseUrl}/live/${event.slug}`,
        lastModified: event.startTime?.toDate?.() || new Date(),
        changeFrequency: 'always' as const, // Live events change often
        priority: 0.9,
    }));

    return [...routes, ...articleRoutes, ...liveRoutes];
}
