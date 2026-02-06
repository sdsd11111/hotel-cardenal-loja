import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tours y Experiencias en Loja | Hotel El Cardenal Loja',
    description: 'Explore el Parque Nacional Podocarpus, el Eólico Villonaco y el centro histórico de Loja con nuestros tours guiados. Aventura y naturaleza en Ecuador.',
    openGraph: {
        title: 'Tours y Experiencias en Loja | Hotel El Cardenal Loja',
        description: 'Explore el Parque Podocarpus, el Eólico Villonaco y el centro histórico de Loja con nuestros tours guiados. Aventura y naturaleza.',
        url: 'https://hotelelcardenalloja.com/servicios/tours-experiencias',
        siteName: 'Hotel El Cardenal Loja',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Tours Hotel El Cardenal Loja',
            },
        ],
        locale: 'es_EC',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tours y Experiencias | Hotel El Cardenal Loja',
        description: 'Descubra Loja con nosotros: City Tour, Vilcabamba y Parque Nacional Podocarpus.',
        images: ['/logo.png'],
    },
};
