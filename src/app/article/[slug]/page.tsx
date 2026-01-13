"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ActionRail from '@/components/article/action-rail';
import ArticleFooter from '@/components/article/article-footer';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, DocumentData, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const ArticlePage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const firestore = useFirestore();

  const [article, setArticle] = useState<DocumentData | null>(null);
  const [author, setAuthor] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (!firestore || !slug) return;
      setIsLoading(true);
      
      const articlesRef = collection(firestore, 'articles');
      const q = query(articlesRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const articleDoc = querySnapshot.docs[0];
        const articleData = { id: articleDoc.id, ...articleDoc.data() };
        setArticle(articleData);

        if (articleData.authorId) {
            const authorsRef = collection(firestore, 'authors');
            const authorQ = query(authorsRef, where("id", "==", articleData.authorId));
            const authorSnapshot = await getDocs(authorQ);
            if (!authorSnapshot.empty) {
                setAuthor({ id: authorSnapshot.docs[0].id, ...authorSnapshot.docs[0].data() });
            }
        }
      }
      setIsLoading(false);
    };

    fetchArticle();
  }, [firestore, slug]);


  const [isFocusMode, setFocusMode] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary mr-4" />
        <span>Loading article...</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Article not found.</p>
      </div>
    );
  }
  
  const publishDate = article.publishDate?.toDate ? format(article.publishDate.toDate(), 'MMM dd, yyyy') : 'Date not available';
  const readTime = Math.ceil(article.content.split(' ').length / 200); // Estimate read time

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen relative bg-background"
    >
      <ActionRail isFocusMode={isFocusMode} setFocusMode={setFocusMode} />
      
      <header className={`pt-20 pb-12 px-6 md:px-12 max-w-4xl mx-auto transition-opacity duration-500 ${isFocusMode ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center space-x-3 mb-6">
            <span className="h-[1px] w-8 bg-muted-foreground/50"></span>
            <Link 
              href={`/category/${article.category.toLowerCase()}`}
              className="text-xs font-bold tracking-[0.2em] uppercase cursor-pointer hover:underline text-primary"
            >
              {article.category}
            </Link>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-foreground"
            dangerouslySetInnerHTML={{ __html: article.title.replace(/<br\s*\/?>/gi, '') }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-b py-6 gap-6 border-border">
             {author && <Link href={`/author/${author.id}`} className="flex items-center space-x-4 group">
               <div className="w-10 h-10 rounded-full bg-muted overflow-hidden transition-all duration-300 group-hover:ring-2 ring-primary ring-offset-2 ring-offset-background">
                 <Image src={author.profileImageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"} alt={author.name} width={40} height={40} />
               </div>
               <div>
                 <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{author.name}</p>
                 <p className="text-xs text-muted-foreground">{author.bio.substring(0, 30)}...</p>
               </div>
             </Link>}
             <div className="text-xs tracking-widest uppercase font-medium text-muted-foreground">
               {publishDate} • {readTime} Min Read
             </div>
          </div>
        </motion.div>
      </header>
      
      {article.imageUrl && (
        <div className="my-16 -mx-6 md:-mx-24 relative group">
          <Image 
            src={article.imageUrl}
            alt={article.title}
            width={2564}
            height={1709}
            className={`w-full h-auto object-cover transition-all duration-1000 ${isFocusMode ? 'opacity-60 grayscale' : 'opacity-90 hover:opacity-100'}`}
          />
        </div>
      )}

      <article className="px-6 md:px-12 max-w-3xl mx-auto pb-32">
        <div className={`transition-all duration-700 ${isFocusMode ? 'grayscale-[0.5]' : ''}`}>
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
             <p className="text-xl md:text-2xl font-serif italic mb-12 leading-relaxed opacity-80 text-muted-foreground">
               "{article.summary}"
             </p>
           </motion.div>

           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
             <div className="prose prose-xl dark:prose-invert font-serif prose-p:leading-[1.8] prose-h2:font-serif" dangerouslySetInnerHTML={{ __html: article.content }} />
           </motion.div>
        </div>
      </article>

      <ArticleFooter onViewChange={() => router.push('/article/1')} />
    </motion.div>
  );
}
