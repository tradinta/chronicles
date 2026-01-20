'use client';

import React from 'react';

export const Ticker = ({ items }: { items: any[] }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="w-full py-3 border-b overflow-hidden bg-[#F2F0EB] dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400">
            <div className="ticker-wrap cursor-default">
                <div className="ticker inline-block whitespace-nowrap">
                    {items.map((item, index) => (
                        <span key={index} className="inline-block px-8 text-xs font-medium tracking-wide uppercase">
                            <span className="mr-2 opacity-50 text-orange-600 font-bold">•</span> {item.title}
                        </span>
                    ))}
                    {/* Duplicate for infinite effect */}
                    {items.map((item, index) => (
                        <span key={`dup-${index}`} className="inline-block px-8 text-xs font-medium tracking-wide uppercase">
                            <span className="mr-2 opacity-50 text-orange-600 font-bold">•</span> {item.title}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
