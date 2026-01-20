import type { Metadata } from 'next';
import LivePageClient from './live-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

export const metadata: Metadata = {
  title: 'Live Coverage & Breaking News | The Chronicle',
  description: 'Real-time updates on breaking news stories. Follow our journalists on the ground for live coverage of the events that matter most.',
  keywords: ['live news', 'breaking news', 'live coverage', 'real-time news', 'live updates', 'news broadcast'],
  alternates: {
    canonical: '/live',
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/live`,
    title: 'Live Coverage & Breaking News | The Chronicle',
    description: 'Real-time updates on breaking news stories from our journalists on the ground.',
    siteName: 'The Chronicle',
    images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: 'The Chronicle Live' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live Coverage | The Chronicle',
    description: 'Real-time updates on breaking news stories.',
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function LivePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Live Coverage',
            description: 'Real-time breaking news coverage from The Chronicle.',
            url: `${SITE_URL}/live`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'The Chronicle',
              url: SITE_URL,
            },
            specialty: 'Breaking News',
            publisher: {
              '@type': 'NewsMediaOrganization',
              name: 'The Chronicle',
              logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
            },
          }),
        }}
      />
      <LivePageClient />
    </>
  );
}
