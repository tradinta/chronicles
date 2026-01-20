'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, TrendingUp, MapPin, ArrowRight, Flame, EyeOff } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { getFeaturedArticle, getRecentArticles, getArticlesByCategory } from '@/firebase/firestore/articles';
import { formatDistanceToNow } from 'date-fns';

import { FeedSkeleton } from '@/components/loader/FeedSkeleton';

import { LandingHero } from './LandingHero';
import { Ticker } from './Ticker';
import { BriefingSection } from './BriefingSection';
import { MainGrid, LatestDispatch } from './MainGrid';

export default function LandingPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [featured, setFeatured] = useState<any>(null);
  const [techArticles, setTechArticles] = useState<any[]>([]);
  const [businessArticles, setBusinessArticles] = useState<any[]>([]);
  const [worldArticles, setWorldArticles] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    if (!firestore) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        // Parallel fetching for performance
        const [feat, tech, bus, world, rec] = await Promise.all([
          getFeaturedArticle(firestore),
          getArticlesByCategory(firestore, 'Technology', 3),
          getArticlesByCategory(firestore, 'Business', 3),
          getArticlesByCategory(firestore, 'World', 3),
          getRecentArticles(firestore, 10)
        ]);

        setFeatured(feat);
        setTechArticles(tech);
        setBusinessArticles(bus);
        setWorldArticles(world);
        setRecent(rec);
      } catch (e) {
        console.error("Failed to load landing page data", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [firestore]);

  if (isLoading) return <FeedSkeleton />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <LandingHero article={featured} />
      <Ticker items={recent} />
      <BriefingSection
        onViewChange={router.push}
        techArticles={techArticles}
        businessArticles={businessArticles}
        worldArticles={worldArticles}
      />
      {/* Split recent into Lead + Trending for variety */}
      <MainGrid
        leadArticle={recent[0]}
        trendingArticles={recent.slice(1, 4)}
      />
      <LatestDispatch onViewChange={router.push} articles={recent.slice(0, 3)} />
    </motion.div>
  );
}
