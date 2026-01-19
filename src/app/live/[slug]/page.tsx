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

    return {
        title: event.title,
        description: event.summary,
        openGraph: {
            title: event.title,
            description: event.summary,
            images: event.coverImage ? [event.coverImage] : [],
        }
    };
}

export default function Page({ params }: Props) {
    return <LiveRoomClientPage slug={params.slug} />;
}
