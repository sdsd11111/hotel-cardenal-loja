'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

type Article = {
    id: string;
    slug: string;
    titulo: string;
    extracto: string;
    imagen_url: string;
    autor: string;
    categoria: string;
    fecha_publicacion: string;
    contenido: string; // Needed for search
};

export default function BlogClient({ initialArticles, initialCategory = 'Todas' }: { initialArticles: Article[], initialCategory?: string }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Categories (Static as requested)
    const categories = ['Todas', 'Nuestro Hotel', 'Qué comer en Loja', 'Eventos en Loja', 'Tours de Loja'];

    // Filter articles
    const filteredArticles = useMemo(() => {
        return initialArticles.filter(article => {
            const matchesSearch = (
                article.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.contenido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.extracto?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesCategory = selectedCategory === 'Todas' || article.categoria === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [initialArticles, searchTerm, selectedCategory]);

    // Recent Articles (Sorted by date DESC, take 3)
    const recentArticles = useMemo(() => {
        return [...initialArticles]
            .sort((a, b) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime())
            .slice(0, 3);
    }, [initialArticles]);

    // Auto-slide logic
    useEffect(() => {
        if (recentArticles.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % recentArticles.length);
        }, 5000); // 5 seconds
        return () => clearInterval(interval);
    }, [recentArticles.length]);

    const nextSlide = () => setCurrentSlide(prev => (prev + 1) % recentArticles.length);
    const prevSlide = () => setCurrentSlide(prev => (prev - 1 + recentArticles.length) % recentArticles.length);

    return (
        <div className="min-h-screen bg-cardenal-cream flex flex-col">
            <Header />

            {/* HERO SECTION (Fullscreen) */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden p-0 m-0">
                {/* Background Image */}
                <Image
                    src="/images/contacto/blog-hero.webp?v=2"
                    alt="Blog y Novedades de Loja - Hotel El Cardenal"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 z-0"></div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
                    <span className="text-cardenal-gold font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-6 block drop-shadow-md">
                        Explora Nuestro Contenido
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-xl">
                        Blog & Novedades
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                        Historias, guías y secretos de Loja para hacer tu estadía inolvidable.
                    </p>
                </div>
            </section>

            <main className="flex-grow pb-16 px-4 bg-cardenal-cream relative z-10 -mt-10 rounded-t-[3rem] shadow-2xl border-t border-white/20">
                <div className="max-w-7xl mx-auto pt-16">

                    {/* SEARCH & FILTERS */}
                    <div className="mb-20 space-y-8">
                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-gray-400 group-focus-within:text-cardenal-green transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-16 pr-6 py-5 rounded-full bg-white border-none shadow-lg text-text-main placeholder-gray-400 focus:ring-4 focus:ring-cardenal-green/20 focus:outline-none transition-all text-lg"
                                placeholder="Buscar artículos por título, contenido o categoría..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Buttons */}
                        <div className="flex flex-wrap justify-center gap-3">
                            <div className="text-center w-full mb-2 text-gray-400 text-sm font-semibold uppercase tracking-wider">
                                Filtrar por Categoría
                            </div>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedCategory === cat
                                        ? 'bg-cardenal-green text-white shadow-md transform scale-105'
                                        : 'bg-white text-text-muted hover:bg-cardenal-cream hover:text-cardenal-green shadow-sm border border-cardenal-sand'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ARTICLE GRID */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-serif font-bold text-center text-text-main mb-12 relative inline-block w-full">
                            <span className="relative z-10 bg-cardenal-cream px-4">Todos los Artículos</span>
                            <div className="absolute top-1/2 left-0 w-full h-px bg-cardenal-sand -z-0"></div>
                        </h2>

                        {filteredArticles.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">No se encontraron artículos con esos criterios.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredArticles.map((article) => (
                                    <Link
                                        href={`/blog/${article.slug}`}
                                        key={article.id}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full border border-cardenal-sand hover/-translate-y-2"
                                    >
                                        <div className="relative h-64 w-full overflow-hidden">
                                            {article.imagen_url ? (
                                                <Image
                                                    src={article.imagen_url}
                                                    alt={article.titulo}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                                    <span className="text-4xl">📷</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-cardenal-green shadow-sm">
                                                {article.categoria || 'General'}
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col flex-grow">
                                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-medium uppercase tracking-wide">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <time dateTime={article.fecha_publicacion}>
                                                        {article.fecha_publicacion ? new Date(article.fecha_publicacion).toLocaleDateString('es-EC', { dateStyle: 'medium' }) : ''}
                                                    </time>
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-serif font-bold text-text-main mb-4 group-hover:text-cardenal-green transition-colors leading-tight">
                                                {article.titulo}
                                            </h3>

                                            <p className="text-gray-600 mb-6 line-clamp-3 text-base leading-relaxed flex-grow">
                                                {article.extracto || 'Lee el artículo completo para descubrir más...'}
                                            </p>

                                            <div className="mt-auto flex items-center text-cardenal-green font-bold text-sm tracking-wider uppercase group/link">
                                                Leer Artículo
                                                <ArrowRight className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RECENT ARTICLES SLIDER */}
                    {recentArticles.length > 0 && (
                        <div className="mb-20 pt-10 border-t border-cardenal-sand">
                            <h2 className="text-3xl font-serif font-bold text-text-main mb-10 text-center">
                                Artículos Recientes
                            </h2>

                            <div className="relative max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[400px]">
                                <div className="absolute top-4 right-4 z-20 flex gap-2">
                                    <button onClick={prevSlide} className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button onClick={nextSlide} className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Slider Content using currentSlide index */}
                                {recentArticles.map((article, index) => (
                                    <div
                                        key={article.id}
                                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                            }`}
                                    >
                                        <div className="flex flex-col md:flex-row h-full">
                                            {/* Image Side */}
                                            <div className="w-full md:w-1/2 relative h-48 md:h-full shrink-0">
                                                {article.imagen_url ? (
                                                    <Image
                                                        src={article.imagen_url}
                                                        alt={article.titulo}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent"></div>
                                            </div>

                                            {/* Content Side */}
                                            <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-cardenal-green-dark text-white flex-grow">
                                                <div className="bg-cardenal-gold text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full self-start mb-3 md:mb-6 uppercase tracking-wider">
                                                    NUEVO
                                                </div>
                                                <h3 className="text-xl md:text-4xl font-serif font-bold mb-3 md:mb-6 leading-tight line-clamp-2 md:line-clamp-none text-cardenal-gold">
                                                    {article.titulo}
                                                </h3>
                                                <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-8 line-clamp-2 md:line-clamp-3">
                                                    {article.extracto}
                                                </p>
                                                <Link
                                                    href={`/blog/${article.slug}`}
                                                    className="inline-flex items-center text-white border border-cardenal-gold/30 hover:bg-cardenal-gold hover:text-white px-4 py-2 md:px-8 md:py-3 text-sm md:text-base rounded-lg transition-all duration-300 self-start mt-auto md:mt-0 font-bold uppercase tracking-widest"
                                                >
                                                    Leer Ahora
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Dots Indicators */}
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                                    {recentArticles.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-cardenal-gold w-8' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}
