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

import { query } from '@/lib/mysql';

async function getArticle(slug: string): Promise<Article | null> {
    try {
        const results = await query(
            'SELECT * FROM blog_articles WHERE slug = ? AND activo = 1 LIMIT 1',
            [slug]
        );

        const articles = results as Article[];
        return articles.length > 0 ? articles[0] : null;
    } catch (error) {
        console.error('Error fetching article from MySQL:', error);
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
        title: `${article.titulo} | Blog Hotel El Cardenal Loja`,
        description: article.meta_description || article.extracto || article.titulo,
        keywords: article.tags ? article.tags + (article.palabra_clave ? `, ${article.palabra_clave}` : '') : article.palabra_clave,
        openGraph: {
            title: article.titulo,
            description: article.meta_description || article.extracto,
            images: article.imagen_url ? [article.imagen_url] : [],
            type: 'article',
            publishedTime: article.fecha_publicacion,
            authors: [article.autor || 'Hotel El Cardenal Loja'],
            tags: article.tags ? article.tags.split(',').map(t => t.trim()) : [],
        },
    };
}

// Helper para traer artículos relacionados
async function getRelatedArticles(category: string, currentSlug: string): Promise<Article[]> {
    try {
        const results = await query(
            'SELECT * FROM blog_articles WHERE categoria = ? AND slug != ? AND activo = 1 LIMIT 3',
            [category, currentSlug]
        );

        return results as Article[];
    } catch (e) {
        console.error('Error fetching related articles from MySQL:', e);
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
    const tagsList = article.tags ? Array.from(new Set(article.tags.split(',').map(t => t.trim()))) : [];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
            <Header forceDarkText={true} />

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
                                    <span>{article.autor || 'Equipo El Cardenal'}</span>
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
                        <div className="prose prose-lg prose-amber max-w-none font-sans text-gray-700 leading-8 break-words overflow-hidden">
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
            {/* 📊 Structured Data (JSON-LD) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": article.titulo,
                        "description": article.meta_description || article.extracto,
                        "image": article.imagen_url,
                        "datePublished": article.fecha_publicacion,
                        "author": {
                            "@type": "Organization",
                            "name": article.autor || "Hotel El Cardenal Loja",
                            "url": "https://hotelelcardenalloja.com"
                        },
                        "publisher": {
                            "@type": "Hotel",
                            "name": "Hotel El Cardenal Loja",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://hotelelcardenalloja.com/logo.jpg"
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://hotelelcardenalloja.com/blog/${article.slug}`
                        }
                    })
                }}
            />
        </div>
    );
}
