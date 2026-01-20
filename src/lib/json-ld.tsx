import { DocumentData } from 'firebase/firestore';

export interface JsonLdNewsArticle {
    "@context": string;
    "@type": string;
    headline: string;
    description: string;
    image: string[];
    datePublished: string;
    dateModified?: string;
    author: {
        "@type": string;
        name: string;
        url?: string;
    }[];
    publisher: {
        "@type": string;
        name: string;
        logo: {
            "@type": string;
            url: string;
        };
    };
    mainEntityOfPage: {
        "@type": string;
        "@id": string;
    };
}

export function generateNewsArticleJsonLd(
    article: DocumentData,
    authorName: string,
    siteUrl: string
): JsonLdNewsArticle {
    const publishDate = article.publishDate?.toDate?.()
        ? article.publishDate.toDate().toISOString()
        : new Date().toISOString();

    const modifiedDate = article.lastUpdated?.toDate?.()
        ? article.lastUpdated.toDate().toISOString()
        : publishDate;

    return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title || "Untitled",
        description: article.summary || "",
        image: article.imageUrl ? [article.imageUrl] : [],
        datePublished: publishDate,
        dateModified: modifiedDate,
        author: [
            {
                "@type": "Person",
                name: authorName || "The Chronicle Staff",
                url: `${siteUrl}/author/${article.authorId}`,
            }
        ],
        publisher: {
            "@type": "Organization",
            name: "The Chronicle",
            logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo.png`,
            }
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteUrl}/article/${article.slug || article.id}`,
        }
    };
}

/**
 * React component to inject JSON-LD into the page head.
 * Usage: <JsonLdScript data={generateNewsArticleJsonLd(...)} />
 */
export function JsonLdScript({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
