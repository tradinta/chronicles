'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser, useFirestore } from '@/firebase';
import { getAuthorStats, getAuthorArticles } from '@/firebase/firestore/articles';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Layout
import { DashboardShell } from '@/components/dashboard/layout/shell';

// Widgets
import { GreetingWidget } from '@/components/dashboard/widgets/greeting-widget';
import { StatsRow } from '@/components/dashboard/widgets/stats-row';
import { AnalyticsChart } from '@/components/dashboard/widgets/analytics-chart';
import { CalendarWidget } from '@/components/dashboard/widgets/calendar-widget';
import { QuickTasks } from '@/components/dashboard/widgets/quick-tasks';
import { RecentProjects } from '@/components/dashboard/widgets/recent-projects';

// Admin
import { ModerationQueue } from '@/components/dashboard/admin/moderation-queue';
import { UserManagement } from '@/components/dashboard/admin/user-management';

// --- Dev Tools (Seed Button) ---
function DevTools() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSeed = async () => {
        if (!confirm("This will add dummy data to your database. Continue?")) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/seed', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Success", description: data.message });
                window.location.reload();
            } else throw new Error(data.error);
        } catch (e: any) {
            toast({ variant: "destructive", title: "Error", description: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-black/20 border border-dashed border-white/5 rounded-2xl flex items-center justify-between">
            <div>
                <h4 className="text-sm font-bold text-white">Developer Tools</h4>
                <p className="text-xs text-gray-500">Utilities for development and testing.</p>
            </div>
            <button
                onClick={handleSeed}
                disabled={isLoading}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors border border-white/5"
            >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Seed Database
            </button>
        </div>
    )
}

export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['authorStats', user?.uid],
        queryFn: async () => {
            if (!user || !firestore) return null;
            return await getAuthorStats(firestore, user.uid);
        },
        enabled: !!user && !!firestore,
    });

    const { data: articles, isLoading: articlesLoading } = useQuery({
        queryKey: ['recentArticles', user?.uid],
        queryFn: async () => {
            if (!user || !firestore) return [];
            const all = await getAuthorArticles(firestore, user.uid);
            return all.slice(0, 5); // Just top 5
        },
        enabled: !!user && !!firestore,
    });

    if (!user) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center"><Loader2 className="text-white animate-spin" /></div>;

    const mockStats = {
        totalArticles: 0,
        publishedCount: 0,
        draftCount: 0,
        totalViews: 0
    };

    return (
        <DashboardShell>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* 1. Greeting & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <GreetingWidget />
                    <div className="lg:col-span-3">
                        <StatsRow stats={stats || mockStats} />
                    </div>
                </div>

                {/* 2. Main Work Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Analytics & Projects */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnalyticsChart />
                        <RecentProjects articles={articles || []} />
                    </div>

                    {/* Right Column: Calendar & Tasks */}
                    <div className="space-y-6">
                        <CalendarWidget />
                        <QuickTasks />
                    </div>
                </div>

                {/* 3. Admin Zone */}
                <div className="pt-8 border-t border-white/5">
                    <h2 className="text-xl font-bold text-white font-serif mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        Admin Control Center
                    </h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ModerationQueue />
                        <UserManagement />
                    </div>
                </div>

                {/* 4. Footer / Dev Tools */}
                <DevTools />

            </div>
        </DashboardShell>
    );
}
