import { getFirebaseServer } from '@/lib/firebase-server';
import { getLiveEventBySlug } from '@/firebase/firestore/live';
import { Metadata } from 'next';
import LiveRoomClientPage from '@/components/live-coverage/live-client-page';

type Props = {
    params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { firestore } = getFirebaseServer();
    const event = await getLiveEventBySlug(firestore, params.slug);

    if (!event) return { title: 'Event Not Found' };

    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';
    const url = `${SITE_URL}/live/${params.slug}`;
    const imageUrl = event.coverImage || `${SITE_URL}/logo.png`;

    return {
        title: event.title,
        description: event.summary,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: 'website',
            url: url,
            title: event.title,
            description: event.summary,
            siteName: 'The Chronicle',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: event.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: event.summary,
            images: [imageUrl],
            site: '@TheChronicle',
        }
    };
}

export default function Page({ params }: Props) {
    return <LiveRoomClientPage slug={params.slug} />;
}
