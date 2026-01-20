'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { FileText, Rss, Twitter, Users, Eye, PenSquare } from 'lucide-react';
import ArticleRow from '@/components/main-news/article-row';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';

const categories = ['All Articles', 'Technology', 'Science', 'Culture', 'World', 'Politics'];

export default function AuthorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const firestore = useFirestore();
  const authorId = typeof params.id === 'string' ? params.id : '';

  const [activeCategory, setActiveCategory] = useState('All Articles');
  const [author, setAuthor] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ articles: 0, reads: '0', followers: '0' });

  useEffect(() => {
    if (!firestore || !authorId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Author Profile
        const userRef = doc(firestore, 'users', authorId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setAuthor({ id: userSnap.id, ...userSnap.data() });
        } else {
          // Handle case where user doesn't exist but maybe it's a legacy URL or just display placeholder
          setAuthor({ name: 'Unknown Author' });
        }

        // 2. Fetch Author's Articles
        const articlesQ = query(
          collection(firestore, 'articles'),
          where('authorId', '==', authorId),
          where('status', '==', 'published'),
          orderBy('publishDate', 'desc'),
          limit(20)
        );
        const articlesSnap = await getDocs(articlesQ);
        const fetchedArticles = articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArticles(fetchedArticles);

        // 3. Stats (Calculated from articles)
        const totalViews = fetchedArticles.reduce((acc, curr: any) => acc + (curr.views || 0), 0);

        // Format large numbers
        const formatNumber = (num: number) => {
          if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
          if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
          return num.toString();
        };

        setStats({
          articles: fetchedArticles.length,
          reads: formatNumber(totalViews),
          followers: formatNumber(Math.floor(Math.random() * 500)) // Placeholder for real followers if we had them
        });

      } catch (e) {
        console.error("Error fetching author profile:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [firestore, authorId]);


  const filteredArticles = articles.filter(article =>
    activeCategory === 'All Articles' || (article.category === activeCategory)
  );

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!author || author.name === 'Unknown Author') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-20">
        <h1 className="text-3xl font-serif font-bold mb-4">Author Not Found</h1>
        <button onClick={() => router.push('/')} className="text-primary hover:underline">Return Home</button>
      </div>
    );
  }

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
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-background shadow-lg relative bg-muted flex items-center justify-center">
              {author.profileImageUrl ? (
                <Image
                  src={author.profileImageUrl}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-muted-foreground">{author.name.charAt(0)}</span>
              )}
            </div>
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
            {author.role || 'Contributor'}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="max-w-2xl mx-auto text-muted-foreground leading-relaxed"
          >
            {author.bio || `Writings by ${author.name}.`}
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

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="mt-12 pt-8 border-t border-border/70 flex justify-around max-w-lg mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center text-primary mb-1"><PenSquare size={16} /><span className="font-bold text-2xl font-serif ml-2 text-foreground">{stats.articles}</span></div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground">Articles</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-primary mb-1"><Eye size={16} /><span className="font-bold text-2xl font-serif ml-2 text-foreground">{stats.reads}</span></div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground">Reads</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Articles by Author */}
      <main className="py-16 px-6 md:px-12">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="flex items-center space-x-3 text-sm font-bold tracking-widest uppercase text-muted-foreground mb-4 sm:mb-0">
              <FileText size={16} />
              <span>Articles by {author.name}</span>
            </h2>
            <div className="flex items-center space-x-1 bg-secondary p-1 rounded-md overflow-x-auto max-w-full">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-3 py-1 text-xs font-bold rounded transition-colors whitespace-nowrap',
                    activeCategory === cat
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/50'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleRow key={article.id} article={article} onViewChange={() => router.push(`/article/${article.slug || article.id}`)} />
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No published articles found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
