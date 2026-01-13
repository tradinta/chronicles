
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import NewsHeader from '@/components/main-news/news-header';
import CategoryRail from '@/components/main-news/category-rail';
import ArticleRow from '@/components/main-news/article-row';
import InfiniteLoader from '@/components/main-news/infinite-loader';
import Sidebar from '@/components/main-news/sidebar';
import { articles as initialArticles, newArticles as loadableArticles } from '@/lib/data';
import { useRouter } from 'next/navigation';

export default function MainNewsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [articles, setArticles] = useState(initialArticles);
  
  const loadMoreArticles = () => {
    setArticles(prev => [...prev, ...loadableArticles]);
  };
  
  const filteredArticles = articles.filter(article => 
    activeCategory === 'All' || (article.type === 'article' && article.category === activeCategory)
  );

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
          
          <div className="lg:col-span-9">
            {(activeCategory === 'All' ? articles : filteredArticles).map((article) => (
              <ArticleRow key={article.id} article={article} onViewChange={() => router.push(`/article/${article.id}`)} />
            ))}
            <InfiniteLoader loadMore={loadMoreArticles} />
          </div>

          <div className="lg:col-span-3">
             <Sidebar onViewChange={(id) => router.push(`/article/${id}`)} />
          </div>

        </div>
      </div>
    </motion.div>
  );
}
