'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { MoreHorizontal, Shield, User, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserData {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'writer' | 'subscriber';
    joinDate: any;
    profileImageUrl?: string;
}

export function UserManagement() {
    const firestore = useFirestore();
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        if (!firestore) return;
        const q = query(collection(firestore, 'users'), orderBy('joinDate', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData)));
        });
        return () => unsubscribe();
    }, [firestore]);

    const updateUserRole = async (userId: string, newRole: UserData['role']) => {
        if (!firestore) return;
        await updateDoc(doc(firestore, 'users', userId), { role: newRole });
    };

    return (
        <div className="bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden mt-6">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white font-serif">Staff Management</h3>
                    <p className="text-xs text-gray-400">Manage privileges and roles.</p>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.length === 0 && <p className="text-sm text-gray-500 italic p-4">No users found.</p>}

                {users.map((user) => (
                    <div key={user.id} className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 overflow-hidden">
                                {user.profileImageUrl ? (
                                    <img src={user.profileImageUrl} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={18} /></div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-white">{user.username || 'Anonymous'}</h4>
                                <p className="text-[10px] text-gray-500 font-mono truncate max-w-[120px]">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                user.role === 'admin' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                    user.role === 'editor' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                        "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            )}>
                                {user.role || 'Writer'}
                            </div>
                            {/* Simple dropdown mock for quick role switch */}
                            <button
                                onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'writer' : 'admin')}
                                className="text-gray-600 hover:text-white transition-colors"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
