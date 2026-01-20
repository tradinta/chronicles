'use client';

import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, FileText, PenTool, BarChart2, BookOpen,
    Settings, LogOut, Search, Bell, ChevronLeft, ChevronRight,
    Plus, Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAuth, signOut } from 'firebase/auth';

// Import Modular Components
import Overview from '@/components/dashboard/editorial/Overview';
import StoriesView from '@/components/dashboard/editorial/StoriesView';
import PerformanceAnalytics from '@/components/dashboard/editorial/PerformanceAnalytics';
import EditorialResources from '@/components/dashboard/editorial/EditorialResources';
import EditorSettings from '@/components/dashboard/editorial/EditorSettings';

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
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Editor</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 p-[2px] cursor-pointer hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-shadow">
                            <div className="h-full w-full rounded-full bg-black overflow-hidden relative">
                                {user?.photoURL ? (
                                    <Image src={user.photoURL} alt="User" fill className="object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-zinc-400 font-bold">
                                        {user?.displayName?.[0] || 'U'}
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

// --- MAIN PAGE ---

export default function EditorDashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentTab, setCurrentTab] = useState('overview');
    const { user, isLoading } = useUser();
    const router = useRouter();

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
        // router.push('/login'); 
        // Can fail if pure client? Let's just return null and let middleware or useEffect handle default.
        // Actually, let's keep it safe.
    }

    // Protection if redirect is slow
    if (!user && !isLoading) {
        if (typeof window !== 'undefined') router.push('/login');
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
                    {currentTab === 'drafts' && <StoriesView statusFilter="draft" title="My Drafts" />}
                    {currentTab === 'analytics' && <PerformanceAnalytics />}
                    {currentTab === 'resources' && <EditorialResources />}
                    {currentTab === 'settings' && <EditorSettings />}
                </main>
            </div>
        </EditorContext.Provider>
    );
}
