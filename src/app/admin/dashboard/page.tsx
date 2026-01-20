'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Bot, Users, FolderKanban, ShieldCheck, UserCog, Settings,
    Component, LogOut, Search, Bell, ChevronDown, ChevronRight, Plus,
    CheckCircle2, TrendingUp, Clock, MoreHorizontal, Sun, Calendar as CalendarIcon,
    CreditCard, Layout, FileText, ArrowUpRight, GripVertical
} from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { ModerationQueue } from '@/components/dashboard/admin/moderation-queue';
import { UserManagement } from '@/components/dashboard/admin/user-management';

/** * SHADCN-UI INSPIRED PRIMITIVES 
 * (Inlined for single-file portability as requested, though ideally should reuse @/components/ui)
 */

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("rounded-xl border border-slate-800 bg-slate-900/50 text-slate-100 shadow-sm backdrop-blur-sm", className)}>
        {children}
    </div>
);

const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <h3 className={cn("font-semibold leading-none tracking-tight", className)}>{children}</h3>
);

const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("p-6 pt-0", className)}>{children}</div>
);

const Button = ({ className, variant = "default", size = "default", children, ...props }: any) => {
    const variants: any = {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20",
        ghost: "hover:bg-slate-800 text-slate-300 hover:text-white",
        outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300",
        secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
        icon: "h-9 w-9 p-0 flex items-center justify-center",
    };
    const sizes: any = {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        icon: "h-9 w-9",
    };
    return (
        <button
            className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};

const Input = ({ className, ...props }: any) => (
    <input
        className={cn("flex h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-slate-100", className)}
        {...props}
    />
);

const Badge = ({ className, variant = "default", children }: any) => {
    const variants: any = {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        secondary: "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-700",
        destructive: "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
        outline: "text-slate-100 border-slate-700",
    };
    return (
        <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)}>
            {children}
        </div>
    );
};

const Avatar = ({ src, fallback, className }: any) => (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-700", className)}>
        {src ? (
            <img className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" />
        ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-300">{fallback}</div>
        )}
    </div>
);

const Tabs = ({ children, activeTab, setActiveTab, className }: any) => (
    <div className={cn("w-full", className)}>{children}</div>
);

const TabsList = ({ children, className }: any) => (
    <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-slate-800 p-1 text-slate-400", className)}>
        {children}
    </div>
);

const TabsTrigger = ({ value, activeTab, onClick, children }: any) => (
    <button
        onClick={() => onClick(value)}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            activeTab === value ? "bg-slate-950 text-white shadow" : "hover:bg-slate-700/50 hover:text-slate-100"
        )}
    >
        {children}
    </button>
);

/**
 * CUSTOM CALENDAR WIDGET
 */
const CalendarWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();

    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentDate)),
        end: endOfWeek(endOfMonth(currentDate))
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="p-2">
            <div className="flex items-center justify-between mb-4 px-2">
                <h4 className="font-semibold text-sm">{format(currentDate, 'MMMM yyyy')}</h4>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-6 w-6"><ChevronDown className="h-4 w-4 rotate-90" /></Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-6 w-6"><ChevronDown className="h-4 w-4 -rotate-90" /></Button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-slate-500">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {days.map((day, idx) => {
                    const isToday = isSameDay(day, today);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    return (
                        <div
                            key={idx}
                            className={cn(
                                "h-8 w-8 flex items-center justify-center rounded-full cursor-pointer transition-all",
                                !isCurrentMonth && "text-slate-600",
                                isToday ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "hover:bg-slate-800 text-slate-300"
                            )}
                        >
                            {format(day, 'd')}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * DASHBOARD APP
 */
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [activeTaskTab, setActiveTaskTab] = useState("active");
    const [time, setTime] = useState(new Date());
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    // State for Real Analytics
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Real-time clock
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Analytics
    useEffect(() => {
        const fetchStats = async () => {
            if (!firestore) return;
            try {
                // Dynamically import to avoid circular dependencies if any
                const { getSystemAnalytics } = await import('@/firebase/firestore/analytics');
                const data = await getSystemAnalytics(firestore);
                setAnalytics(data);
            } catch (error) {
                console.error("Failed to load analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [firestore]);

    // Loading State
    if (loading || !analytics) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
                    <p className="text-slate-500 text-sm font-medium">Initializing Admin Console...</p>
                </div>
            </div>
        );
    }

    const { overview, topArticles, categoryDistribution } = analytics;

    // Map overview data to cards
    // Note: We use the first 4 metrics for the top row
    const stats = [
        { title: overview[0].title, value: overview[0].value, trend: overview[0].trend, trendUp: overview[0].trendUp, icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
        { title: overview[1].title, value: overview[1].value, trend: overview[1].trend, trendUp: overview[1].trendUp, icon: FileText, color: "text-green-400", bg: "bg-green-400/10" },
        { title: overview[2].title, value: overview[2].value, trend: overview[2].trend, trendUp: true, icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10" },
        { title: overview[3].title, value: overview[3].value, trend: overview[3].trend, trendUp: true, icon: Clock, color: "text-orange-400", bg: "bg-orange-400/10" },
    ];

    // Chart Data adapter (Category Distribution)
    const chartData = categoryDistribution.map((c: any, i: number) => ({
        name: c.name,
        value: c.value,
        fill: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][i % 5]
    }));

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">

            {/* SIDEBAR */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-[#020617]/95 backdrop-blur">
                <div className="flex h-16 items-center px-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <span className="font-bold text-white">C</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Chronicles</span>
                    </div>
                </div>

                <div className="px-3 py-6 space-y-6 overflow-y-auto h-[calc(100vh-64px)] custom-scrollbar">
                    <div>
                        <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Main</h3>
                        <nav className="space-y-1">
                            {[
                                { name: 'Overview', id: 'overview', icon: LayoutDashboard },
                                { name: 'AI Assistant', id: 'ai', icon: Bot },
                                { name: 'Users', id: 'users', icon: Users },
                                { name: 'Content', id: 'content', icon: FolderKanban },
                            ].map((item: any) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
                                        activeTab === item.id
                                            ? "bg-slate-800 text-white shadow-inner shadow-white/5"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </div>
                                    {activeTab === item.id && <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Admin</h3>
                        <nav className="space-y-1">
                            {[
                                { name: 'Moderation', id: 'moderation', icon: ShieldCheck },
                                { name: 'Roles & Perms', id: 'roles', icon: UserCog },
                                { name: 'Settings', id: 'settings', icon: Settings },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
                                        activeTab === item.id
                                            ? "bg-slate-800 text-white"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-800/50">
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="pl-64">

                {/* TOP NAVIGATION */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-[#020617]/80 px-8 backdrop-blur-md">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search projects, users, or tasks..."
                                className="pl-10 bg-slate-900/50 border-slate-800 focus-visible:ring-blue-500/50"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <span className="bg-slate-800 border border-slate-700 rounded px-1.5 text-[10px] text-slate-400">⌘K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                        </Button>

                        <div className="h-6 w-px bg-slate-800" />

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-white">{user?.displayName || 'Admin'}</p>
                                <p className="text-xs text-slate-500">Super Admin</p>
                            </div>
                            <Avatar src={user?.photoURL} fallback={user?.displayName?.[0]} className="h-9 w-9 border-2 border-slate-800 bg-gradient-to-br from-blue-500 to-purple-500 text-white" />
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                        </div>
                    </div>
                </header>

                {/* DASHBOARD CONTENT */}
                <div className="p-8 space-y-8 max-w-[1600px] mx-auto">


                    {/* Header Section */}
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white mb-1 capitalize">{activeTab}</h1>
                            <p className="text-slate-400 flex items-center gap-2">
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                                <span className="text-slate-600">/</span>
                                {activeTab}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="gap-2">
                                <CalendarIcon className="h-4 w-4" /> {format(new Date(), 'MMM dd, yyyy')}
                            </Button>
                        </div>
                    </div>

                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-12 gap-6">
                            {/* LEFT COLUMN (MAIN) */}
                            <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">

                                {/* WELCOME CARD */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 shadow-2xl shadow-blue-900/20"
                                >
                                    {/* Decorative Background Elements */}
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
                                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                                    Rise and shine, {user?.displayName?.split(' ')[0] || 'Admin'} <span className="text-2xl animate-bounce">🚀</span>
                                                </h2>
                                                <p className="text-blue-200/80 max-w-md">
                                                    System performance is optimal.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                                            <div className="text-right">
                                                <h3 className="text-4xl font-bold text-white tabular-nums tracking-tight">
                                                    {format(time, 'h:mm')}
                                                    <span className="text-xl text-blue-300 ml-1">{format(time, 'a')}</span>
                                                </h3>
                                                <p className="text-blue-200 text-sm font-medium mt-1">{format(time, 'EEEE, MMMM d')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* STATS GRID */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {stats.map((stat: any, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Card className="hover:border-slate-700 transition-colors cursor-pointer group">
                                                <CardContent className="p-5">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", stat.bg)}>
                                                            <stat.icon className={cn("h-5 w-5", stat.color)} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                                        <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* LOWER SECTION */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="h-full">
                                        <CardHeader className="pb-2 border-b border-slate-800/50">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-blue-500" />
                                                Calendar
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <CalendarWidget />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* RIGHT COLUMN (INSIGHTS) */}
                            <div className="col-span-12 lg:col-span-4 xl:col-span-3">
                                <Card className="h-full flex flex-col bg-slate-900/80 border-slate-800">
                                    <CardHeader>
                                        <CardTitle>Content</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col relative">
                                        <div className="relative h-64 w-full flex items-center justify-center my-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadialBarChart
                                                    innerRadius="65%"
                                                    outerRadius="100%"
                                                    barSize={16}
                                                    data={chartData}
                                                    startAngle={90}
                                                    endAngle={-270}
                                                >
                                                    <PolarAngleAxis type="number" domain={[0, 'auto']} angleAxisId={0} tick={false} />
                                                    <RadialBar background={{ fill: '#1e293b' }} cornerRadius={10} dataKey="value" />
                                                </RadialBarChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-4xl font-bold text-white">{categoryDistribution.length}</span>
                                                <span className="text-xs text-slate-500 uppercase tracking-wide">Categories</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {chartData.map((item: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                                        <span className="text-sm font-medium text-slate-200">{item.name}</span>
                                                    </div>
                                                    <span className="font-bold text-sm" style={{ color: item.fill }}>{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'moderation' && <ModerationQueue />}
                    {(activeTab === 'users' || activeTab === 'roles') && <UserManagement />}
                </div>
            </main>
        </div>
    );
}
