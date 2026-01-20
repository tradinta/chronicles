'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Flame, EyeOff, ExternalLink } from 'lucide-react';

export const MainGrid = ({ leadArticle, trendingArticles }: any) => {
    const router = useRouter();

    if (!leadArticle && trendingArticles.length === 0) return null;

    return (
        <section className="py-20 px-6 md:px-12 bg-[#FDFBF7] dark:bg-[#121212]">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-8">
                    {leadArticle && (
                        <div onClick={() => router.push(`/article/${leadArticle.id}`)} className="group cursor-pointer">
                            <div className="overflow-hidden mb-5 relative aspect-[4/3] rounded-sm bg-stone-100 dark:bg-stone-800">
                                <Image
                                    src={leadArticle.imageUrl || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop"}
                                    alt={leadArticle.title}
                                    fill
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <span className="text-xs font-bold tracking-widest uppercase text-orange-600">{leadArticle.category || 'Feature'}</span>
                            <h3 className="font-serif text-4xl mt-3 leading-tight text-stone-900 dark:text-stone-100">{leadArticle.title}</h3>
                            <p className="mt-3 text-lg leading-relaxed text-stone-600 dark:text-stone-400">{leadArticle.summary}</p>
                        </div>
                    )}
                </div>
                <div className="md:col-span-4 flex flex-col space-y-12 border-l border-stone-200/20 pl-0 md:pl-12">
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <Flame size={16} className="text-orange-600" />
                            <h4 className="text-xs font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400">Trending Now</h4>
                        </div>
                        <ul className="space-y-6">
                            {trendingArticles.map((item: any, i: number) => (
                                <li key={i} className="group cursor-pointer flex items-start" onClick={() => router.push(`/article/${item.id}`)}>
                                    <span className="text-xl font-serif mr-4 opacity-30 group-hover:opacity-60 transition-opacity text-stone-900 dark:text-stone-100">0{i + 1}</span>
                                    <div>
                                        <span className="text-[10px] font-bold text-orange-600/70 uppercase mb-1 block">by {item.authorName || 'The Editors'}</span>
                                        <span className="text-sm font-medium leading-snug group-hover:underline text-stone-700 dark:text-stone-300">
                                            {item.title}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div onClick={() => router.push('/off-the-record')} className="p-6 rounded-lg cursor-pointer border transition-colors bg-teal-50 border-teal-200 dark:bg-[#042f2e] dark:border-teal-800">
                        <div className="flex items-center space-x-2 text-teal-500 mb-2">
                            <EyeOff size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Off The Record</span>
                        </div>
                        <h3 className="font-serif text-xl text-teal-900 dark:text-teal-50">Unverified: The Tech Merger Rumors</h3>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const LatestDispatch = ({ onViewChange, articles }: any) => {
    return (
        <section className="py-20 px-6 md:px-12 bg-white dark:bg-black border-y border-stone-200 dark:border-stone-800">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col space-y-6">
                    <h3 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">The Latest Dispatch</h3>
                    {articles.map((a: any) => (
                        <div key={a.id} className="group cursor-pointer" onClick={() => onViewChange(`/article/${a.id}`)}>
                            <span className="text-[10px] font-bold text-orange-600/70 uppercase mb-1 block">by {a.authorName || 'The Editors'}</span>
                            <p className="text-sm font-medium leading-snug text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
                                {a.title}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="text-right">
                    <button onClick={() => onViewChange('/news')} className="group inline-flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 dark:bg-white dark:text-black">
                        Explore All Stories
                        <ExternalLink size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
};
