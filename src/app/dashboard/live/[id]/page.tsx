'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Image as ImageIcon,
    AlertTriangle,
    Radio,
    RefreshCcw,
    StopCircle,
    Eye,
    CheckCircle,
    Trash2,
    Edit2
} from 'lucide-react';
import { useFirestore, useUser, useDoc } from '@/firebase';
import { getDoc, doc } from 'firebase/firestore';
import {
    getLiveEventBySlug,
    updateLiveEvent,
    pushLiveUpdate,
    subscribeToLiveUpdates,
    LiveEvent,
    LiveUpdate
} from '@/firebase/firestore/live';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PhotoUploader } from '@/components/shared/photo-uploader';

export default function LiveConsolePage() {
    const { id } = useParams() as { id: string };
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();

    const [eventData, setEventData] = useState<LiveEvent | null>(null);
    const [updates, setUpdates] = useState<LiveUpdate[]>([]);
    const [newUpdateContent, setNewUpdateContent] = useState('');
    const [isBreaking, setIsBreaking] = useState(false);
    const [isImageUpdate, setIsImageUpdate] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Subscribe to updates & fetch event details
    useEffect(() => {
        if (!firestore || !id) return;

        // Fetch Event Metadata
        const fetchEvent = async () => {
            const docRef = doc(firestore, 'liveEvents', id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setEventData({ id: snap.id, ...snap.data() } as LiveEvent);
            }
        };
        fetchEvent();

        // Subscribe to feed
        const unsubscribe = subscribeToLiveUpdates(firestore, id, (newUpdates) => {
            setUpdates(newUpdates);
        });

        return () => unsubscribe();
    }, [firestore, id]);

    const handlePostUpdate = async () => {
        if (!firestore || !user || (!newUpdateContent && !imageUrl)) return;
        setIsSending(true);

        try {
            await pushLiveUpdate(firestore, id, {
                content: newUpdateContent,
                type: isBreaking ? 'breaking' : isImageUpdate && imageUrl ? 'image' : 'text',
                authorId: user.uid,
                authorName: user.displayName || 'Editor',
                ...(isImageUpdate && imageUrl ? { imageUrl } : {}) // You might need to update the Type definition if imageUrl isn't there yet
            } as any);

            setNewUpdateContent('');
            setImageUrl('');
            setIsBreaking(false);
            setIsImageUpdate(false);
            toast({ title: "Update Posted", description: "Live feed updated successfully." });
        } catch (error) {
            console.error("Error posting update", error);
            toast({ variant: "destructive", title: "Failed to Post", description: "Something went wrong." });
        } finally {
            setIsSending(false);
        }
    };

    const handleEndCoverage = async () => {
        if (!firestore || !id) return;
        const confirmed = confirm("Are you sure you want to END this live coverage? This cannot be undone.");
        if (confirmed) {
            await updateLiveEvent(firestore, id, { status: 'ended' });
            const docRef = doc(firestore, 'liveEvents', id);
            const snap = await getDoc(docRef); // Refresh local state
            if (snap.exists()) setEventData({ id: snap.id, ...snap.data() } as LiveEvent);
            toast({ title: "Coverage Ended", description: "Event marked as ended." });
        }
    };

    if (!eventData) return <div className="h-screen flex items-center justify-center">Loading Console...</div>;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6">

            {/* Left Column: Publisher */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-start bg-card border border-border p-6 rounded-xl shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant={eventData.status === 'live' ? 'destructive' : 'secondary'} className="uppercase tracking-widest text-[10px]">
                                {eventData.status}
                            </Badge>
                            <span className="text-xs font-mono text-muted-foreground">{id}</span>
                        </div>
                        <h1 className="font-serif text-2xl font-bold">{eventData.title}</h1>
                        <div className="flex items-center gap-4 mt-4">
                            <Button size="sm" variant="outline" onClick={() => window.open(`/live/${eventData.slug}`, '_blank')}>
                                <Eye className="w-4 h-4 mr-2" /> View Public Page
                            </Button>
                            {eventData.status === 'live' && (
                                <Button size="sm" variant="destructive" onClick={handleEndCoverage}>
                                    <StopCircle className="w-4 h-4 mr-2" /> End Coverage
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor Input */}
                <div className="flex-1 bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Radio className="w-4 h-4 text-primary" /> Post Update
                    </h3>

                    <div className="flex-1 flex flex-col gap-4">
                        <Textarea
                            placeholder="Type your update here... Support markdown for bold/italic."
                            className="flex-1 resize-none font-serif text-lg leading-relaxed p-4"
                            value={newUpdateContent}
                            onChange={(e) => setNewUpdateContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    handlePostUpdate();
                                }
                            }}
                        />

                        {isImageUpdate && (
                            <div className="border border-border rounded-lg p-4 bg-muted/30">
                                <PhotoUploader
                                    onUploadComplete={setImageUrl}
                                    initialImage={imageUrl}
                                    className="w-full h-48 rounded-lg"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t border-border pt-4">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center space-x-2">
                                    <Switch id="breaking" checked={isBreaking} onCheckedChange={setIsBreaking} />
                                    <Label htmlFor="breaking" className={`font-bold flex items-center gap-1 ${isBreaking ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        <AlertTriangle className="w-4 h-4" /> Breaking News
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="image-mode" checked={isImageUpdate} onCheckedChange={setIsImageUpdate} />
                                    <Label htmlFor="image-mode" className="flex items-center gap-1">
                                        <ImageIcon className="w-4 h-4" /> Add Image
                                    </Label>
                                </div>
                            </div>
                            <Button onClick={handlePostUpdate} disabled={isSending || (!newUpdateContent && !imageUrl)} className={isBreaking ? 'bg-red-600 hover:bg-red-700' : ''}>
                                <Send className="w-4 h-4 mr-2" /> {isSending ? 'Posting...' : 'Post Update'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Feed Preview */}
            <div className="w-full lg:w-[400px] flex flex-col bg-muted/30 border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-card flex justify-between items-center">
                    <h3 className="font-bold text-sm">Live Feed Preview</h3>
                    <Badge variant="outline" className="font-mono text-[10px]">{updates.length} updates</Badge>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence initial={false}>
                        {updates.map((update) => (
                            <motion.div
                                key={update.id}
                                layout
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-card border-l-4 p-4 rounded shadow-sm text-sm ${update.type === 'breaking' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-primary'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                                        {update.timestamp?.toDate ? new Date(update.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </span>
                                    {update.type === 'breaking' && <span className="text-red-600 font-bold text-[10px] uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Breaking</span>}
                                </div>
                                {update.type === 'image' && (
                                    <div className="mb-2 rounded overflow-hidden aspect-video bg-muted relative">
                                        <img src={(update as any).imageUrl} alt="Update" className="object-cover w-full h-full" />
                                    </div>
                                )}
                                <p className="whitespace-pre-wrap">{update.content}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}
