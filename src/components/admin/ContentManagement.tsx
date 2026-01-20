'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, MoreVertical, Star, StarOff, Eye, EyeOff, Trash2, Edit, ExternalLink, Loader2, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

interface Article {
    id: string;
    title: string;
    slug: string;
    authorId: string;
    category: string;
    status: string;
    views: number;
    isFeatured?: boolean;
    publishDate?: any;
}

export default function ContentManagement() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        if (!firestore) return;
        loadArticles();
    }, [firestore]);

    const loadArticles = async () => {
        if (!firestore) return;
        setLoading(true);
        try {
            const q = query(collection(firestore, 'articles'), orderBy('publishDate', 'desc'));
            const snap = await getDocs(q);
            setArticles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article)));
        } catch (error) {
            console.error('Failed to load articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeature = async (articleId: string, isFeatured: boolean) => {
        if (!firestore) return;
        try {
            await updateDoc(doc(firestore, 'articles', articleId), { isFeatured });
            setArticles(prev => prev.map(a => a.id === articleId ? { ...a, isFeatured } : a));
            toast({ title: isFeatured ? 'Article featured' : 'Article unfeatured' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to update' });
        }
    };

    const handleStatusChange = async (articleId: string, status: string) => {
        if (!firestore) return;
        try {
            await updateDoc(doc(firestore, 'articles', articleId), { status });
            setArticles(prev => prev.map(a => a.id === articleId ? { ...a, status } : a));
            toast({ title: `Article ${status}` });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to update' });
        }
    };

    const handleDelete = async (articleId: string) => {
        if (!firestore || !confirm('Are you sure you want to delete this article?')) return;
        try {
            await deleteDoc(doc(firestore, 'articles', articleId));
            setArticles(prev => prev.filter(a => a.id !== articleId));
            toast({ title: 'Article deleted' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to delete' });
        }
    };

    const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];

    const filteredArticles = articles.filter(article => {
        const matchesSearch = !searchTerm || article.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        Content Management
                    </h2>
                    <p className="text-muted-foreground">Manage all articles and publications</p>
                </div>
                <div className="text-sm text-muted-foreground">{articles.length} articles</div>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm"
                    />
                </div>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
                    <option value="all">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                </select>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-secondary/50">
                        <tr className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="px-4 py-3 text-left">Article</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Views</th>
                            <th className="px-4 py-3 text-left">Published</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map((article, i) => (
                            <motion.tr key={article.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-t border-border hover:bg-secondary/30">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {article.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                        <span className="font-medium text-sm line-clamp-1">{article.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{article.category || 'Uncategorized'}</td>
                                <td className="px-4 py-3">
                                    <span className={cn("text-xs font-bold uppercase px-2 py-1 rounded",
                                        article.status === 'published' && "bg-green-500/10 text-green-600",
                                        article.status === 'draft' && "bg-yellow-500/10 text-yellow-600",
                                        article.status === 'scheduled' && "bg-blue-500/10 text-blue-600"
                                    )}>{article.status || 'published'}</span>
                                </td>
                                <td className="px-4 py-3 text-sm font-mono">{(article.views || 0).toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                    {article.publishDate?.toDate ? format(article.publishDate.toDate(), 'MMM d, yyyy') : 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="p-1.5 rounded hover:bg-secondary"><MoreVertical className="w-4 h-4" /></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/article/${article.slug}`} target="_blank"><ExternalLink className="w-4 h-4 mr-2" /> View</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleFeature(article.id, !article.isFeatured)}>
                                                {article.isFeatured ? <StarOff className="w-4 h-4 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                                                {article.isFeatured ? 'Unfeature' : 'Feature'}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleStatusChange(article.id, 'published')}><Eye className="w-4 h-4 mr-2" /> Publish</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(article.id, 'draft')}><EyeOff className="w-4 h-4 mr-2" /> Unpublish</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDelete(article.id)} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredArticles.length === 0 && <div className="py-12 text-center text-muted-foreground">No articles found</div>}
            </div>
        </div>
    );
}
