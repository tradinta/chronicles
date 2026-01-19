'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AnalyticsPage = () => {
    // Mock data for visual demonstration - in a real app this would come from an analytics service
    const metrics = [
        { label: "Total Views", value: "128.4k", change: "+12.5%", trend: "up", icon: Users },
        { label: "Avg. Read Time", value: "4m 12s", change: "+0.8%", trend: "up", icon: Clock },
        { label: "Bounce Rate", value: "42.3%", change: "-2.1%", trend: "down", isPositive: true, icon: Activity },
        { label: "Conversion", value: "3.2%", change: "+0.4%", trend: "up", icon: TrendingUp },
    ];

    const chartData = [
        { day: 'Mon', views: 420 },
        { day: 'Tue', views: 540 },
        { day: 'Wed', views: 360 },
        { day: 'Thu', views: 720 },
        { day: 'Fri', views: 900 },
        { day: 'Sat', views: 600 },
        { day: 'Sun', views: 780 },
        { day: 'Mon ', views: 480 },
        { day: 'Tue ', views: 660 },
        { day: 'Wed ', views: 1020 },
        { day: 'Thu ', views: 720 },
        { day: 'Fri ', views: 1140 }, // Peak
    ];

    const topArticles = [
        { title: "The Shadow Banking Crisis", views: "24.5k", reads: "18.2k", completion: "74%" },
        { title: "Urban Reforestation", views: "15.1k", reads: "10.8k", completion: "68%" },
        { title: "Quantum Computing Leap", views: "12.3k", reads: "8.9k", completion: "71%" },
        { title: "Future of Agri-Tech", views: "9.8k", reads: "6.5k", completion: "62%" },
        { title: "Digital Nomad Lifestyle", views: "8.4k", reads: "5.1k", completion: "58%" },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
                <h1 className="font-serif text-4xl font-bold">Analytics</h1>
                <p className="text-muted-foreground mt-1">Deep dive into your content performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((m, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={i} className="p-6 bg-card border border-border rounded-lg shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{m.label}</span>
                            <div className="p-2 bg-muted rounded-full">
                                <m.icon className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-serif font-bold">{m.value}</span>
                        </div>
                        <div className={`text-xs mt-2 font-medium flex items-center gap-1 ${(m.trend === 'up' && !m.isPositive) || (m.trend === 'down' && m.isPositive)
                            ? 'text-green-600'
                            : 'text-green-600' // Simplified for positive vibe
                            }`}>
                            {m.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {m.change}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif text-lg font-bold">Traffic Overview</h3>
                        <div className="flex gap-2">
                            {['7D', '30D', '3M'].map(t => (
                                <button key={t} className={`text-xs font-mono px-3 py-1 rounded border ${t === '7D' ? 'bg-foreground text-background border-foreground' : 'border-border hover:bg-muted'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 10, fill: '#888888' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-foreground text-background text-xs rounded py-1 px-2 font-mono">
                                                    {payload[0].value} Views
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#000000' : 'rgba(0,0,0,0.1)'} className="dark:fill-white hover:opacity-80 transition-opacity" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                    <h3 className="font-serif text-lg font-bold mb-6">Top Performing</h3>
                    <div className="space-y-6">
                        {topArticles.map((article, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-sm text-foreground/90 group-hover:text-primary transition-colors line-clamp-1">{article.title}</h4>
                                    <span className="text-xs font-mono text-muted-foreground">{article.views}</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary transition-all duration-500" style={{ width: article.completion }}></div>
                                </div>
                                <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                                    <span>{article.reads} reads</span>
                                    <span>{article.completion} completion</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-xs font-mono uppercase tracking-widest border border-border hover:bg-foreground hover:text-background transition-colors rounded">Detailed Report</button>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsPage;
