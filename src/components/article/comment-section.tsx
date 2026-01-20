'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { addComment, getComments, likeComment, reportComment, Comment } from '@/firebase/firestore/comments';
import { MessageSquare, ThumbsUp, Flag, Send, Loader2, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface CommentSectionProps {
    articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!firestore) return;

        const fetchComments = async () => {
            try {
                const data = await getComments(firestore, articleId);
                setComments(data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, [firestore, articleId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user || !firestore || !newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await addComment(firestore, {
                articleId,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                userAvatar: user.photoURL || undefined,
                content: newComment.trim(),
                parentId: null,
            });

            // Refresh comments
            const updatedComments = await getComments(firestore, articleId);
            setComments(updatedComments);
            setNewComment('');
            toast({ title: 'Comment posted!' });
        } catch (error) {
            console.error('Error posting comment:', error);
            toast({ variant: 'destructive', title: 'Failed to post comment' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (commentId: string) => {
        if (!firestore) return;
        try {
            await likeComment(firestore, articleId, commentId);
            // Optimistically update
            setComments(prev => prev.map(c =>
                c.id === commentId ? { ...c, likes: c.likes + 1 } : c
            ));
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleReport = async (commentId: string) => {
        if (!firestore) return;
        try {
            await reportComment(firestore, articleId, commentId);
            toast({ title: 'Comment reported for review' });
        } catch (error) {
            console.error('Error reporting comment:', error);
        }
    };

    return (
        <div className="mt-16 border-t border-border pt-12">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-6">
                <MessageSquare size={20} />
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                            {user.photoURL ? (
                                <Image src={user.photoURL} alt={user.displayName || 'You'} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <User size={20} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows={3}
                                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="mt-2 px-4 py-2 bg-primary text-white rounded-md font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                Post Comment
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="text-muted-foreground text-sm mb-8">
                    <a href="/auth" className="text-primary hover:underline">Sign in</a> to join the discussion.
                </p>
            )}

            {/* Comments List */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-muted-foreground" />
                </div>
            ) : comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</p>
            ) : (
                <div className="space-y-6">
                    {comments.filter(c => !c.parentId).map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                                {comment.userAvatar ? (
                                    <Image src={comment.userAvatar} alt={comment.userName} width={40} height={40} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
                                        {comment.userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm">{comment.userName}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {comment.createdAt?.toDate ? format(comment.createdAt.toDate(), 'MMM d, yyyy') : ''}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground/90">{comment.content}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <button
                                        onClick={() => handleLike(comment.id!)}
                                        className={cn(
                                            "flex items-center gap-1 text-xs transition-colors",
                                            comment.likes > 0 ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <ThumbsUp size={14} />
                                        {comment.likes > 0 && comment.likes}
                                    </button>
                                    <button
                                        onClick={() => handleReport(comment.id!)}
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Flag size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
