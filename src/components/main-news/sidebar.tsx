
"use client";

import { TrendingUp, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

const trendingItems = [
    {id: 1, title: "Why the global supply chain is shifting to localized hubs faster than predicted."},
    {id: 2, title: "The surprising link between gut health and mental focus."},
    {id: 3, title: "AI's impact on creative industries: A one-year retrospective."},
    {id: 4, title: "Urban planning reimagined: The 15-minute city model gains traction."}
];

type SidebarProps = {
  onViewChange: (id: number) => void;
};

export default function Sidebar({ onViewChange }: SidebarProps) {
  const router = useRouter();
  return (
    <div className="hidden lg:block lg:col-span-3 pl-8 relative">
      <div className="sticky top-40 space-y-12">
        
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp size={16} className="text-primary" />
            <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Trending Now</h4>
          </div>
          <ul className="space-y-6">
            {trendingItems.map((item, i) => (
              <li key={item.id} className="group cursor-pointer flex items-baseline" onClick={() => onViewChange(item.id)}>
                <span className="text-xs font-mono mr-4 opacity-50 text-muted-foreground">0{i+1}</span>
                <span className="text-sm font-medium leading-snug group-hover:underline text-foreground/80 dark:text-foreground/70">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-lg bg-secondary/30 dark:bg-secondary/20">
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Reading Queue</h4>
              <Bookmark size={14} className="text-muted-foreground" />
           </div>
           <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm italic">Your list is empty.</p>
              <button className="mt-2 text-xs uppercase tracking-wide font-bold text-muted-foreground hover:text-foreground">Explore Archives</button>
           </div>
        </div>

      </div>
    </div>
  );
}
