"use client";

import { useState } from 'react';
import { Highlighter } from 'lucide-react';
import { cn } from '@/lib/utils';

type ArticleParagraphProps = {
  children: React.ReactNode;
};

export default function ArticleParagraph({ children }: ArticleParagraphProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  return (
    <div 
      className={cn(
        'group relative mb-8 transition-colors duration-300 p-2 -mx-2 rounded-lg cursor-text',
        isHighlighted
          ? 'bg-yellow-500/10 dark:bg-yellow-400/10'
          : 'hover:bg-muted/50 dark:hover:bg-secondary/30'
      )}
      onClick={() => setIsHighlighted(!isHighlighted)}
    >
       <div className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary/70 cursor-pointer" title="Click to highlight">
          <Highlighter size={14} />
       </div>
       <p className="text-lg md:text-xl leading-[1.8] font-serif text-foreground/80 dark:text-foreground/70">
         {children}
       </p>
    </div>
  );
}
