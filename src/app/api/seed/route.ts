
import { NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebase-server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
    const { firestore } = getFirebaseServer();

    try {
        const dummyAuthorId = "seed-admin";

        // 1. Standard Articles (Technology, Business, World)
        const standardArticles = [
            {
                title: "Quantum Computing Breakthrough: Security Implications",
                summary: "Scientists achieve new milestone in quantum coherence time, raising questions about current encryption standards.",
                slug: "quantum-computing-breakthrough",
                content: "<p>In a detailed report released today...</p><p>This marks a significant step forward...</p>",
                imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2600&auto=format&fit=crop",
                authorId: dummyAuthorId,
                category: "Technology",
                tags: ["Quantum", "Security", "Future"],
                status: "published",
                publishDate: serverTimestamp(),
                views: 120
            },
            {
                title: "Global Markets Rally on Renewable Energy Shifts",
                summary: "Major indices hit record highs as nations commit to accelerated green energy timelines.",
                slug: "global-markets-rally-renewable",
                content: "<p>The S&P 500 closed at a record high...</p><p>Investors are clearly signaling...</p>",
                imageUrl: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2574&auto=format&fit=crop",
                authorId: dummyAuthorId,
                category: "Business",
                tags: ["Markets", "Green Energy", "Economy"],
                status: "published",
                publishDate: serverTimestamp(),
                views: 85
            },
            {
                title: "Diplomatic Summit Concludes with Historic Accord",
                summary: "Leaders from 20 nations sign treating aiming to reduce ocean plastic by 90% within a decade.",
                slug: "historic-ocean-accord",
                content: "<p>After three days of intense negotiations...</p><p>The agreement outlines...</p>",
                imageUrl: "https://images.unsplash.com/photo-1516937941344-00b4ec277cd0?q=80&w=2524&auto=format&fit=crop",
                authorId: dummyAuthorId,
                category: "World",
                tags: ["Environment", "Politics", "Accord"],
                status: "published",
                publishDate: serverTimestamp(),
                views: 200
            }
        ];

        // 2. Editorial Articles (Opinion)
        const editorialArticles = [
            {
                title: "The Case for Digital Minimalism",
                summary: "Why stepping back from the connected world might be the best way to move forward.",
                slug: "case-for-digital-minimalism",
                content: "<p>We live in an age of constant notification...</p><p>The silence is where we find ourselves...</p>",
                imageUrl: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2668&auto=format&fit=crop",
                authorId: dummyAuthorId,
                category: "Opinion",
                tags: ["Lifestyle", "Tech", "Wellness"],
                status: "published",
                publishDate: serverTimestamp(),
                views: 45
            },
            {
                title: "Urban Planning in the Post-Car Era",
                summary: "Cities are redesigning themselves for people, not vehicles. Here is what that looks like.",
                slug: "urban-planning-post-car",
                content: "<p>The 15-minute city concept...</p><p>Imagine walking out your door...</p>",
                imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop",
                authorId: dummyAuthorId,
                category: "Opinion",
                tags: ["Urbanism", "Future", "Cities"],
                status: "published",
                publishDate: serverTimestamp(),
                views: 60
            },
            {
                title: "Why Mars Can Wait",
                summary: "We should focus on fixing Earth before we attempt to colonize the Red Planet.",
                slug: "why-mars-can-wait",
                content: "<p>The allure of space is undeniable...</p><p>However, the cost of terraforming...</p>",
                imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
                authorId: dummyAuthorId,
                category: "Opinion",
                tags: ["Space", "Climate", "Ethics"],
                status: "published",
                publishDate: serverTimestamp(),
                views: 110
            }
        ];

        // 3. Live Events
        const liveEvents = [
            {
                title: "SpaceX Starship Launch",
                slug: "spacex-starship-launch",
                summary: "Live coverage of the orbital flight test from Starbase, Texas.",
                status: "live",
                startTime: serverTimestamp(),
                authorId: dummyAuthorId,
                coverImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2670&auto=format&fit=crop"
            },
            {
                title: "Global Tech Keynote 2024",
                slug: "global-tech-keynote-2024",
                summary: "Unveiling the next generation of AI consumer hardware.",
                status: "upcoming",
                startTime: serverTimestamp(),
                authorId: dummyAuthorId,
                coverImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2612&auto=format&fit=crop"
            },
            {
                title: "Emergency Senate Hearing",
                slug: "emergency-senate-hearing",
                summary: "Senators gather to discuss critical infrastructure cybersecurity legislation.",
                status: "ended",
                startTime: serverTimestamp(),
                authorId: dummyAuthorId,
                coverImage: "https://images.unsplash.com/photo-1575314027874-4d5609635bbc?q=80&w=2574&auto=format&fit=crop"
            }
        ];

        // 4. Off the Record
        const offTheRecordPosts = [
            {
                content: "Sources inside the merger deal say it's off. No agreement on valuation.",
                mediaType: null,
                mediaUrl: null,
                isSensitive: false,
                authorId: dummyAuthorId,
                createdAt: serverTimestamp()
            },
            {
                content: "Spotted at the secret airfield. This looks like the new prototype drone.",
                mediaType: "image",
                mediaUrl: "https://images.unsplash.com/photo-1485546753034-75bf22838521?q=80&w=2574&auto=format&fit=crop",
                isSensitive: true,
                authorId: dummyAuthorId,
                createdAt: serverTimestamp()
            },
            {
                content: "||Redacted|| CEO was seen leaving the DOJ office late last night. ||Redacted|| confirmed investigation active.",
                mediaType: null,
                mediaUrl: null,
                isSensitive: false,
                authorId: dummyAuthorId,
                createdAt: serverTimestamp()
            }
            // Audio/Video logic requires valid Cloudinary URLs, skipping for seed to avoid broken links unless we have one.
        ];

        const batchPromises = [];

        // Add Standard Articles
        for (const article of standardArticles) {
            batchPromises.push(addDoc(collection(firestore, 'articles'), article));
        }

        // Add Editorial Articles
        for (const article of editorialArticles) {
            batchPromises.push(addDoc(collection(firestore, 'articles'), article));
        }

        // Add Live Events
        for (const event of liveEvents) {
            batchPromises.push(addDoc(collection(firestore, 'liveEvents'), event));
        }

        // Add Off The Record
        for (const post of offTheRecordPosts) {
            batchPromises.push(addDoc(collection(firestore, 'offTheRecord'), post));
        }

        await Promise.all(batchPromises);

        return NextResponse.json({ success: true, message: `Seeded ${batchPromises.length} items.` });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ success: false, error: 'Failed to seed database' }, { status: 500 });
    }
}
