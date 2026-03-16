"use client";

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { getComments, addComment, Comment } from '@/firebase/firestore/comments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, MessageSquare, Send, Flag, Heart } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ReportModal } from '../shared/ReportModal';

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
    const [reportingComment, setReportingComment] = useState<Comment | null>(null);
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

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

    const handleSubmit = async (parentId: string | null = null) => {
        const content = parentId ? newComment : newComment; // Use same state for now or separate
        if (!newComment.trim() || !user || !firestore) return;

        setIsSubmitting(true);
        try {
            await addComment(firestore, {
                articleId,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userAvatar: user.photoURL || '',
                content: newComment,
                parentId: parentId
            });

            setNewComment('');
            setReplyingTo(null);
            // Refresh comments
            const fetched = await getComments(firestore, articleId);
            setComments(fetched);

            toast({
                title: parentId ? "Reply posted" : "Comment posted",
                description: "Your voice has been heard.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to post. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (commentId: string) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Sign in to like' });
            return;
        }
        try {
            await updateDoc(doc(firestore, 'articles', articleId, 'comments', commentId), {
                likes: increment(1)
            });
            // Optimistic update
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c));
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

    const renderComment = (comment: Comment, depth = 0) => {
        const replies = comments.filter(c => c.parentId === comment.id);
        const isReplying = replyingTo?.id === comment.id;

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={comment.id}
                className={cn("relative", depth > 0 ? "ml-6 md:ml-10 mt-4" : "mt-8")}
            >
                {/* Visual Connector */}
                {depth > 0 && (
                    <div className="absolute -left-4 md:-left-6 top-0 bottom-0 w-px bg-border group-hover:bg-primary/30 transition-colors" />
                )}
                
                <div className="flex space-x-3 md:space-x-4 group">
                    <Avatar className="w-8 h-8 md:w-10 md:h-10 border border-border shrink-0">
                        <AvatarImage src={comment.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`} />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs md:text-sm truncate">{comment.userName}</span>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {comment.createdAt?.seconds ? formatDistanceToNow(new Date(comment.createdAt.seconds * 1000), { addSuffix: true }) : 'Just now'}
                            </span>
                        </div>
                        <div className="text-sm md:text-base leading-relaxed text-foreground/90 break-words">
                            {comment.content}
                        </div>
                        
                        <div className="flex space-x-4 mt-2 items-center">
                            <button 
                                onClick={() => setReplyingTo(isReplying ? null : comment)}
                                className="text-[10px] font-bold text-muted-foreground hover:text-orange-600 uppercase tracking-wider transition-colors"
                            >
                                {isReplying ? 'Cancel' : 'Reply'}
                            </button>
                            <button 
                                onClick={() => handleLike(comment.id!)}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-orange-600 uppercase tracking-wider transition-colors"
                            >
                                <Heart size={12} className={cn((comment.likes || 0) > 0 && "fill-red-500 text-red-500")} />
                                <span>{comment.likes || 0}</span>
                            </button>
                            {replies.length > 0 && (
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                                </span>
                            )}
                            <button 
                                onClick={() => setReportingComment(comment)}
                                className="text-[10px] font-bold text-muted-foreground hover:text-red-600 uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Flag size={10} /> Report
                            </button>
                        </div>

                        {/* Reply Input */}
                        {isReplying && (
                            <div className="mt-4 space-y-3">
                                <Textarea
                                    autoFocus
                                    placeholder={`Reply to ${comment.userName}...`}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="bg-secondary/10 resize-none min-h-[80px] text-sm"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                    <Button 
                                        size="sm" 
                                        onClick={() => handleSubmit(comment.id)}
                                        disabled={!newComment.trim() || isSubmitting}
                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin w-3 h-3" /> : 'Post Reply'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Render Nested Replies */}
                {replies.length > 0 && (
                    <div className="space-y-1">
                        {replies.map(reply => renderComment(reply, depth + 1))}
                    </div>
                )}
            </motion.div>
        );
    };

    const rootComments = comments.filter(c => !c.parentId);

    return (
        <section className="mt-16 border-t border-border pt-12 max-w-2xl mx-auto px-4 md:px-0">
            <ReportModal
                isOpen={!!reportingComment}
                onClose={() => setReportingComment(null)}
                contentType="comment"
                contentId={reportingComment?.id || ''}
                contentPreview={reportingComment?.content || ''}
            />
            
            <div className="flex items-center space-x-2 mb-8">
                <MessageSquare size={24} className="text-orange-600" />
                <h3 className="font-serif text-2xl font-bold">Discussion ({comments.length})</h3>
            </div>

            {/* Main Input Area */}
            {!replyingTo && (
                <div className="mb-12">
                    {user ? (
                        <div className="flex items-start space-x-4">
                            <Avatar className="w-10 h-10 border border-border shrink-0">
                                <AvatarImage src={user.photoURL || ''} />
                                <AvatarFallback>{user.displayName?.substring(0, 2) || 'ME'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3 min-w-0">
                                <Textarea
                                    placeholder="Share your perspective..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="bg-secondary/20 resize-none min-h-[100px] font-sans focus:ring-orange-500/20 text-base"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => handleSubmit(null)}
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
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-8 text-muted-foreground">
                        <Loader2 className="animate-spin mr-2" /> Loading discussion...
                    </div>
                ) : rootComments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground italic">
                        No comments yet. Be the first to start the discussion.
                    </div>
                ) : (
                    <AnimatePresence>
                        {rootComments.map(comment => renderComment(comment))}
                    </AnimatePresence>
                )}
            </div>
        </section>
    );
}
