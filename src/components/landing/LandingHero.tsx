'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const LandingHero = ({ article }: { article: any }) => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const yImg = useTransform(scrollY, [0, 500], [0, -50]);

  if (!article) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#FDFBF7] dark:bg-[#121212]">
      <div className="absolute inset-0 bg-radial-light dark:bg-radial-dark opacity-60" />
      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 relative z-10 h-full items-start">
        <motion.div className="lg:col-span-8 order-2 lg:order-1" style={{ y: yText }}>
          <div className="flex items-center space-x-3 mb-6 animate-fade-in-up">
            <span className="h-[1px] w-8 bg-stone-400 dark:bg-stone-500"></span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">Featured Story</span>
          </div>
          <motion.h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 cursor-default text-tight-hover text-stone-900 dark:text-stone-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            {article.title}
          </motion.h1>
          <motion.p className="text-lg md:text-xl font-light leading-relaxed max-w-md mb-10 text-stone-600 dark:text-stone-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
            {article.summary}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-10">
            <button onClick={() => router.push(`/article/${article.id}`)} className="group flex items-center space-x-2 text-sm tracking-widest uppercase font-semibold text-stone-900 dark:text-stone-100">
              <span>Read Full Story</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </motion.div>
        </motion.div>
        <motion.div className="lg:col-span-4 order-1 lg:order-2 hidden lg:flex flex-col justify-end h-full pb-20" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}>
          <div className="p-8 border-l border-stone-300 dark:border-stone-800">
            <h3 className="font-serif text-3xl font-bold mb-4 text-stone-900 dark:text-stone-100">The Newsroom</h3>
            <p className="text-sm leading-relaxed mb-8 text-stone-600 dark:text-stone-400">
              Access the full feed of global events, analysis, and market data. Updated every minute.
            </p>
            <button onClick={() => router.push('/news')} className="group flex items-center space-x-3 text-sm font-bold uppercase tracking-widest transition-colors text-stone-800 hover:text-stone-900 dark:text-stone-200 dark:hover:text-white">
              <span>Enter Now</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
