import { Metadata } from 'next';
import BlogClient from './BlogClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Blog | Hotel Puente Roto',
    description: 'Descubre noticias, guías y artículos sobre turismo, cultura y gastronomía en Cuenca, Ecuador.',
};

type Article = {
    id: string;
    slug: string;
    titulo: string;
    extracto: string;
    imagen_url: string;
    autor: string;
    categoria: string;
    fecha_publicacion: string;
    contenido: string;
};

async function getArticles() {
    // Definir la URL de la API: Prioridad variable entorno, fallback a construcción manual
    const apiUrl = process.env.CPANEL_BLOG_API_URL ||
        (process.env.CPANEL_API_URL ? process.env.CPANEL_API_URL.replace('api-platos.php', 'blog/blog_api.php') : null);

    if (!apiUrl) return [];

    try {
        // cache: 'no-store' asegura que siempre se obtenga la data fresca (Real-time)
        const res = await fetch(`${apiUrl}?active=true`, {
            headers: {
                'X-API-Key': process.env.PHP_API_KEY || ''
            },
            cache: 'no-store'
        });

        if (!res.ok) return [];

        const result = await res.json();
        return result.success ? result.data : [];
    } catch (e) {
        console.error('Error fetching articles:', e);
        return [];
    }
}

export default async function BlogPage() {
    const articles = await getArticles();

    return <BlogClient initialArticles={articles} />;
}
