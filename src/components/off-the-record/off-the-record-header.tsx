
"use client";

import { motion } from 'framer-motion';

const navLinks = ['Celebrities', 'Influencers', 'Controversies', 'Whispers', 'Leaks', 'Trending'];

export default function OffTheRecordHeader() {
  return (
    <div className="pt-32 pb-8 px-6 md:px-12 border-b border-white/10">
      <div className="container mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl md:text-6xl text-stone-100"
        >
          Off the Record
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm font-medium tracking-widest uppercase text-purple-400/70"
        >
          Unverified. Unofficial. Unavoidable.
        </motion.p>
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 container mx-auto overflow-x-auto no-scrollbar"
      >
        <div className="flex space-x-8 min-w-max justify-center">
          {navLinks.map((link) => (
            <button key={link} className="text-sm font-semibold tracking-wide text-stone-400 hover:text-white transition-colors relative group py-2">
              {link}
              {link === 'Trending' && (
                <motion.span
                  layoutId="activeOTRCategory"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500"
                />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
