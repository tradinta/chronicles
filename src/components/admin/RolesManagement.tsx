'use client';

import React, { useState } from 'react';
import { UserCog, Shield, Edit, Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Role {
    id: string;
    name: string;
    permissions: string[];
    color: string;
}

const AVAILABLE_PERMISSIONS = [
    { id: 'create_article', label: 'Create Articles', desc: 'Publish standard articles' },
    { id: 'create_live', label: 'Create Live Events', desc: 'Start live coverage' },
    { id: 'create_otr', label: 'Off the Record', desc: 'Post to OTR feed' },
    { id: 'create_editorial', label: 'Create Editorials', desc: 'Publish opinion pieces' },
    { id: 'moderate', label: 'Moderate Content', desc: 'Review flagged content' },
    { id: 'manage_users', label: 'Manage Users', desc: 'Edit user roles and status' },
    { id: 'admin_settings', label: 'Site Settings', desc: 'Configure site options' },
];

const DEFAULT_ROLES: Role[] = [
    { id: 'admin', name: 'Admin', permissions: AVAILABLE_PERMISSIONS.map(p => p.id), color: 'red' },
    { id: 'editor', name: 'Editor', permissions: ['create_article', 'create_live', 'create_otr', 'create_editorial', 'moderate'], color: 'blue' },
    { id: 'writer', name: 'Writer', permissions: ['create_article', 'create_otr'], color: 'green' },
    { id: 'subscriber', name: 'Subscriber', permissions: [], color: 'gray' },
];

export default function RolesManagement() {
    const { toast } = useToast();
    const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
    const [editingRole, setEditingRole] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const togglePermission = (roleId: string, permissionId: string) => {
        setRoles(prev => prev.map(role => {
            if (role.id !== roleId) return role;
            const hasPermission = role.permissions.includes(permissionId);
            return {
                ...role,
                permissions: hasPermission
                    ? role.permissions.filter(p => p !== permissionId)
                    : [...role.permissions, permissionId]
            };
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        // In production, save to Firestore 'roles' collection
        await new Promise(r => setTimeout(r, 1000));
        toast({ title: 'Roles updated' });
        setEditingRole(null);
        setSaving(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <UserCog className="w-6 h-6 text-primary" />
                    Roles & Permissions
                </h2>
                <p className="text-muted-foreground">Configure user access levels</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="border border-border rounded-lg overflow-hidden bg-card">
                        <div className={cn(
                            "px-4 py-3 flex items-center justify-between",
                            role.color === 'red' && "bg-red-500/10 border-b border-red-500/20",
                            role.color === 'blue' && "bg-blue-500/10 border-b border-blue-500/20",
                            role.color === 'green' && "bg-green-500/10 border-b border-green-500/20",
                            role.color === 'gray' && "bg-secondary border-b border-border"
                        )}>
                            <div className="flex items-center gap-2">
                                <Shield className={cn("w-4 h-4",
                                    role.color === 'red' && "text-red-500",
                                    role.color === 'blue' && "text-blue-500",
                                    role.color === 'green' && "text-green-500",
                                    role.color === 'gray' && "text-muted-foreground"
                                )} />
                                <span className="font-bold">{role.name}</span>
                            </div>
                            <button
                                onClick={() => setEditingRole(editingRole === role.id ? null : role.id)}
                                className="p-1.5 rounded hover:bg-secondary"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {AVAILABLE_PERMISSIONS.map(perm => {
                                const hasPermission = role.permissions.includes(perm.id);
                                const isEditing = editingRole === role.id;
                                return (
                                    <div
                                        key={perm.id}
                                        onClick={() => isEditing && togglePermission(role.id, perm.id)}
                                        className={cn(
                                            "flex items-center justify-between p-2 rounded transition-all",
                                            isEditing && "cursor-pointer hover:bg-secondary",
                                            hasPermission ? "opacity-100" : "opacity-40"
                                        )}
                                    >
                                        <div>
                                            <p className="text-sm font-medium">{perm.label}</p>
                                            <p className="text-xs text-muted-foreground">{perm.desc}</p>
                                        </div>
                                        <div className={cn(
                                            "w-5 h-5 rounded border flex items-center justify-center",
                                            hasPermission ? "bg-primary border-primary text-primary-foreground" : "border-border"
                                        )}>
                                            {hasPermission && <Check className="w-3 h-3" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {editingRole && (
                <div className="flex justify-end pt-4 border-t border-border">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
}
