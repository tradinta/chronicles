import { getFirebaseServer } from '@/lib/firebase-server';
import { getRecentArticles } from '@/firebase/firestore/articles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

export async function GET() {
    const { firestore } = getFirebaseServer();
    const articles = await getRecentArticles(firestore, 50);

    const rssItems = articles.map((article: any) => `
        <item>
            <title><![CDATA[${article.title}]]></title>
            <link>${SITE_URL}/article/${article.slug || article.id}</link>
            <guid isPermaLink="false">${article.id}</guid>
            <pubDate>${article.publishDate?.toDate ? article.publishDate.toDate().toUTCString() : new Date().toUTCString()}</pubDate>
            <description><![CDATA[${article.summary}]]></description>
            <content:encoded><![CDATA[${article.content}]]></content:encoded>
            ${article.imageUrl ? `<media:content url="${article.imageUrl}" medium="image" />` : ''}
            <dc:creator><![CDATA[The Chronicle Editorial Team]]></dc:creator>
            <category><![CDATA[${article.category || 'News'}]]></category>
        </item>
    `).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
    xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
    xmlns:media="http://search.yahoo.com/mrss/"
>
    <channel>
        <title>The Chronicle</title>
        <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
        <link>${SITE_URL}</link>
        <description>Intelligent journalism for the modern era.</description>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <language>en-US</language>
        <sy:updatePeriod>hourly</sy:updatePeriod>
        <sy:updateFrequency>1</sy:updateFrequency>
        ${rssItems}
    </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}
