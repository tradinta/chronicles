import type { Metadata } from 'next';
import HomePage from './home-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

export const metadata: Metadata = {
  title: 'The Chronicle | Intelligent Journalism for the Modern Era',
  description: 'Breaking news, investigative reports, and in-depth coverage of politics, technology, science, and culture. Award-winning journalism that matters.',
  keywords: ['news', 'journalism', 'breaking news', 'politics', 'technology', 'science', 'culture', 'investigative journalism', 'current events'],
  authors: [{ name: 'The Chronicle Editorial Team' }],
  creator: 'The Chronicle',
  publisher: 'The Chronicle Media Group',
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'The Chronicle',
    title: 'The Chronicle | Intelligent Journalism',
    description: 'Breaking news and in-depth journalism covering politics, technology, science, and culture.',
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'The Chronicle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Chronicle | Intelligent Journalism',
    description: 'Breaking news and in-depth journalism covering politics, technology, science, and culture.',
    images: [`${SITE_URL}/logo.png`],
    creator: '@TheChronicle',
    site: '@TheChronicle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'The Chronicle',
            url: SITE_URL,
            description: 'Intelligent journalism for the modern era.',
            publisher: {
              '@type': 'Organization',
              name: 'The Chronicle',
              logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
              },
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: `${SITE_URL}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <HomePage />
    </>
  );
}
