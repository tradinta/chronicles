"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function NewsHeader() {
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    setDateString(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <div className="pt-32 pb-8 px-6 md:px-12 border-b border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-serif text-5xl md:text-6xl text-foreground"
            >
              Latest News
            </motion.h1>
            <motion.div
               initial={{ width: 0 }}
               animate={{ width: '100px' }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-1 mt-6 bg-primary/20 dark:bg-primary/30" 
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium tracking-wide uppercase text-muted-foreground"
          >
            {dateString} • Global Edition
          </motion.div>
        </div>
      </div>
    </div>
  );
}
