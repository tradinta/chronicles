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
      images: article.imageUrl ? [article.imageUrl] : [`${SITE_URL}/logo.png`],
      site: '@TheChronicle',
    }
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ArticleClientPage slug={slug} />;
}
