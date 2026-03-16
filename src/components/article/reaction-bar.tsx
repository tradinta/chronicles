'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { setReaction, removeReaction, getUserReaction, getArticleReactions, ReactionType } from '@/firebase/firestore/reactions';
import { Heart, Sparkles, Lightbulb, Zap, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const REACTION_CONFIG: { type: ReactionType; emoji: string; label: string; color: string }[] = [
    { type: 'upvote', emoji: '👍', label: 'Upvote', color: 'text-blue-500' },
    { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
    { type: 'laugh', emoji: '🤣', label: 'Laugh', color: 'text-yellow-500' },
    { type: 'shock', emoji: '😲', label: 'Shock', color: 'text-purple-500' },
    { type: 'angry', emoji: '😡', label: 'Angry', color: 'text-orange-600' },
];

interface ReactionBarProps {
    articleId: string;
}

export function ReactionBar({ articleId }: ReactionBarProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
    const [counts, setCounts] = useState<Record<ReactionType, number>>({ upvote: 0, love: 0, laugh: 0, shock: 0, angry: 0 });
    const [isExpanded, setIsExpanded] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!firestore) return;

        const fetchReactions = async () => {
            const reactionCounts = await getArticleReactions(firestore, articleId);
            setCounts(reactionCounts);

            if (user) {
                const existing = await getUserReaction(firestore, articleId, user.uid);
                setUserReaction(existing);
            }
        };

        fetchReactions();
    }, [firestore, articleId, user]);

    const handleReaction = async (type: ReactionType) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Sign in to react' });
            return;
        }
        if (!firestore || isLoading) return;

        setIsLoading(true);
        try {
            if (userReaction === type) {
                // Remove reaction
                await removeReaction(firestore, articleId, user.uid);
                setUserReaction(null);
                setCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
            } else {
                // Set or update reaction
                if (userReaction) {
                    // First decrement old reaction
                    setCounts(prev => ({ ...prev, [userReaction]: Math.max(0, prev[userReaction] - 1) }));
                }
                await setReaction(firestore, articleId, user.uid, type);
                setUserReaction(type);
                setCounts(prev => ({ ...prev, [type]: prev[type] + 1 }));
            }
        } catch (error) {
            console.error('Error setting reaction:', error);
            toast({ variant: 'destructive', title: 'Failed to react' });
        } finally {
            setIsLoading(false);
        }
    };

    const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="relative inline-flex items-center">
            <button
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                disabled={isLoading}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full border transition-all",
                    userReaction
                        ? "border-primary/50 bg-primary/10"
                        : "border-border hover:border-primary/50",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}
            >
                {userReaction ? (
                    <div className="flex items-center gap-1.5">
                        <span className="text-xl">
                            {REACTION_CONFIG.find(r => r.type === userReaction)?.emoji}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {REACTION_CONFIG.find(r => r.type === userReaction)?.label}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Heart size={18} className="text-muted-foreground group-hover:text-red-500 transition-colors" />
                        <span className="text-xs font-bold uppercase tracking-wider">React</span>
                    </div>
                )}
                {totalReactions > 0 && (
                    <div className="ml-1 px-1.5 py-0.5 rounded-full bg-secondary text-[10px] font-black">
                        {totalReactions}
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full right-0 mb-4 p-2 bg-card border border-border rounded-2xl shadow-2xl flex items-center gap-1 z-50 min-w-max"
                        onMouseEnter={() => setIsExpanded(true)}
                        onMouseLeave={() => setIsExpanded(false)}
                    >
                        {REACTION_CONFIG.map(({ type, emoji, label, color }) => (
                            <button
                                key={type}
                                onClick={() => handleReaction(type)}
                                disabled={isLoading}
                                className={cn(
                                    "px-2 py-1.5 rounded-xl transition-all hover:scale-110 flex flex-col items-center min-w-[50px]",
                                    userReaction === type ? "bg-secondary scale-105" : "hover:bg-muted"
                                )}
                                title={label}
                            >
                                <span className="text-xl">{emoji}</span>
                                <span className="text-[9px] font-bold mt-0.5">{counts[type]}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
