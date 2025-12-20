import { Metadata } from 'next';
import BlogClient from '../../BlogClient';
import { query } from '@/lib/mysql';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

// SEO Data Configuration
const categorySEO: Record<string, { title: string, description: string, keywords: string[], realCategory: string }> = {
    'nuestro-hotel': {
        title: 'Nuestro Hotel El Cardenal Loja | Historia y Servicios',
        description: 'Conozca la propuesta de valor de Hotel El Cardenal: arquitectura neoclásica, seguridad del huésped, parking privado y hospitalidad familiar en Loja.',
        keywords: ['Hotel familiar en Loja', 'alojamiento seguro', 'hotel boutique Loja', 'historia Hotel El Cardenal', 'habitación loft Loja'],
        realCategory: 'Nuestro Hotel'
    },
    'que-comer-en-loja': {
        title: 'Qué Comer en Loja | Guía Gastronómica y Café',
        description: 'Guía gastronómica de la Centinela del Sur. Descubra los mejores platos típicos: tamales, humitas, repe lojano y el mejor café de altura en Loja.',
        keywords: ['Comida típica de Loja', 'mejor café de Ecuador', 'desayunos tradicionales', 'gastronomía lojana', 'dónde comer en Loja'],
        realCategory: 'Qué comer en Loja'
    },
    'eventos-en-loja': {
        title: 'Eventos en Loja | Agenda Cultural y Festividades',
        description: 'Información actualizada sobre la agenda cultural de Loja: Festival de Artes Vivas, Feria de Loja, Romería del Cisne y eventos corporativos.',
        keywords: ['Festival de Artes Vivas Loja', 'agenda cultural Loja', 'eventos corporativos', 'fiestas de Loja', 'ferias en Loja'],
        realCategory: 'Eventos en Loja'
    },
    'tours-de-loja': {
        title: 'Tours de Loja y Turismo | Podocarpus y Vilcabamba',
        description: 'Guías de viaje desde Hotel El Cardenal: Senderismo en Podocarpus, visita a Vilcabamba, Parque Jipiro y rutas por el centro histórico de Loja.',
        keywords: ['Turismo en Loja', 'tours desde Loja', 'visitar Vilcabamba', 'Parque Nacional Podocarpus', 'guía de viajes Loja Ecuador'],
        realCategory: 'Tours de Loja'
    }
};

type Props = {
    params: { slug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const seo = categorySEO[params.slug];

    if (!seo) {
        return {
            title: 'Categoría no encontrada | Hotel El Cardenal',
            description: 'Explora nuestros artículos de blog.'
        };
    }

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.title,
            description: seo.description,
            type: 'website',
            locale: 'es_EC',
        }
    };
}

async function getArticlesByCategory(category: string) {
    try {
        const results = await query(
            'SELECT id, slug, titulo, extracto, imagen_url, autor, categoria, fecha_publicacion, contenido FROM blog_articles WHERE activo = 1 AND categoria = ? ORDER BY fecha_publicacion DESC',
            [category]
        );
        return Array.isArray(results) ? (results as Article[]) : [];
    } catch (e) {
        console.error('Error fetching articles from MySQL:', e);
        return [];
    }
}

async function getAllArticles() {
    try {
        const results = await query(
            'SELECT id, slug, titulo, extracto, imagen_url, autor, categoria, fecha_publicacion, contenido FROM blog_articles WHERE activo = 1 ORDER BY fecha_publicacion DESC'
        );
        return Array.isArray(results) ? (results as Article[]) : [];
    } catch (e) {
        console.error('Error fetching all articles:', e);
        return [];
    }
}


export default async function CategoryPage({ params }: Props) {
    const seo = categorySEO[params.slug];

    if (!seo) {
        notFound();
    }

    // We fetch ALL articles to allow the client to switch categories if they want (or we could fetch only filtered)
    // But 'BlogClient' expects 'initialArticles'. 
    // If we want the client to START filtered but be able to see others, we should pass all.
    // However, if we filter on server, the client will only show these.
    // The user requirement is usually to filter. 
    // Let's pass ALL articles but tell BlogClient which category is active.

    const allArticles = await getAllArticles();

    return <BlogClient initialArticles={allArticles} initialCategory={seo.realCategory} />;
}
