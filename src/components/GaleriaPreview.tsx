'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

// SEO Optimized Gallery Images - 9 images in 3x3 grid
const galeriaImagenes = [
    // I. Habitaciones (4 Imágenes) - Row 1 & part of Row 2
    {
        id: 1,
        categoria: 'HABITACIONES',
        url: '/images/galeria/galeria-1.webp?v=2',
        titulo: 'Familiar Loft',
        alt: 'Familiar Loft - Espacio de dos niveles diseñado para la comodidad de toda la familia en Hotel El Cardenal Loja'
    },
    {
        id: 2,
        categoria: 'HABITACIONES',
        url: '/images/galeria/galeria-2.webp?v=2',
        titulo: 'Matrimonial',
        alt: 'Habitación Matrimonial - El rincón más íntimo y elegante para un descanso en pareja en Hotel El Cardenal'
    },
    {
        id: 3,
        categoria: 'HABITACIONES',
        url: '/images/galeria/galeria-3.webp?v=2',
        titulo: 'Habitación Triple',
        alt: 'Habitación Triple - Versatilidad y confort para grupos que buscan un refugio tranquilo en Loja'
    },
    {
        id: 4,
        categoria: 'HABITACIONES',
        url: '/images/galeria/galeria-4.webp?v=2',
        titulo: 'Doble Twin',
        alt: 'Doble Twin - Funcionalidad neoclásica ideal para viajeros de negocios y turismo en Loja'
    },
    // II. Espacios y Detalles (2 Imágenes) - Part of Row 2
    {
        id: 5,
        categoria: 'ESPACIOS',
        url: '/images/galeria/galeria-5.webp?v=2',
        titulo: 'Arquitectura Neoclásica',
        alt: 'Arquitectura Neoclásica - Detalles en piedra volcánica y madera que narran la historia de nuestra casa en Loja'
    },
    {
        id: 6,
        categoria: 'ESPACIOS',
        url: '/images/galeria/galeria-6.webp?v=2',
        titulo: 'Salón de la Romería',
        alt: 'Salón de la Romería - Un espacio de arte y cultura con muebles Zuleta y esencia lojana'
    },
    // III. Restaurante y Sabores (2 Imágenes) - Row 3
    {
        id: 7,
        categoria: 'RESTAURANTE',
        url: '/images/galeria/galeria-7.webp?v=2',
        titulo: 'Desayuno Casero',
        alt: 'Desayuno Casero - El aroma del café lojano y sabores auténticos para empezar su día en Hotel El Cardenal'
    },
    {
        id: 8,
        categoria: 'RESTAURANTE',
        url: '/images/galeria/galeria-8.webp?v=2',
        titulo: 'Nuestro Comedor',
        alt: 'Nuestro Comedor - Calidez familiar y atención personalizada en cada detalle gastronómico'
    },
    // IV. Eventos y Reuniones (1 Imagen) - Row 3
    {
        id: 9,
        categoria: 'EVENTOS',
        url: '/images/galeria/galeria-9.webp?v=2',
        titulo: 'Eventos Íntimos',
        alt: 'Eventos Íntimos - El escenario perfecto para celebraciones y reuniones corporativas exclusivas en Loja'
    }
];

export const GaleriaPreview = () => {
    const [imagenSeleccionada, setImagenSeleccionada] = useState<number | null>(null);

    // Navegación del lightbox
    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (imagenSeleccionada !== null) {
            const currentIndex = galeriaImagenes.findIndex(img => img.id === imagenSeleccionada);
            const prevIndex = currentIndex === 0 ? galeriaImagenes.length - 1 : currentIndex - 1;
            setImagenSeleccionada(galeriaImagenes[prevIndex].id);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (imagenSeleccionada !== null) {
            const currentIndex = galeriaImagenes.findIndex(img => img.id === imagenSeleccionada);
            const nextIndex = currentIndex === galeriaImagenes.length - 1 ? 0 : currentIndex + 1;
            setImagenSeleccionada(galeriaImagenes[nextIndex].id);
        }
    };

    const closeLightbox = () => {
        setImagenSeleccionada(null);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (imagenSeleccionada === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') handlePrevImage(e as unknown as React.MouseEvent);
            if (e.key === 'ArrowRight') handleNextImage(e as unknown as React.MouseEvent);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [imagenSeleccionada]);

    const imagenActual = galeriaImagenes.find(img => img.id === imagenSeleccionada);

    return (
        <section className="py-24 bg-cardenal-cream/50 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-cardenal-gold/5 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cardenal-green/5 translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header - SEO Optimized */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <div className="inline-block mb-6">
                        <span className="text-cardenal-gold font-bold text-xs uppercase tracking-[0.3em] bg-cardenal-gold/10 px-6 py-3 font-serif">
                            Galería de Experiencias
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-cardenal-green mb-6 font-serif leading-tight">
                        Tu Refugio Familiar en el Corazón de Loja
                    </h2>
                    <h3 className="text-xl md:text-2xl text-cardenal-gold font-script italic leading-relaxed">
                        Un entorno de paz, historia y naturaleza diseñado para su descanso.
                    </h3>
                    <div className="w-24 h-1.5 bg-cardenal-gold mx-auto mt-8"></div>
                </div>

                {/* 3x3 Image Grid */}
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {galeriaImagenes.map((imagen) => (
                            <button
                                key={imagen.id}
                                onClick={() => setImagenSeleccionada(imagen.id)}
                                className="group relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-cardenal-gold/50"
                            >
                                <div className="relative aspect-square">
                                    <Image
                                        src={imagen.url}
                                        alt={imagen.alt}
                                        fill
                                        loading="lazy"
                                        className="object-cover transition-transform duration-1000 group-hover:scale-125"
                                        unoptimized
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                    {/* Zoom Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="bg-cardenal-green/80 backdrop-blur-md p-4 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <ZoomIn className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    {/* Title and Category Badge */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-white font-bold text-sm md:text-base font-serif mb-1">{imagen.titulo}</p>
                                        <span className="inline-block bg-cardenal-gold text-white font-bold text-[10px] px-3 py-1 uppercase tracking-widest">
                                            {imagen.categoria}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-16">
                    <Link
                        href="/galeria"
                        className="inline-flex items-center gap-3 bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-5 px-10 transition-all duration-500 shadow-xl font-serif tracking-widest text-sm group"
                    >
                        VER GALERÍA COMPLETA
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                </div>
            </div>

            {/* Lightbox Modal */}
            {imagenActual && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-6 right-6 text-white hover:text-cardenal-gold transition-colors p-3 bg-cardenal-green hover:bg-cardenal-gold/20 z-10"
                        onClick={closeLightbox}
                        aria-label="Cerrar"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Previous Button */}
                    <button
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-cardenal-gold transition-all p-4 bg-cardenal-green/50 hover:bg-cardenal-green hover:scale-110 z-10"
                        onClick={handlePrevImage}
                        aria-label="Imagen anterior"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    {/* Next Button */}
                    <button
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-cardenal-gold transition-all p-4 bg-cardenal-green/50 hover:bg-cardenal-green hover:scale-110 z-10"
                        onClick={handleNextImage}
                        aria-label="Siguiente imagen"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={imagenActual.url}
                                alt={imagenActual.alt}
                                width={1920}
                                height={1080}
                                className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                                priority
                                unoptimized
                            />
                        </div>

                        {/* Image Info */}
                        <div className="mt-6 text-center bg-cardenal-green/80 backdrop-blur-md px-8 py-4">
                            <p className="text-white text-xl font-bold font-serif mb-1">{imagenActual.titulo}</p>
                            <p className="text-cardenal-gold text-sm font-medium uppercase tracking-widest">
                                {imagenActual.categoria}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </section>
    );
};
