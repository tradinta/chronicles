'use client';

import React from 'react';
import { BookOpen, LayoutDashboard, Search, AlertCircle, Video, Download } from 'lucide-react';

export default function EditorialResources() {
    const resources = [
        {
            title: "Style Guide",
            desc: "The definitive guide to our voice, tone, and house style.",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Asset Library",
            desc: "High-resolution logos, brand patterns, and stock photography.",
            icon: LayoutDashboard,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "SEO Handbook",
            desc: "Best practices for headlines, meta descriptions, and keywords.",
            icon: Search,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Legal Guidelines",
            desc: "Understanding defamation, copyright, and sourcing requirements.",
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            title: "Tutorials",
            desc: "Video guides on using the CMS and new features.",
            icon: Video,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-white">Resources</h2>
                <p className="text-zinc-400 mt-1">Tools and guides to help you create your best work.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((r, i) => (
                    <div key={i} className="bg-[#18181b] border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${r.color} ${r.bg} mb-6 transition-transform group-hover:scale-110`}>
                            <r.icon size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                        <p className="text-sm text-zinc-400 mb-6">{r.desc}</p>

                        <div className="flex items-center text-xs font-bold uppercase tracking-wider text-zinc-500 group-hover:text-white transition-colors">
                            <span className="mr-2">Open Resource</span>
                            <Download size={12} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[#18181b] border border-white/5 p-8 rounded-2xl mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Need something else?</h3>
                    <p className="text-zinc-400">Contact the editorial operations team for specific requests.</p>
                </div>
                <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">
                    Contact Ops
                </button>
            </div>
        </div>
    );
}
