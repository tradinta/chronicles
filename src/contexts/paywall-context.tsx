'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const FREE_ARTICLE_LIMIT = 3;
const STORAGE_KEY = 'chronicle_article_reads';
const RESET_PERIOD_DAYS = 30;

interface PaywallContextType {
    articlesRead: number;
    hasReachedLimit: boolean;
    isPremium: boolean;
    recordArticleRead: (articleId: string) => void;
    setIsPremium: (value: boolean) => void;
}

const PaywallContext = createContext<PaywallContextType | undefined>(undefined);

export function PaywallProvider({ children }: { children: ReactNode }) {
    const [articlesRead, setArticlesRead] = useState<string[]>([]);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        // Load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                const now = Date.now();
                const resetTime = RESET_PERIOD_DAYS * 24 * 60 * 60 * 1000;

                // Reset if period has passed
                if (data.startDate && (now - data.startDate) > resetTime) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({ startDate: now, articles: [] }));
                    setArticlesRead([]);
                } else {
                    setArticlesRead(data.articles || []);
                }
            } catch (e) {
                console.error('Error parsing paywall data:', e);
            }
        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ startDate: Date.now(), articles: [] }));
        }
    }, []);

    const recordArticleRead = (articleId: string) => {
        if (isPremium) return;
        if (articlesRead.includes(articleId)) return;

        const newArticles = [...articlesRead, articleId];
        setArticlesRead(newArticles);

        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : { startDate: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, articles: newArticles }));
    };

    const hasReachedLimit = !isPremium && articlesRead.length >= FREE_ARTICLE_LIMIT;

    return (
        <PaywallContext.Provider value={{
            articlesRead: articlesRead.length,
            hasReachedLimit,
            isPremium,
            recordArticleRead,
            setIsPremium,
        }}>
            {children}
        </PaywallContext.Provider>
    );
}

export function usePaywall() {
    const context = useContext(PaywallContext);
    if (!context) {
        throw new Error('usePaywall must be used within a PaywallProvider');
    }
    return context;
}
