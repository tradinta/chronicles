import { getFirebaseServer } from '@/lib/firebase-server';
import { getArticleById } from '@/firebase/firestore/articles';
import { getArticleBySlug } from '@/firebase/firestore/article-slug';
import { Metadata } from 'next';
import ArticleClientPage from '@/components/article/article-client-page';
import { doc, getDoc } from 'firebase/firestore';

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { firestore } = getFirebaseServer();
  const article = await getArticleBySlug(firestore, slug);

  if (!article) return { title: 'Not Found' };

  // Fetch author
  let authorName = 'The Chronicle Editorial Team';
  if (article.authorId) {
    const authorRef = doc(firestore, 'users', article.authorId);
    try {
      const authorSnap = await getDoc(authorRef);
      if (authorSnap.exists()) {
        authorName = authorSnap.data().displayName || authorName;
      }
    } catch (e) {
      console.error("Error fetching author for metadata:", e);
    }
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';
  const url = `${SITE_URL}/article/${slug}`;

  return {
    title: article.title,
    description: article.summary,
    authors: [{ name: authorName }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url: url,
      title: article.title,
      description: article.summary,
      siteName: 'The Chronicle',
      images: article.imageUrl ? [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [
        {
          url: `${SITE_URL}/logo.png`,
          width: 1200,
          height: 630,
          alt: 'The Chronicle',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.imageUrl || `${SITE_URL}/logo.png`],
      site: '@TheChronicle',
    }
  };
}

// This function would ideally use cookies or headers to get the user session on the server.
// For now, we'll implement the logic to handle gated content delivery.
async function getAuthUserServer(firestore: any): Promise<{ role: string } | null> {
  // In a real production app with Firebase App Hosting, you might use cookies
  // to identify the user and fetch their profile from Firestore here.
  return null; 
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { firestore } = getFirebaseServer();
  
  const article = await getArticleBySlug(firestore, slug);
  
  if (!article) {
    return <ArticleClientPage slug={slug} initialArticle={null} />;
  }

  // Fetch author
  let authorName = 'The Chronicle Editorial Team';
  if (article.authorId) {
    const authorRef = doc(firestore, 'users', article.authorId);
    try {
      const authorSnap = await getDoc(authorRef);
      if (authorSnap.exists()) {
        authorName = authorSnap.data().displayName || authorName;
      }
    } catch (e) {
      console.error("Error fetching author for metadata:", e);
    }
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';
  const url = `${SITE_URL}/article/${slug}`;

  const user = await getAuthUserServer(firestore);
  const isPremiumUser = user?.role === 'subscriber' || user?.role === 'admin';
  
  // SECURE GATE: If article is premium and user is not, truncate content on the server!
  // This cannot be bypassed by disabling Javascript.
  const isRestricted = !!article.isPremium && !isPremiumUser;
  
  const initialData = {
    ...article,
    publishDate: article.publishDate?.toDate ? article.publishDate.toDate().getTime() : null,
    content: isRestricted 
      ? ((article.content || "").substring(0, 800) + "... [PROTECTED CONTENT]") 
      : (article.content || "")
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: article.imageUrl ? [article.imageUrl] : [`${SITE_URL}/logo.png`],
    datePublished: article.publishDate?.toDate ? article.publishDate.toDate().toISOString() : null,
    dateModified: article.publishDate?.toDate ? article.publishDate.toDate().toISOString() : null,
    author: [{
      '@type': 'Person',
      name: authorName,
      url: article.authorId ? `${SITE_URL}/author/${article.authorId}` : undefined,
    }],
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'The Chronicle',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.category || 'News',
        item: `${SITE_URL}/category/${(article.category || 'news').toLowerCase()}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleClientPage 
        slug={slug} 
        initialArticle={initialData} 
        isRestricted={isRestricted} 
      />
    </>
  );
}
