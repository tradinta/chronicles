'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Image as ImageIcon,
    Video,
    Type,
    Send,
    X,
    MoreVertical,
    Loader2,
    Trash2,
    Mic,
    EyeOff,
    Eraser,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function OffTheRecordPage() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [posts, setPosts] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | null>(null);
    const [isSensitive, setIsSensitive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Subscribe to posts
    React.useEffect(() => {
        if (!firestore) return;
        const q = query(collection(firestore, 'offTheRecord'), orderBy('timestamp', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [firestore]);

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

        if (start === end) return; // No selection

        const selectedText = content.substring(start, end);
        const newText = content.substring(0, start) + `||${selectedText}||` + content.substring(end);

        setContent(newText);

        // Restore focus and cursor (optional adjustment)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + 2 + selectedText.length + 2, start + 2 + selectedText.length + 2);
        }, 0);
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

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Upload failed');
                mediaUrl = data.url;
                publicId = data.public_id;
            }

            await addDoc(collection(firestore, 'offTheRecord'), {
                content,
                mediaUrl,
                mediaType: mediaUrl ? mediaType : 'text',
                publicId,
                isSensitive,
                authorId: user.uid,
                authorName: user.displayName || 'Anonymous',
                timestamp: serverTimestamp()
            });

            setContent('');
            setMediaFile(null);
            setMediaPreview(null);
            setMediaType(null);
            setIsSensitive(false);
            toast({ title: "Posted off the record" });
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Failed to post", description: "Could not upload media." });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        if (confirm('Delete this post?')) {
            await deleteDoc(doc(firestore, 'offTheRecord', id));
        }
    }

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="mb-8 text-center md:text-left">
                <h1 className="font-serif text-3xl font-bold italic">Off the Record</h1>
                <p className="text-muted-foreground">Share raw moments, photos, and behind-the-scenes thoughts.</p>
            </div>

            {/* Composer */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-4 mb-8 relative group active-composer">

                {/* Formatting Toolbar */}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={insertRedaction}>
                        <Eraser className="w-3 h-3 mr-1" /> Redact
                    </Button>
                    <div className="h-4 w-[1px] bg-border mx-1"></div>
                    <div className="flex items-center space-x-2">
                        <Switch id="sensitive-mode" checked={isSensitive} onCheckedChange={setIsSensitive} className="scale-75" />
                        <Label htmlFor="sensitive-mode" className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer ${isSensitive ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {isSensitive ? 'Classified' : 'Public'}
                        </Label>
                    </div>
                </div>

                <Textarea
                    ref={textareaRef}
                    placeholder="What's happening behind the scenes?"
                    className="border-none bg-transparent resize-none text-lg mb-4 focus-visible:ring-0 p-0 min-h-[120px] font-serif pt-8"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                {mediaPreview && (
                    <div className="relative rounded-lg overflow-hidden mb-4 bg-muted/30 border border-border max-h-[400px]">
                        <button
                            onClick={() => { setMediaFile(null); setMediaPreview(null); setMediaType(null); }}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        {mediaType === 'video' ? (
                            <video src={mediaPreview} controls className="w-full h-full object-contain" />
                        ) : mediaType === 'audio' ? (
                            <div className="flex items-center justify-center p-8 w-full gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                                    <Mic className="w-6 h-6 text-primary" />
                                </div>
                                <div className="text-sm font-mono text-muted-foreground">Audio Recording Attached</div>
                            </div>
                        ) : (
                            <img src={mediaPreview} alt="Preview" className="w-full h-full object-contain" />
                        )}
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-border mt-2">
                    <div className="flex gap-2">
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*,video/*,audio/*"
                            onChange={handleFileSelect}
                        />
                        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} title="Add Media">
                            <ImageIcon className="w-5 h-5 text-muted-foreground hover:text-primary" />
                        </Button>
                    </div>
                    <Button onClick={handlePost} disabled={isUploading || (!content && !mediaFile)} className={isSensitive ? 'bg-red-600 hover:bg-red-700' : ''}>
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        {isSensitive ? 'Post Classified' : 'Post'}
                    </Button>
                </div>
            </div>

            {/* Feed List (Mini Admin View) */}
            <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Recent Posts</h3>
                <AnimatePresence>
                    {posts.map((post) => (
                        <motion.div
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-lg p-3 flex justify-between items-center text-sm shadow-sm"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${post.isSensitive ? 'bg-red-500' : 'bg-green-500'}`} />
                                <span className="truncate font-serif opacity-80">{post.content || 'Media only'}</span>
                                {post.mediaType && <span className="text-[10px] font-mono border border-border px-1 rounded uppercase">{post.mediaType}</span>}
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0" onClick={() => handleDelete(post.id)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
