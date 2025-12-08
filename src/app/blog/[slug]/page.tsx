import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export const dynamic = 'force-dynamic';

type Article = {
    id: string;
    slug: string;
    titulo: string;
    contenido: string;
    extracto: string;
    imagen_url: string;
    autor: string;
    categoria: string;
    tags: string;
    meta_description: string;
    palabra_clave: string;
    fecha_publicacion: string;
};

async function getArticle(slug: string): Promise<Article | null> {
    try {
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = process.env.VERCEL_URL || 'localhost:3000';
        const baseUrl = `${protocol}://${host}`;
        const apiUrl = `${baseUrl}/api/blog?slug=${slug}`;

        console.log(`DEBUG: Fetching Article from ${apiUrl}`);

        const res = await fetch(apiUrl, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`DEBUG: Failed to fetch. Status: ${res.status}`);
            return null;
        }

        const json = await res.json();

        if (json.success) {
            return json.data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        return { title: 'Artículo no encontrado' };
    }

    return {
        title: `${article.titulo} | Blog Hotel Puente Roto`,
        description: article.meta_description || article.extracto || article.titulo,
        keywords: article.tags ? article.tags + (article.palabra_clave ? `, ${article.palabra_clave}` : '') : article.palabra_clave,
        openGraph: {
            title: article.titulo,
            description: article.meta_description || article.extracto,
            images: article.imagen_url ? [article.imagen_url] : [],
            type: 'article',
            publishedTime: article.fecha_publicacion,
            authors: [article.autor || 'Hotel Puente Roto'],
            tags: article.tags ? article.tags.split(',').map(t => t.trim()) : [],
        },
    };
}

// Helper para traer artículos relacionados
async function getRelatedArticles(category: string, currentSlug: string): Promise<Article[]> {
    const apiUrl = process.env.CPANEL_BLOG_API_URL ||
        (process.env.CPANEL_API_URL ? process.env.CPANEL_API_URL.replace('api-platos.php', 'blog/blog_api.php') : null);

    if (!apiUrl) return [];

    try {
        // Pedimos artículos de la misma categoría
        const res = await fetch(`${apiUrl}?active=true&category=${encodeURIComponent(category)}`, {
            headers: { 'X-API-Key': process.env.PHP_API_KEY || '' },
            cache: 'no-store'
        });

        if (!res.ok) return [];
        const result = await res.json();
        const articles = result.success ? (result.data as Article[]) : [];

        // Filtramos para quitar el actual y limitamos a 3
        return articles
            .filter(a => a.slug !== currentSlug)
            .slice(0, 3);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    // Fetch related
    const relatedArticles = await getRelatedArticles(article.categoria, article.slug);
    const tagsList = article.tags ? article.tags.split(',').map(t => t.trim()) : [];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header className="bg-black/95" />

            <main className="flex-grow pt-32 pb-16">
                <article>
                    {/* Header Section */}
                    <div className="bg-gray-50 py-16 px-4 border-b border-gray-100">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6 flex-wrap">
                                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide">
                                    {article.categoria || 'Blog'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <time dateTime={article.fecha_publicacion}>
                                        {article.fecha_publicacion ? new Date(article.fecha_publicacion).toLocaleDateString('es-EC', { dateStyle: 'long' }) : ''}
                                    </time>
                                </div>
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{article.autor || 'Equipo Puente Roto'}</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 leading-tight mb-8">
                                {article.titulo}
                            </h1>

                            {article.extracto && (
                                <div className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8 italic font-serif">
                                    "{article.extracto}"
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
                        {article.imagen_url && (
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl mb-12 bg-gray-200">
                                <Image
                                    src={article.imagen_url}
                                    alt={article.titulo}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="max-w-3xl mx-auto px-4 pb-12">
                        <div className="prose prose-lg prose-amber max-w-none font-sans text-gray-700 leading-8">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h1: ({ node, ...props }) => <h2 className="font-playfair font-bold mt-8 mb-4" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="font-playfair font-bold mt-8 mb-4 text-3xl text-gray-900" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="font-playfair font-bold mt-6 mb-3 text-2xl text-gray-900" {...props} />,
                                    p: ({ node, ...props }) => <p className="mb-6 leading-relaxed" {...props} />,
                                    img: ({ node, ...props }) => <img className="rounded-lg shadow-lg my-8 w-full" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-amber-500 pl-4 italic my-6 bg-gray-50 py-2 pr-2 rounded-r" {...props} />,
                                }}
                            >
                                {article.contenido}
                            </ReactMarkdown>
                        </div>

                        {/* Tags Footer */}
                        {tagsList.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <Tag className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-bold text-gray-500 mr-2">Etiquetas:</span>
                                    {tagsList.map(tag => (
                                        <span key={tag} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm transition-colors cursor-default">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-16 text-center border-t border-gray-100 pt-10">
                            <Link
                                href="/blog"
                                className="inline-flex items-center text-amber-600 hover:text-amber-700 font-bold transition-colors border border-amber-200 hover:border-amber-400 px-6 py-3 rounded-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver a la lista de artículos
                            </Link>
                        </div>
                    </div>
                </article>

                {/* RELATED ARTICLES SECTION */}
                {relatedArticles.length > 0 && (
                    <div className="bg-gray-50 py-16 mt-8">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-8 text-center">
                                Artículos Relacionados
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedArticles.map(rel => (
                                    <Link
                                        key={rel.id}
                                        href={`/blog/${rel.slug}`}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
                                    >
                                        <div className="relative h-48 w-full">
                                            {rel.imagen_url ? (
                                                <Image
                                                    src={rel.imagen_url}
                                                    alt={rel.titulo}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">📷</div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-playfair font-bold text-xl mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                                                {rel.titulo}
                                            </h3>
                                            <p className="text-gray-500 text-sm line-clamp-2">{rel.extracto}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
