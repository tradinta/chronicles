'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreHorizontal } from 'lucide-react';

const data = [
    { name: 'Mon', views: 4000, reads: 2400 },
    { name: 'Tue', views: 3000, reads: 1398 },
    { name: 'Wed', views: 2000, reads: 9800 },
    { name: 'Thu', views: 2780, reads: 3908 },
    { name: 'Fri', views: 1890, reads: 4800 },
    { name: 'Sat', views: 2390, reads: 3800 },
    { name: 'Sun', views: 3490, reads: 4300 },
];

export function AnalyticsChart() {
    return (
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 lg:col-span-2 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-white font-serif">Readership Growth</h3>
                    <p className="text-xs text-gray-500">Revenue breakdown by category (Mocked for now)</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-xs text-gray-400 hover:text-white transition-colors">This Quarter</button>
                    <button className="text-gray-600 hover:text-white"><MoreHorizontal size={16} /></button>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 border-t border-white/5 pt-4">
                <div>
                    <h4 className="text-xl font-bold text-white">$193,390</h4>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
                <div>
                    <h4 className="text-xl font-bold text-white flex items-center gap-1">
                        +13.9% <span className="text-[10px] text-gray-500 font-normal">Avg Growth</span>
                    </h4>
                </div>
                <div>
                    <h4 className="text-xl font-bold text-white text-right">6/6</h4>
                    <p className="text-xs text-gray-500 text-right">Positive</p>
                </div>
            </div>
        </div>
    );
}
