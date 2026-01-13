"use client";

import { AnimatePresence, motion } from 'framer-motion';
import type { LiveUpdate } from '@/lib/data';
import LiveUpdateEntry from './live-update-entry';
import { Button } from '@/components/ui/button';
import { Pause, Play, ChevronsDown } from 'lucide-react';
import { useState } from 'react';

type LiveFeedProps = {
  updates: LiveUpdate[];
};

export default function LiveFeed({ updates }: LiveFeedProps) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Live Feed</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            <span className="ml-2">{isPaused ? 'Resume' : 'Pause'} Updates</span>
          </Button>
          <Button variant="outline" size="sm">
            <ChevronsDown size={14} />
            <span className="ml-2">Jump to Latest</span>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-border" />
        <AnimatePresence initial={false}>
          {!isPaused && updates.map((update, index) => (
            <motion.div
              key={update.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ opacity: 1 - (index * 0.05) }}
            >
              <LiveUpdateEntry update={update} />
            </motion.div>
          ))}
          {isPaused && updates.map((update, index) => (
            <div key={update.id} style={{ opacity: 1 - (index * 0.05) }}>
              <LiveUpdateEntry update={update} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
