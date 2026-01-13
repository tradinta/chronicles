"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function LiveStatusBar() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-20 z-30 py-3 px-6 md:px-12 backdrop-blur-md transition-colors duration-300 border-b border-border bg-background/90">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-2.5 h-2.5 rounded-full bg-red-500"
          />
          <span className="text-xs font-bold tracking-widest uppercase text-red-500">Live Coverage</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
