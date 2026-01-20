'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Loader2, Camera, Quote, Video, Mic, Eye, Lock, Play, Pause } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function OffTheRecordClient() {
    const firestore = useFirestore();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firestore) return;

        const q = query(
            collection(firestore, 'offTheRecord'),
            orderBy('timestamp', 'desc'),
            limit(20)
        );

        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });

        return () => unsub();
    }, [firestore]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-4">
            <div className="max-w-2xl mx-auto">
                <header className="mb-12 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground border border-border px-3 py-1 rounded-full bg-background">
                        Confidential Feed
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-black mt-6 italic" style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}>
                        Off The Record.
                    </h1>
                    <p className="text-muted-foreground mt-4 font-serif">
                        Unfiltered thoughts, behind-the-scenes moments, and leaked tapes.
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin opacity-50" />
                    </div>
                ) : (
                    <div className="space-y-12">
                        {posts.map((post, index) => (
                            <FeedItem key={post.id} post={post} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function FeedItem({ post, index }: { post: any, index: number }) {
    const [isRevealed, setIsRevealed] = useState(!post.isSensitive);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-background border border-border rounded-none md:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group ${post.isSensitive ? 'border-red-900/20' : ''}`}
        >
            {post.isSensitive && !isRevealed && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Classified Material</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-red-200 hover:bg-red-100 text-red-700" onClick={() => setIsRevealed(true)}>
                        <Eye className="w-3 h-3 mr-2" /> View Evidence
                    </Button>
                </div>
            )}

            <div className={post.isSensitive && !isRevealed ? 'filter blur-xl opacity-50 pointer-events-none select-none transition-all duration-700' : 'transition-all duration-700'}>
                {post.mediaUrl && (
                    <div className="w-full bg-black relative">
                        {post.mediaType === 'video' ? (
                            <video src={post.mediaUrl} controls className="w-full max-h-[600px] object-contain mx-auto" />
                        ) : post.mediaType === 'audio' ? (
                            <AudioPlayer src={post.mediaUrl} />
                        ) : (
                            <div className="relative aspect-[4/3] w-full">
                                <Image src={post.mediaUrl} alt="Off the record media" fill className="object-cover" />
                            </div>
                        )}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white p-2 rounded-full z-10">
                            {post.mediaType === 'video' ? <Video size={16} /> : post.mediaType === 'audio' ? <Mic size={16} /> : <Camera size={16} />}
                        </div>
                    </div>
                )}

                <div className="p-6 md:p-8">
                    {!post.mediaUrl && (
                        <div className="mb-4 text-primary opacity-50">
                            <Quote size={32} />
                        </div>
                    )}

                    {post.content && (
                        <div className={`font-serif leading-relaxed text-foreground/90 whitespace-pre-wrap ${post.mediaType === 'audio' ? 'text-base font-mono' : post.mediaUrl ? 'text-lg' : 'text-2xl font-light'}`}>
                            <RedactedText text={post.content} />
                        </div>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                {post.authorName?.[0]}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                {post.authorName}
                            </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                            {post.timestamp?.toDate ? post.timestamp.toDate().toLocaleDateString() : 'Just now'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function RedactedText({ text }: { text: string }) {
    if (!text) return null;
    const parts = text.split(/\|\|(.*?)\|\|/g);
    return (
        <span>
            {parts.map((part, index) => {
                if (index % 2 === 1) {
                    return <RedactionBlock key={index} text={part} />;
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
}

function RedactionBlock({ text }: { text: string }) {
    const [revealed, setRevealed] = useState(false);
    return (
        <span
            className={`cursor-pointer transition-all duration-300 px-1 rounded mx-0.5 select-none ${revealed ? 'bg-yellow-200 text-black dark:bg-yellow-900/50 dark:text-yellow-100' : 'bg-black text-transparent hover:bg-black/80'}`}
            onClick={() => setRevealed(!revealed)}
            title="Click to declassify"
        >
            {text}
        </span>
    )
}

function AudioPlayer({ src }: { src: string }) {
    const [playing, setPlaying] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const toggle = () => {
        if (!audioRef.current) return;
        if (playing) audioRef.current.pause();
        else audioRef.current.play();
        setPlaying(!playing);
    };

    return (
        <div className="bg-zinc-900 text-white p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <div className="flex items-end justify-center gap-1 h-32 w-full mb-8 opacity-50">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className={`w-2 bg-green-500 transition-all duration-100 ${playing ? 'animate-pulse' : ''}`} style={{ height: playing ? `${Math.random() * 100}%` : '10%', animationDelay: `${i * 0.05}s` }} />
                ))}
            </div>
            <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} className="hidden" />
            <button onClick={toggle} className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center transition-all hover:scale-105 shadow-xl shadow-green-900/20 z-10">
                {playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <div className="mt-4 font-mono text-xs uppercase tracking-widest text-green-500">
                {playing ? 'Wiretap Active' : 'Encrypted Audio'}
            </div>
        </div>
    );
}
