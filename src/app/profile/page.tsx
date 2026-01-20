import type { Metadata } from 'next';
import ProfileClient from './profile-client';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

export const metadata: Metadata = {
    title: 'My Profile | The Chronicle',
    description: 'Manage your account, bookmarks, and settings.',
    alternates: {
        canonical: '/profile',
    },
    openGraph: {
        type: 'website',
        url: `${SITE_URL}/profile`,
        title: 'My Profile | The Chronicle',
        description: 'Manage your personal dashboard and bookmarks.',
        siteName: 'The Chronicle',
        images: [{ url: `${SITE_URL}/logo.png`, width: 1200, height: 630, alt: 'The Chronicle Profile' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'My Profile | The Chronicle',
        description: 'Manage your personal dashboard and bookmarks.',
        images: [`${SITE_URL}/logo.png`],
    },
    robots: {
        index: false, // Profile pages should generally not be indexed
        follow: false,
    },
};

export default function ProfilePage() {
    return <ProfileClient />;
}
