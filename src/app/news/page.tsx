import type { Metadata } from 'next';
import NewsPageClient from './news-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

export const metadata: Metadata = {
  title: 'Latest News & Headlines | The Chronicle',
  description: 'Stay informed with the latest breaking news, headlines, and in-depth coverage across politics, technology, science, culture, and more. Updated around the clock.',
  keywords: ['latest news', 'breaking news', 'headlines', 'current events', 'news today', 'world news', 'top stories'],
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/news`,
    title: 'Latest News & Headlines | The Chronicle',
    description: 'Stay informed with the latest breaking news and in-depth coverage across all topics.',
    siteName: 'The Chronicle',
    images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: 'The Chronicle News' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest News & Headlines | The Chronicle',
    description: 'Stay informed with the latest breaking news and in-depth coverage.',
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function NewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Latest News',
            description: 'The latest news and headlines from The Chronicle.',
            url: `${SITE_URL}/news`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'The Chronicle',
              url: SITE_URL,
            },
            publisher: {
              '@type': 'Organization',
              name: 'The Chronicle',
              logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
            },
          }),
        }}
      />
      <NewsPageClient />
    </>
  );
}
