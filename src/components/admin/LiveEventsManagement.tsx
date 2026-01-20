'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, MoreVertical, Trash2, ExternalLink, Play, Square, Loader2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

interface LiveEvent {
    id: string;
    title: string;
    slug: string;
    status: 'active' | 'ended';
    startedAt?: any;
    endedAt?: any;
    updateCount?: number;
}

export default function LiveEventsManagement() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [events, setEvents] = useState<LiveEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;
        loadEvents();
    }, [firestore]);

    const loadEvents = async () => {
        if (!firestore) return;
        setLoading(true);
        try {
            const q = query(collection(firestore, 'liveEvents'), orderBy('startedAt', 'desc'));
            const snap = await getDocs(q);
            setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as LiveEvent)));
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEndEvent = async (eventId: string) => {
        if (!firestore) return;
        try {
            await updateDoc(doc(firestore, 'liveEvents', eventId), { status: 'ended', endedAt: new Date() });
            setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'ended' } : e));
            toast({ title: 'Event ended' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to end event' });
        }
    };

    const handleDelete = async (eventId: string) => {
        if (!firestore || !confirm('Delete this event?')) return;
        try {
            await deleteDoc(doc(firestore, 'liveEvents', eventId));
            setEvents(prev => prev.filter(e => e.id !== eventId));
            toast({ title: 'Event deleted' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to delete' });
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Radio className="w-6 h-6 text-red-500" />
                        Live Events
                    </h2>
                    <p className="text-muted-foreground">Manage live coverage events</p>
                </div>
                <Link href="/dashboard/live" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                    + New Event
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                            "p-4 border rounded-lg transition-all",
                            event.status === 'active' ? "border-red-500/50 bg-red-500/5" : "border-border bg-card"
                        )}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                {event.status === 'active' && (
                                    <span className="flex h-2 w-2">
                                        <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                )}
                                <span className={cn("text-xs font-bold uppercase px-2 py-0.5 rounded",
                                    event.status === 'active' ? "bg-red-500/10 text-red-600" : "bg-muted text-muted-foreground"
                                )}>
                                    {event.status}
                                </span>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="p-1 rounded hover:bg-secondary"><MoreVertical className="w-4 h-4" /></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild><Link href={`/live/${event.slug}`} target="_blank"><ExternalLink className="w-4 h-4 mr-2" /> View</Link></DropdownMenuItem>
                                    <DropdownMenuItem asChild><Link href={`/dashboard/live/${event.id}`}><Play className="w-4 h-4 mr-2" /> Console</Link></DropdownMenuItem>
                                    {event.status === 'active' && (
                                        <DropdownMenuItem onClick={() => handleEndEvent(event.id)}><Square className="w-4 h-4 mr-2" /> End Event</DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleDelete(event.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <h3 className="font-bold mb-2">{event.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{event.startedAt?.toDate ? format(event.startedAt.toDate(), 'MMM d, HH:mm') : 'N/A'}</span>
                            {event.updateCount && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.updateCount} updates</span>}
                        </div>
                    </motion.div>
                ))}
            </div>
            {events.length === 0 && <div className="py-12 text-center text-muted-foreground">No live events yet</div>}
        </div>
    );
}
