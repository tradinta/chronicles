import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/'],
        },
        sitemap: 'https://the-chronicles.vercel.app/sitemap.xml',
    };
}
