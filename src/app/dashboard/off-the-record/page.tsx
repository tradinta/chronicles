'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Video,
    Send,
    X,
    Trash2,
    Mic,
    EyeOff,
    Eraser,
    ShieldAlert,
    Terminal,
    Globe,
    Clock,
    User,
    LogOut,
    FileText,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

// Alias Generator Data
const ADJECTIVES = ['Crimson', 'Shadow', 'Midnight', 'Solar', 'Velvet', 'Iron', 'Neon', 'Silent', 'Ghost', 'Phantom'];
const NOUNS = ['Fox', 'Oracle', 'Viper', 'Protocol', 'Echo', 'Blade', 'Raven', 'Cipher', 'Nomad', 'Sentinel'];

export default function OffTheRecordPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [posts, setPosts] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | null>(null);
    const [isSensitive, setIsSensitive] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const [alias, setAlias] = useState('');
    const [burnTimer, setBurnTimer] = useState(false);
    const [geoSpoofing, setGeoSpoofing] = useState(false);
    const [spoofedLocation, setSpoofedLocation] = useState('Routing...');

    useEffect(() => { generateAlias(); }, []);

    useEffect(() => {
        if (!firestore) return;
        const q = query(collection(firestore, 'offTheRecord'), orderBy('timestamp', 'desc'));
        const unsub = onSnapshot(q, (snap) => { setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() }))); });
        return () => unsub();
    }, [firestore]);

    const generateAlias = () => {
        const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        setAlias(`${adj} ${noun}`);
    };

    const toggleGeoSpoof = () => {
        if (!geoSpoofing) {
            setGeoSpoofing(true);
            setSpoofedLocation('Routing...');
            const locations = ['Zurich, CH', 'Reykjavik, IS', 'Panama City, PA', 'Singapore, SG', 'Kyiv, UA'];
            let ticks = 0;
            const interval = setInterval(() => {
                setSpoofedLocation(locations[ticks % locations.length]);
                ticks++;
                if (ticks > 5) { clearInterval(interval); setSpoofedLocation(locations[Math.floor(Math.random() * locations.length)]); }
            }, 300);
        } else { setGeoSpoofing(false); }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            if (file.type.startsWith('video/')) setMediaType('video');
            else if (file.type.startsWith('audio/')) setMediaType('audio');
            else setMediaType('image');
            setMediaPreview(URL.createObjectURL(file));
        }
    };

    const insertRedaction = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        if (start === end) return;
        const selectedText = content.substring(start, end);
        const newText = content.substring(0, start) + `||${selectedText}||` + content.substring(end);
        setContent(newText);
    };

    const handlePost = async () => {
        if (!firestore || !user) return;
        if (!content && !mediaFile) return;
        setIsUploading(true);
        try {
            let mediaUrl = '';
            let publicId = '';
            if (mediaFile) {
                const formData = new FormData();
                formData.append('file', mediaFile);
                formData.append('type', mediaType || 'image');
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Upload failed');
                mediaUrl = data.url;
                publicId = data.public_id;
            }
            await addDoc(collection(firestore, 'offTheRecord'), {
                content, mediaUrl, mediaType: mediaUrl ? mediaType : 'text', publicId, isSensitive,
                burnAt: burnTimer ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
                location: geoSpoofing ? spoofedLocation : 'Undisclosed',
                displayAlias: alias, authorId: user.uid, timestamp: serverTimestamp()
            });
            setContent(''); setMediaFile(null); setMediaPreview(null); setMediaType(null);
            toast({ title: "Transmission Sent", className: "font-mono bg-green-900 border-green-500 text-green-100" });
        } catch (e) { console.error(e); toast({ variant: "destructive", title: "Transmission Failed" }); }
        finally { setIsUploading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        if (confirm('Purge this record?')) { await deleteDoc(doc(firestore, 'offTheRecord', id)); }
    };

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 selection:bg-green-500/30">
            <div className="max-w-4xl mx-auto flex justify-between items-start mb-8 border-b border-green-900/50 pb-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tighter flex items-center gap-2">
                        <Terminal className="w-8 h-8" /> PROJECT BLACKLIGHT
                    </h1>
                    <p className="text-green-700 text-xs md:text-sm mt-1 uppercase tracking-[0.2em]">Secure Leaks Terminal // Authorized Access Only</p>
                </div>
                <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-green-700 hover:text-green-400 hover:bg-green-900/20 uppercase tracking-widest text-xs border border-transparent hover:border-green-800">
                    <LogOut className="w-4 h-4 mr-2" /> Exit Terminal
                </Button>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-black border border-green-800 p-4 rounded-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-1 opacity-50"><User className="w-4 h-4" /></div>
                        <h3 className="text-xs uppercase tracking-widest text-green-700 mb-3">Active Alias</h3>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">{alias}</span>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-green-700 hover:text-green-400" onClick={generateAlias}><RefreshCw className="w-3 h-3" /></Button>
                        </div>
                    </div>
                    <div className="bg-black border border-green-800 p-4 space-y-4">
                        <h3 className="text-xs uppercase tracking-widest text-green-700 border-b border-green-900/50 pb-2">Security Protocols</h3>
                        <div className="flex items-center justify-between p-2 hover:bg-green-900/10 transition-colors cursor-pointer" onClick={toggleGeoSpoof}>
                            <div className="flex items-center gap-2"><Globe className={cn("w-4 h-4", geoSpoofing ? "text-green-400" : "text-green-800")} /><span className={cn("text-xs uppercase", geoSpoofing ? "text-green-400" : "text-green-800")}>Geo-Spoofing</span></div>
                            <div className="text-[10px] font-bold text-green-600">{geoSpoofing ? spoofedLocation : 'OFF'}</div>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-green-900/10 transition-colors cursor-pointer" onClick={() => setBurnTimer(!burnTimer)}>
                            <div className="flex items-center gap-2"><Clock className={cn("w-4 h-4", burnTimer ? "text-red-500" : "text-green-800")} /><span className={cn("text-xs uppercase", burnTimer ? "text-red-500" : "text-green-800")}>Burn Timer (24h)</span></div>
                            <div className={cn("text-[10px] font-bold", burnTimer ? "text-red-500" : "text-green-800")}>{burnTimer ? 'ARMED' : 'OFF'}</div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <div className="border border-green-500/50 bg-green-900/5 relative">
                        <div className="absolute top-0 left-0 bg-green-500 text-black text-[10px] px-1 font-bold">QS-UPLINK</div>
                        <div className="p-4 pt-8">
                            <Textarea ref={textareaRef} placeholder="Enter encrypted payload..." className="w-full bg-transparent border-none text-green-100 placeholder-green-800 font-mono focus-visible:ring-0 min-h-[150px] resize-none text-base" value={content} onChange={(e) => setContent(e.target.value)} />
                            <AnimatePresence>
                                {mediaPreview && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-4 overflow-hidden">
                                        <div className="relative border border-green-800 bg-black/50 p-2">
                                            <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} className="absolute top-1 right-1 text-green-500 hover:text-red-500"><X className="w-4 h-4" /></button>
                                            {mediaType === 'video' ? <video src={mediaPreview} controls className="max-h-60 w-full object-contain" /> : <img src={mediaPreview} className="max-h-60 w-full object-contain opacity-80" />}
                                            <div className="text-[10px] text-green-600 mt-1 uppercase">Media Attached: {mediaFile?.name}</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flex items-center justify-between border-t border-green-800 pt-3 mt-2">
                                <div className="flex items-center gap-2">
                                    <input type="file" ref={fileInputRef} hidden accept="image/*,video/*,audio/*" onChange={handleFileSelect} />
                                    <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-400 hover:bg-green-900/20" onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-400 hover:bg-green-900/20" onClick={insertRedaction}><Eraser className="w-4 h-4" /></Button>
                                </div>
                                <Button onClick={handlePost} className="bg-green-600 text-black hover:bg-green-500 font-bold uppercase tracking-widest text-xs" disabled={isUploading}>
                                    {isUploading ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <Send className="w-3 h-3 mr-2" />} Execute
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xs uppercase tracking-widest text-green-800 mb-4 border-b border-green-900 pb-1">Transmission Log</h4>
                        <div className="space-y-3">
                            {posts.length === 0 && <div className="text-green-900/50 italic text-sm text-center py-8">No transmissions detected on this frequency.</div>}
                            {posts.map(post => (
                                <motion.div key={post.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="border border-green-900/30 p-3 bg-black/40 hover:border-green-700/50 transition-colors group">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-green-600 uppercase font-bold">{post.displayAlias || 'Unknown'}</span>
                                            {post.location && <span className="text-[9px] text-green-800 uppercase">[{post.location}]</span>}
                                            {post.burnAt && <Clock className="w-3 h-3 text-red-900" />}
                                        </div>
                                        <button onClick={() => handleDelete(post.id)} className="opacity-0 group-hover:opacity-100 text-green-900 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                    <div className="text-sm text-green-400/90 break-words leading-relaxed">{post.content}</div>
                                    {post.mediaUrl && <div className="mt-2 text-[10px] uppercase text-green-800 border border-green-900/50 inline-block px-2 py-0.5 rounded-sm">[{post.mediaType} ATTACHED]</div>}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
