'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FileText, PenTool, BarChart2, BookOpen,
    Settings, LogOut, Search, Bell, ChevronLeft, ChevronRight,
    Plus, Sparkles, Clock, Calendar as CalendarIcon, Filter,
    MoreHorizontal, CheckCircle2, TrendingUp, AlertCircle, Quote
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import Image from 'next/image';
import { getAuth, signOut } from 'firebase/auth';

// --- CONTEXT ---
const EditorContext = createContext<{
    isCollapsed: boolean;
    setIsCollapsed: (v: boolean) => void;
    currentTab: string;
    setCurrentTab: (v: string) => void;
}>({ isCollapsed: false, setIsCollapsed: () => { }, currentTab: 'overview', setCurrentTab: () => { } });

// --- COMPONENTS ---

// 1. Sidebar
const Sidebar = () => {
    const { isCollapsed, setIsCollapsed, currentTab, setCurrentTab } = useContext(EditorContext);
    const router = useRouter();
    const auth = getAuth();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    const navItems = [
        { id: 'overview', label: 'Newsroom', icon: LayoutDashboard },
        { id: 'stories', label: 'My Stories', icon: FileText },
        { id: 'drafts', label: 'Drafts', icon: PenTool },
        { id: 'analytics', label: 'Performance', icon: BarChart2 },
        { id: 'resources', label: 'Resources', icon: BookOpen },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className={cn(
            "fixed left-0 top-0 z-40 h-screen bg-[#0f0f12] border-r border-white/5 transition-all duration-300 flex flex-col",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Header */}
            <div className="h-20 flex items-center px-6 relative border-b border-white/5">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="min-w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center text-orange-500">
                        <Quote size={18} fill="currentColor" />
                    </div>
                    <motion.span
                        animate={{ opacity: isCollapsed ? 0 : 1 }}
                        className="font-serif font-bold text-xl text-white tracking-tight whitespace-nowrap"
                    >
                        Editor
                    </motion.span>
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer shadow-lg z-50 border-2 border-[#0f0f12]"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Nav */}
            <div className="flex-1 py-8 px-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentTab(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                            currentTab === item.id
                                ? "bg-orange-600/10 text-orange-500 shadow-sm shadow-orange-900/20"
                                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                        )}
                    >
                        <item.icon size={20} className={cn("min-w-[20px]", currentTab === item.id ? "text-orange-500" : "group-hover:text-zinc-200")} />
                        {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}

                        {isCollapsed && currentTab === item.id && (
                            <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-orange-500" />
                        )}
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-zinc-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 border border-white/10 shadow-xl">
                                {item.label}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="text-sm">Log Out</span>}
                </button>
            </div>
        </aside>
    );
};

// 2. TopBar
const TopBar = () => {
    const { isCollapsed } = useContext(EditorContext);
    const { user } = useUser();
    const router = useRouter();

    return (
        <header className={cn(
            "fixed top-0 right-0 z-30 h-20 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300 flex items-center justify-between px-8",
            isCollapsed ? "left-20" : "left-64"
        )}>
            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search stories, assets, or notes..."
                        className="w-full bg-[#18181b] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-zinc-600"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 border border-white/10 rounded bg-white/5 text-[10px] font-mono text-zinc-500">Ctrl K</kbd>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => router.push('/dashboard/new-story')}
                    className="hidden md:flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                    <Plus size={16} />
                    New Story
                </button>

                <div className="h-8 w-px bg-white/10" />

                <div className="flex items-center gap-4">
                    <button className="relative text-zinc-400 hover:text-white transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{user?.displayName}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Senior Editor</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 p-[2px] cursor-pointer hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-shadow">
                            <div className="h-full w-full rounded-full bg-black overflow-hidden relative">
                                {user?.photoURL ? (
                                    <Image src={user.photoURL} alt="User" fill className="object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-zinc-400 font-bold">
                                        {user?.displayName?.[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

// 3. Views

const Overview = () => {
    const { user } = useUser();

    const stats = [
        { label: "Total Views", value: "84.2K", trend: "+12%", trendUp: true, icon: TrendingUp },
        { label: "Stories Published", value: "24", trend: "+4", trendUp: true, icon: FileText },
        { label: "Drafts", value: "3", trend: "Active", trendUp: null, icon: PenTool },
        { label: "Avg Read Time", value: "4m 12s", trend: "+30s", trendUp: true, icon: Clock },
    ];

    const tasks = [
        { title: "Review 'Tech in Africa' draft", due: "Today, 2:00 PM", priority: "high" },
        { title: "Update profile bio", due: "Tomorrow", priority: "low" },
        { title: "Submit monthly report", due: "Fri, Oct 24", priority: "medium" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Welcome */}
            <div className="relative rounded-3xl bg-gradient-to-r from-orange-950/40 to-zinc-900/40 border border-white/5 overflow-hidden p-8 sm:p-12">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
                        Good morning, {user?.displayName?.split(' ')[0]}.
                    </h1>
                    <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                        You have <span className="text-white font-semibold">3 active drafts</span> and your latest story
                        <span className="text-white font-semibold italic"> " The Future of AI"</span> is trending with
                        <span className="text-orange-400 font-semibold"> +12% views</span>.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
                            Continue Writing
                        </button>
                        <button className="bg-white/5 text-white border border-white/10 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors">
                            View Analytics
                        </button>
                    </div>
                </div>
                {/* Decor */}
                <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-[#18181b] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">{stat.label}</span>
                                <div className="p-2 bg-white/5 rounded-lg text-zinc-400 group-hover:text-orange-400 transition-colors">
                                    <stat.icon size={16} />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold text-white">{stat.value}</span>
                                {stat.trendUp !== null && (
                                    <span className={cn("text-xs font-bold px-2 py-1 rounded-full bg-white/5", stat.trendUp ? "text-green-400" : "text-red-400")}>
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Tasks */}
                <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif font-bold text-lg text-white">Editorial Query</h3>
                        <button className="p-1 text-zinc-500 hover:text-white"><MoreHorizontal size={16} /></button>
                    </div>
                    <div className="space-y-4">
                        {tasks.map((task, i) => (
                            <div key={i} className="flex items-start gap-3 group cursor-pointer">
                                <div className={cn(
                                    "w-4 h-4 rounded-full border-2 mt-1 transition-colors",
                                    task.priority === 'high' ? "border-orange-500/50 group-hover:bg-orange-500" : "border-zinc-700 group-hover:border-zinc-500"
                                )}></div>
                                <div className="flex-1">
                                    <p className="text-sm text-zinc-300 group-hover:text-white transition-colors line-through-hover">{task.title}</p>
                                    <p className="text-xs text-zinc-600 mt-1">{task.due}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border border-dashed border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:border-white/20 transition-all">
                        + Add Task
                    </button>
                </div>
            </div>
        </div>
    );
};

const StoriesView = ({ statusFilter }: { statusFilter?: string }) => {
    const firestore = useFirestore();
    const { user } = useUser();
    const router = useRouter();

    // In a real app, query would be filtered by status if provided
    // const q = query(collection(firestore, 'articles'), where('authorId', '==', user.uid));
    // For now we just mock or use the hook properly if we can

    // Simplification for the view:
    const stories = [
        { id: 1, title: "The Rise of Distributed Systems", status: "Published", date: "Oct 12, 2024", views: "12.4K", category: "Tech" },
        { id: 2, title: "Kenya's Fintech Revolution", status: "Draft", date: "Edited 2h ago", views: "-", category: "Finance" },
        { id: 3, title: "Modern Journalism Ethics", status: "Scheduled", date: "Tomorrow, 9AM", views: "-", category: "Opinion" },
        { id: 4, title: "Web3 and the Creator Economy", status: "Published", date: "Sep 28, 2024", views: "8.1K", category: "Tech" },
        { id: 5, title: "Nairobi's Startups to Watch", status: "Draft", date: "Edited 1d ago", views: "-", category: "Business" },
    ];

    const filtered = statusFilter ? stories.filter(s => s.status.toLowerCase() === statusFilter) : stories;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-white">
                        {statusFilter ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Stories` : "All Stories"}
                    </h2>
                    <p className="text-zinc-400 mt-1">Manage, edit, and track your content.</p>
                </div>
                <button onClick={() => router.push('/dashboard/new-story')} className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors">
                    <Plus size={16} /> New Story
                </button>
            </div>

            <div className="bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/[0.02] text-xs font-mono uppercase tracking-widest text-zinc-500">
                    <div className="col-span-6">Title</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1">Views</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-white/5">
                    {filtered.map((story) => (
                        <div key={story.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] transition-colors group">
                            <div className="col-span-6">
                                <h3 className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors cursor-pointer">{story.title}</h3>
                                <p className="text-xs text-zinc-600 mt-0.5">{story.date}</p>
                            </div>
                            <div className="col-span-2">
                                <span className={cn(
                                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border",
                                    story.status === 'Published' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                        story.status === 'Draft' ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" :
                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                )}>
                                    {story.status}
                                </span>
                            </div>
                            <div className="col-span-2 text-sm text-zinc-400">{story.category}</div>
                            <div className="col-span-1 text-sm text-zinc-400 font-mono">{story.views}</div>
                            <div className="col-span-1 flex justify-end">
                                <button className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const AnalyticsView = () => (
    <div className="max-w-5xl mx-auto text-center py-20 animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-6 inline-flex p-4 rounded-full bg-orange-600/10 text-orange-500">
            <BarChart2 size={32} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-4">Deep Analytics</h2>
        <p className="text-zinc-400 max-w-md mx-auto">
            Detailed breakdown of your readership, engagement metrics, and geographic reach is being processed.
            Check back shortly.
        </p>
    </div>
);

const ResourcesView = () => (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-serif font-bold text-white">Editorial Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                { title: "Style Guide", desc: "Our house style, tone, and voice guidelines.", icon: BookOpen },
                { title: "Asset Library", desc: "Logos, stock images, and brand assets.", icon: LayoutDashboard },
                { title: "SEO Best Practices", desc: "How to optimize your stories for search.", icon: Search },
                { title: "Legal & Ethics", desc: "Defamation, copyright, and ethical standards.", icon: AlertCircle },
            ].map((r, i) => (
                <div key={i} className="bg-[#18181b] border border-white/5 p-6 rounded-2xl hover:border-orange-500/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-orange-600 group-hover:text-white transition-all mb-6">
                        <r.icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                    <p className="text-sm text-zinc-400">{r.desc}</p>
                </div>
            ))}
        </div>
    </div>
);

// --- MAIN PAGE ---

export default function EditorDashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentTab, setCurrentTab] = useState('overview');
    const { user, isLoading } = useUser();
    const router = useRouter();

    // Updated Nav Items
    const sidebarNavItems = [
        { id: 'overview', label: 'Newsroom', icon: LayoutDashboard },
        { id: 'stories', label: 'My Stories', icon: FileText },
        { id: 'drafts', label: 'Drafts', icon: PenTool },
        { id: 'analytics', label: 'Performance', icon: BarChart2 },
        { id: 'resources', label: 'Resources', icon: BookOpen },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Pass custom nav items to Sidebar if properly refactored, but for now we stick to contextual usage or direct edit.
    // Actually, Sidebar component is defined above. I need to update IT directly or pass logic.
    // I'll update the component above via full replacement of the Main Page + sub-components block
    // Wait, replace_file_content targets lines. I'll just update the Sidebar definition in the next step or careful edit.
    // Easier to just duplicate the logic in the replacement since it IS the file.

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-500 text-sm animate-pulse">Loading Workspace...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <EditorContext.Provider value={{ isCollapsed, setIsCollapsed, currentTab, setCurrentTab }}>
            <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-orange-500/30">
                <Sidebar />
                <TopBar />

                <main className={cn(
                    "pt-28 px-8 pb-12 transition-all duration-300 min-h-screen",
                    isCollapsed ? "ml-20" : "ml-64"
                )}>
                    {currentTab === 'overview' && <Overview />}
                    {currentTab === 'stories' && <StoriesView />}
                    {currentTab === 'drafts' && <StoriesView statusFilter="draft" />}
                    {currentTab === 'analytics' && <AnalyticsView />}
                    {currentTab === 'resources' && <ResourcesView />}
                    {currentTab === 'settings' && <SettingsView />}
                </main>
            </div>
        </EditorContext.Provider>
    );
}
