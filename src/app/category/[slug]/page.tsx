import type { Metadata } from 'next';
import CategoryPageClient from './category-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return {
    title: `${categoryName} News | The Chronicle`,
    description: `Read the latest ${categoryName.toLowerCase()} news and in-depth coverage. Expert analysis and breaking stories in ${categoryName.toLowerCase()}.`,
    keywords: [categoryName.toLowerCase(), `${categoryName.toLowerCase()} news`, 'news', 'journalism', 'coverage'],
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/category/${slug}`,
      title: `${categoryName} News | The Chronicle`,
      description: `Latest ${categoryName.toLowerCase()} news and coverage.`,
      siteName: 'The Chronicle',
      images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: `${categoryName} News` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} News | The Chronicle`,
      description: `Latest ${categoryName.toLowerCase()} news and coverage.`,
      images: [`${SITE_URL}/logo.png`],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${categoryName} News`,
            description: `Latest news and coverage in ${categoryName}`,
            url: `${SITE_URL}/category/${slug}`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'The Chronicle',
              url: SITE_URL,
            },
            about: {
              '@type': 'Thing',
              name: categoryName,
            },
          }),
        }}
      />
      <CategoryPageClient slug={slug} categoryName={categoryName} />
    </>
  );
}
