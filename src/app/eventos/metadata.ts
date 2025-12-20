import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Salas de Eventos y Convenciones | Hotel El Cardenal Loja',
    description: 'Organice su evento corporativo, conferencia o celebración en nuestras salas equipadas con tecnología de punta. Capacidad hasta 200 personas.',
    openGraph: {
        title: 'Salas de Eventos y Convenciones | Hotel El Cardenal Loja',
        description: 'Organice su evento corporativo, conferencia o celebración. Salas equipadas con tecnología de punta.',
        url: 'https://hotelelcardenalloja.com/eventos',
        siteName: 'Hotel El Cardenal Loja',
        images: [
            {
                url: '/logo.jpg',
                width: 1200,
                height: 630,
                alt: 'Eventos Hotel El Cardenal Loja',
            },
        ],
        locale: 'es_EC',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Salas de Eventos y Convenciones | Hotel El Cardenal Loja',
        description: 'Eventos corporativos, conferencias y celebraciones con tecnología de punta.',
        images: ['/logo.jpg'],
    },
};
