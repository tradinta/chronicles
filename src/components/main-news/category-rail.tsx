
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CategoryRailProps = {
  activeCategory: string;
  setActiveCategory: Dispatch<SetStateAction<string>>;
};

const categories = ['All', 'World', 'Politics', 'Business', 'Technology', 'Science', 'Culture', 'Opinion', 'Long Reads'];

export default function CategoryRail({ activeCategory, setActiveCategory }: CategoryRailProps) {
  return (
    <div className="sticky top-[124px] z-30 py-4 px-6 md:px-12 backdrop-blur-md transition-colors duration-300 border-b border-border bg-background/90">
      <div className="container mx-auto overflow-x-auto no-scrollbar">
        <div className="flex space-x-8 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'text-sm font-medium tracking-wide transition-colors relative group py-2',
                activeCategory === cat
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {cat}
              {activeCategory === cat && (
                <motion.span
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
