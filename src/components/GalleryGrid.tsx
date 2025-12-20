'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

// Categories
// Categories
// Categories
const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'habitaciones', label: 'Habitaciones' },
    { id: 'restaurante', label: 'Restaurante' },
    { id: 'eventos', label: 'Eventos' },
    { id: 'turismo', label: 'Turismo Loja' },
];

// Descriptive Gallery Images
const galleryImages = [
    { id: 1, src: '/images/galeria/galeria-1.webp?v=3', alt: 'Familiar Loft: Espacio en Dos Niveles', category: 'habitaciones' },
    { id: 2, src: '/images/galeria/galeria-2.webp?v=3', alt: 'Habitación Matrimonial: Elegancia neoclásica', category: 'habitaciones' },
    { id: 3, src: '/images/galeria/galeria-3.webp?v=3', alt: 'Triple Confort: Ideal para Amigos', category: 'habitaciones' },
    { id: 4, src: '/images/galeria/galeria-4.webp?v=3', alt: 'Doble Twin: Descanso Funcional', category: 'habitaciones' },
    { id: 5, src: '/images/galeria/galeria-5.webp?v=3', alt: 'Fachada Histórica del Hotel El Cardenal', category: 'turismo' },
    { id: 6, src: '/images/galeria/galeria-6.webp?v=3', alt: 'Salón de la Romería: Arte y Madera Zuleta', category: 'turismo' },
    { id: 7, src: '/images/galeria/galeria-7.webp?v=3', alt: 'Desayuno Tradicional: Sabores de Loja', category: 'restaurante' },
    { id: 8, src: '/images/galeria/galeria-8.webp?v=3', alt: 'Café de Altura: Aroma Inigualable', category: 'restaurante' },
    { id: 9, src: '/images/galeria/galeria-9.webp?v=3', alt: 'Tamales y Humitas: Receta Secreta', category: 'restaurante' },
    { id: 10, src: '/images/galeria/galeria-10.webp?v=3', alt: 'Rincones con Esencia Neoclásica', category: 'turismo' },
    { id: 11, src: '/images/galeria/galeria-11.webp?v=3', alt: 'Cercanía al Parque Lineal La Tebaida', category: 'turismo' },
    { id: 12, src: '/images/galeria/galeria-12.webp?v=3', alt: 'La Paz junto al Río Malacatos', category: 'turismo' },
    { id: 13, src: '/images/galeria/galeria-13.webp?v=3', alt: 'Ventanales con Aire Puro', category: 'habitaciones' },
    { id: 14, src: '/images/galeria/galeria-14.webp?v=3', alt: 'Puerta de la Ciudad', category: 'turismo' },
    { id: 15, src: '/images/galeria/galeria-15.webp?v=3', alt: 'Hall Principal: Bienvenida Cálida', category: 'turismo' },
    { id: 16, src: '/images/galeria/galeria-16.webp?v=3', alt: 'Salón de Eventos y Reuniones Corporativas', category: 'eventos' },
    { id: 17, src: '/images/galeria/galeria-17.webp?v=3', alt: 'Fruta Fresca de Nuestra Tierra', category: 'restaurante' },
    { id: 18, src: '/images/galeria/galeria-18.webp?v=3', alt: 'Descanso Íntimo en Plena Ciudad', category: 'habitaciones' },
    { id: 19, src: '/images/galeria/galeria-19.webp?v=3', alt: 'El Mejor Inicio del Día en Loja', category: 'restaurante' },
    { id: 20, src: '/images/galeria/galeria-20.webp?v=3', alt: 'Tradición Familiar en Cada Detalle', category: 'turismo' },
].map(img => ({ ...img, width: 800, height: 600 }));

export const GalleryGrid = () => {
    const [filter, setFilter] = useState('all');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const filteredImages = galleryImages; // Show all by default since we removed categories


    // Handle filter change with animation
    const handleFilterChange = (newFilter: string) => {
        if (newFilter === filter) return;

        setIsAnimating(true);

        // Wait for fade-out animation
        setTimeout(() => {
            setFilter(newFilter);
            setIsAnimating(false);
        }, 300);
    };

    // Handle Lightbox Navigation
    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev! - 1));
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev! + 1));
        }
    };

    const selectedImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

    return (
        <div className="w-full">
            {/* Filters removed as per new numbering structure */}
            {/* <div className="flex flex-wrap justify-center gap-3 mb-10">...</div> */}

            {/* Masonry Grid with Animation */}
            <div
                className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'
                    }`}
            >
                {filteredImages.map((image, index) => (
                    <div
                        key={image.id}
                        className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer bg-gray-200"
                        onClick={() => setSelectedImageIndex(index)}
                    >
                        <div className="relative w-full">
                            <div className={`w-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs min-h-[200px] ${image.height > image.width ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                                <span className="sr-only">{image.alt}</span>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={image.width}
                                    height={image.height}
                                    className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <ZoomIn className="text-white w-8 h-8" />
                        </div>

                        {/* Caption on Hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white text-sm font-medium truncate">{image.alt}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
                        onClick={() => setSelectedImageIndex(null)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 bg-black/20 hover:bg-black/40 rounded-full"
                        onClick={handlePrev}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 bg-black/20 hover:bg-black/40 rounded-full"
                        onClick={handleNext}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <div
                        className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                width={selectedImage.width}
                                height={selectedImage.height}
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                                priority
                                unoptimized
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-white text-lg font-medium">{selectedImage.alt}</p>
                            <p className="text-gray-400 text-sm capitalize">{categories.find(c => c.id === selectedImage.category)?.label}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
