"use client";

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { View } from '@/app/page';
import { placeholderImages } from '@/lib/data';

type HeroProps = {
  onViewChange: (view: View) => void;
};

const heroImage = placeholderImages.find(p => p.id === 'hero-analogue');

export default function Hero({ onViewChange }: HeroProps) {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 100]);
  const yImg = useTransform(scrollY, [0, 500], [0, -50]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
      <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 relative z-10 h-full items-center">
        <motion.div className="lg:col-span-5 order-2 lg:order-1" style={{ y: yText }}>
          <div className="flex items-center space-x-3 mb-6">
            <span className="h-[1px] w-8 bg-muted-foreground/50"></span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Featured Story</span>
          </div>
          <motion.h1 
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 text-tight-hover cursor-default text-foreground"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}
          >
            The Quiet <br/> Revolution of <br/> <i className="font-light text-primary/90">Analogue.</i>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl font-light leading-relaxed max-w-md text-muted-foreground"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
          >
            In a world of digital noise, we explore why the most forward-thinking creators are returning to tangible mediums.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-10">
            <button onClick={() => onViewChange('article')} className="group flex items-center space-x-2 text-sm tracking-widest uppercase font-semibold text-foreground">
              <span>Read Full Story</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="lg:col-span-7 h-[50vh] lg:h-[80vh] relative order-1 lg:order-2" 
          style={{ y: yImg }}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }} 
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
          transition={{ duration: 1.2 }}
        >
          {heroImage && <div className="w-full h-full relative overflow-hidden rounded-lg">
            <Image 
              src={heroImage.imageUrl} 
              alt={heroImage.description}
              fill
              className="w-full h-full object-cover grayscale-[20%] hover:scale-[1.02] transition-transform duration-[2s] ease-out"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          </div>}
        </motion.div>
      </div>
    </section>
  );
}
