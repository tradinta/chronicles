'use client';

import React, { useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { User, Mail, Shield, Save } from 'lucide-react';

export default function EditorSettings() {
    const { user } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate save - mostly just profile updates via Firebase Auth or user doc
        // For this demo we just timeout
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-white">Settings</h2>
                <p className="text-zinc-400 mt-1">Manage your account and preferences.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 md:p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <User size={18} className="text-orange-500" /> Profile Information
                    </h3>

                    <form onSubmit={handleSave} className="space-y-6 max-w-xl">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Display Name</label>
                            <input
                                type="text"
                                defaultValue={user.displayName || ''}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/5 rounded-lg text-zinc-400 cursor-not-allowed">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>
                            <p className="text-xs text-zinc-600 mt-2">Email changes require re-verification.</p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Account Status */}
                <div className="bg-[#18181b] border border-white/5 rounded-2xl p-6 md:p-8">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Shield size={18} className="text-green-500" /> Account Status
                    </h3>

                    <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <div>
                                <p className="text-green-400 font-bold text-sm">Active & Verified</p>
                                <p className="text-green-500/60 text-xs">Your account is in good standing.</p>
                            </div>
                        </div>
                        <span className="text-xs font-mono text-green-500/60">ID: {user.uid.substring(0, 8)}...</span>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <button className="text-red-400 text-sm hover:text-red-300 font-medium transition-colors">
                            Deactivate Account...
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
