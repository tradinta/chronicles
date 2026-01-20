import type { Metadata } from 'next';
import SubscribePageClient from './subscribe-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

export const metadata: Metadata = {
  title: 'Subscribe | Premium Access | The Chronicle',
  description: 'Unlock unlimited access to The Chronicle with our subscription plans. Ad-free reading, exclusive content, breaking news alerts, and more.',
  keywords: ['subscribe', 'subscription', 'premium', 'membership', 'news subscription', 'ad-free news'],
  alternates: {
    canonical: '/subscribe',
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/subscribe`,
    title: 'Subscribe to The Chronicle',
    description: 'Unlock unlimited access to premium journalism, exclusive content, and ad-free reading.',
    siteName: 'The Chronicle',
    images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: 'Subscribe to The Chronicle' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subscribe to The Chronicle',
    description: 'Unlock unlimited access to premium journalism.',
    images: [`${SITE_URL}/logo.png`],
  },
};

export default function SubscribePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'The Chronicle Subscription',
            description: 'Premium subscription to The Chronicle for unlimited access to journalism.',
            brand: {
              '@type': 'Organization',
              name: 'The Chronicle',
            },
            offers: [
              {
                '@type': 'Offer',
                name: 'Explorer',
                price: '650',
                priceCurrency: 'KES',
                availability: 'https://schema.org/InStock',
              },
              {
                '@type': 'Offer',
                name: 'Insider',
                price: '1500',
                priceCurrency: 'KES',
                availability: 'https://schema.org/InStock',
              },
              {
                '@type': 'Offer',
                name: 'VIP',
                price: '3200',
                priceCurrency: 'KES',
                availability: 'https://schema.org/InStock',
              },
            ],
          }),
        }}
      />
      <SubscribePageClient />
    </>
  );
}
