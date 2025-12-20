'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface SimpleGallerySliderProps {
    images: string[];
    aspectRatio?: string; // e.g. 'aspect-video', 'aspect-square'
}

export default function SimpleGallerySlider({ images, aspectRatio = 'aspect-[4/3]' }: SimpleGallerySliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Prevent scrolling when lightbox is open
    useEffect(() => {
        if (isLightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isLightboxOpen]);

    const prevSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex(slideIndex);
    };

    if (!images || images.length === 0) return null;

    return (
        <>
            {/* Inline Slider */}
            <div
                className={`relative group w-full ${aspectRatio} rounded-xl overflow-hidden shadow-xl border-4 border-white/50 cursor-zoom-in`}
                onClick={() => setIsLightboxOpen(true)}
            >
                {/* Images container */}
                <div className="w-full h-full relative">
                    <Image
                        src={images[currentIndex]}
                        alt={`Galería slide ${currentIndex + 1}`}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        priority={currentIndex === 0}
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12 drop-shadow-md" />
                    </div>
                </div>

                {/* Left Arrow (Inline) */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    aria-label="Anterior imagen"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Right Arrow (Inline) */}
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                    aria-label="Siguiente imagen"
                >
                    <ChevronRight size={24} />
                </button>

                {/* Dots (Inline) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    {images.map((_, slideIndex) => (
                        <button
                            key={slideIndex}
                            onClick={(e) => goToSlide(slideIndex, e)}
                            className={`w-3 h-3 rounded-full transition-all shadow-sm ${currentIndex === slideIndex ? 'bg-cardenal-gold scale-110' : 'bg-white/60 hover:bg-white'
                                }`}
                            aria-label={`Ir a la imagen ${slideIndex + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
                    >
                        <X size={40} />
                    </button>

                    <div
                        className="relative w-full max-w-6xl h-[80vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={images[currentIndex]}
                                alt={`Galería full ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                                unoptimized
                            />
                        </div>

                        {/* Left Arrow (Lightbox) */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full md:-translate-x-12 text-white/50 hover:text-white p-4 transition-all"
                        >
                            <ChevronLeft size={48} />
                        </button>

                        {/* Right Arrow (Lightbox) */}
                        <button
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full md:translate-x-12 text-white/50 hover:text-white p-4 transition-all"
                        >
                            <ChevronRight size={48} />
                        </button>

                        {/* Dots (Lightbox) */}
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex space-x-3">
                            {images.map((_, slideIndex) => (
                                <button
                                    key={slideIndex}
                                    onClick={() => goToSlide(slideIndex)}
                                    className={`w-3 h-3 rounded-full transition-all ${currentIndex === slideIndex ? 'bg-cardenal-gold scale-125' : 'bg-white/30 hover:bg-white'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
