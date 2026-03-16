import { getFirebaseServer } from '@/lib/firebase-server';
import { doc, getDoc } from 'firebase/firestore';
import { Metadata } from 'next';
import AuthorProfileClient from './author-client';

type Props = {
    params: Promise<{ id: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const { firestore } = getFirebaseServer();
    const userRef = doc(firestore, 'users', id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return { title: 'Author Not Found' };

    const author = userSnap.data();
    const name = author.displayName || author.name || 'The Chronicle Author';
    const bio = author.bio || `Explore investigative journalism and in-depth reporting from ${name} at The Chronicle.`;
    const image = author.profileImageUrl || 'https://thechronicle.news/logo.png';
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thechronicle.news';

    return {
        title: `${name} | The Chronicle`,
        description: bio,
        openGraph: {
            type: 'profile',
            title: `${name} | The Chronicle`,
            description: bio,
            images: [{
                url: image,
                width: 400,
                height: 400,
                alt: name,
            }],
        },
        twitter: {
            card: 'summary',
            title: `${name} | The Chronicle`,
            description: bio,
            images: [image],
        }
    };
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    const { firestore } = getFirebaseServer();
    const userRef = doc(firestore, 'users', id);
    const userSnap = await getDoc(userRef);
    
    const initialAuthor = userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Home',
                                item: SITE_URL,
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Authors',
                                item: `${SITE_URL}/authors`, // Assuming there's an authors list page or just a parent link
                            },
                            {
                                '@type': 'ListItem',
                                position: 3,
                                name: name,
                                item: `${SITE_URL}/author/${id}`,
                            },
                        ],
                    }),
                }}
            />
            <AuthorProfileClient authorId={id} initialAuthor={initialAuthor} />
        </>
    );
}
