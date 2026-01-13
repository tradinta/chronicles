
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Share2, Zap } from 'lucide-react';
import type { Article } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ArticleRowProps = {
  article: Article;
  onViewChange: (href: string) => void;
};

export default function ArticleRow({ article, onViewChange }: ArticleRowProps) {
  const router = useRouter();
  const isQuote = article.type === 'quote';
  
  if (isQuote) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="py-16 my-8 border-y border-border bg-secondary/30 dark:bg-secondary/20"
      >
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-6xl text-primary/20 font-serif leading-none">“</span>
          <p className="font-serif text-2xl md:text-4xl italic mb-6 text-foreground">
            {article.content}
          </p>
          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
            — {article.author}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className="group py-8 border-b border-border"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-3 lg:col-span-2 overflow-hidden rounded-sm bg-muted aspect-[4/3] relative">
           {article.image && <Image 
             src={article.image.imageUrl} 
             alt={article.title || 'Article image'}
             fill
             data-ai-hint={article.image.imageHint}
             className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0" 
           />}
        </div>

        <div className="md:col-span-9 lg:col-span-7 flex flex-col justify-center h-full pt-1">
          <div className="flex items-center space-x-3 mb-2">
            {article.isBreaking && (
                <span className="flex items-center text-[10px] font-bold tracking-widest uppercase text-red-500">
                    <Zap size={12} className="mr-1.5 fill-red-500"/>
                    Breaking
                </span>
            )}
            {article.category && (
              <Link href={`/category/${article.category.toLowerCase()}`} className="text-[10px] font-bold tracking-widest uppercase text-primary hover:underline">
                {article.category}
              </Link>
            )}
            <span className="text-[10px] text-muted-foreground/50">•</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {article.time} ago
            </span>
          </div>

          <Link href={`/article/${article.id}`}>
            <h3 className={cn("font-serif text-2xl md:text-3xl leading-tight mb-3 group-hover:text-muted-foreground transition-colors cursor-pointer", "text-foreground")}>
              {article.title}
            </h3>
          </Link>

          <p className="text-sm md:text-base leading-relaxed max-w-2xl transition-all duration-300 text-muted-foreground">
            {article.summary}
          </p>
          
          <div className="mt-4 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="text-xs font-medium flex items-center text-muted-foreground">
               <Clock size={12} className="mr-1" /> {article.readTime}
             </span>
             <button className="text-xs font-medium flex items-center text-muted-foreground">
               <Share2 size={12} className="mr-1" /> Share
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
