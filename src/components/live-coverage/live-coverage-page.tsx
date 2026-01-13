"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { View } from '@/app/page';
import { liveUpdates as initialUpdates, newLiveUpdates } from '@/lib/data';
import LiveStatusBar from './live-status-bar';
import LiveHeader from './live-header';
import LiveFeed from './live-feed';
import LiveContextSidebar from './live-context-sidebar';

type LiveCoveragePageProps = {
  onViewChange: (view: View) => void;
};

export default function LiveCoveragePage({ onViewChange }: LiveCoveragePageProps) {
  const [updates, setUpdates] = useState(initialUpdates);

  useEffect(() => {
    // Simulate receiving new updates
    const interval = setInterval(() => {
      setUpdates(prev => [
        { ...newLiveUpdates[Math.floor(Math.random() * newLiveUpdates.length)], id: Date.now() }, 
        ...prev
      ]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background dark:bg-zinc-900/50"
    >
      <LiveStatusBar />
      <LiveHeader />
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <LiveFeed updates={updates} />
          </div>
          <div className="lg:col-span-4">
            <LiveContextSidebar />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
