import type { Metadata } from 'next';
import OffTheRecordClient from './otr-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

export const metadata: Metadata = {
  title: 'Off The Record | Confidential Stories | The Chronicle',
  description: 'Exclusive behind-the-scenes content, leaked documents, and unfiltered journalism. The stories they don\'t want you to see.',
  keywords: ['off the record', 'confidential', 'leaked documents', 'exclusive', 'behind the scenes', 'investigative journalism'],
  alternates: {
    canonical: '/off-the-record',
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/off-the-record`,
    title: 'Off The Record | The Chronicle',
    description: 'Exclusive behind-the-scenes content and unfiltered journalism.',
    siteName: 'The Chronicle',
    images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: 'Off The Record' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Off The Record | The Chronicle',
    description: 'Exclusive behind-the-scenes content.',
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function OffTheRecordPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Off The Record',
            description: 'Behind-the-scenes content from The Chronicle journalists.',
            url: `${SITE_URL}/off-the-record`,
            publisher: {
              '@type': 'NewsMediaOrganization',
              name: 'The Chronicle',
              logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
            },
          }),
        }}
      />
      <OffTheRecordClient />
    </>
  );
}
