'use client';

import React, { useState, useEffect } from 'react';
import { CloudSun, Sun, Moon } from 'lucide-react';
import { useUser } from '@/firebase';

export function GreetingWidget() {
    const { user } = useUser();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const hours = time.getHours();
    let greeting = "Good evening";
    if (hours < 12) greeting = "Good morning";
    else if (hours < 18) greeting = "Good afternoon";

    return (
        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-8 relative overflow-hidden col-span-2 lg:col-span-2 min-h-[220px] flex flex-col justify-between group">
            {/* Background Ambient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>

            <div className="relative z-10">
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                    {greeting}, {user?.displayName?.split(' ')[0] || 'Editor'}
                </h1>
                <p className="text-gray-400">Ready to break the next big story? 🚀</p>
            </div>

            <div className="flex items-end justify-between relative z-10 mt-6">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-mono font-bold text-white tracking-tighter">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).replace(" ", "")}
                    </span>
                </div>

                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-yellow-500 mb-1">
                        <Sun size={24} className="animate-pulse-slow" />
                        <span className="text-2xl font-bold text-white">26°C</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Sunny • Nairobi</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-0.5">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </div>
        </div>
    );
}
