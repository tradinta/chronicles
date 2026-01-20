import type { Metadata } from 'next';
import CareersPageClient from './careers-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

export const metadata: Metadata = {
  title: 'Careers at The Chronicle | Join Our Team',
  description: 'Join The Chronicle team. We\'re looking for passionate journalists, engineers, designers, and marketers to help build the future of intelligent journalism.',
  keywords: ['careers', 'jobs', 'journalism jobs', 'media jobs', 'work at chronicle', 'hiring'],
  alternates: {
    canonical: '/careers',
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/careers`,
    title: 'Careers at The Chronicle',
    description: 'Join our mission to build the future of journalism.',
    siteName: 'The Chronicle',
    images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: 'Careers at The Chronicle' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at The Chronicle',
    description: 'Join our mission to build the future of journalism.',
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'The Chronicle',
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            sameAs: [
              'https://twitter.com/TheChronicle',
              'https://linkedin.com/company/thechronicle',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Careers',
              email: 'careers@thechronicle.news',
            },
          }),
        }}
      />
      <CareersPageClient />
    </>
  );
}
