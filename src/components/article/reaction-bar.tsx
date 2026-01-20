'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { setReaction, removeReaction, getUserReaction, getArticleReactions, ReactionType } from '@/firebase/firestore/reactions';
import { Heart, Sparkles, Lightbulb, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const REACTION_CONFIG: { type: ReactionType; icon: any; label: string; color: string }[] = [
    { type: 'like', icon: Heart, label: 'Like', color: 'text-red-500' },
    { type: 'love', icon: Sparkles, label: 'Love', color: 'text-pink-500' },
    { type: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-yellow-500' },
    { type: 'surprised', icon: Zap, label: 'Surprised', color: 'text-blue-500' },
];

interface ReactionBarProps {
    articleId: string;
}

export function ReactionBar({ articleId }: ReactionBarProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
    const [counts, setCounts] = useState<Record<ReactionType, number>>({ like: 0, love: 0, insightful: 0, surprised: 0 });
    const [isExpanded, setIsExpanded] = useState(false);

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
        if (!firestore) return;

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
        }
    };

    const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="relative inline-flex items-center">
            <button
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full border transition-all",
                    userReaction
                        ? "border-primary/50 bg-primary/10"
                        : "border-border hover:border-primary/50"
                )}
            >
                {userReaction ? (
                    <span className={REACTION_CONFIG.find(r => r.type === userReaction)?.color}>
                        {(() => {
                            const Icon = REACTION_CONFIG.find(r => r.type === userReaction)?.icon || Heart;
                            return <Icon size={18} fill="currentColor" />;
                        })()}
                    </span>
                ) : (
                    <Heart size={18} className="text-muted-foreground" />
                )}
                <span className="text-sm font-medium">{totalReactions > 0 ? totalReactions : 'React'}</span>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 flex gap-1 p-1 bg-background border border-border rounded-full shadow-lg"
                        onMouseEnter={() => setIsExpanded(true)}
                        onMouseLeave={() => setIsExpanded(false)}
                    >
                        {REACTION_CONFIG.map(({ type, icon: Icon, label, color }) => (
                            <button
                                key={type}
                                onClick={() => handleReaction(type)}
                                className={cn(
                                    "p-2 rounded-full transition-all hover:scale-125",
                                    userReaction === type ? `${color} bg-secondary` : "text-muted-foreground hover:text-foreground"
                                )}
                                title={label}
                            >
                                <Icon size={20} fill={userReaction === type ? "currentColor" : "none"} />
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
