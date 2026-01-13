
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Hero from './hero';
import BreakingNews from './breaking-news';
import { placeholderImages } from '@/lib/data';
import { useRouter } from 'next/navigation';

const featuredStories = [
  { title: "Tokyo's Hidden Jazz Bars", cat: "Culture", href: "/article/1" },
  { title: "Death of Open Plan Offices", cat: "Business", href: "/article/1" }
];

const ethicsImage = placeholderImages.find(p => p.id === 'ethics-synthetic-memory');

export default function LandingPage() {
  const router = useRouter();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Hero />
      <BreakingNews />
      
      <div className="w-full py-3 border-y border-border bg-secondary/30 dark:bg-secondary/20 text-muted-foreground overflow-hidden">
        <div className="ticker-wrap cursor-default">
          <div className="ticker">
            {[...Array(2)].map((_, i) => (
                ["Global markets stabilize", "SpaceX Mars Mission Update", "Climate Summit Agreement", "MoMA Digital Realism Exhibit"].map((item, index) => (
                    <span key={`${i}-${index}`} className="inline-block px-8 text-xs font-medium tracking-wide uppercase"><span className="mr-2 opacity-50">•</span> {item}</span>
                ))
            ))}
          </div>
        </div>
      </div>

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
    </motion.div>
  );
}
