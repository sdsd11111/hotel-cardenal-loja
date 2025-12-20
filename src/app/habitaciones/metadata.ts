import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Habitaciones Premium | Hotel El Cardenal Loja',
    description: 'Descubra nuestras habitaciones de lujo en Loja. Suites ejecutivas, presidenciales y habitaciones familiares con todas las comodidades. Reserve con el mejor precio garantizado.',
    openGraph: {
        title: 'Habitaciones Premium | Hotel El Cardenal Loja',
        description: 'Descubra nuestras habitaciones de lujo en Loja. Suites ejecutivas, presidenciales y habitaciones familiares con todas las comodidades.',
        url: 'https://hotelelcardenalloja.com/habitaciones',
        siteName: 'Hotel El Cardenal Loja',
        images: [
            {
                url: '/logo.jpg',
                width: 1200,
                height: 630,
                alt: 'Habitaciones Hotel El Cardenal Loja',
            },
        ],
        locale: 'es_EC',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Habitaciones Premium | Hotel El Cardenal Loja',
        description: 'Descubra nuestras habitaciones de lujo en Loja. Suites ejecutivas, presidenciales y habitaciones familiares.',
        images: ['/logo.jpg'],
    },
};
