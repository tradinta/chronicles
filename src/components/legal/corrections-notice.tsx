'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Edit3, Clock, X } from 'lucide-react';
import { format } from 'date-fns';

interface Correction {
    id: string;
    date: Date;
    description: string;
}

interface CorrectionsNoticeProps {
    corrections?: Correction[];
    lastUpdated?: Date;
    publishDate?: Date;
}

export function CorrectionsNotice({ corrections = [], lastUpdated, publishDate }: CorrectionsNoticeProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Only show if there are corrections or if article was updated after publish
    const wasUpdated = lastUpdated && publishDate && lastUpdated > publishDate;
    if (corrections.length === 0 && !wasUpdated) return null;

    return (
        <div className="my-8 border border-border rounded-lg overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {corrections.length > 0 ? (
                        <AlertCircle size={18} className="text-amber-500" />
                    ) : (
                        <Edit3 size={18} className="text-muted-foreground" />
                    )}
                    <span className="font-bold text-sm">
                        {corrections.length > 0
                            ? `${corrections.length} Correction${corrections.length > 1 ? 's' : ''}`
                            : 'Article Updated'}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {lastUpdated && (
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Last updated: {format(lastUpdated, 'MMM d, yyyy')}
                        </span>
                    )}
                </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 border-t border-border space-y-4">
                            {corrections.length > 0 ? (
                                corrections.map((correction) => (
                                    <div key={correction.id} className="flex gap-3">
                                        <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle size={12} className="text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground font-mono uppercase">
                                                {format(correction.date, 'MMM d, yyyy h:mm a')}
                                            </p>
                                            <p className="text-sm">{correction.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    This article has been updated since its original publication.
                                    Updates may include clarifications, additional information, or minor corrections.
                                </p>
                            )}

                            <p className="text-xs text-muted-foreground border-t border-border pt-4">
                                The Chronicle is committed to accuracy. If you spot an error,{' '}
                                <a href="/legal/takedown" className="text-primary hover:underline">
                                    let us know
                                </a>.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
