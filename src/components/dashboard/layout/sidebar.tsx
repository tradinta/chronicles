'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Radio,
    BarChart2,
    Users,
    Settings,
    ShieldAlert,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Search,
    PenTool,
    Mic,
    Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';

const menuItems = [
    {
        group: "MAIN",
        items: [
            { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
            { label: "Stories", icon: FileText, href: "/dashboard/stories" },
            { label: "Live Events", icon: Radio, href: "/dashboard/live" },
            { label: "Off the Record", icon: Mic, href: "/dashboard/off-the-record" },
        ]
    },
    {
        group: "ANALYTICS",
        items: [
            { label: "Insights", icon: BarChart2, href: "/dashboard/analytics" },
        ]
    },
    {
        group: "ADMIN",
        items: [
            { label: "Moderation", icon: ShieldAlert, href: "/dashboard/moderation" },
            { label: "Users", icon: Users, href: "/dashboard/users" },
            { label: "Settings", icon: Settings, href: "/dashboard/settings" },
        ]
    }
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (v: boolean) => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    const auth = getAuth();

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 260 }}
            className="h-screen sticky top-0 bg-[#0f0f12] border-r border-white/5 flex flex-col z-50 transition-all duration-300 ease-in-out"
        >
            {/* Brand */}
            <div className="h-20 flex items-center px-6 border-b border-white/5 relative">
                <div className="flex items-center gap-3 overflow-hidden text-nowrap">
                    <div className="min-w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <PenTool size={18} />
                    </div>
                    <motion.span
                        animate={{ opacity: collapsed ? 0 : 1 }}
                        className="font-serif font-bold text-xl tracking-tight text-white whitespace-nowrap"
                    >
                        The Chronicle
                    </motion.span>
                </div>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform cursor-pointer shadow-lg z-50 border-2 border-[#0f0f12]"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
                {menuItems.map((group, idx) => (
                    <div key={idx}>
                        {!collapsed && (
                            <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4 px-2">
                                {group.group}
                            </h4>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => router.push(item.href)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <item.icon size={20} className={cn("min-w-[20px]", isActive ? "text-primary-foreground" : "group-hover:text-primary transition-colors")} />

                                        {!collapsed && (
                                            <span className="text-sm truncate">{item.label}</span>
                                        )}

                                        {collapsed && isActive && (
                                            <div className="absolute left-full ml-4 px-2 py-1 bg-primary text-black text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                                                {item.label}
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <button
                    onClick={() => router.push('/')}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    <Home size={20} />
                    {!collapsed && <span className="text-sm">Public Site</span>}
                </button>

                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors",
                        collapsed && "justify-center"
                    )}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="text-sm">Logout</span>}
                </button>
            </div>
        </motion.aside>
    );
}
