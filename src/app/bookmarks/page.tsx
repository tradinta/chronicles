'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Bookmark, Clock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface BookmarkedArticle {
    id: string;
    articleId: string;
    title: string;
    imageUrl?: string;
    publishDate?: string;
    bookmarkedAt: any;
}

export default function BookmarksPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !firestore) {
            setIsLoading(false);
            return;
        }

        const bookmarksRef = collection(firestore, 'users', user.uid, 'bookmarks');
        const q = query(bookmarksRef, orderBy('bookmarkedAt', 'desc'), limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBookmarks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookmarkedArticle)));
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, firestore]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Bookmark size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h1 className="text-2xl font-serif font-bold mb-2">Sign In to View Bookmarks</h1>
                    <p className="text-muted-foreground mb-6">Save articles to read later.</p>
                    <Link href="/auth" className="px-6 py-2 bg-primary text-white rounded-md font-bold">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background pt-24 pb-16 px-6 md:px-12"
        >
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center space-x-3 mb-2">
                        <Bookmark size={24} className="text-primary" />
                        <h1 className="font-serif text-4xl font-bold">My Bookmarks</h1>
                    </div>
                    <p className="text-muted-foreground">Articles you've saved for later reading.</p>
                </header>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border rounded-xl">
                        <Bookmark size={48} className="mx-auto mb-4 text-muted-foreground/50" />
                        <h2 className="text-xl font-bold mb-2">No Bookmarks Yet</h2>
                        <p className="text-muted-foreground mb-6">Start saving articles to build your reading list.</p>
                        <Link href="/news" className="text-primary font-bold hover:underline">
                            Browse Articles →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookmarks.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/article/${item.articleId}`}
                                    className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary/30 transition-colors group"
                                >
                                    {item.imageUrl && (
                                        <div className="w-20 h-14 rounded overflow-hidden flex-shrink-0 bg-muted">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                width={80}
                                                height={56}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                                            <Clock size={12} className="mr-1" />
                                            Saved {item.bookmarkedAt?.toDate ? format(item.bookmarkedAt.toDate(), 'MMM d, yyyy') : 'recently'}
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
