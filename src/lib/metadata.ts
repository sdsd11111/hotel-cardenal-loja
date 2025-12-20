import { Metadata } from 'next';

interface PageMetadataProps {
    title: string;
    description: string;
    path?: string;
    image?: string;
}

export function generatePageMetadata({
    title,
    description,
    path = '',
    image = '/Logo.png'
}: PageMetadataProps): Metadata {
    const baseUrl = 'https://hotelloja.com';
    const fullUrl = `${baseUrl}${path}`;

    return {
        title: `${title} | Hotel El Cardenal Loja`,
        description,
        openGraph: {
            title: `${title} | Hotel El Cardenal Loja`,
            description,
            url: fullUrl,
            siteName: 'Hotel El Cardenal Loja',
            images: [
                {
                    url: image === '/Logo.png' ? '/logo.jpg' : image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'es_EC',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Hotel El Cardenal Loja`,
            description,
            images: [image === '/Logo.png' ? '/logo.jpg' : image],
        },
    };
}
