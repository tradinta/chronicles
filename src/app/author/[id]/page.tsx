'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FileText, Rss, Twitter } from 'lucide-react';
import { articles as allArticles } from '@/lib/data';
import ArticleRow from '@/components/main-news/article-row';

const author = {
  name: 'Sarah Jenkins',
  title: 'Senior Tech Correspondent',
  bio: 'Sarah is the Senior Tech Correspondent for The Chronicle, covering the intersection of AI, ethics, and human psychology. She previously worked as a researcher at the Institute for Digital Future and is a three-time recipient of the Digital Journalism Award.',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  articles: allArticles.slice(0, 3), // Placeholder
};

export default function AuthorProfilePage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Author Header */}
      <header className="pt-32 md:pt-40 pb-20 px-6 md:px-12 bg-secondary/30 dark:bg-secondary/10 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Image
              src={author.avatarUrl}
              alt={author.name}
              width={120}
              height={120}
              className="rounded-full mx-auto mb-6 border-4 border-background shadow-lg"
            />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-serif text-5xl md:text-6xl text-foreground mb-3"
          >
            {author.name}
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-sm font-bold tracking-widest uppercase text-primary mb-6"
          >
            {author.title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="max-w-2xl mx-auto text-muted-foreground leading-relaxed"
          >
            {author.bio}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-8 flex items-center justify-center space-x-6 text-muted-foreground"
          >
            <a href="#" className="hover:text-primary transition-colors"><Twitter size={18} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Rss size={18} /></a>
          </motion.div>
        </div>
      </header>

      {/* Articles by Author */}
      <main className="py-16 px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          <h2 className="flex items-center space-x-3 text-sm font-bold tracking-widest uppercase text-muted-foreground mb-8">
            <FileText size={16} />
            <span>Articles by {author.name}</span>
          </h2>

          <div className="border-t border-border">
            {author.articles.map((article) => (
              <ArticleRow key={article.id} article={article} onViewChange={() => router.push('/article/1')} />
            ))}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
