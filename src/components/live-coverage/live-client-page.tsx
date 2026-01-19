'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Share2, Bell, AlertCircle, ArrowDown, Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { getLiveEventBySlug, subscribeToLiveUpdates, LiveEvent, LiveUpdate } from '@/firebase/firestore/live';
import LiveEntry from '@/components/live-coverage/live-entry';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

type Props = {
    slug: string;
}

export default function LiveRoomClientPage({ slug }: Props) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const [event, setEvent] = useState<LiveEvent | null>(null);
    const [updates, setUpdates] = useState<LiveUpdate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewPill, setShowNewPill] = useState(false);

    // Ref to track if user is at top of feed
    const topRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!firestore || !slug) return;

        // 1. Fetch Event Details
        const init = async () => {
            try {
                const data = await getLiveEventBySlug(firestore, slug);
                if (data) {
                    setEvent(data);

                    // 2. Subscribe to Updates (only if event exists)
                    const unsubscribe = subscribeToLiveUpdates(firestore, data.id!, (newUpdates) => {
                        setUpdates(newUpdates);
                    });
                    return unsubscribe;
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const cleanup = init();
        return () => { cleanup.then(unsub => unsub && unsub()) };
    }, [firestore, slug]);

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied", description: "Share the coverage with others." });
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;
    if (!event) return <div className="h-screen flex flex-col items-center justify-center text-center p-4"><h1 className="text-2xl font-bold">Event Not Found</h1><Link href="/live" className="text-primary underline mt-4">Back to Live Coverage</Link></div>;

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {event.status === 'live' && (
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded animate-pulse">
                                <span className="w-1.5 h-1.5 bg-white rounded-full block animate-ping" /> Live
                            </span>
                        )}
                        <h1 className="font-serif font-bold text-lg md:text-xl line-clamp-1">{event.title}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hidden md:flex"><Bell className="w-4 h4 mr-2" /> Follow</Button>
                        <Button variant="outline" size="sm" onClick={copyLink}><Share2 className="w-4 h-4 mr-2" /> Share</Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Feed */}
                <div className="lg:col-span-8">
                    <div ref={topRef} />

                    {/* New Updates Pill (Floating) */}
                    <AnimatePresence>
                        {showNewPill && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="sticky top-20 z-40 flex justify-center mb-4"
                            >
                                <Button className="rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white" onClick={() => {
                                    topRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    setShowNewPill(false);
                                }}>
                                    <ArrowDown className="w-4 h-4 mr-2" /> New Updates
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2 mb-12">
                        <p className="text-xl md:text-2xl font-serif text-muted-foreground italic leading-relaxed">
                            {event.summary}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                            Updated continuously
                        </div>
                    </div>

                    <div className="border-l border-border/50 ml-4 md:ml-0">
                        <AnimatePresence initial={false}>
                            {updates.length === 0 ? (
                                <div className="py-20 text-center text-muted-foreground">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 opacity-50" />
                                    <p>Connecting to live feed...</p>
                                </div>
                            ) : (
                                updates.map((update) => (
                                    <motion.div
                                        key={update.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        layout
                                    >
                                        <LiveEntry update={update} />
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Context Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24">
                        {/* Event Key Stats / Info Card */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-6">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Coverage Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-border pb-2">
                                    <span className="text-sm">Status</span>
                                    <span className="text-sm font-bold capitalize">{event.status}</span>
                                </div>
                                <div className="flex justify-between border-b border-border pb-2">
                                    <span className="text-sm">Started</span>
                                    <span className="text-sm font-bold">
                                        {event.startTime?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* About/Context Area */}
                        <div className="bg-muted/30 rounded-xl p-6">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-2">About this Story</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This live coverage is updated in real-time by our editorial team. Refresh for the latest news, but updates should appear automatically.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
