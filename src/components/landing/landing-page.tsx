
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Hero from './hero';
import { placeholderImages, breakingNews } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight } from 'lucide-react';

const featuredStories = [
  { title: "Tokyo's Hidden Jazz Bars", cat: "Culture", href: "/article/1" },
  { title: "Death of Open Plan Offices", cat: "Business", href: "/article/1" }
];

const ethicsImage = placeholderImages.find(p => p.id === 'ethics-synthetic-memory');
const dispatchImage = placeholderImages.find(p => p.id === 'gdp-alternative');

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

      <section className="py-20 px-6 md:px-12 bg-background border-t border-border">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div onClick={() => router.push('/article/1')} className="group cursor-pointer flex items-center gap-6">
                {dispatchImage && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                            src={dispatchImage.imageUrl}
                            alt={dispatchImage.description}
                            fill
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-ai-hint={dispatchImage.imageHint}
                        />
                    </div>
                )}
                <div>
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Latest Dispatch</span>
                    <h4 className="font-serif text-xl mt-2 text-foreground group-hover:text-primary transition-colors">Alternative Metrics to GDP Gain Traction</h4>
                </div>
            </div>
            <div className="text-center md:text-right">
                <button onClick={() => router.push('/news')} className="group inline-flex items-center space-x-3 text-sm font-bold tracking-widest uppercase text-foreground px-6 py-4 rounded-full border border-border hover:bg-secondary transition-colors">
                    <span>View All Stories</span>
                    <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                </button>
            </div>
        </div>
      </section>
    </motion.div>
  );
}
