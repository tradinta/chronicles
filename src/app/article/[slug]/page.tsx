import { getFirebaseServer } from '@/lib/firebase-server';
import { getArticleById } from '@/firebase/firestore/articles';
import { getArticleBySlug } from '@/firebase/firestore/article-slug';
import { Metadata } from 'next';
import ArticleClientPage from '@/components/article/article-client-page';

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { firestore } = getFirebaseServer();
  const article = await getArticleBySlug(firestore, slug);

  if (!article) return { title: 'Not Found' };

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : [],
    }
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ArticleClientPage slug={slug} />;
}
