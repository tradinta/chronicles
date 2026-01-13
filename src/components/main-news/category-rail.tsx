
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type CategoryRailProps = {
  activeCategory: string;
  setActiveCategory: Dispatch<SetStateAction<string>>;
};

const categories = ['All', 'World', 'Politics', 'Business', 'Technology', 'Science', 'Culture', 'Opinion', 'Long Reads'];

export default function CategoryRail({ activeCategory, setActiveCategory }: CategoryRailProps) {
  const pathname = usePathname();

  // If we are on a dynamic category page, we use its slug as the active category
  const isCategoryPage = pathname.startsWith('/category/');
  const activeSlug = isCategoryPage ? pathname.split('/')[2] : activeCategory.toLowerCase();

  return (
    <div className="sticky top-[80px] z-30 py-4 px-6 md:px-12 backdrop-blur-md transition-colors duration-300 border-b border-border bg-background/90">
      <div className="container mx-auto overflow-x-auto no-scrollbar">
        <div className="flex space-x-8 min-w-max">
          {categories.map((cat) => {
            const catSlug = cat.toLowerCase();
            const href = cat === 'All' ? '/news' : `/category/${catSlug}`;
            const isActive = cat === 'All' ? pathname === '/news' : activeSlug === catSlug;

            return (
              <Link
                href={href}
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'text-sm font-medium tracking-wide transition-colors relative group py-2',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {cat}
                {isActive && (
                  <motion.span
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
