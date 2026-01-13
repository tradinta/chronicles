"use client";

import Image from 'next/image';
import type { View } from '@/app/page';

type ArticleFooterProps = {
  onViewChange: (view: View) => void;
};

const nextArticles = [
  { title: "The End of Privacy in Public Spaces", cat: "Policy" },
  { title: "Why Vinyl Records Are Outselling Digital", cat: "Culture" }
];

export default function ArticleFooter({ onViewChange }: ArticleFooterProps) {
  return (
    <div className="py-24 border-t border-border bg-secondary/30 dark:bg-secondary/20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-start space-x-6 mb-16">
          <div className="w-20 h-20 rounded-full bg-muted overflow-hidden flex-shrink-0">
            <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Author" width={80} height={80} />
          </div>
          <div>
            <h3 className="font-serif text-2xl mb-2 text-foreground">About Sarah Jenkins</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sarah is the Senior Tech Correspondent for The Chronicle, covering the intersection of AI, ethics, and human psychology. She previously worked as a researcher at the Institute for Digital Future.
            </p>
          </div>
        </div>

        <h4 className="text-xs font-bold tracking-widest uppercase mb-8 text-muted-foreground">What to Read Next</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nextArticles.map((item, idx) => (
            <div key={idx} className="group cursor-pointer" onClick={() => onViewChange('article')}>
              <span className="text-xs font-bold text-primary uppercase mb-2 block">{item.cat}</span>
              <h3 className="font-serif text-xl group-hover:underline text-foreground">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
