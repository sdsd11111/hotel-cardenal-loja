import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://hotelelcardenalloja.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/login/'],
            },
            // LLM specific rules to ensure visibility
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Bot', 'ClaudeWeb', 'Google-Extended', 'CCBot', 'PerplexityBot', 'FacebookBot'],
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
