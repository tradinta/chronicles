'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Plus, PenTool, ExternalLink, Calendar, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface StoriesViewProps {
    statusFilter?: string; // 'draft' | 'published' | 'scheduled' | undefined (for all)
    title?: string;
}

export default function StoriesView({ statusFilter, title }: StoriesViewProps) {
    const firestore = useFirestore();
    const { user } = useUser();
    const router = useRouter();
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user || !firestore) return;

        const fetchStories = async () => {
            try {
                // Fetch all stories for author, order by Last Updated
                // We fetch all then filter in memory for search/status if not provided
                let q = query(
                    collection(firestore, 'articles'),
                    where('authorId', '==', user.uid),
                    orderBy('lastUpdated', 'desc')
                );

                const snap = await getDocs(q);
                let fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));

                // Client-side filtering
                if (statusFilter) {
                    fetched = fetched.filter((s: any) => s.status === statusFilter);
                }

                setStories(fetched);
            } catch (e) {
                console.error("Fetch stories error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [user, firestore, statusFilter]);

    const filteredStories = stories.filter(story => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return story.title?.toLowerCase().includes(q) || story.category?.toLowerCase().includes(q);
    });

    if (loading) return <div className="text-center py-20 text-zinc-500 animate-pulse">Loading stories...</div>;

    const displayTitle = title || (statusFilter ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Stories` : "All Stories");

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-white">{displayTitle}</h2>
                    <p className="text-zinc-400 mt-1">Manage, edit, and track your content.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#18181b] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 w-full md:w-64"
                        />
                    </div>
                    <button onClick={() => router.push('/dashboard/new-story')} className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-900/20 whitespace-nowrap">
                        <Plus size={16} /> New Story
                    </button>
                </div>
            </div>

            <div className="bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-zinc-500">
                    <div className="col-span-6">Details</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Stats</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                    {filteredStories.length === 0 && (
                        <div className="p-12 text-center text-zinc-500 italic flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                                <FileText size={32} />
                            </div>
                            <p>No stories found matching your criteria.</p>
                            <button onClick={() => router.push('/dashboard/new-story')} className="text-orange-500 text-sm font-bold hover:underline">
                                Start Writing
                            </button>
                        </div>
                    )}
                    {filteredStories.map((story) => (
                        <div key={story.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
                            <div className="col-span-6 cursor-pointer" onClick={() => router.push(`/dashboard/editorial/${story.id}`)}>
                                <h3 className="text-sm font-bold text-zinc-200 group-hover:text-orange-400 transition-colors line-clamp-1 font-serif text-lg">
                                    {story.title || '(Untitled Draft)'}
                                </h3>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {story.lastUpdated ? format(story.lastUpdated.toDate(), 'MMM d, yyyy') : 'Unknown'}
                                    </span>
                                    {story.category && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                                            {story.category}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border inline-flex items-center gap-1.5",
                                    story.status === 'published' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                        story.status === 'draft' ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" :
                                            story.status === 'scheduled' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                "bg-red-500/10 text-red-400 border-red-500/20"
                                )}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full",
                                        story.status === 'published' ? "bg-green-400" :
                                            story.status === 'draft' ? "bg-zinc-400" :
                                                "bg-blue-400"
                                    )} />
                                    {story.status || 'draft'}
                                </span>
                            </div>

                            <div className="col-span-2 flex flex-col gap-1">
                                <span className="text-sm text-zinc-300 font-mono">
                                    {story.views || 0} <span className="text-zinc-600 text-xs">views</span>
                                </span>
                            </div>

                            <div className="col-span-2 flex justify-end gap-2">
                                <button
                                    onClick={() => router.push(`/dashboard/editorial/${story.id}`)}
                                    className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                                    title="Edit"
                                >
                                    <PenTool size={16} />
                                </button>
                                {story.status === 'published' && story.slug && (
                                    <button
                                        onClick={() => window.open(`/article/${story.slug}`, '_blank')}
                                        className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                                        title="View Live"
                                    >
                                        <ExternalLink size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
