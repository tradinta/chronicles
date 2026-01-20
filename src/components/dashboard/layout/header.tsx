'use client';

import React from 'react';
import { Search, Bell, Sun, User as UserIcon } from 'lucide-react';
import { useUser } from '@/firebase';

export function Header({ collapsed }: { collapsed: boolean }) {
    const { user } = useUser();

    return (
        <header className="h-20 flex items-center justify-between px-8 bg-[#0f0f12] border-b border-white/5 sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#18181b] border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <span className="text-[10px] font-mono text-gray-600 border border-white/5 px-1.5 py-0.5 rounded">Ctrl + K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Status Badge */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#18181b] rounded-full border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-400 font-medium">System Operational</span>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0f0f12]"></span>
                    </button>

                    <button className="flex items-center gap-3 pl-2 pr-1 rounded-full hover:bg-white/5 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[1px]">
                            <div className="w-full h-full rounded-full bg-[#0f0f12] flex items-center justify-center overflow-hidden">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={14} className="text-gray-400" />
                                )}
                            </div>
                        </div>
                        <div className="hidden md:block text-left mr-2">
                            <p className="text-xs font-bold text-white leading-none">{user?.displayName?.split(' ')[0] || 'User'}</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">Admin</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
