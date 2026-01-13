"use client";

import Image from 'next/image';
import type { LiveUpdate } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

type LiveUpdateEntryProps = {
  update: LiveUpdate;
};

const updateTypeStyles = {
  New: {
    icon: Info,
    borderColor: 'border-blue-500',
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-500/5 dark:bg-blue-500/10'
  },
  Confirmed: {
    icon: CheckCircle2,
    borderColor: 'border-green-500',
    textColor: 'text-green-500',
    bgColor: 'bg-green-500/5 dark:bg-green-500/10'
  },
  Correction: {
    icon: AlertTriangle,
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/5 dark:bg-yellow-500/10'
  }
};

export default function LiveUpdateEntry({ update }: LiveUpdateEntryProps) {
  const styles = updateTypeStyles[update.type];
  const Icon = styles.icon;

  return (
    <div className="pl-12 pb-10 relative">
      <div className="absolute left-0 top-1.5">
        <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center">
          <Icon size={16} className={cn("text-muted-foreground", styles.textColor)} />
        </div>
      </div>
      
      <div className={cn("p-4 rounded-lg border-l-4", styles.borderColor, styles.bgColor)}>
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className={cn("text-xs font-bold uppercase tracking-wider", styles.textColor)}>{update.type}</span>
            <span className="text-xs text-muted-foreground font-medium">{update.time}</span>
          </div>
        </div>

        <h3 className="font-serif text-xl mb-2 text-foreground">{update.headline}</h3>
        <p className="text-base text-muted-foreground mb-4">
          {update.body}
        </p>

        {update.imageUrl && (
          <div className="mt-4 rounded-md overflow-hidden aspect-video relative">
            <Image src={update.imageUrl} alt={update.headline} fill className="object-cover" />
          </div>
        )}
        <p className="text-xs text-muted-foreground/70 mt-2">Source: {update.source}</p>
      </div>
    </div>
  );
}
