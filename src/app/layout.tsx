import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import App from './App';
import QueryProvider from '@/components/providers/query-provider';

import PageViewTracker from '@/components/tracking/PageViewTracker';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The Chronicle',
    template: '%s | The Chronicle',
  },
  description: 'Intelligent journalism for the modern era. Breaking news, investigative reports, and in-depth coverage.',
  keywords: ['news', 'journalism', 'breaking news', 'politics', 'technology'],
  authors: [{ name: 'The Chronicle Editorial Team' }],
  creator: 'The Chronicle',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'The Chronicle',
    title: 'The Chronicle',
    description: 'Intelligent journalism for the modern era.',
    images: [
      {
        url: '/og-default.png', // We need to ensure this exists or use logo
        width: 1200,
        height: 630,
        alt: 'The Chronicle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Chronicle',
    description: 'Intelligent journalism for the modern era.',
    images: ['/og-default.png'],
    creator: '@TheChronicle',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <App>
          <PageViewTracker />
          <QueryProvider>
            {children}
          </QueryProvider>
        </App>
        <Toaster />
      </body>
    </html>
  );
}
