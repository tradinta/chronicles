'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AlertCircle, Clock, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { LiveUpdate } from '@/firebase/firestore/live';

interface LiveEntryProps {
    update: LiveUpdate;
}

export default function LiveEntry({ update }: LiveEntryProps) {
    const isBreaking = update.type === 'breaking';
    const isImage = update.type === 'image';

    // Format timestamp (handle Firestore Timestamp or primitive)
    const timeString = update.timestamp?.toDate
        ? update.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Just now';

    return (
        <div className="relative pl-8 md:pl-12 py-6 border-l border-border hover:bg-muted/10 transition-colors group">
            {/* Timeline Dot */}
            <div className={cn(
                "absolute left-[-5px] top-6 w-2.5 h-2.5 rounded-full border-2 border-background",
                isBreaking ? "bg-red-600 animate-pulse" : "bg-primary"
            )}></div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                    {timeString}
                </span>
                {isBreaking && (
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1 animate-pulse">
                        <AlertCircle className="w-3 h-3" /> Breaking
                    </span>
                )}
            </div>

            {/* Content */}
            <div className={cn(
                "prose dark:prose-invert max-w-none text-foreground/90 font-serif leading-relaxed",
                isBreaking ? "text-lg font-bold" : "text-base"
            )}>
                <p className="whitespace-pre-wrap">{update.content}</p>
            </div>

            {/* Image Attachment */}
            {(isImage || (update as any).imageUrl) && (update as any).imageUrl && (
                <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-lg shadow-sm">
                    <Image
                        src={(update as any).imageUrl}
                        alt="Live Update"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}

            {/* Footer/Meta */}
            <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-50">
                    {(update as any).authorName || 'Editor'}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    {/* Future interaction buttons could go here */}
                </div>
            </div>
        </div>
    );
}
