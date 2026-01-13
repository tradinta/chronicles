
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background dark:bg-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative"
      >
        <Compass size={80} className="absolute -top-12 -left-12 text-primary/10 dark:text-primary/20 -rotate-45" />
        <h1 className="font-serif text-8xl md:text-9xl font-bold text-foreground dark:text-zinc-100">404</h1>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="font-serif text-xl md:text-2xl mt-4 text-muted-foreground dark:text-zinc-400"
      >
        It seems you've ventured off the map.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-2 max-w-sm text-sm text-muted-foreground dark:text-zinc-500"
      >
        The page you are looking for might have been moved, deleted, or perhaps never existed in the first place.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="mt-10"
      >
        <Link href="/" className="group flex items-center space-x-2 text-sm tracking-widest uppercase font-semibold text-foreground dark:text-zinc-100">
            <span>Return to Homepage</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </motion.div>
    </div>
  );
}
