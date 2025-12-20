import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Servicios Premium | Hotel El Cardenal Loja',
    description: 'Descubra nuestros servicios exclusivos: restaurante gourmet, spa, piscina climatizada, salas de eventos y tours guiados por Loja y el Parque Nacional Podocarpus.',
    openGraph: {
        title: 'Servicios Premium | Hotel El Cardenal Loja',
        description: 'Descubra nuestros servicios exclusivos: restaurante gourmet, spa, piscina climatizada, salas de eventos y tours guiados.',
        url: 'https://hotelelcardenalloja.com/servicios',
        siteName: 'Hotel El Cardenal Loja',
        images: [
            {
                url: '/logo.jpg',
                width: 1200,
                height: 630,
                alt: 'Servicios Hotel El Cardenal Loja',
            },
        ],
        locale: 'es_EC',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Servicios Premium | Hotel El Cardenal Loja',
        description: 'Restaurante gourmet, spa, piscina climatizada, eventos y tours guiados.',
        images: ['/logo.jpg'],
    },
};
