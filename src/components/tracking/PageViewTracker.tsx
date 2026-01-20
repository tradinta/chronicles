'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { recordPageView, getOrCreateSessionId } from '@/firebase/firestore/tracking';

/**
 * PageViewTracker - Tracks all page views for analytics
 * 
 * This component should be placed in the root layout to track:
 * - Every page navigation
 * - Both authenticated users and anonymous guests
 * - Article-specific views with metadata
 */
export default function PageViewTracker() {
    const pathname = usePathname();
    const firestore = useFirestore();
    const { user } = useUser();
    const lastPathRef = useRef<string | null>(null);
    const isRecordingRef = useRef(false);

    useEffect(() => {
        // Ensure session ID exists on mount
        getOrCreateSessionId();
    }, []);

    useEffect(() => {
        // Prevent duplicate recordings for the same path
        if (!firestore || pathname === lastPathRef.current || isRecordingRef.current) {
            return;
        }

        const trackView = async () => {
            isRecordingRef.current = true;
            lastPathRef.current = pathname;

            try {
                // Extract article info if on an article page
                let articleId: string | undefined;
                let articleTitle: string | undefined;

                // Check if this is an article page (e.g., /article/[slug])
                const articleMatch = pathname.match(/^\/article\/([^/]+)/);
                if (articleMatch) {
                    articleId = articleMatch[1]; // The slug
                    // Try to get title from document if available
                    if (typeof document !== 'undefined') {
                        const titleElement = document.querySelector('h1');
                        articleTitle = titleElement?.textContent || undefined;
                    }
                }

                await recordPageView(firestore, {
                    path: pathname,
                    articleId,
                    articleTitle,
                    userId: user?.uid
                });
            } catch (error) {
                console.error('PageViewTracker error:', error);
            } finally {
                isRecordingRef.current = false;
            }
        };

        // Small delay to ensure page has loaded and title is available
        const timeoutId = setTimeout(trackView, 500);

        return () => clearTimeout(timeoutId);
    }, [pathname, firestore, user]);

    // This component renders nothing - it's purely for side effects
    return null;
}
