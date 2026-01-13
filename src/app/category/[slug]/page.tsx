'use client';

import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import ArticleRow from '@/components/main-news/article-row';
import { articles as allArticles } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [categoryName, setCategoryName] = useState('');

  const filteredArticles = allArticles.filter(
    (article) => article.type === 'article' && article.category?.toLowerCase() === slug
  );

  useEffect(() => {
    if (filteredArticles.length > 0) {
      setCategoryName(filteredArticles[0].category || 'Category');
    } else {
        const formattedSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
        setCategoryName(formattedSlug);
    }
  }, [slug, filteredArticles]);
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <header className="pt-32 pb-12 px-6 md:px-12 border-b border-border bg-secondary/30 dark:bg-secondary/10">
        <div className="container mx-auto">
          <button onClick={() => router.push('/news')} className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft size={16} />
            <span>All News</span>
          </button>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground">{categoryName}</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 py-12">
        <div className="lg:col-span-9">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <ArticleRow key={article.id} article={article} onViewChange={() => router.push(`/article/${article.id}`)} />
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
                <h2 className="text-xl font-semibold">No articles found</h2>
                <p className="text-muted-foreground mt-2">There are no articles in the "{categoryName}" category yet.</p>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
