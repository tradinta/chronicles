import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
function getAdminApp(): App {
    if (getApps().length === 0) {
        // In production, use service account credentials
        // For now, we'll use default credentials or skip if not available
        try {
            return initializeApp({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            });
        } catch (e) {
            console.warn('Firebase Admin init failed, RSS will use mock data');
            throw e;
        }
    }
    return getApps()[0];
}

function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET(request: NextRequest) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

    let articles: any[] = [];

    try {
        const app = getAdminApp();
        const db = getFirestore(app);

        const snapshot = await db
            .collection('articles')
            .where('status', '==', 'published')
            .orderBy('publishDate', 'desc')
            .limit(50)
            .get();

        articles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishDate: doc.data().publishDate?.toDate?.() || new Date(),
        }));
    } catch (error) {
        console.error('Error fetching articles for RSS:', error);
        // Return empty feed on error
    }

    const rssItems = articles.map(article => `
    <item>
      <title>${escapeXml(article.title || 'Untitled')}</title>
      <link>${siteUrl}/article/${article.slug || article.id}</link>
      <description>${escapeXml(article.summary || '')}</description>
      <pubDate>${new Date(article.publishDate).toUTCString()}</pubDate>
      <guid isPermaLink="true">${siteUrl}/article/${article.slug || article.id}</guid>
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ''}
      ${article.imageUrl ? `<enclosure url="${escapeXml(article.imageUrl)}" type="image/jpeg" />` : ''}
    </item>`).join('\n');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Chronicle</title>
    <link>${siteUrl}</link>
    <description>Breaking news and in-depth journalism from The Chronicle.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssFeed, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
