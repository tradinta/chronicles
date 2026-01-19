"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ActionRail from '@/components/article/action-rail';
import ArticleFooter from '@/components/article/article-footer';
import { useRouter } from 'next/navigation';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { getArticleById } from '@/firebase/firestore/articles';
import { useScroll, useSpring } from 'framer-motion';
import { ArticleSkeleton } from '@/components/loader/ArticleSkeleton';
import { useFirestore } from '@/firebase';
import Link from 'next/link';
import { format } from 'date-fns';

type Props = {
    slug: string;
};

export default function ArticleClientPage({ slug }: Props) {
    const router = useRouter();
    const articleId = slug;
    const firestore = useFirestore();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [article, setArticle] = useState<DocumentData | null>(null);
    const [author, setAuthor] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!firestore || !articleId) return;
            setIsLoading(true);

            try {
                const articleData = await getArticleById(firestore, articleId);

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

    const publishDate = article.publishDate?.toDate ? format(article.publishDate.toDate(), 'MMM dd, yyyy') : 'Date not available';
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
            <ActionRail isFocusMode={isFocusMode} setFocusMode={setFocusMode} />

            <header className={`pt-20 pb-12 px-6 md:px-12 max-w-4xl mx-auto transition-opacity duration-500 ${isFocusMode ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="h-[1px] w-8 bg-muted-foreground/50"></span>
                        <Link
                            href={`/news`}
                            className="text-xs font-bold tracking-[0.2em] uppercase cursor-pointer hover:underline text-primary"
                        >
                            {article.category || 'Opinion'}
                        </Link>
                    </div>

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

            <article className="px-6 md:px-12 max-w-3xl mx-auto pb-32">
                <div className={`transition-all duration-700 ${isFocusMode ? 'grayscale-[0.5]' : ''}`}>
                    {article.summary && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                            <p className="text-xl md:text-2xl font-serif italic mb-12 leading-relaxed opacity-80 text-muted-foreground border-l-4 border-primary pl-6 py-2">
                                "{article.summary}"
                            </p>
                        </motion.div>
                    )}

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                        <div className="prose prose-lg md:prose-xl dark:prose-invert font-serif prose-p:leading-[1.8] prose-h2:font-serif prose-headings:font-bold prose-a:text-primary" dangerouslySetInnerHTML={{ __html: article.content }} />
                    </motion.div>
                </div>
            </article>

            <ArticleFooter onViewChange={() => router.push('/news')} />
        </motion.div>
    );
}
