import { getFirebaseServer } from '@/lib/firebase-server';
import { getArticleById } from '@/firebase/firestore/articles';
import { Metadata } from 'next';
import ArticleClientPage from '@/components/article/article-client-page';

type Props = {
  params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { firestore } = getFirebaseServer();
  const article = await getArticleById(firestore, params.slug);

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

export default function Page({ params }: Props) {
  return <ArticleClientPage slug={params.slug} />;
}
