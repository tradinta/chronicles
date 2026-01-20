'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    trend: number;
    icon: React.ElementType;
    colorClass?: string;
}

function StatCard({ label, value, trend, icon: Icon, colorClass = "bg-primary" }: StatCardProps) {
    const isPositive = trend >= 0;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-[#18181b] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-[140px] relative overflow-hidden group"
        >
            <div className="flex justify-between items-start z-10">
                <div className="p-2.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                    <Icon size={18} />
                </div>
                <button className="text-gray-600 hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            <div className="z-10">
                <h3 className="text-sm text-gray-400 font-medium mb-1">{label}</h3>
                <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
                    <div className={`flex items-center gap-0.5 text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(trend)}%
                    </div>
                </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        </motion.div>
    );
}

export function StatsRow({ stats }: { stats: any }) {
    // Mock trends for now, can calculate real ones if historian data exists
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Articles" value={stats.totalArticles} trend={12} icon={require('lucide-react').FileText} />
            <StatCard label="Total Views" value={stats.totalViews} trend={8.4} icon={require('lucide-react').Users} />
            <StatCard label="Publication Rate" value={`${Math.round((stats.publishedCount / (stats.totalArticles || 1)) * 100)}%`} trend={-2} icon={require('lucide-react').Activity} />
            <StatCard label="Drafts Pending" value={stats.draftCount} trend={5} icon={require('lucide-react').PenTool} />
        </div>
    );
}
