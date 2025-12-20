import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Piscina Climatizada y Spa | Hotel El Cardenal Loja',
    description: 'Relájese en nuestra piscina panorámica climatizada y spa. Masajes, hidromasaje y vistas espectaculares de las montañas de Loja.',
    openGraph: {
        title: 'Piscina Climatizada y Spa | Hotel El Cardenal Loja',
        description: 'Relájese en nuestra piscina panorámica climatizada y spa. Masajes, hidromasaje y vistas espectaculares.',
        url: 'https://hotelelcardenalloja.com/servicios/piscina',
        siteName: 'Hotel El Cardenal Loja',
        images: [
            {
                url: '/logo.jpg',
                width: 1200,
                height: 630,
                alt: 'Piscina y Spa Hotel El Cardenal Loja',
            },
        ],
        locale: 'es_EC',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Piscina Climatizada y Spa | Hotel El Cardenal Loja',
        description: 'Piscina panorámica climatizada, spa, masajes y vistas espectaculares.',
        images: ['/logo.jpg'],
    },
};
