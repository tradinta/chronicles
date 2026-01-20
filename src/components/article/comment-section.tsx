"use client";

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { getComments, addComment, Comment } from '@/firebase/firestore/comments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CommentSectionProps {
    articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchComments() {
            if (!firestore) return;
            try {
                const fetched = await getComments(firestore, articleId);
                setComments(fetched);
            } catch (error) {
                console.error("Failed to load comments", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchComments();
    }, [firestore, articleId]);

    const handleSubmit = async () => {
        if (!newComment.trim() || !user || !firestore) return;

        setIsSubmitting(true);
        try {
            await addComment(firestore, {
                articleId,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userAvatar: user.photoURL || '',
                content: newComment,
            });

            setNewComment('');
            // Refresh comments
            const fetched = await getComments(firestore, articleId);
            setComments(fetched);

            toast({
                title: "Comment posted",
                description: "Your voice has been heard.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to post comment. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mt-16 border-t border-border pt-12 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 mb-8">
                <MessageSquare size={24} className="text-orange-600" />
                <h3 className="font-serif text-2xl font-bold">Discussion ({comments.length})</h3>
            </div>

            {/* Input Area */}
            <div className="mb-12">
                {user ? (
                    <div className="flex items-start space-x-4">
                        <Avatar className="w-10 h-10 border border-border">
                            <AvatarImage src={user.photoURL || ''} />
                            <AvatarFallback>{user.displayName?.substring(0, 2) || 'ME'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                            <Textarea
                                placeholder="Share your perspective..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="bg-secondary/20 resize-none min-h-[100px] font-sans focus:ring-orange-500/20 text-base"
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!newComment.trim() || isSubmitting}
                                    className={cn("rounded-full px-6", isSubmitting ? "bg-muted" : "bg-foreground text-background hover:bg-orange-600 hover:text-white")}
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : (
                                        <>
                                            <span>Post Comment</span>
                                            <Send size={14} className="ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-secondary/30 rounded-xl p-8 text-center border border-dashed border-stone-300 dark:border-stone-700">
                        <h4 className="font-serif text-xl mb-2">Join the conversation</h4>
                        <p className="text-muted-foreground mb-6">Sign in to share your thoughts with our community.</p>
                        <Link href="/auth">
                            <Button className="rounded-full font-bold uppercase tracking-wider">Sign In to Comment</Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-8">
                {isLoading ? (
                    <div className="flex justify-center py-8 text-muted-foreground">
                        <Loader2 className="animate-spin mr-2" /> Loading discussion...
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground italic">
                        No comments yet. Be the first to start the discussion.
                    </div>
                ) : (
                    <AnimatePresence>
                        {comments.map((comment) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={comment.id}
                                className="flex space-x-4 group"
                            >
                                <Avatar className="w-10 h-10 border border-border">
                                    <AvatarImage src={comment.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`} />
                                    <AvatarFallback>User</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-sm">{comment.userName}</span>
                                        <span className="text-xs text-muted-foreground">{comment.createdAt?.seconds ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}</span>
                                    </div>
                                    <div className="text-base leading-relaxed text-foreground/90">
                                        {comment.content}
                                    </div>
                                    {/* Action Row - likes/reply could go here */}
                                    <div className="flex space-x-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-xs font-bold text-muted-foreground hover:text-orange-600">Reply</button>
                                        <button className="text-xs font-bold text-muted-foreground hover:text-orange-600">Like</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </section>
    );
}
