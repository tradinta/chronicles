
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Hero from './hero';
import { placeholderImages, featuredStories, trendingItems, marketPulseItems, cityBeatItems, dispatchItems } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, TrendingUp, Briefcase, Building } from 'lucide-react';
import ContentCard from './content-card';

const ethicsImage = placeholderImages.find(p => p.id === 'ethics-synthetic-memory');

export default function LandingPage() {
  const router = useRouter();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Hero />
      
      <section className="py-20 px-6 md:px-12 bg-background">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <div onClick={() => router.push('/article/1')} className="group cursor-pointer">
              {ethicsImage && <div className="overflow-hidden mb-5 relative aspect-[4/3] rounded-lg">
                <Image 
                  src={ethicsImage.imageUrl} 
                  alt={ethicsImage.description} 
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  data-ai-hint={ethicsImage.imageHint}
                />
              </div>}
              <span className="text-xs font-bold tracking-widest uppercase text-primary">Technology</span>
              <h3 className="font-serif text-4xl mt-3 text-foreground">The Ethics of Synthetic Memory</h3>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col space-y-12 md:border-l md:pl-12 border-border">
             {featuredStories.map((story, i) => (
                <div key={i} onClick={() => router.push(story.href)} className="cursor-pointer group">
                  <span className="text-xs font-bold tracking-widest uppercase text-primary">{story.cat}</span>
                  <h3 className="font-serif text-2xl mt-2 group-hover:text-muted-foreground transition-colors text-foreground">{story.title}</h3>
                </div>
             ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-secondary/30 dark:bg-secondary/10 border-t border-border">
          <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ContentCard 
                  title="The Dispatch"
                  items={dispatchItems}
                  buttonText="Explore All Stories"
                  onButtonClick={() => router.push('/news')}
                />
                <ContentCard 
                  title="Trending Now"
                  icon={TrendingUp}
                  items={trendingItems.slice(0,3).map(item => ({ title: item }))}
                  onItemClick={(item) => router.push('/article/1')}
                />
                <ContentCard 
                  title="Market Pulse"
                  icon={Briefcase}
                  items={marketPulseItems}
                  onItemClick={(item) => router.push('/article/1')}
                />
                 <ContentCard 
                  title="City Beat"
                  icon={Building}
                  items={cityBeatItems}
                  onItemClick={(item) => router.push('/article/1')}
                />
              </div>
          </div>
      </section>
    </motion.div>
  );
}
