"use client";

import type { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Share2, Type, Volume2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ActionRailProps = {
  isFocusMode: boolean;
  setFocusMode: Dispatch<SetStateAction<boolean>>;
};

export default function ActionRail({ isFocusMode, setFocusMode }: ActionRailProps) {
  const actions = [
    { icon: Bookmark, label: "Save" },
    { icon: Share2, label: "Share" },
    { icon: Type, label: "Text Size" },
    { icon: Volume2, label: "Listen" },
    { icon: Minimize2, label: "Focus", action: () => setFocusMode(!isFocusMode), active: isFocusMode }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className={cn(
        "hidden lg:flex fixed right-12 bottom-12 flex-col space-y-4 z-40 transition-opacity duration-500",
        isFocusMode ? 'opacity-20 hover:opacity-100' : 'opacity-100'
      )}
    >
      {actions.map((Item, idx) => (
        <button
          key={idx}
          onClick={Item.action}
          className={cn(`p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 relative group`,
            Item.active
              ? 'bg-orange-900/50 text-orange-200 dark:bg-accent dark:text-accent-foreground'
              : 'bg-white text-muted-foreground hover:text-foreground dark:bg-secondary dark:text-muted-foreground dark:hover:text-foreground'
            )}
        >
          <Item.icon size={20} strokeWidth={1.5} />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-secondary text-secondary-foreground shadow-sm">
            {Item.label}
          </span>
        </button>
      ))}
    </motion.div>
  );
}
