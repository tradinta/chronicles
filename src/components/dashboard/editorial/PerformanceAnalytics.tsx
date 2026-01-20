'use client';

import React, { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { getTrafficSources, getDeviceBreakdown, getTopArticles } from '@/firebase/firestore/tracking.ts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowUpRight, Smartphone, Monitor, Globe } from 'lucide-react';

export default function PerformanceAnalytics() {
    const firestore = useFirestore();
    const { user } = useUser();

    // State
    const [trafficData, setTrafficData] = useState<any[]>([]);
    const [deviceData, setDeviceData] = useState<any[]>([]);
    const [topArticles, setTopArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;

        const fetchData = async () => {
            try {
                const [sources, devices, articles] = await Promise.all([
                    getTrafficSources(firestore, 30),
                    getDeviceBreakdown(firestore, 30),
                    getTopArticles(firestore, { days: 30, count: 5 })
                ]);

                // transform for charts
                setTrafficData(sources.slice(0, 5)); // Top 5 sources
                setDeviceData(devices);
                setTopArticles(articles);
            } catch (e) {
                console.error("Analytics fetch error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [firestore]);

    // Chart Colors
    const COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'];
    const DEVICE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

    if (loading) return <div className="p-20 text-center text-zinc-500 animate-pulse">Loading insights...</div>;

    if (topArticles.length === 0 && trafficData.length === 0) {
        return (
            <div className="p-20 text-center text-zinc-500">
                <p className="text-xl font-serif text-zinc-400 mb-2">No Data Yet</p>
                <p className="text-sm">Once people start reading your stories, insights will appear here.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-white">Performance</h2>
                <p className="text-zinc-400 mt-1">Last 30 Days Activity</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Top Articles Chart */}
                <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <ArrowUpRight size={18} className="text-orange-500" /> Top Stories
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topArticles} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="title"
                                    type="category"
                                    width={150}
                                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                    tickFormatter={(val) => val.length > 20 ? val.substring(0, 20) + '...' : val}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="views" fill="#ea580c" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Smartphone size={18} className="text-blue-500" /> Device Usage
                    </h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-zinc-400 text-sm ml-1 capitalize">{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-[#18181b] border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Globe size={18} className="text-green-500" /> Traffic Sources
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <XAxis dataKey="source" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
