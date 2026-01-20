"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';


type SidebarProps = {
  onViewChange: (id: number) => void;
};

export default function Sidebar({ onViewChange }: SidebarProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const [trending, setTrending] = useState<any[]>([]);

  useEffect(() => {
    if (!firestore) return;
    const fetchTrending = async () => {
      try {
        const { getTrendingArticles } = await import('@/firebase/firestore/articles');
        const data = await getTrendingArticles(firestore, 5);
        setTrending(data);
      } catch (e) {
        console.error("Failed to load trending", e);
      }
    };
    fetchTrending();
  }, [firestore]);

  return (
    <div className="hidden lg:block lg:col-span-3 pl-8 relative">
      <div className="sticky top-40 space-y-12">

        {/* Trending Widget */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp size={16} className="text-primary" />
            <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Trending Now</h4>
          </div>
          <ul className="space-y-6">
            {trending.length === 0 ? (
              // Simple Loading State
              Array(5).fill(0).map((_, i) => (
                <li key={i} className="flex items-baseline animate-pulse">
                  <span className="text-xs font-mono mr-4 opacity-50 text-muted-foreground">0{i + 1}</span>
                  <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                </li>
              ))
            ) : (
              trending.map((item, i) => (
                <li key={item.id} className="group cursor-pointer flex items-baseline" onClick={() => router.push(`/article/${item.slug || item.id}`)}>
                  <span className="text-xs font-mono mr-4 opacity-50 text-muted-foreground">0{i + 1}</span>
                  <span className="text-sm font-medium leading-snug group-hover:underline text-foreground/80 dark:text-foreground/70 decoration-primary/50 underline-offset-4 line-clamp-2">
                    {item.title}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Reading Queue (Static for now) */}
        <div className="p-6 rounded-lg bg-secondary/30 dark:bg-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Reading Queue</h4>
            <Bookmark size={14} className="text-muted-foreground" />
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm italic">Your list is empty.</p>
            <button className="mt-2 text-xs uppercase tracking-wide font-bold text-muted-foreground hover:text-foreground">Explore Archives</button>
          </div>
        </div>

      </div>
    </div>
  );
}

