'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface TldrSummaryProps {
    articleId: string;
    content: string;
}

export function TldrSummary({ articleId, content }: TldrSummaryProps) {
    const [bullets, setBullets] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [hasGenerated, setHasGenerated] = useState(false);

    const generateSummary = async () => {
        if (hasGenerated) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/ai/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, maxBullets: 3 }),
            });

            const data = await response.json();
            if (data.bullets) {
                setBullets(data.bullets);
                setHasGenerated(true);
            }
        } catch (error) {
            console.error('Failed to generate summary:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-generate on mount
    useState(() => {
        if (content && !hasGenerated) {
            generateSummary();
        }
    });

    if (!hasGenerated && !isLoading) {
        return (
            <button
                onClick={generateSummary}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-bold text-sm hover:bg-primary/20 transition-colors"
            >
                <Sparkles size={16} />
                Generate TL;DR
            </button>
        );
    }

    return (
        <div className="bg-secondary/30 border border-border rounded-xl overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-primary" />
                    <span className="font-bold text-sm">TL;DR</span>
                    <span className="text-xs text-muted-foreground">AI-Generated Summary</span>
                </div>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border"
                    >
                        <div className="p-4">
                            {isLoading ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-sm">Generating summary...</span>
                                </div>
                            ) : (
                                <ul className="space-y-2">
                                    {bullets.map((bullet, index) => (
                                        <li key={index} className="text-sm text-foreground/90">
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
