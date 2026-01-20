'use client';

import React from 'react';
import { Clock, TrendingUp, MapPin, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const BriefingCard = ({ title, icon: Icon, items, onViewChange }: any) => (
    <div className="p-6 rounded-xl border flex flex-col h-full transition-all hover:shadow-md bg-white dark:bg-stone-900/30 border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-dashed border-stone-300 dark:border-stone-700/50">
            <Icon size={16} className="text-stone-500 dark:text-stone-400" />
            <h3 className="font-serif text-lg font-bold tracking-wide text-stone-800 dark:text-stone-200">{title}</h3>
        </div>
        <div className="space-y-6 flex-1">
            {items.map((item: any, i: number) => (
                <div key={i} className="group cursor-pointer" onClick={() => onViewChange(`/article/${item.id}`)}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500">
                            {item.publishDate ? formatDistanceToNow(item.publishDate.toDate(), { addSuffix: true }) : 'Just now'}
                        </span>
                        <span className="text-[9px] font-bold text-orange-600/70 uppercase">
                            by {item.authorName || 'The Editors'}
                        </span>
                    </div>

                    <h4 className="text-sm font-medium leading-snug group-hover:underline text-stone-700 dark:text-stone-300">{item.title}</h4>
                </div>
            ))}
            {items.length === 0 && <p className="text-xs text-stone-400 italic">No updates in this section.</p>}
        </div>
        <div className="mt-6 pt-4 border-t border-transparent">
            <button className="text-xs font-bold uppercase tracking-widest flex items-center group text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300" onClick={() => onViewChange('/news')}>
                <span>Explore All</span>
                <ArrowRight size={12} className="ml-1 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    </div>
);

export const BriefingSection = ({ onViewChange, techArticles, businessArticles, worldArticles }: any) => {
    return (
        <section className="py-16 px-6 md:px-12 border-b border-stone-200 dark:border-stone-800 bg-[#F9F7F3] dark:bg-[#151515]">
            <div className="container mx-auto">
                <div className="flex items-center space-x-2 mb-8 opacity-60">
                    <span className="h-[1px] w-8 bg-stone-400 dark:bg-stone-500"></span>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">The Daily Briefing</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <BriefingCard title="Technology" icon={Clock} items={techArticles} onViewChange={onViewChange} />
                    <BriefingCard title="Business" icon={TrendingUp} items={businessArticles} onViewChange={onViewChange} />
                    <BriefingCard title="World" icon={MapPin} items={worldArticles} onViewChange={onViewChange} />
                </div>
            </div>
        </section>
    );
};
