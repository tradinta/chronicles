'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Clock, ChevronRight } from 'lucide-react';

export function RecentProjects({ articles }: { articles: any[] }) {
    const router = useRouter();

    return (
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 lg:col-span-2 min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white font-serif">Recent Projects</h3>
                <button onClick={() => router.push('/dashboard/stories')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                    Export <ChevronRight size={12} />
                </button>
            </div>

            <div className="space-y-4">
                {articles.length === 0 && <p className="text-sm text-gray-500 italic">No recent articles found.</p>}

                {articles.map((article, i) => (
                    <div
                        key={article.id}
                        onClick={() => router.push(`/dashboard/stories/${article.id}`)}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                                <FileText size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors line-clamp-1">{article.title}</h4>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    {article.category || 'General'} • <span className="flex items-center gap-0.5"><Clock size={10} /> {article.status}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Progress bar mock */}
                            <div className="hidden sm:block w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: article.status === 'published' ? '100%' : '60%' }}></div>
                            </div>
                            <span className="text-xs font-mono text-gray-400 hidden sm:block">{article.status === 'published' ? '100%' : '60%'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
