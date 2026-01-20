'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFirestore } from '@/firebase';
import { getRecentArticles, getArticlesByCategory } from '@/firebase/firestore/articles';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Components
import NewsHeader from '@/components/main-news/news-header';
import CategoryRail from '@/components/main-news/category-rail';
import ArticleRow from '@/components/main-news/article-row';
import Sidebar from '@/components/main-news/sidebar';

export default function MainNewsPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      if (!firestore) return;
      setIsLoading(true);
      try {
        let data;
        if (activeCategory === 'All') {
          data = await getRecentArticles(firestore, 20);
        } else {
          data = await getArticlesByCategory(firestore, activeCategory, 20);
        }
        // Map Firestore data to the format expected by ArticleRow if necessary
        // Assuming ArticleRow expects { id, title, summary, category, imageUrl, authorId, publishDate }
        // The getRecentArticles returns exactly that + id.
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, [firestore, activeCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <NewsHeader />
      <CategoryRail activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-9 min-h-[50vh]">
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
              </div>
            )}

            {!isLoading && articles.length === 0 && (
              <div className="text-center py-20 text-muted-foreground font-serif italic">
                No stories found in this section.
              </div>
            )}

            {!isLoading && articles.map((article) => (
              <ArticleRow
                key={article.id}
                article={{
                  ...article,
                  type: 'article', // Shim for legacy component prop
                  longSummary: article.summary, // Shim
                  date: article.publishDate?.toDate?.().toLocaleDateString() || 'Recently' // Shim
                }}
                onViewChange={() => router.push(`/article/${article.id}`)}
              />
            ))}

            {/* Infinite Loader removed for now, simple pagination/limit is better for stability first */}
          </div>

          <div className="lg:col-span-3">
            <Sidebar onViewChange={(id) => router.push(`/article/${id}`)} />
          </div>

        </div>
      </div>
    </motion.div>
  );
}
