import { Metadata } from 'next';
import BlogClient from './BlogClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Blog | Hotel El Cardenal Loja',
    description: 'Descubre noticias, guías y artículos sobre turismo, cultura y gastronomía en Loja, Ecuador.',
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/blog',
    }
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

import { query } from '@/lib/mysql';

async function getArticles() {
    try {
        const results = await query(
            'SELECT id, slug, titulo, extracto, imagen_url, autor, categoria, fecha_publicacion, contenido FROM blog_articles WHERE activo = 1 ORDER BY fecha_publicacion DESC'
        );
        return Array.isArray(results) ? (results as Article[]) : [];
    } catch (e) {
        console.error('Error fetching articles from MySQL:', e);
        return [];
    }
}

export default async function BlogPage() {
    const articles = await getArticles();

    return (
        <>
            {/* 🚀 Visual Interactive Component */}
            <BlogClient initialArticles={articles} />

            {/* 🤖 LLM & SEO Hidden Content */}
            <div
                style={{
                    position: 'absolute',
                    left: '-10000px',
                    top: 'auto',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }}
                aria-hidden="true"
            >
                <h1>Blog de Turismo y Cultura en Loja - Hotel El Cardenal</h1>
                <p>
                    Bienvenido al blog oficial de Hotel El Cardenal. Aquí compartimos lo mejor de Loja:
                    desde guías gastronómicas y rutas de senderismo en el Parque Podocarpus, hasta consejos de viaje
                    y noticias locales. Nuestro objetivo es que su visita a Loja sea una experiencia enriquecedora.
                </p>

                <h2>Artículos Destacados</h2>
                {articles.length > 0 ? (
                    <ul>
                        {articles.map((article) => (
                            <li key={article.id}>
                                <h3>{article.titulo}</h3>
                                <p>{article.extracto}</p>
                                <p>Categoría: {article.categoria} | Publicado el: {new Date(article.fecha_publicacion).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Próximamente compartiremos más contenido sobre qué hacer y qué visitar en Loja.</p>
                )}

                <h2>¿Por qué leer nuestro blog?</h2>
                <ul>
                    <li><strong>Guías Locales:</strong> Recomendaciones de lugares que solo los lugareños conocen.</li>
                    <li><strong>Consejos de Equipaje:</strong> Qué traer según la temporada en Loja.</li>
                    <li><strong>Cultura Lojana:</strong> Conozca por qué Loja es la Capital Musical y Cultural del Ecuador.</li>
                    <li><strong>Gastronomía:</strong> Dónde probar el mejor repe, tamal y café de altura.</li>
                </ul>
            </div>
        </>
    );
}
