import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Galería | Hotel El Cardenal Loja',
    description: 'Explore nuestra galería de imágenes. Descubra las habitaciones, restaurante, spa, eventos y la belleza de Loja que rodea nuestro hotel premium.',
    openGraph: {
        title: 'Galería | Hotel El Cardenal Loja',
        description: 'Explore nuestra galería de imágenes. Descubra las habitaciones, restaurante, spa, eventos y la belleza de Loja.',
        url: 'https://hotelelcardenalloja.com/galeria',
        siteName: 'Hotel El Cardenal Loja',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Galería Hotel El Cardenal Loja',
            },
        ],
        locale: 'es_EC',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Galería de Fotos | Hotel El Cardenal Loja',
        description: 'Explore nuestras instalaciones: habitaciones, restaurante y áreas sociales.',
        images: ['/logo.png'],
    },
};
