'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Loader2,
    MoreHorizontal,
    PenTool,
    Archive,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { getArticlesByAuthor, updateArticleStatus } from '@/firebase/firestore/articles';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { EmptyState } from '../page';


const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        published: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
        draft: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
        takedown: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
    };
    return (<Badge variant="outline" className={`capitalize ${styles[status as keyof typeof styles] || styles.draft}`}>{status}</Badge>);
};



const MyStoriesPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [filter, setFilter] = React.useState('all');
    const [searchQuery, setSearchQuery] = React.useState('');

    const articlesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return getArticlesByAuthor(firestore, user.uid);
    }, [firestore, user]);

    const { data: articles, isLoading } = useCollection(articlesQuery);

    const filteredArticles = useMemo(() => {
        if (!articles) return [];
        return articles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === 'all' || (article.status || 'published') === filter;
            return matchesSearch && matchesFilter;
        });
    }, [articles, filter, searchQuery]);

    const handleTakedown = async (articleId: string) => {
        if (!firestore) return;
        try {
            await updateArticleStatus(firestore, articleId, 'takedown');
            toast({ title: "Article taken down", description: "The article has been marked for takedown." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: "Could not perform takedown." });
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="font-serif text-4xl font-bold">My Stories</h1>
                    <p className="text-muted-foreground mt-1">Manage your editorial content.</p>
                </div>
                <Button onClick={() => router.push('/dashboard/new-story')} className="shadow-lg hover:shadow-xl transition-all">
                    <PenTool className="mr-2 w-4 h-4" /> New Article
                </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex p-1 bg-muted rounded-lg">
                    {['all', 'published', 'draft', 'takedown'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === f
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans text-sm"
                    />
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                {filteredArticles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-foreground">No stories found</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mt-2">
                            {searchQuery ? `No results for "${searchQuery}"` : "You haven't written any stories with this status yet."}
                        </p>
                        {searchQuery && <Button variant="link" onClick={() => setSearchQuery('')}>Clear Search</Button>}
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredArticles.map(article => (
                            <div key={article.id} className="group p-5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-5">
                                    <div className="w-20 h-20 md:w-32 md:h-24 bg-muted rounded-lg overflow-hidden shrink-0 shadow-sm relative group-hover:shadow-md transition-all">
                                        {article.imageUrl ? (
                                            <Image
                                                src={article.imageUrl}
                                                alt={article.title}
                                                width={128}
                                                height={96}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                                                <FileText className="w-8 h-8 text-muted-foreground/20" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="max-w-lg">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <StatusBadge status={(article as any).status || 'published'} />
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                                                {article.category || 'Uncategorized'}
                                            </span>
                                        </div>
                                        <Link href={`/article/${article.slug}`} className="block">
                                            <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                                                {article.title || 'Untitled Draft'}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 pr-4">
                                            {article.summary || "No summary provided..."}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-medium">
                                            <span>Last updated {article.publishDate ? new Date(article.publishDate.toDate()).toLocaleDateString() : 'Recently'}</span>
                                            {/* Future stats: Views, comments */}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
                                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/new-story?edit=${article.id}`)}>
                                        <PenTool className="w-4 h-4 mr-2" /> Edit
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => router.push(`/article/${article.id}`)}>
                                                View Live
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleTakedown(article.id)} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                                                <Archive className="mr-2 w-4 h-4" /> Takedown
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};


export default function StoriesPageWrapper() {
    return <MyStoriesPage />
}
