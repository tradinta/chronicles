import {
    Firestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    doc,
    setDoc,
    increment,
    getDoc,
    updateDoc,
    limit
} from 'firebase/firestore';

// --- Types ---
export interface PageView {
    id?: string;
    path: string;
    articleId?: string;
    articleTitle?: string;
    userId?: string | null;
    sessionId: string;
    userAgent: string;
    referrer: string;
    timestamp: Timestamp;
    country?: string;
    device?: 'mobile' | 'desktop' | 'tablet';
}

export interface SessionData {
    sessionId: string;
    userId?: string | null;
    startedAt: Timestamp;
    lastActive: Timestamp;
    pageCount: number;
    userAgent: string;
}

// --- Session Management ---

/**
 * Generates or retrieves a session ID for tracking.
 * Stored in localStorage for persistence across page loads.
 */
export function getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'ssr-session';

    const STORAGE_KEY = 'chronicle_session_id';
    let sessionId = localStorage.getItem(STORAGE_KEY);

    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem(STORAGE_KEY, sessionId);
    }

    return sessionId;
}

/**
 * Detects device type from user agent
 */
function getDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
}

// --- Page View Recording ---

/**
 * Records a page view to Firestore.
 * Works for both authenticated users and anonymous guests.
 */
export async function recordPageView(
    firestore: Firestore,
    data: {
        path: string;
        articleId?: string;
        articleTitle?: string;
        userId?: string;
    }
): Promise<void> {
    const sessionId = getOrCreateSessionId();
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    const pageView: Omit<PageView, 'id'> = {
        path: data.path,
        articleId: data.articleId,
        articleTitle: data.articleTitle,
        userId: data.userId || null,
        sessionId,
        userAgent,
        referrer,
        timestamp: Timestamp.now(),
        device: getDeviceType(userAgent)
    };

    try {
        // 1. Record the page view
        await addDoc(collection(firestore, 'pageViews'), pageView);

        // 2. Update or create session
        const sessionRef = doc(firestore, 'sessions', sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (sessionSnap.exists()) {
            await updateDoc(sessionRef, {
                lastActive: Timestamp.now(),
                pageCount: increment(1)
            });
        } else {
            const sessionData: SessionData = {
                sessionId,
                userId: data.userId,
                startedAt: Timestamp.now(),
                lastActive: Timestamp.now(),
                pageCount: 1,
                userAgent
            };
            await setDoc(sessionRef, sessionData);
        }

        // 3. If it's an article, increment the view count on the article itself
        if (data.articleId) {
            const articleRef = doc(firestore, 'articles', data.articleId);
            await updateDoc(articleRef, {
                views: increment(1)
            }).catch(() => {
                // Article might not exist or field might not be set - that's ok
            });
        }
    } catch (error) {
        console.error('Failed to record page view:', error);
    }
}

// --- Analytics Queries ---

/**
 * Get total page views for a time range
 */
export async function getPageViewStats(
    firestore: Firestore,
    options: { days?: number; articleId?: string } = {}
): Promise<{ total: number; unique: number }> {
    const { days = 30, articleId } = options;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let q = query(
        collection(firestore, 'pageViews'),
        where('timestamp', '>=', Timestamp.fromDate(startDate))
    );

    if (articleId) {
        q = query(q, where('articleId', '==', articleId));
    }

    const snap = await getDocs(q);
    const sessions = new Set<string>();

    snap.docs.forEach(doc => {
        const data = doc.data();
        sessions.add(data.sessionId);
    });

    return {
        total: snap.size,
        unique: sessions.size
    };
}

/**
 * Get today's page views
 */
export async function getTodayViews(firestore: Firestore): Promise<number> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const q = query(
        collection(firestore, 'pageViews'),
        where('timestamp', '>=', Timestamp.fromDate(startOfToday))
    );

    const snap = await getDocs(q);
    return snap.size;
}

/**
 * Get currently online users (active in last 5 minutes)
 */
export async function getOnlineCount(firestore: Firestore): Promise<number> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const q = query(
        collection(firestore, 'sessions'),
        where('lastActive', '>', Timestamp.fromDate(fiveMinutesAgo))
    );

    const snap = await getDocs(q);
    return snap.size;
}

/**
 * Get top articles by views
 */
export async function getTopArticles(
    firestore: Firestore,
    options: { days?: number; count?: number } = {}
): Promise<{ articleId: string; title: string; views: number }[]> {
    const { days = 30, count = 10 } = options;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
        collection(firestore, 'pageViews'),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('articleId', '!=', null)
    );

    const snap = await getDocs(q);
    const articleCounts: Record<string, { title: string; views: number }> = {};

    snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.articleId) {
            if (!articleCounts[data.articleId]) {
                articleCounts[data.articleId] = { title: data.articleTitle || 'Unknown', views: 0 };
            }
            articleCounts[data.articleId].views++;
        }
    });

    return Object.entries(articleCounts)
        .map(([articleId, data]) => ({ articleId, ...data }))
        .sort((a, b) => b.views - a.views)
        .slice(0, count);
}

/**
 * Get traffic sources breakdown
 */
export async function getTrafficSources(
    firestore: Firestore,
    days: number = 30
): Promise<{ source: string; count: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
        collection(firestore, 'pageViews'),
        where('timestamp', '>=', Timestamp.fromDate(startDate))
    );

    const snap = await getDocs(q);
    const sources: Record<string, number> = {};

    snap.docs.forEach(doc => {
        const data = doc.data();
        let source = 'Direct';

        if (data.referrer) {
            try {
                const url = new URL(data.referrer);
                source = url.hostname.replace('www.', '');
            } catch {
                source = 'Other';
            }
        }

        sources[source] = (sources[source] || 0) + 1;
    });

    return Object.entries(sources)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);
}

/**
 * Get device breakdown
 */
export async function getDeviceBreakdown(
    firestore: Firestore,
    days: number = 30
): Promise<{ device: string; count: number; percentage: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
        collection(firestore, 'pageViews'),
        where('timestamp', '>=', Timestamp.fromDate(startDate))
    );

    const snap = await getDocs(q);
    const devices: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };

    snap.docs.forEach(doc => {
        const data = doc.data();
        const device = data.device || 'desktop';
        devices[device]++;
    });

    const total = Object.values(devices).reduce((a, b) => a + b, 0);

    return Object.entries(devices).map(([device, count]) => ({
        device,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
}

/**
 * Get new users count (registered in time range)
 */
export async function getNewUsersCount(
    firestore: Firestore,
    days: number = 30
): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
        const q = query(
            collection(firestore, 'users'),
            where('createdAt', '>=', Timestamp.fromDate(startDate))
        );
        const snap = await getDocs(q);
        return snap.size;
    } catch {
        return 0;
    }
}

/**
 * Get total counts for collections
 */
export async function getCollectionCount(
    firestore: Firestore,
    collectionName: string
): Promise<number> {
    try {
        const snap = await getDocs(collection(firestore, collectionName));
        return snap.size;
    } catch {
        return 0;
    }
}

/**
 * Get articles by status
 */
export async function getArticlesByStatus(
    firestore: Firestore
): Promise<{ published: number; draft: number; scheduled: number }> {
    try {
        const snap = await getDocs(collection(firestore, 'articles'));
        let published = 0, draft = 0, scheduled = 0;

        snap.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === 'published') published++;
            else if (data.status === 'draft') draft++;
            else if (data.status === 'scheduled') scheduled++;
            else published++; // Default to published for legacy articles
        });

        return { published, draft, scheduled };
    } catch {
        return { published: 0, draft: 0, scheduled: 0 };
    }
}
