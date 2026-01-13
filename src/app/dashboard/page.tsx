
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Feather, 
  ArrowRight, 
  PenTool, 
  BarChart, 
  Clock, 
  Edit,
  Loader,
  BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';

const StatCard = ({ icon: Icon, value, label, isDark }) => (
  <div className={`p-6 rounded-xl border transition-all ${isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>
      <Icon size={20} />
    </div>
    <p className={`text-3xl font-serif font-bold ${isDark ? 'text-stone-100' : 'text-stone-900'}`}>{value}</p>
    <p className={`text-xs uppercase tracking-widest mt-1 ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>{label}</p>
  </div>
);

const ArticleListItem = ({ article, isDraft = false, isDark, onEdit }) => (
  <div className={`p-4 rounded-lg flex items-center justify-between transition-colors ${isDark ? 'hover:bg-stone-800/50' : 'hover:bg-stone-100'}`}>
    <div>
      <span className={`text-[10px] uppercase font-bold tracking-wider ${isDraft ? 'text-yellow-500' : 'text-green-500'}`}>{isDraft ? 'Draft' : 'Published'}</span>
      <p className={`font-serif ${isDark ? 'text-stone-300' : 'text-stone-800'}`}>{article.headline || article.title}</p>
      <p className={`text-xs text-stone-500`}>
        {isDraft ? `Saved ${new Date(article.timestamp).toLocaleDateString()}` : (article.publishDate ? `Published on ${new Date(article.publishDate?.toDate()).toLocaleDateString()}`: 'Date not available')}
      </p>
    </div>
    <button onClick={() => onEdit(article.id)} className={`p-2 rounded-full transition-colors ${isDark ? 'text-stone-500 hover:text-stone-200 hover:bg-stone-800' : 'text-stone-400 hover:text-stone-800 hover:bg-stone-200'}`}>
      <Edit size={16} />
    </button>
  </div>
);


export default function AuthorDashboardPage() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const articlesQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, 'articles'), 
        where('authorId', '==', user.uid), 
        limit(5)
    );
  }, [firestore, user]);

  const draftsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, 'users', user.uid, 'drafts'),
        orderBy('savedAt', 'desc'),
        limit(5)
    );
  }, [firestore, user]);
  
  const { data: rawArticles, isLoading: articlesLoading } = useCollection(articlesQuery);
  const { data: drafts, isLoading: draftsLoading } = useCollection(draftsQuery);
  
  const articles = useMemo(() => {
    if (!rawArticles) return [];
    return [...rawArticles].sort((a, b) => {
      const dateA = a.publishDate?.toDate() || 0;
      const dateB = b.publishDate?.toDate() || 0;
      return dateB - dateA;
    });
  }, [rawArticles]);


  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth');
    return null;
  }
  
  return (
    <div className={`min-h-screen pt-32 pb-20 px-6 md:px-12 transition-colors duration-700 ${isDark ? 'bg-[#121212]' : 'bg-background'}`}>
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border pb-8"
        >
            <div>
                <h1 className={`font-serif text-4xl md:text-5xl mb-2 ${isDark ? 'text-stone-100' : 'text-foreground'}`}>Welcome, {user.displayName || 'Author'}</h1>
                <p className={`text-lg font-light max-w-xl ${isDark ? 'text-stone-400' : 'text-muted-foreground'}`}>This is your personal author dashboard. Manage your content and track your impact.</p>
            </div>
            <button onClick={() => router.push('/dashboard/new')} className="mt-6 md:mt-0 flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-lg bg-primary hover:bg-primary/90 transition-all transform hover:scale-105">
                <PenTool size={16} />
                <span>Write a New Story</span>
            </button>
        </motion.div>
        
        {/* STATS */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
            <StatCard icon={FileText} value={articles?.length || 0} label="Published Articles" isDark={isDark} />
            <StatCard icon={BarChart} value="1.2M" label="Total Reads" isDark={isDark} />
            <StatCard icon={Feather} value={drafts?.length || 0} label="Active Drafts" isDark={isDark} />
        </motion.div>

        {/* ARTICLES AND DRAFTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Published Articles */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <div className="flex items-center space-x-3 mb-6">
                    <BookOpen size={20} className="text-primary"/>
                    <h2 className="font-serif text-2xl text-foreground">Recent Publications</h2>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-white border-stone-200'}`}>
                    {articlesLoading ? <Loader className="animate-spin mx-auto my-8 text-primary"/> :
                     articles && articles.length > 0 ? articles.map(article => (
                        <ArticleListItem key={article.id} article={article} isDark={isDark} onEdit={(id) => router.push(`/dashboard/new-story?id=${id}`)} />
                    )) : <p className="text-center text-sm text-muted-foreground py-8">No articles published yet.</p>}
                </div>
            </motion.div>

            {/* Drafts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                 <div className="flex items-center space-x-3 mb-6">
                    <Clock size={20} className="text-primary"/>
                    <h2 className="font-serif text-2xl text-foreground">Your Drafts</h2>
                </div>
                <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-stone-900/50 border-stone-800' : 'bg-white border-stone-200'}`}>
                    {draftsLoading ? <Loader className="animate-spin mx-auto my-8 text-primary"/> :
                     drafts && drafts.length > 0 ? drafts.map(draft => (
                        <ArticleListItem key={draft.id} article={draft} isDraft isDark={isDark} onEdit={(id) => router.push(`/dashboard/new-story?draftId=${id}`)} />
                    )) : <p className="text-center text-sm text-muted-foreground py-8">No drafts saved.</p>}
                </div>
            </motion.div>
        </div>

      </div>
    </div>
  );
}
