'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Service cards data
const servicios = [
    {
        id: 1,
        title: 'Habitaciones',
        image: '/images/home/servicios-habitaciones.webp',
        href: '/habitaciones'
    },
    {
        id: 2,
        title: 'Restaurante',
        image: '/images/home/servicios-restaurante.webp',
        href: '/restaurante'
    },
    {
        id: 3,
        title: 'Eventos',
        image: '/images/home/servicios-eventos.webp',
        href: '/eventos'
    },
    {
        id: 4,
        title: 'Turismo en Loja',
        image: '/images/home/servicios-turismo.webp',
        href: '/turismo-en-loja'
    }
];

export const AmenidadesCarousel = () => {
    return (
        <section className="py-24 bg-cardenal-cream border-t border-b border-cardenal-gold/10">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-cardenal-green mb-8 font-serif leading-tight">
                        NUESTROS <span className="text-cardenal-gold-dark">SERVICIOS EXCEPCIONALES</span>
                    </h2>
                    <div className="text-lg md:text-xl font-medium leading-relaxed space-y-3">
                        <p className="text-cardenal-brown font-semibold">Habitaciones con historia, diseñadas para tu comodidad</p>
                        <p className="text-cardenal-green">Tus eventos en el Hotel El Cardenal</p>
                        <p className="text-cardenal-gold-dark font-semibold italic">La verdadera cocina tradicional lojana</p>
                        <p className="text-cardenal-brown">Promociones especiales</p>
                    </div>
                </div>

                {/* Service Cards Grid - All in One Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {servicios.map((servicio) => (
                        <div
                            key={servicio.id}
                            className="group bg-white shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] border-b-4 border-transparent hover:border-cardenal-gold overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src={servicio.image}
                                    alt={servicio.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    quality={70}
                                />
                                {/* Subtle Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>

                            {/* Content Below Image */}
                            <div className="p-6 bg-white">
                                <h3 className="text-xl md:text-2xl font-bold mb-4 font-serif tracking-wide text-cardenal-green group-hover:text-cardenal-gold transition-colors duration-300">
                                    {servicio.title}
                                </h3>
                                <Link
                                    href={servicio.href}
                                    className="inline-flex items-center gap-2 bg-cardenal-gold hover:bg-cardenal-green text-white font-bold py-2.5 px-5 transition-all duration-300 text-xs uppercase tracking-widest shadow-lg group-hover:gap-3"
                                    aria-label={`Ver más sobre ${servicio.title}`}
                                >
                                    Ver más
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Optional CTA */}
                <div className="text-center">
                    <Link
                        href="/servicios"
                        className="inline-flex items-center gap-2 bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-4 px-10 transition-all duration-500 shadow-lg font-serif tracking-widest text-sm"
                    >
                        EXPLORAR TODOS LOS SERVICIOS
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
