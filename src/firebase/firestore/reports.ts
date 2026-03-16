import { Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type ReportType = 'article' | 'comment' | 'live-event' | 'live-update' | 'off-the-record';

export interface ReportData {
    type: ReportType;
    contentId: string;
    parentEventId?: string; // For live-update
    contentPreview: string;
    reason: string;
    description?: string;
    reportedBy: string;
    status: 'pending' | 'reviewed' | 'dismissed';
}

/**
 * Submits a new report to the moderation queue.
 */
export async function submitReport(firestore: Firestore, data: Omit<ReportData, 'status'>) {
    return addDoc(collection(firestore, 'reports'), {
        ...data,
        status: 'pending',
        reportedAt: serverTimestamp()
    });
}
