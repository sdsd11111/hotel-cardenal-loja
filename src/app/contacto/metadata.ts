import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contacto | Hotel El Cardenal Loja',
    description: 'Contáctenos para reservas, consultas o solicitudes especiales. Atención personalizada 24/7. Teléfono: (07) 2570-888 | Email: recepción@hotelelcardenalloja.com',
    openGraph: {
        title: 'Contacto | Hotel El Cardenal Loja',
        description: 'Contáctenos para reservas, consultas o solicitudes especiales. Atención personalizada 24/7.',
        url: 'https://hotelelcardenalloja.com/contacto',
        siteName: 'Hotel El Cardenal Loja',
        images: [
            {
                url: '/logo.jpg',
                width: 1200,
                height: 630,
                alt: 'Contacto Hotel El Cardenal Loja',
            },
        ],
        locale: 'es_EC',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contacto | Hotel El Cardenal Loja',
        description: 'Contáctenos para reservas, consultas o solicitudes especiales. Atención 24/7.',
        images: ['/logo.jpg'],
    },
};
