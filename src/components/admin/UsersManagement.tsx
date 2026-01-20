'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MoreVertical, Shield, Ban, Eye, EyeOff, Trash2, UserCheck, UserX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { getAllUsers, updateUserRole, updateUserStatus, shadowBanUser, UserData } from '@/firebase/firestore/users';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export default function UsersManagement() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        if (!firestore) return;
        loadUsers();
    }, [firestore]);

    const loadUsers = async () => {
        if (!firestore) return;
        setLoading(true);
        try {
            const data = await getAllUsers(firestore);
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: UserData['role']) => {
        if (!firestore) return;
        try {
            await updateUserRole(firestore, userId, newRole);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast({ title: 'Role updated' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to update role' });
        }
    };

    const handleStatusChange = async (userId: string, newStatus: UserData['status']) => {
        if (!firestore) return;
        try {
            await updateUserStatus(firestore, userId, newStatus);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
            toast({ title: `User ${newStatus}` });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to update status' });
        }
    };

    const handleShadowBan = async (userId: string, isBanned: boolean) => {
        if (!firestore) return;
        try {
            await shadowBanUser(firestore, userId, isBanned);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, isShadowBanned: isBanned } : u));
            toast({ title: isBanned ? 'User shadow banned' : 'Shadow ban removed' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to update' });
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = !searchTerm ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        User Management
                    </h2>
                    <p className="text-muted-foreground">Manage all registered users</p>
                </div>
                <div className="text-sm text-muted-foreground">
                    {users.length} total users
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="writer">Writer</option>
                    <option value="subscriber">Subscriber</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-secondary/50">
                        <tr className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Joined</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, i) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                                className="border-t border-border hover:bg-secondary/30 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                            {user.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{user.username || 'Unknown'}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        {user.isShadowBanned && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/10 text-orange-600 rounded font-bold">SHADOW</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserData['role'])}
                                        className={cn(
                                            "text-xs font-bold uppercase px-2 py-1 rounded border-none bg-transparent cursor-pointer",
                                            user.role === 'admin' && "text-red-600",
                                            user.role === 'editor' && "text-blue-600",
                                            user.role === 'writer' && "text-green-600",
                                            user.role === 'subscriber' && "text-muted-foreground"
                                        )}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="editor">Editor</option>
                                        <option value="writer">Writer</option>
                                        <option value="subscriber">Subscriber</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={cn(
                                        "text-xs font-bold uppercase px-2 py-1 rounded",
                                        user.status === 'active' && "bg-green-500/10 text-green-600",
                                        user.status === 'suspended' && "bg-yellow-500/10 text-yellow-600",
                                        user.status === 'banned' && "bg-red-500/10 text-red-600"
                                    )}>
                                        {user.status || 'active'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {user.joinDate?.toDate ? format(user.joinDate.toDate(), 'MMM d, yyyy') : 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="p-1.5 rounded hover:bg-secondary">
                                            <MoreVertical className="w-4 h-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                                                <UserCheck className="w-4 h-4 mr-2" /> Activate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'suspended')}>
                                                <UserX className="w-4 h-4 mr-2" /> Suspend
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleShadowBan(user.id, !user.isShadowBanned)}>
                                                {user.isShadowBanned ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                                                {user.isShadowBanned ? 'Remove Shadow Ban' : 'Shadow Ban'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'banned')} className="text-red-600">
                                                <Ban className="w-4 h-4 mr-2" /> Ban User
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">No users found</div>
                )}
            </div>
        </div>
    );
}
