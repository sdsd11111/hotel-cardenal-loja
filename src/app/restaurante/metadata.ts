import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Restaurante Gourmet | Hotel El Cardenal Loja',
    description: 'Disfrute de nuestra cocina fusión de autor, menú ejecutivo y desayuno buffet. Experiencia gastronómica premium en el corazón de Loja.',
    openGraph: {
        title: 'Restaurante Gourmet | Hotel El Cardenal Loja',
        description: 'Disfrute de nuestra cocina fusión de autor, menú ejecutivo y desayuno buffet. Experiencia gastronómica premium.',
        url: 'https://hotelelcardenalloja.com/restaurante',
        siteName: 'Hotel El Cardenal Loja',
        images: [
            {
                url: '/logo.jpg',
                width: 1200,
                height: 630,
                alt: 'Restaurante Hotel El Cardenal Loja',
            },
        ],
        locale: 'es_EC',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Restaurante Gourmet | Hotel El Cardenal Loja',
        description: 'Cocina fusión de autor, menú ejecutivo y desayuno buffet premium.',
        images: ['/logo.jpg'],
    },
};
