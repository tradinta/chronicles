"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ActionRail from '@/components/article/action-rail';
import ArticleFooter from '@/components/article/article-footer';
import { useRouter } from 'next/navigation';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { getArticleById } from '@/firebase/firestore/articles';
import { getArticleBySlug } from '@/firebase/firestore/article-slug';
import { useScroll, useSpring } from 'framer-motion';
import { ArticleSkeleton } from '@/components/loader/ArticleSkeleton';
import { useFirestore } from '@/firebase';
import Link from 'next/link';
import { format } from 'date-fns';
import { ReactionBar } from './reaction-bar';
import CommentSection from './comment-section';

type Props = {
    slug: string;
    initialArticle?: DocumentData | null;
    isRestricted?: boolean;
};

export default function ArticleClientPage({ slug, initialArticle, isRestricted }: Props) {
    const router = useRouter();
    const articleId = slug;
    const firestore = useFirestore();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [article, setArticle] = useState<DocumentData | null>(initialArticle || null);
    const [author, setAuthor] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState(!initialArticle);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!firestore || !articleId) return;
            setIsLoading(true);

            try {
                const articleData = await getArticleBySlug(firestore, articleId);

                if (articleData) {
                    setArticle(articleData);

                    if (articleData.authorId) {
                        const authorRef = doc(firestore, 'users', articleData.authorId);
                        const authorSnap = await getDoc(authorRef);
                        if (authorSnap.exists()) {
                            setAuthor({ id: authorSnap.id, ...authorSnap.data() });
                        } else {
                            setAuthor({ name: 'The Chronicle Staff', bio: 'Editorial Team', profileImageUrl: null });
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching article", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [firestore, articleId]);


    const [isFocusMode, setFocusMode] = useState(false);

    if (isLoading) {
        return <ArticleSkeleton />;
    }

    if (!article) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
                    <p className="mb-6 text-muted-foreground">The article you are looking for does not exist or has been moved.</p>
                    <button onClick={() => router.push('/')} className="px-4 py-2 bg-primary text-white rounded">Return Home</button>
                </div>
            </div>
        );
    }

    const getFormattedDate = (date: any) => {
        if (!date) return 'Date not available';
        if (typeof date === 'number') return format(new Date(date), 'MMM dd, yyyy');
        if (date.toDate) return format(date.toDate(), 'MMM dd, yyyy');
        if (date.seconds) return format(new Date(date.seconds * 1000), 'MMM dd, yyyy');
        return 'Date not available';
    };

    const publishDate = getFormattedDate(article.publishDate);
    const readTime = article.content ? Math.ceil(article.content.split(/\s+/).length / 200) : 5;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen relative bg-background"
        >
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary transform origin-left z-50"
                style={{ scaleX }}
            />
            <ActionRail 
                isFocusMode={isFocusMode} 
                setFocusMode={setFocusMode} 
                articleId={article.id} 
            />

            <div className={`pt-24 px-6 md:px-12 max-w-4xl mx-auto transition-opacity duration-500 ${isFocusMode ? 'opacity-0' : 'opacity-100'}`}>
                <nav className="flex items-center text-xs text-muted-foreground font-mono uppercase tracking-widest space-x-2">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/news" className="hover:text-primary transition-colors">News</Link>
                    <span>/</span>
                    <span className="text-primary font-bold">{article.category || 'Article'}</span>
                </nav>
            </div>

            <header className={`pt-8 pb-12 px-6 md:px-12 max-w-4xl mx-auto transition-opacity duration-500 ${isFocusMode ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                    <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-foreground"
                        dangerouslySetInnerHTML={{ __html: article.title ? article.title.replace(/<br\s*\/?>/gi, '') : 'Untitled' }}
                    />

                    <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-b py-6 gap-6 border-border">
                        <div className="flex items-center space-x-4 group">
                            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden transition-all duration-300 group-hover:ring-2 ring-primary ring-offset-2 ring-offset-background flex items-center justify-center">
                                {author?.profileImageUrl ? (
                                    <Image src={author.profileImageUrl} alt={author.name || 'Author'} width={40} height={40} className="object-cover" />
                                ) : (
                                    <div className="bg-primary/20 text-primary font-bold w-full h-full flex items-center justify-center">
                                        {(author?.name || 'A')?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{author?.name || 'Anonymous'}</p>
                                <p className="text-xs text-muted-foreground">{author?.bio ? author.bio.substring(0, 30) + '...' : 'Contributor'}</p>
                            </div>
                        </div>
                        <div className="text-xs tracking-widest uppercase font-medium text-muted-foreground">
                            {publishDate} • {readTime} Min Read
                        </div>
                    </div>
                </motion.div>
            </header>

            {article.imageUrl && (
                <div className="my-16 -mx-6 md:-mx-24 relative group h-[50vh] md:h-[70vh] overflow-hidden">
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        priority
                        className={`w-full h-full object-cover transition-all duration-1000 ${isFocusMode ? 'opacity-60 grayscale' : 'opacity-90 hover:opacity-100'}`}
                    />
                </div>
            )}

            <article className="px-6 md:px-12 max-w-3xl mx-auto pb-8">
                <div className={`transition-all duration-700 ${isFocusMode ? 'grayscale-[0.5]' : ''}`}>
                    {article.summary && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                            <p className="text-xl md:text-2xl font-serif italic mb-12 leading-relaxed opacity-80 text-muted-foreground border-l-4 border-primary pl-6 py-2">
                                "{article.summary}"
                            </p>
                        </motion.div>
                    )}

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                        <div className="prose prose-lg md:prose-xl dark:prose-invert font-serif prose-p:leading-[1.8] prose-h2:font-serif prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-headings:font-bold prose-a:text-primary prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-figure:my-12 prose-img:rounded-xl relative" >
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                            
                            {isRestricted && (
                                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent z-10 flex items-end justify-center pb-8">
                                    <div className="bg-card border border-border p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center backdrop-blur-sm">
                                        <h3 className="text-2xl font-serif font-bold mb-3">Keep Reading with Premium</h3>
                                        <p className="text-muted-foreground mb-6">This investigative report is exclusive to Chronicle subscribers. Support independent journalism and get unlimited access.</p>
                                        <Link 
                                            href="/subscribe" 
                                            className="inline-block w-full py-4 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-primary/20"
                                        >
                                            Subscribe for $5/month
                                        </Link>
                                        <p className="mt-4 text-xs text-muted-foreground underline cursor-pointer">Already a subscriber? Sign In</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </article>

            <div className="max-w-3xl mx-auto pb-24 border-t border-border pt-8">
                <div className="flex justify-center mb-8">
                    <ReactionBar articleId={article.id!} />
                </div>
                <CommentSection articleId={article.id!} />
            </div>

            <ArticleFooter onViewChange={() => router.push('/news')} author={author} />
        </motion.div>
    );
}
