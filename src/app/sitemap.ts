import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://hotelelcardenalloja.com';
    const lastModified = new Date();

    const routes = [
        '',
        '/habitaciones',
        '/habitaciones/doble-twin',
        '/habitaciones/matrimonial',
        '/habitaciones/triple',
        '/habitaciones/familiar-loft',
        '/restaurante',
        '/eventos',
        '/servicios',
        '/galeria',
        '/blog',
        '/contacto',
        '/turismo-en-loja',
        '/privacidad',
        '/terminos',
        '/politica-datos',
        '/cookies',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified,
        changeFrequency: route === '' || route === '/blog' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : route.startsWith('/habitaciones') ? 0.9 : 0.7,
    }));
}
