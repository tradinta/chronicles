'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Clock, TrendingUp, MapPin, ArrowRight, Flame, EyeOff } from 'lucide-react';
import { ExternalLink } from 'lucide-react';

const Hero = () => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const yImg = useTransform(scrollY, [0, 500], [0, -50]);

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
            The Quiet <br/> Revolution of <br/> <i className="font-light text-primary/90">Analogue.</i>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl font-light leading-relaxed max-w-md mb-10 text-muted-foreground"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          >
            In a world of digital noise, we explore why the most forward-thinking creators are returning to tangible mediums.
          </motion.p>
          
          {/* Main Feature Image */}
          <motion.div 
            className="h-[400px] w-full relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => router.push('/article/1')}
            style={{ y: yImg }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}
          >
            <img src="https://images.unsplash.com/photo-1493728639209-4091a1829910?q=80&w=2574&auto=format&fit=crop" alt="Architecture" className="w-full h-full object-cover grayscale-[20%] hover:scale-[1.02] transition-transform duration-[2s] ease-out" />
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
        <div key={i} className="group cursor-pointer" onClick={() => onViewChange('/news')}>
          <span className="text-[10px] font-mono block mb-1 uppercase tracking-wider text-muted-foreground/80">{item.time}</span>
          <h4 className="text-sm font-medium leading-snug group-hover:underline text-foreground/80">{item.text}</h4>
        </div>
      ))}
    </div>
    <div className="mt-6 pt-4 border-t border-transparent">
      <button className="text-xs font-bold uppercase tracking-widest flex items-center group text-muted-foreground hover:text-foreground">
        <span>Explore All</span>
        <ArrowRight size={12} className="ml-1 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  </div>
);

const BriefingSection = ({ onViewChange }: any) => {
  const latestNewsItems = [
    { time: "Just now", text: "The Silent Migration: Why Nordic Citizens are Moving South" },
    { time: "15m ago", text: "Silicon Valley's Return to Hardware" },
    { time: "1h ago", text: "The Ocean's Memory: Mapping Deep Sea Currents" }
  ];
  const marketItems = [
    { time: "2h ago", text: "Central Bank holds interest rates steady, citing 'cautious optimism'" },
    { time: "5h ago", text: "Analysis: Are tech stocks overvalued in the current climate?" },
    { time: "8h ago", text: "New agricultural fund launches to support small-scale farmers" }
  ];
  const cityItems = [
    { time: "30m ago", text: "Proposed high-rise development in Westlands faces resident opposition" },
    { time: "3h ago", text: "Nairobi traffic reform: Is the new bus rapid transit system working?" },
    { time: "1d ago", text: "The cultural revival of Nairobi's downtown arts scene" }
  ];

  return (
    <section className="py-16 px-6 md:px-12 border-b border-border bg-secondary/30 dark:bg-[#151515]">
      <div className="container mx-auto">
        <div className="flex items-center space-x-2 mb-8 opacity-60">
           <span className="h-[1px] w-8 bg-muted-foreground"></span>
           <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">The Daily Briefing</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <BriefingCard title="Latest News" icon={Clock} items={latestNewsItems} onViewChange={onViewChange} />
           <BriefingCard title="Market Pulse" icon={TrendingUp} items={marketItems} onViewChange={onViewChange} />
           <BriefingCard title="City Beat" icon={MapPin} items={cityItems} onViewChange={onViewChange} />
        </div>
      </div>
    </section>
  );
}

const Ticker = () => {
  const newsItems = [
    "Global markets stabilize after week of volatility",
    "SpaceX announces new timeline for Mars mission",
    "Climate summit concludes with historic agreement",
    "New exhibit opens at the MoMA featuring digital realism"
  ];

  return (
    <div className="w-full py-3 border-b overflow-hidden bg-secondary/30 dark:bg-stone-900 border-border text-muted-foreground">
      <div className="ticker-wrap cursor-default">
        <div className="ticker">
          {newsItems.map((item, index) => (
            <span key={index} className="inline-block px-8 text-xs font-medium tracking-wide uppercase">
              <span className="mr-2 opacity-50 text-primary font-bold">•</span> {item}
            </span>
          ))}
          {newsItems.map((item, index) => (
            <span key={`dup-${index}`} className="inline-block px-8 text-xs font-medium tracking-wide uppercase">
              <span className="mr-2 opacity-50 text-primary font-bold">•</span> {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const MainGrid = () => {
  const router = useRouter();
  const trendingItems = [
    "Why the global supply chain is shifting to localized hubs faster than predicted.",
    "The surprising link between gut health and mental focus.",
    "AI's impact on creative industries: A one-year retrospective."
  ];

  return (
    <section className="py-20 px-6 md:px-12 bg-background dark:bg-[#121212]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8">
          <div onClick={() => router.push('/article/1')} className="group cursor-pointer">
            <div className="overflow-hidden mb-5 relative aspect-[4/3] rounded-sm"><img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Technology</span>
            <h3 className="font-serif text-4xl mt-3 leading-tight text-foreground">The Ethics of Synthetic Memory</h3>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">As AI begins to fill the gaps in our past, we must ask: whose version of history are we remembering? A deep dive into the new era of generative recall.</p>
          </div>
        </div>
        
        <div className="md:col-span-4 flex flex-col space-y-12 border-l border-border/50 pl-0 md:pl-12">
           
           <div>
              <div className="flex items-center space-x-2 mb-6">
                <Flame size={16} className="text-primary" />
                <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Trending Now</h4>
              </div>
              <ul className="space-y-6">
                {trendingItems.map((item, i) => (
                  <li key={i} className="group cursor-pointer flex items-start" onClick={() => router.push('/article/1')}>
                    <span className="text-xl font-serif mr-4 opacity-30 group-hover:opacity-60 transition-opacity text-foreground">0{i+1}</span>
                    <span className="text-sm font-medium leading-snug group-hover:underline text-muted-foreground">
                      {item}
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

const LatestDispatch = ({onViewChange}: any) => {
    return (
        <section className="py-20 px-6 md:px-12 bg-secondary/30 dark:bg-black border-y border-border">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col space-y-6">
                    <h3 className="font-serif text-3xl font-bold text-foreground">The Latest Dispatch</h3>
                    <p className="text-sm font-medium leading-snug text-muted-foreground group-hover:underline">The surprising link between gut health and mental focus.</p>
                    <p className="text-sm font-medium leading-snug text-muted-foreground group-hover:underline">AI's impact on creative industries: A one-year retrospective.</p>
                    <p className="text-sm font-medium leading-snug text-muted-foreground group-hover:underline">Urban planning reimagined: The 15-minute city model gains traction.</p>
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

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Hero />
            <Ticker />
            <BriefingSection onViewChange={router.push}/>
            <MainGrid />
            <LatestDispatch onViewChange={router.push}/>
        </motion.div>
    );
}
