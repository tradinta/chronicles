
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { breakingNews } from '@/lib/data';

export default function BreakingNewsStrip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (breakingNews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % breakingNews.length);
    }, 5000); // Change headline every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleFollowCoverage = () => {
    router.push('/live');
  };

  if (breakingNews.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 left-0 right-0 z-30 h-11 bg-[#cc3333] text-white flex items-center justify-center shadow-md">
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between h-full">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 bg-black/10 backdrop-blur-sm rounded-md px-3 py-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-xs font-bold tracking-wider uppercase">Breaking</span>
          </div>

          <div className="relative flex-1 h-full flex items-center min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center"
              >
                <p className="text-sm font-medium truncate">
                  <span className="font-bold mr-2">LIVE:</span>
                  {breakingNews[currentIndex].title}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button 
          onClick={handleFollowCoverage} 
          className="hidden sm:flex items-center gap-2 text-xs font-bold tracking-wider uppercase opacity-80 hover:opacity-100 transition-opacity"
        >
          <span>Follow Coverage</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
