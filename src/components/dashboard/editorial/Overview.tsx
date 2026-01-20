'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { getAuthorStats } from '@/firebase/firestore/articles';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { TrendingUp, FileText, PenTool, BookOpen, MoreHorizontal, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function Overview() {
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [stats, setStats] = useState({ totalArticles: 0, publishedCount: 0, draftCount: 0, totalViews: 0 });
    const [recentDrafts, setRecentDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !firestore) return;

        const fetchData = async () => {
            try {
                // Fetch Stats
                const authorStats = await getAuthorStats(firestore, user.uid);
                setStats(authorStats);

                // Fetch Recent Drafts
                const draftQ = query(
                    collection(firestore, 'articles'),
                    where('authorId', '==', user.uid),
                    where('status', '==', 'draft'),
                    orderBy('lastUpdated', 'desc'),
                    limit(3)
                );
                const draftSnap = await getDocs(draftQ);
                setRecentDrafts(draftSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            } catch (e) {
                console.error("Dashboard overview error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, firestore]);

    const statCards = [
        { label: "Total Views", value: stats.totalViews.toLocaleString(), trend: "Lifetime", trendUp: true, icon: TrendingUp },
        { label: "Published", value: stats.publishedCount, trend: "Stories", trendUp: true, icon: FileText },
        { label: "Drafts", value: stats.draftCount, trend: "In Progress", trendUp: null, icon: PenTool },
        { label: "Total Articles", value: stats.totalArticles, trend: "All Time", trendUp: true, icon: BookOpen },
    ];

    if (loading) return <div className="p-12 text-center text-zinc-500 animate-pulse">Loading newsroom...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Welcome */}
            <div className="relative rounded-3xl bg-gradient-to-r from-orange-950/40 to-zinc-900/40 border border-white/5 overflow-hidden p-8 sm:p-12">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
                        Hello, {user?.displayName?.split(' ')[0] || 'Editor'}.
                    </h1>
                    <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                        You have <span className="text-white font-semibold">{stats.draftCount} active drafts</span> waiting for your touch.
                        Ready to create something impactful today?
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => router.push('/dashboard/new-story')} className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
                            Create New Story
                        </button>
                    </div>
                </div>
                {/* Decor */}
                <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {statCards.map((stat, i) => (
                        <div key={i} className="bg-[#18181b] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">{stat.label}</span>
                                <div className="p-2 bg-white/5 rounded-lg text-zinc-400 group-hover:text-orange-400 transition-colors">
                                    <stat.icon size={16} />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/5 text-zinc-400">
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Drafts */}
                <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif font-bold text-lg text-white">Recent Drafts</h3>
                        <button className="p-1 text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                    </div>
                    <div className="space-y-4">
                        {recentDrafts.length === 0 && <p className="text-zinc-500 text-sm">No drafts found.</p>}
                        {recentDrafts.map((draft, i) => (
                            <div key={i} className="flex items-start gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors" onClick={() => router.push(`/dashboard/editorial/${draft.id}`)}>
                                <div className="w-8 h-8 rounded bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                                    <PenTool size={14} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-zinc-300 group-hover:text-white transition-colors font-medium line-clamp-1">{draft.title || 'Untitled Draft'}</p>
                                    <p className="text-xs text-zinc-600 mt-1">Edited {draft.lastUpdated ? format(draft.lastUpdated.toDate(), 'MMM d, h:mm a') : 'Recently'}</p>
                                </div>
                                <ArrowRight size={14} className="text-zinc-600 group-hover:text-white self-center opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        ))}
                    </div>
                    <button onClick={() => router.push('/dashboard/new-story')} className="w-full mt-6 py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                        + New Draft
                    </button>
                </div>
            </div>
        </div>
    );
}
