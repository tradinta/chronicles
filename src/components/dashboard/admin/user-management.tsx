import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { MoreHorizontal, Shield, User, Star, StopCircle, CheckCircle, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateUserStatus, updateUserRole, UserData } from '@/firebase/firestore/users';

export function UserManagement() {
    const firestore = useFirestore();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;
        // We still use onSnapshot for real-time updates in the dashboard
        const q = query(collection(firestore, 'users'), orderBy('joinDate', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [firestore]);

    const handleRoleUpdate = async (userId: string, currentRole: UserData['role']) => {
        if (!firestore) return;
        const nextRole = currentRole === 'admin' ? 'writer' : 'admin'; // Simple toggle for now, can be a dropdown
        await updateUserRole(firestore, userId, nextRole);
    };

    const handleStatusUpdate = async (userId: string, currentStatus: UserData['status']) => {
        if (!firestore) return;
        // Toggle logic: active -> suspended -> banned -> active
        let nextStatus: UserData['status'] = 'active';
        if (currentStatus === 'active') nextStatus = 'suspended';
        else if (currentStatus === 'suspended') nextStatus = 'banned';
        else nextStatus = 'active';

        await updateUserStatus(firestore, userId, nextStatus);
    };

    return (
        <div className="bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden mt-6">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white font-serif">Staff Management</h3>
                    <p className="text-xs text-gray-400">Manage privileges and account status.</p>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                    {users.length} Users
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.length === 0 && !loading && <p className="text-sm text-gray-500 italic p-4">No users found.</p>}

                {users.map((user) => (
                    <div key={user.id} className={cn(
                        "rounded-xl p-4 flex items-center justify-between group transition-all border",
                        user.status === 'banned' ? "bg-red-950/20 border-red-900/30" :
                            user.status === 'suspended' ? "bg-orange-950/20 border-orange-900/30" :
                                "bg-black/20 border-white/5 hover:border-white/10"
                    )}>
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-white/5 overflow-hidden">
                                {user.profileImageUrl ? (
                                    <img src={user.profileImageUrl} alt={user.username} className={cn("w-full h-full object-cover", (user.status === 'banned' || user.status === 'suspended') && "grayscale")} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500"><User size={18} /></div>
                                )}
                                <div className={cn("absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black",
                                    user.status === 'active' ? "bg-green-500" :
                                        user.status === 'suspended' ? "bg-orange-500" : "bg-red-600"
                                )} />
                            </div>
                            <div>
                                <h4 className={cn("font-bold text-sm", (user.status === 'banned' || user.status === 'suspended') ? "text-slate-400 decoration-slate-600 line-through" : "text-white")}>{user.username || 'Anonymous'}</h4>
                                <p className="text-[10px] text-gray-500 font-mono truncate max-w-[120px]">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Role Badge */}
                            <button
                                onClick={() => handleRoleUpdate(user.id, user.role)}
                                className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors hover:bg-white/5",
                                    user.role === 'admin' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                        user.role === 'editor' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                )}>
                                {user.role || 'Writer'}
                            </button>

                            {/* Actions Dropdown Substitute (Cycle Button for now) */}
                            <button
                                onClick={() => handleStatusUpdate(user.id, user.status || 'active')}
                                className={cn("p-1.5 rounded transition-colors group-hover:opacity-100 opacity-0",
                                    user.status === 'active' ? "text-green-500 hover:bg-green-500/10" :
                                        user.status === 'suspended' ? "text-orange-500 hover:bg-orange-500/10" : "text-red-500 hover:bg-red-500/10"
                                )}
                                title={`Current: ${user.status || 'Active'}. Click to cycle status.`}
                            >
                                {user.status === 'active' || !user.status ? <CheckCircle size={16} /> :
                                    user.status === 'suspended' ? <StopCircle size={16} /> : <Ban size={16} />}
                            </button>

                            <button className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

