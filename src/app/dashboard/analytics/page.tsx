'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight, Activity, Eye, FileText, MessageSquare, Heart, Bookmark, Globe, Target, Zap, CreditCard, UserPlus, Radio, Share2, MousePointer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie, AreaChart, Area } from 'recharts';

// Comprehensive Analytics with 20+ metrics
const AnalyticsPage = () => {
    // Traffic Metrics
    const trafficMetrics = [
        { label: "Total Page Views", value: "1.24M", change: "+18.2%", trend: "up", icon: Eye },
        { label: "Unique Visitors", value: "456K", change: "+12.5%", trend: "up", icon: Users },
        { label: "Sessions", value: "789K", change: "+15.3%", trend: "up", icon: Globe },
        { label: "Pages/Session", value: "3.4", change: "+0.5%", trend: "up", icon: FileText },
    ];

    // Engagement Metrics
    const engagementMetrics = [
        { label: "Avg. Read Time", value: "4m 32s", change: "+8.1%", trend: "up", icon: Clock },
        { label: "Bounce Rate", value: "38.2%", change: "-2.4%", trend: "down", isPositive: true, icon: Activity },
        { label: "Scroll Depth", value: "68%", change: "+4.2%", trend: "up", icon: MousePointer },
        { label: "Share Rate", value: "2.8%", change: "+0.6%", trend: "up", icon: Share2 },
    ];

    // Content Metrics
    const contentMetrics = [
        { label: "Article Reads", value: "324K", change: "+22.1%", trend: "up", icon: FileText },
        { label: "Comments", value: "12.4K", change: "+31.5%", trend: "up", icon: MessageSquare },
        { label: "Reactions", value: "89.2K", change: "+45.2%", trend: "up", icon: Heart },
        { label: "Bookmarks", value: "15.6K", change: "+19.8%", trend: "up", icon: Bookmark },
    ];

    // Growth Metrics
    const growthMetrics = [
        { label: "New Users (30d)", value: "2,847", change: "+14.2%", trend: "up", icon: UserPlus },
        { label: "DAU", value: "4,521", change: "+5.3%", trend: "up", icon: Users },
        { label: "MAU", value: "18,934", change: "+9.1%", trend: "up", icon: Users },
        { label: "Retention Rate", value: "42%", change: "+3.2%", trend: "up", icon: Target },
    ];

    // Revenue Metrics
    const revenueMetrics = [
        { label: "MRR", value: "KES 1.8M", change: "+15.2%", trend: "up", icon: CreditCard },
        { label: "Subscriptions", value: "1,247", change: "+28.4%", trend: "up", icon: Zap },
        { label: "ARPU", value: "KES 1,172", change: "+6.2%", trend: "up", icon: TrendingUp },
        { label: "Conversion", value: "3.2%", change: "+0.4%", trend: "up", icon: Target },
    ];

    const chartData = [
        { day: 'Jan 1', views: 4200 },
        { day: 'Jan 2', views: 5400 },
        { day: 'Jan 3', views: 3600 },
        { day: 'Jan 4', views: 7200 },
        { day: 'Jan 5', views: 9000 },
        { day: 'Jan 6', views: 6000 },
        { day: 'Jan 7', views: 7800 },
        { day: 'Jan 8', views: 4800 },
        { day: 'Jan 9', views: 6600 },
        { day: 'Jan 10', views: 10200 },
        { day: 'Jan 11', views: 7200 },
        { day: 'Jan 12', views: 11400 },
        { day: 'Jan 13', views: 9800 },
        { day: 'Jan 14', views: 12100 },
    ];

    const sourceData = [
        { name: 'Organic Search', value: 42, fill: 'hsl(var(--primary))' },
        { name: 'Social Media', value: 28, fill: 'hsl(var(--chart-1, 220 70% 50%))' },
        { name: 'Direct', value: 18, fill: 'hsl(var(--chart-2, 160 60% 45%))' },
        { name: 'Referral', value: 8, fill: 'hsl(var(--chart-3, 30 80% 55%))' },
        { name: 'Email', value: 4, fill: 'hsl(var(--chart-4, 280 65% 60%))' },
    ];

    const topArticles = [
        { title: "The Shadow Banking Crisis Explained", views: "24.5k", reads: "18.2k", completion: "74%" },
        { title: "Urban Reforestation: A Global Movement", views: "15.1k", reads: "10.8k", completion: "68%" },
        { title: "Quantum Computing's Commercial Leap", views: "12.3k", reads: "8.9k", completion: "71%" },
        { title: "Future of Agri-Tech in Africa", views: "9.8k", reads: "6.5k", completion: "62%" },
        { title: "Digital Nomad Lifestyle 2026", views: "8.4k", reads: "5.1k", completion: "58%" },
    ];

    const MetricCard = ({ metric, delay = 0 }: { metric: any; delay?: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-5 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all"
        >
            <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{metric.label}</span>
                <div className="p-2 bg-primary/10 rounded-full">
                    <metric.icon className="w-4 h-4 text-primary" />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{metric.value}</span>
            </div>
            <div className={`text-xs mt-2 font-bold flex items-center gap-1 ${(metric.trend === 'down' && metric.isPositive) || metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {metric.change}
            </div>
        </motion.div>
    );

    const MetricSection = ({ title, metrics, startDelay = 0 }: { title: string; metrics: any[]; startDelay?: number }) => (
        <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
                <div className="h-1 w-4 bg-primary rounded-full" />
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <MetricCard key={i} metric={m} delay={startDelay + i * 0.05} />
                ))}
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-4xl font-bold">Analytics Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Comprehensive platform performance metrics</p>
                </div>
                <div className="flex gap-2">
                    {['24H', '7D', '30D', '90D'].map(t => (
                        <button
                            key={t}
                            className={`text-xs font-mono px-4 py-2 rounded-lg border transition-all ${t === '30D'
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'border-border hover:bg-secondary'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metric Sections */}
            <MetricSection title="Traffic Metrics" metrics={trafficMetrics} startDelay={0} />
            <MetricSection title="Engagement Metrics" metrics={engagementMetrics} startDelay={0.2} />
            <MetricSection title="Content Performance" metrics={contentMetrics} startDelay={0.4} />
            <MetricSection title="User Growth" metrics={growthMetrics} startDelay={0.6} />
            <MetricSection title="Revenue & Conversion" metrics={revenueMetrics} startDelay={0.8} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Traffic Overview</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary rounded-full" />
                                Page Views
                            </span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    className="text-muted-foreground"
                                />
                                <YAxis
                                    tick={{ fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    className="text-muted-foreground"
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-3">
                                                    <p className="text-xs text-muted-foreground">{payload[0].payload.day}</p>
                                                    <p className="font-bold">{payload[0].value?.toLocaleString()} views</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    fill="url(#colorViews)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-lg mb-6">Traffic Sources</h3>
                    <div className="space-y-4">
                        {sourceData.map((source, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.fill }} />
                                    <span className="text-sm">{source.name}</span>
                                </div>
                                <span className="font-bold">{source.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Articles */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-6">Top Performing Articles</h3>
                <div className="space-y-6">
                    {topArticles.map((article, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{article.title}</h4>
                                </div>
                                <span className="text-sm font-bold">{article.views}</span>
                            </div>
                            <div className="ml-7 w-full h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: article.completion }}
                                />
                            </div>
                            <div className="ml-7 flex justify-between mt-1 text-xs text-muted-foreground">
                                <span>{article.reads} reads</span>
                                <span>{article.completion} completion</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsPage;
