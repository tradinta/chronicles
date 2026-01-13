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
  
  const articlesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return getArticlesByAuthor(firestore, user.uid);
  }, [firestore, user]);

  const { data: articles, isLoading } = useCollection(articlesQuery);

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
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-primary" />
        </div>
    );
  }

  if (!articles || articles.length === 0) {
      return <EmptyState tab="stories" />
  }


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="font-serif text-4xl font-bold">My Stories</h1>
                <p className="text-muted-foreground mt-1">Manage your published articles and drafts.</p>
            </div>
            <Button onClick={() => router.push('/dashboard/new-story')}>
                <PenTool className="mr-2" /> New Article
            </Button>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-4 border-b border-border">
                <p className="text-sm font-medium">
                    {articles.length} articles
                </p>
            </div>
            <div className="divide-y divide-border">
                {articles.map(article => (
                    <div key={article.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-16 bg-muted rounded-md overflow-hidden shrink-0">
                                {article.imageUrl && (
                                    <Image 
                                        src={article.imageUrl} 
                                        alt={article.title}
                                        width={96}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div>
                                <Link href={`/article/${article.slug}`}>
                                    <h3 className="font-semibold hover:underline">{article.title}</h3>
                                </Link>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <span>{article.category}</span>
                                    <span>•</span>
                                    <span>{new Date(article.publishDate.toDate()).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <StatusBadge status={(article as any).status || 'published'} />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/dashboard/new-story?edit=${article.id}`)}>
                                        <PenTool className="mr-2" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleTakedown(article.id)} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                                        <Archive className="mr-2" /> Takedown
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
  );
};


export default function StoriesPageWrapper() {
    return <MyStoriesPage />
}
