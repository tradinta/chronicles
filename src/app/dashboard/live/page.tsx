'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Radio,
    Plus,
    Calendar,
    MoreHorizontal,
    ExternalLink,
    Loader2,
    Trash2,
    PlayCircle,
    StopCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { getLiveEvents, createLiveEvent, LiveEvent } from '@/firebase/firestore/live';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function LiveDashboardPage() {
    const router = useRouter();
    const firestore = useFirestore();
    const { user } = useUser();
    const [events, setEvents] = useState<LiveEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // New Event Form State
    const [newTitle, setNewTitle] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [newSummary, setNewSummary] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (firestore) {
            fetchEvents();
        }
    }, [firestore]);

    const fetchEvents = async () => {
        if (!firestore) return;
        setIsLoading(true);
        try {
            const data = await getLiveEvents(firestore);
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!firestore || !user) return;
        setIsCreating(true);
        try {
            const docRef = await createLiveEvent(firestore, {
                title: newTitle,
                slug: newSlug || newTitle.toLowerCase().replace(/\s+/g, '-'),
                summary: newSummary,
                status: 'upcoming',
                authorId: user.uid,
                // Default cover image for now
                coverImage: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=2069&auto=format&fit=crop'
            });

            setIsOpen(false);
            setNewTitle('');
            setNewSlug('');
            setNewSummary('');
            fetchEvents();

            // Optional: Redirect immediately to the console
            router.push(`/dashboard/live/${docRef.id}`);
        } catch (error) {
            console.error("Error creating event", error);
        } finally {
            setIsCreating(false);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            live: "bg-red-500 text-white border-red-600 animate-pulse",
            upcoming: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
            ended: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
        };
        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 w-fit ${styles[status as keyof typeof styles]}`}>
                {status === 'live' && <span className="w-1.5 h-1.5 bg-white rounded-full block animate-ping" />}
                {status}
            </span>
        );
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-serif text-4xl font-bold flex items-center gap-3">
                        <Radio className="w-8 h-8 text-red-500" /> Live Coverage
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage real-time news feeds and broadcasts.</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="shadow-lg hover:shadow-xl transition-all">
                            <Plus className="mr-2 w-4 h-4" /> Start New Coverage
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Live Event</DialogTitle>
                            <DialogDescription>
                                Set up a new live coverage stream. You can configure details before going live.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Event Title</Label>
                                <Input
                                    placeholder="e.g., Election Night 2026: Live Updates"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug (URL)</Label>
                                <Input
                                    placeholder="election-night-2026"
                                    value={newSlug}
                                    onChange={(e) => setNewSlug(e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground">Will be accessible at chronicles.news/live/{newSlug || '...'}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Summary / Lede</Label>
                                <Textarea
                                    placeholder="Brief description of what this coverage entails..."
                                    value={newSummary}
                                    onChange={(e) => setNewSummary(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={!newTitle || isCreating}>
                                {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <PlayCircle className="w-4 h-4 mr-2" />}
                                Create & Enter Console
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Events List */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                        <Radio className="w-16 h-16 opacity-20 mb-4" />
                        <h3 className="font-serif text-xl font-bold text-foreground">No Live Events</h3>
                        <p className="max-w-xs mx-auto mt-2">Get started by creating a new coverage stream.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {events.map((event) => (
                            <div key={event.id} className="p-6 flex items-start justify-between hover:bg-muted/30 transition-colors group">
                                <div className="flex gap-4">
                                    {/* Thumbnail / Status Indicator */}
                                    <div className={`w-1.5 self-stretch rounded-full ${event.status === 'live' ? 'bg-red-500' :
                                            event.status === 'upcoming' ? 'bg-blue-500' : 'bg-slate-300'
                                        }`}></div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <StatusBadge status={event.status} />
                                            <span className="text-xs text-muted-foreground font-mono">
                                                Created {event.startTime?.toDate ? new Date(event.startTime.toDate()).toLocaleDateString() : 'Just now'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/live/${event.id}`)}>
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1 max-w-2xl line-clamp-2">
                                            {event.summary}
                                        </p>
                                        <div className="flex items-center gap-4 mt-4 text-xs font-medium text-muted-foreground">
                                            <span className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors" onClick={() => window.open(`/live/${event.slug}`, '_blank')}>
                                                <ExternalLink className="w-3 h-3" /> View Public Page
                                            </span>
                                            {event.status === 'live' && (
                                                <span className="text-red-500 flex items-center gap-1">
                                                    <Radio className="w-3 h-3" /> Broadcasting
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/live/${event.id}`)}>
                                        Enter Console
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
