'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Search, FileX } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f4f1ea] dark:bg-[#09090b] text-[#1c1c1c] dark:text-[#e4e4e7] text-center relative overflow-hidden">

      {/* Background Graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg"
      >
        <div className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
          <FileX size={48} />
        </div>

        <h1 className="font-serif text-6xl md:text-8xl font-black mb-4 tracking-tighter">404</h1>

        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
            [Redacted]
          </h2>
          <p className="font-serif text-lg md:text-xl text-gray-600 dark:text-gray-400 italic">
            "The story you are looking for has been buried in the archives, or perhaps it was never written at all."
          </p>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 px-6 py-3 bg-[#1c1c1c] dark:bg-white text-white dark:text-black rounded-full font-medium transition-transform hover:scale-105"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Return to Front Page
          </Link>
          <Link
            href="/news"
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Search size={18} />
            Browse Archives
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
