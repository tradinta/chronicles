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


const Hero = ({ article }: { article: any }) => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const yImg = useTransform(scrollY, [0, 500], [0, -50]);

  if (!article) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-background dark:bg-[#121212]">
      <div className="absolute inset-0 bg-radial-light dark:bg-radial-dark opacity-60" />

      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 relative z-10 h-full items-start">

        <motion.div className="lg:col-span-8 order-2 lg:order-1" style={{ y: yText }}>

          <div className="flex items-center space-x-3 mb-6 animate-fade-in-up">
            <span className="h-[1px] w-8 bg-muted-foreground/50"></span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Featured Story</span>
          </div>

          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 cursor-default text-tight-hover text-foreground"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
          >
            {article.title}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl font-light leading-relaxed max-w-md mb-10 text-muted-foreground line-clamp-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          >
            {article.summary}
          </motion.p>

          {/* Main Feature Image */}
          <motion.div
            className="h-[400px] w-full relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => router.push(`/article/${article.id}`)}
            style={{ y: yImg }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}
          >
            <div className="relative w-full h-full">
              <Image
                src={article.imageUrl || "https://images.unsplash.com/photo-1493728639209-4091a1829910?q=80&w=2574&auto=format&fit=crop"}
                alt={article.title}
                fill
                priority
                className="object-cover grayscale-[20%] hover:scale-[1.02] transition-transform duration-[2s] ease-out"
              />
            </div>
          </motion.div>

        </motion.div>

        {/* Right Column: News Deck (Hidden on Mobile) */}
        <motion.div
          className="lg:col-span-4 order-1 lg:order-2 hidden lg:flex flex-col justify-end h-full pb-20"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Enter Newsroom CTA */}
          <div className="p-8 border-l border-border">
            <h3 className="font-serif text-3xl font-bold mb-4 text-foreground">The Newsroom</h3>
            <p className="text-sm leading-relaxed mb-8 text-muted-foreground">
              Access the full feed of global events, analysis, and market data. Updated every minute.
            </p>
            <button
              onClick={() => router.push('/news')}
              className="group flex items-center space-x-3 text-sm font-bold uppercase tracking-widest transition-colors text-foreground hover:text-primary"
            >
              <span>Enter Now</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const BriefingCard = ({ title, icon: Icon, items, onViewChange }: any) => (
  <div className="p-6 rounded-xl border flex flex-col h-full transition-all hover:shadow-md bg-card border-border shadow-sm">
    <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-dashed border-border/50">
      <Icon size={16} className="text-muted-foreground" />
      <h3 className="font-serif text-lg font-bold tracking-wide text-foreground">{title}</h3>
    </div>
    <div className="space-y-6 flex-1">
      {items.map((item: any, i: number) => (
        <div key={i} className="group cursor-pointer" onClick={() => onViewChange(`/article/${item.id}`)}>
          <span className="text-[10px] font-mono block mb-1 uppercase tracking-wider text-muted-foreground/80">
            {item.publishDate ? formatDistanceToNow(item.publishDate.toDate(), { addSuffix: true }) : 'Just now'}
          </span>
          <h4 className="text-sm font-medium leading-snug group-hover:underline text-foreground/80 line-clamp-2">{item.title}</h4>
        </div>
      ))}
      {items.length === 0 && <p className="text-xs text-muted-foreground italic">No updates in this section.</p>}
    </div>
    <div className="mt-6 pt-4 border-t border-transparent">
      <button
        onClick={() => onViewChange('/news')}
        className="text-xs font-bold uppercase tracking-widest flex items-center group text-muted-foreground hover:text-foreground"
      >
        <span>Explore All</span>
        <ArrowRight size={12} className="ml-1 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </div>
);

const BriefingSection = ({ onViewChange, techArticles, businessArticles, worldArticles }: any) => {
  return (
    <section className="py-16 px-6 md:px-12 border-b border-border bg-secondary/30 dark:bg-[#151515]">
      <div className="container mx-auto">
        <div className="flex items-center space-x-2 mb-8 opacity-60">
          <span className="h-[1px] w-8 bg-muted-foreground"></span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">The Daily Briefing</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BriefingCard title="Technology" icon={Clock} items={techArticles} onViewChange={onViewChange} />
          <BriefingCard title="Business" icon={TrendingUp} items={businessArticles} onViewChange={onViewChange} />
          <BriefingCard title="World" icon={MapPin} items={worldArticles} onViewChange={onViewChange} />
        </div>
      </div>
    </section>
  );
}

const Ticker = ({ items }: { items: any[] }) => {
  // If no items, fallback or hide
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full py-3 border-b overflow-hidden bg-secondary/30 dark:bg-stone-900 border-border text-muted-foreground">
      <div className="ticker-wrap cursor-default">
        <div className="ticker">
          {items.map((item, index) => (
            <span key={index} className="inline-block px-8 text-xs font-medium tracking-wide uppercase">
              <span className="mr-2 opacity-50 text-primary font-bold">•</span> {item.title}
            </span>
          ))}
          {/* Duplicate for infinite effect */}
          {items.map((item, index) => (
            <span key={`dup-${index}`} className="inline-block px-8 text-xs font-medium tracking-wide uppercase">
              <span className="mr-2 opacity-50 text-primary font-bold">•</span> {item.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const MainGrid = ({ leadArticle, trendingArticles }: any) => {
  const router = useRouter();

  if (!leadArticle && trendingArticles.length === 0) return null;

  return (
    <section className="py-20 px-6 md:px-12 bg-background dark:bg-[#121212]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">

        {leadArticle && (
          <div className="md:col-span-8">
            <div onClick={() => router.push(`/article/${leadArticle.id}`)} className="group cursor-pointer">
              <div className="overflow-hidden mb-5 relative aspect-[4/3] rounded-sm">
                <Image
                  src={leadArticle.imageUrl || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop"}
                  alt={leadArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-primary">{leadArticle.category || 'Opinion'}</span>
              <h3 className="font-serif text-4xl mt-3 leading-tight text-foreground">{leadArticle.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{leadArticle.summary}</p>
            </div>
          </div>
        )}


        <div className="md:col-span-4 flex flex-col space-y-12 border-l border-border/50 pl-0 md:pl-12">

          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Flame size={16} className="text-primary" />
              <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Trending Now</h4>
            </div>
            <ul className="space-y-6">
              {trendingArticles.map((item: any, i: number) => (
                <li key={i} className="group cursor-pointer flex items-start" onClick={() => router.push(`/article/${item.id}`)}>
                  <span className="text-xl font-serif mr-4 opacity-30 group-hover:opacity-60 transition-opacity text-foreground">0{i + 1}</span>
                  <span className="text-sm font-medium leading-snug group-hover:underline text-muted-foreground line-clamp-2">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div onClick={() => router.push('/off-the-record')} className="p-6 rounded-lg cursor-pointer border transition-colors bg-teal-900/10 border-teal-800/50 hover:bg-teal-900/20">
            <div className="flex items-center space-x-2 text-teal-500 mb-2">
              <EyeOff size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Off The Record</span>
            </div>
            <h3 className="font-serif text-xl text-teal-100">Unverified: The Tech Merger Rumors</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

const LatestDispatch = ({ onViewChange, articles }: any) => {
  return (
    <section className="py-20 px-6 md:px-12 bg-secondary/30 dark:bg-black border-y border-border">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col space-y-6">
          <h3 className="font-serif text-3xl font-bold text-foreground">The Latest Dispatch</h3>
          {articles.map((a: any) => (
            <p key={a.id} className="text-sm font-medium leading-snug text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => onViewChange(`/article/${a.id}`)}>
              {a.title}
            </p>
          ))}
        </div>
        <div className="text-right">
          <button onClick={() => onViewChange('/news')} className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:scale-105">
            Explore All Stories
            <ExternalLink size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};


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
      <Hero article={featured} />
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
