'use client';

import React, { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Check, X, Edit, Eye, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ModerationQueue() {
    const firestore = useFirestore();
    const router = useRouter();
    const [articles, setArticles] = useState<any[]>([]);

    useEffect(() => {
        if (!firestore) return;

        // Fetch articles in 'review' status
        const q = query(
            collection(firestore, 'articles'),
            where('status', '==', 'review'),
            orderBy('lastUpdated', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [firestore]);

    const handleAction = async (id: string, action: 'publish' | 'reject' | 'delete') => {
        if (!firestore) return;
        const ref = doc(firestore, 'articles', id);

        if (action === 'publish') {
            await updateDoc(ref, { status: 'published', publishDate: new Date() });
        } else if (action === 'reject') {
            await updateDoc(ref, { status: 'draft' });
        } else if (action === 'delete') {
            if (confirm('Are you sure you want to delete this article?')) {
                await deleteDoc(ref);
            }
        }
    };

    return (
        <div className="bg-[#18181b] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white font-serif">Moderation Queue</h3>
                    <p className="text-xs text-gray-400">Review pending submissions.</p>
                </div>
                <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                    {articles.length} Pending
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 font-medium font-serif uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Article</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4">Submitted</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                                    All caught up! No articles pending review.
                                </td>
                            </tr>
                        )}

                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-white truncate max-w-xs">{article.title}</p>
                                    <p className="text-xs mt-0.5">{article.category || 'Uncategorized'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {(article.authorId || 'U').substring(0, 2).toUpperCase()}
                                        </div>
                                        <span>{article.authorId}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {article.lastUpdated?.toDate().toLocaleDateString() || 'Recently'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => window.open(`/article/${article.id}`, '_blank')}
                                            className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors" title="Preview"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleAction(article.id, 'publish')}
                                            className="p-1.5 text-green-400 hover:bg-green-400/10 rounded transition-colors" title="Approve"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleAction(article.id, 'reject')}
                                            className="p-1.5 text-yellow-400 hover:bg-yellow-400/10 rounded transition-colors" title="Reject (Draft)"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleAction(article.id, 'delete')}
                                            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Delete"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
