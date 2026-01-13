
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Dispatch, SetStateAction } from 'react';
import ActionRail from '@/components/article/action-rail';
import ArticleParagraph from '@/components/article/article-paragraph';
import ArticleFooter from '@/components/article/article-footer';
import { placeholderImages } from '@/lib/data';
import { useRouter } from 'next/navigation';

type ArticlePageProps = {
  isFocusMode: boolean;
  setFocusMode: Dispatch<SetStateAction<boolean>>;
};

const abstractMemoryImage = placeholderImages.find(p => p.id === 'abstract-memory');

export default function ArticlePage() {
  const router = useRouter();
  const [isFocusMode, setFocusMode] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen relative bg-background"
    >
      <ActionRail isFocusMode={isFocusMode} setFocusMode={setFocusMode} />
      
      <header className={`pt-32 pb-12 px-6 md:px-12 max-w-4xl mx-auto transition-opacity duration-500 ${isFocusMode ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center space-x-3 mb-6">
            <span className="h-[1px] w-8 bg-muted-foreground/50"></span>
            <button 
              onClick={() => router.push('/news')}
              className="text-xs font-bold tracking-[0.2em] uppercase cursor-pointer hover:underline text-primary"
            >
              Technology
            </button>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-foreground">
            The Ethics of <br/> Synthetic Memory
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-b py-6 gap-6 border-border">
             <div className="flex items-center space-x-4">
               <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                 <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Author" width={40} height={40} />
               </div>
               <div>
                 <p className="text-sm font-bold text-foreground">Sarah Jenkins</p>
                 <p className="text-xs text-muted-foreground">Senior Tech Correspondent</p>
               </div>
             </div>
             <div className="text-xs tracking-widest uppercase font-medium text-muted-foreground">
               Oct 12, 2024 • 8 Min Read
             </div>
          </div>
        </motion.div>
      </header>

      <article className="px-6 md:px-12 max-w-3xl mx-auto pb-32">
        <div className={`transition-all duration-700 ${isFocusMode ? 'grayscale-[0.5]' : ''}`}>
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
             <p className="text-xl md:text-2xl font-serif italic mb-12 leading-relaxed opacity-80 text-muted-foreground">
               "As AI begins to fill the gaps in our past, we must ask: whose version of history are we remembering?"
             </p>
           </motion.div>

           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
             <div className="drop-cap">
               <ArticleParagraph>
                 The photograph was old, faded at the edges, showing a family picnic from the late 1990s. But something was wrong. The sky was too blue, the grass too green, and the smiles... they were perfectly symmetrical in a way that biology rarely permits. This wasn't a memory captured on film. It was a reconstruction, "enhanced" by the latest generative model embedded in our cloud storage.
               </ArticleParagraph>
             </div>
             
             <ArticleParagraph>
               For years, we viewed digital restoration as a tool for preservation. We removed red eyes, stabilized shaky videos, and colorized black-and-white classics. But the new wave of "Synthetic Memory" tools promises something different: perfection. They don't just restore; they reimagine. They fill in the blanks of our personal history with statistical probabilities of what "should" have been there.
             </ArticleParagraph>

             {abstractMemoryImage && <div className="my-16 -mx-6 md:-mx-24 relative group">
                <Image 
                  src={abstractMemoryImage.imageUrl}
                  alt={abstractMemoryImage.description}
                  width={2564}
                  height={1709}
                  data-ai-hint={abstractMemoryImage.imageHint}
                  className={`w-full h-auto object-cover transition-all duration-1000 ${isFocusMode ? 'opacity-60 grayscale' : 'opacity-90 hover:opacity-100'}`}
                />
                <p className="absolute bottom-4 right-6 text-xs bg-black/50 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Fig 1. Neural pathways visualized
                </p>
             </div>}

             <ArticleParagraph>
               The implications are subtle but profound. If we begin to rely on algorithmic enhancements to curate our past, do we lose the texture of reality? The frowns, the overcast skies, the awkward silences—these are the imperfections that anchor us to the truth. Without them, our past becomes a sanitized gallery of moments that never quite happened.
             </ArticleParagraph>
             
             <ArticleParagraph>
               "We are entering an era of consensus reality," argues Dr. Aris Thorne, a cognitive psychologist at Cambridge. "When your phone automatically removes the stranger from the background of your vacation photo, it is rewriting the context of that moment. Multiply that by a billion users, and you have a collective shifting of the historical record."
             </ArticleParagraph>

             <div className="my-16 py-8 border-l-4 pl-8 border-primary/20 dark:border-primary/40 bg-secondary/30 dark:bg-secondary/20">
               <p className="font-serif text-3xl italic leading-tight text-foreground">
                 "Memory is not a recording device; it is a creative act. We are now outsourcing that creativity to machines."
               </p>
             </div>

             <ArticleParagraph>
               We must decide, and soon, how much of our humanity we are willing to trade for aesthetic perfection. Because once the raw data of our lives is overwritten by the optimized version, there is no undo button for the human experience.
             </ArticleParagraph>
           </motion.div>
        </div>
      </article>

      <ArticleFooter onViewChange={() => router.push('/article/1')} />
    </motion.div>
  );
}

