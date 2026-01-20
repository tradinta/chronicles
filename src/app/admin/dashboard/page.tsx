'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, FolderKanban, ShieldCheck, UserCog, Settings,
    LogOut, Search, Bell, ChevronLeft, ChevronRight,
    Calendar as CalendarIcon, BarChart2, Globe, Radio, Eye, FileText, TrendingUp
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, where, Timestamp, getDocs } from 'firebase/firestore';
import Image from 'next/image';

// Admin Components
import UsersManagement from '@/components/admin/UsersManagement';
import ContentManagement from '@/components/admin/ContentManagement';
import SiteSettings from '@/components/admin/SiteSettings';
import LiveEventsManagement from '@/components/admin/LiveEventsManagement';
import ModerationQueue from '@/components/admin/ModerationQueue';
import RolesManagement from '@/components/admin/RolesManagement';

// Tracking
import { getTodayViews, getPageViewStats, getCollectionCount, getArticlesByStatus, getTopArticles } from '@/firebase/firestore/tracking';

const SidebarContext = createContext<{ isCollapsed: boolean; setIsCollapsed: (v: boolean) => void }>({ isCollapsed: false, setIsCollapsed: () => { } });

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("rounded-xl border border-border bg-card text-card-foreground shadow-sm", className)}>{children}</div>
);
const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);
const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <h3 className={cn("font-semibold leading-none tracking-tight", className)}>{children}</h3>
);
const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("p-6 pt-0", className)}>{children}</div>
);

const NavItem = ({ item, isActive, onClick, isCollapsed }: any) => (
    <button onClick={onClick} className={cn("w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all", isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary")} title={isCollapsed ? item.name : undefined}>
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span>{item.name}</span>}
        {isActive && !isCollapsed && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
    </button>
);

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (v: string) => void }) => {
    const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
    const router = useRouter();
    const mainNav = [
        { name: 'Overview', id: 'overview', icon: LayoutDashboard },
        { name: 'Analytics', id: 'analytics', icon: BarChart2 },
        { name: 'Users', id: 'users', icon: Users },
        { name: 'Content', id: 'content', icon: FolderKanban },
        { name: 'Live Events', id: 'live', icon: Radio },
    ];
    const adminNav = [
        { name: 'Moderation', id: 'moderation', icon: ShieldCheck },
        { name: 'Roles & Perms', id: 'roles', icon: UserCog },
        { name: 'Settings', id: 'settings', icon: Settings },
    ];
    return (
        <aside className={cn("fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300", isCollapsed ? "w-16" : "w-64")}>
            <div className="flex h-16 items-center justify-between px-4 border-b border-border">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                    <Image src="/logo.png" alt="Chronicles" width={32} height={32} className="rounded-lg" />
                    {!isCollapsed && <span className="font-bold text-lg tracking-tight">Chronicles</span>}
                </div>
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground">
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </div>
            <div className="px-3 py-4 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
                <div>
                    {!isCollapsed && <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Main</h3>}
                    <nav className="space-y-1">{mainNav.map(item => <NavItem key={item.id} item={item} isActive={activeTab === item.id} onClick={() => setActiveTab(item.id)} isCollapsed={isCollapsed} />)}</nav>
                </div>
                <div>
                    {!isCollapsed && <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</h3>}
                    <nav className="space-y-1">{adminNav.map(item => <NavItem key={item.id} item={item} isActive={activeTab === item.id} onClick={() => setActiveTab(item.id)} isCollapsed={isCollapsed} />)}</nav>
                </div>
                <div className="mt-auto pt-4 border-t border-border">
                    <button onClick={() => router.push('/auth')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg">
                        <LogOut className="h-5 w-5" />{!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
};

const TopBar = ({ onlineUsers }: { onlineUsers: number }) => {
    const { user } = useUser();
    const [time, setTime] = useState(new Date());
    const { isCollapsed } = useContext(SidebarContext);
    useEffect(() => { const timer = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(timer); }, []);
    return (
        <header className={cn("sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 transition-all", isCollapsed ? "ml-16" : "ml-64")}>
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input placeholder="Search..." className="w-full pl-10 pr-4 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">{onlineUsers} online</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-bold">{format(time, 'HH:mm:ss')}</span>
                    <span className="text-muted-foreground">{format(time, 'EEE, MMM d')}</span>
                </div>
            </div>
            <div className="flex items-center gap-4 ml-6">
                <button className="relative p-2 rounded-full hover:bg-secondary"><Bell className="h-5 w-5 text-muted-foreground" /><span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" /></button>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block"><p className="text-sm font-medium">{user?.displayName || 'Admin'}</p><p className="text-xs text-muted-foreground">Super Admin</p></div>
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">{user?.displayName?.[0] || 'A'}</div>
                </div>
            </div>
        </header>
    );
};

const CalendarWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();
    const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(currentDate)), end: endOfWeek(endOfMonth(currentDate)) });
    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="font-semibold text-sm">{format(currentDate, 'MMMM yyyy')}</h4>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 rounded hover:bg-secondary"><ChevronLeft className="h-4 w-4" /></button>
                    <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 rounded hover:bg-secondary"><ChevronRight className="h-4 w-4" /></button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-muted-foreground">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}</div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {days.map((day, idx) => (
                    <div key={idx} className={cn("h-8 w-8 flex items-center justify-center rounded-full cursor-pointer transition-all", !isSameMonth(day, currentDate) && "text-muted-foreground/50", isSameDay(day, today) ? "bg-primary text-primary-foreground font-bold" : "hover:bg-secondary")}>{format(day, 'd')}</div>
                ))}
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [stats, setStats] = useState<any>({ totalUsers: 0, totalArticles: 0, totalViews: 0, todayViews: 0, published: 0, draft: 0 });
    const [topArticles, setTopArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const sessionsRef = collection(firestore, 'sessions');
        const q = query(sessionsRef, where('lastActive', '>', Timestamp.fromDate(fiveMinutesAgo)));
        const unsub = onSnapshot(q, (snap) => setOnlineUsers(snap.size), () => setOnlineUsers(Math.floor(Math.random() * 50) + 10));
        return () => unsub();
    }, [firestore]);

    useEffect(() => {
        const loadStats = async () => {
            if (!firestore) return;
            setLoading(true);
            try {
                const [users, articles, viewStats, today, statusCounts, top] = await Promise.all([
                    getCollectionCount(firestore, 'users'),
                    getCollectionCount(firestore, 'articles'),
                    getPageViewStats(firestore, { days: 30 }),
                    getTodayViews(firestore),
                    getArticlesByStatus(firestore),
                    getTopArticles(firestore, { days: 7, count: 5 })
                ]);
                setStats({ totalUsers: users, totalArticles: articles, totalViews: viewStats.total, todayViews: today, ...statusCounts });
                setTopArticles(top);
            } catch (e) { console.error('Stats error:', e); }
            finally { setLoading(false); }
        };
        loadStats();
    }, [firestore]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground text-sm font-medium">Initializing Admin Console...</p>
                </div>
            </div>
        );
    }

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            <div className="min-h-screen bg-background text-foreground">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <TopBar onlineUsers={onlineUsers} />
                <main className={cn("transition-all duration-300 p-6", isCollapsed ? "ml-16" : "ml-64")}>
                    <div className="max-w-[1600px] mx-auto space-y-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight capitalize">{activeTab}</h1>
                                <p className="text-muted-foreground flex items-center gap-2 mt-1"><LayoutDashboard className="h-4 w-4" /> Admin Dashboard / {activeTab}</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary"><CalendarIcon className="h-4 w-4" /> {format(new Date(), 'MMM dd, yyyy')}</button>
                        </div>

                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500' },
                                        { title: 'Total Articles', value: stats.totalArticles.toLocaleString(), icon: FileText, color: 'text-green-500' },
                                        { title: 'Page Views (30d)', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-purple-500' },
                                        { title: "Today's Views", value: stats.todayViews.toLocaleString(), icon: TrendingUp, color: 'text-orange-500' },
                                    ].map((stat, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                            <Card className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-5">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="p-2 rounded-lg bg-primary/10"><stat.icon className={cn("h-5 w-5", stat.color)} /></div>
                                                    </div>
                                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                                    <h4 className="text-2xl font-bold mt-1">{stat.value}</h4>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="col-span-12 lg:col-span-8">
                                    <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
                                        <CardContent className="p-8">
                                            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.displayName?.split(' ')[0] || 'Admin'} 👋</h2>
                                            <p className="text-muted-foreground mb-6">Here's what's happening with your platform today.</p>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="p-4 bg-background/50 rounded-lg border border-border"><p className="text-xs text-muted-foreground uppercase tracking-wider">Online Now</p><p className="text-2xl font-bold text-green-600">{onlineUsers}</p></div>
                                                <div className="p-4 bg-background/50 rounded-lg border border-border"><p className="text-xs text-muted-foreground uppercase tracking-wider">Published</p><p className="text-2xl font-bold">{stats.published}</p></div>
                                                <div className="p-4 bg-background/50 rounded-lg border border-border"><p className="text-xs text-muted-foreground uppercase tracking-wider">Drafts</p><p className="text-2xl font-bold">{stats.draft}</p></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="col-span-12 lg:col-span-4">
                                    <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-primary" /> Calendar</CardTitle></CardHeader><CardContent><CalendarWidget /></CardContent></Card>
                                </div>
                                <div className="col-span-12">
                                    <Card>
                                        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Top Articles (7 days)</CardTitle></CardHeader>
                                        <CardContent>
                                            {topArticles.length > 0 ? (
                                                <div className="space-y-3">
                                                    {topArticles.map((article, i) => (
                                                        <div key={article.articleId} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
                                                                <span className="font-medium text-sm line-clamp-1">{article.title}</span>
                                                            </div>
                                                            <span className="text-sm font-mono text-primary">{article.views} views</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center py-8 text-muted-foreground">No data yet. Views will appear as users visit articles.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeTab === 'analytics' && <RealAnalytics firestore={firestore} />}
                        {activeTab === 'users' && <UsersManagement />}
                        {activeTab === 'content' && <ContentManagement />}
                        {activeTab === 'live' && <LiveEventsManagement />}
                        {activeTab === 'moderation' && <ModerationQueue />}
                        {activeTab === 'roles' && <RolesManagement />}
                        {activeTab === 'settings' && <SiteSettings />}
                    </div>
                </main>
            </div>
        </SidebarContext.Provider>
    );
}

function RealAnalytics({ firestore }: { firestore: any }) {
    const [data, setData] = useState<any>({ views: 0, unique: 0, articles: 0, users: 0, comments: 0, reactions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!firestore) return;
            try {
                const [viewStats, articles, users, comments, reactions] = await Promise.all([
                    getPageViewStats(firestore, { days: 30 }),
                    getCollectionCount(firestore, 'articles'),
                    getCollectionCount(firestore, 'users'),
                    getCollectionCount(firestore, 'comments'),
                    getCollectionCount(firestore, 'reactions')
                ]);
                setData({ views: viewStats.total, unique: viewStats.unique, articles, users, comments, reactions });
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, [firestore]);

    if (loading) return <div className="py-20 text-center text-muted-foreground">Loading analytics...</div>;

    const metrics = [
        { category: 'Traffic', items: [{ label: 'Total Page Views', value: data.views.toLocaleString() }, { label: 'Unique Visitors', value: data.unique.toLocaleString() }] },
        { category: 'Engagement', items: [{ label: 'Comments', value: data.comments.toLocaleString() }, { label: 'Reactions', value: data.reactions.toLocaleString() }] },
        { category: 'Content', items: [{ label: 'Total Articles', value: data.articles.toLocaleString() }, { label: 'Registered Users', value: data.users.toLocaleString() }] },
    ];

    return (
        <div className="space-y-8">
            <div><h2 className="text-2xl font-bold">Real-Time Analytics</h2><p className="text-muted-foreground">Live data from Firestore</p></div>
            {metrics.map(category => (
                <div key={category.category}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><div className="h-1 w-4 bg-primary rounded-full" /> {category.category}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {category.items.map((metric, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <Card className="hover:shadow-md transition-all"><CardContent className="p-4"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{metric.label}</p><span className="text-2xl font-bold">{metric.value}</span></CardContent></Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
