'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { getBreakingNews } from '@/firebase/firestore/articles';
import { DocumentData } from 'firebase/firestore';

export default function BreakingNewsStrip() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const firestore = useFirestore();
  const [breakingNews, setBreakingNews] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchBreaking = async () => {
      if (!firestore) return;
      const news = await getBreakingNews(firestore);
      setBreakingNews(news);
    };
    fetchBreaking();
  }, [firestore]);

  // Cycle through headlines
  useEffect(() => {
    if (breakingNews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  if (!isVisible || breakingNews.length === 0) {
    return null;
  }

  const currentArticle = breakingNews[currentIndex];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#cc0000] text-white h-[44px] flex items-center shadow-md">
      <div className="container mx-auto px-4 md:px-12 flex items-center justify-between">

        <div className="flex items-center flex-1 overflow-hidden">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center mr-4 shrink-0"
          >
            <AlertCircle className="w-4 h-4 mr-2" fill="currentColor" stroke="none" />
            <span className="text-xs font-bold tracking-wider uppercase">Breaking</span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center truncate mr-4"
            >
              <Link href={`/article/${currentArticle.slug || currentArticle.id}`} className="hover:underline flex items-center">
                <span className="text-sm font-medium mr-2 truncate">
                  {currentArticle.title}
                </span>
                <ArrowRight className="w-3 h-3 opacity-70" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-black/10 rounded-full transition-colors ml-4"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
