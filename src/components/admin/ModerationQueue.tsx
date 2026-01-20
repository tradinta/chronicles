'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Flag, Check, X, Loader2, MessageSquare, FileText, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

interface FlaggedItem {
    id: string;
    type: 'comment' | 'article';
    contentId: string;
    contentPreview: string;
    reason: string;
    reportedBy: string;
    reportedAt: any;
    status: 'pending' | 'reviewed' | 'dismissed';
}

export default function ModerationQueue() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [items, setItems] = useState<FlaggedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;
        loadItems();
    }, [firestore]);

    const loadItems = async () => {
        if (!firestore) return;
        setLoading(true);
        try {
            const q = query(collection(firestore, 'reports'), where('status', '==', 'pending'), orderBy('reportedAt', 'desc'));
            const snap = await getDocs(q);
            setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FlaggedItem)));
        } catch (error) {
            console.error('Failed to load reports:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (itemId: string) => {
        if (!firestore) return;
        try {
            await updateDoc(doc(firestore, 'reports', itemId), { status: 'reviewed', reviewedAt: new Date() });
            setItems(prev => prev.filter(i => i.id !== itemId));
            toast({ title: 'Content approved' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed' });
        }
    };

    const handleRemove = async (item: FlaggedItem) => {
        if (!firestore || !confirm('Remove this content?')) return;
        try {
            // Remove the actual content
            const collectionName = item.type === 'comment' ? 'comments' : 'articles';
            await deleteDoc(doc(firestore, collectionName, item.contentId));
            // Mark report as reviewed
            await updateDoc(doc(firestore, 'reports', item.id), { status: 'reviewed', action: 'removed' });
            setItems(prev => prev.filter(i => i.id !== item.id));
            toast({ title: 'Content removed' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to remove' });
        }
    };

    const handleDismiss = async (itemId: string) => {
        if (!firestore) return;
        try {
            await updateDoc(doc(firestore, 'reports', itemId), { status: 'dismissed' });
            setItems(prev => prev.filter(i => i.id !== itemId));
            toast({ title: 'Report dismissed' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed' });
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    Moderation Queue
                </h2>
                <p className="text-muted-foreground">Review flagged content</p>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No flagged content. All clear!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 border border-border rounded-lg bg-card"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {item.type === 'comment' ? <MessageSquare className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-green-500" />}
                                    <span className="text-xs font-bold uppercase text-muted-foreground">{item.type}</span>
                                    <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-600 rounded flex items-center gap-1">
                                        <Flag className="w-3 h-3" /> {item.reason}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {item.reportedAt?.toDate ? format(item.reportedAt.toDate(), 'MMM d, HH:mm') : 'N/A'}
                                </span>
                            </div>
                            <p className="text-sm mb-4 line-clamp-3 bg-secondary/50 p-3 rounded">{item.contentPreview}</p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleApprove(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-600 rounded text-xs font-bold hover:bg-green-500/20">
                                    <Check className="w-3 h-3" /> Approve
                                </button>
                                <button onClick={() => handleRemove(item)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-600 rounded text-xs font-bold hover:bg-red-500/20">
                                    <X className="w-3 h-3" /> Remove
                                </button>
                                <button onClick={() => handleDismiss(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-secondary text-muted-foreground rounded text-xs font-bold hover:bg-secondary/80">
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
