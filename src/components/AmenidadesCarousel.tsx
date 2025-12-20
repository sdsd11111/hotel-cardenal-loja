'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Bed,
    Utensils,
    GlassWater,
    PawPrint,
    Wifi,
    Trees,
    ShoppingBag,
    ArrowRight
} from 'lucide-react';

// SEO Optimized Services data
const servicios = [
    {
        id: 1,
        name: 'HOSPEDAJE',
        icon: <Bed className="w-10 h-10 md:w-14 md:h-14" />,
        description: 'Disfruta de la comodidad de nuestras habitaciones diseñadas para un descanso profundo.',
        isMain: true
    },
    {
        id: 2,
        name: 'RESTAURANTE',
        icon: <Utensils className="w-10 h-10 md:w-14 md:h-14" />,
        description: 'Comienza el día con una deliciosa selección de platos y nuestro desayuno casero incluido.',
        isMain: true
    },
    {
        id: 3,
        name: 'EVENTOS',
        icon: <GlassWater className="w-10 h-10 md:w-14 md:h-14" />,
        description: 'El escenario ideal para reuniones corporativas y celebraciones íntimas en Loja.',
        isMain: true
    },
    {
        id: 4,
        name: 'PET FRIENDLY',
        icon: <PawPrint className="w-8 h-8 md:w-12 md:h-12" />,
        description: 'Tu mascota es bienvenida sin cargos adicionales en nuestro hotel familiar.',
        isMain: false
    },
    {
        id: 5,
        name: 'CONECTIVIDAD',
        icon: <Wifi className="w-8 h-8 md:w-12 md:h-12" />,
        description: 'WiFi de alta velocidad gratuito (9.5/10) para teletrabajo o entretenimiento.',
        isMain: false
    },
    {
        id: 6,
        name: 'NATURALEZA',
        icon: <Trees className="w-8 h-8 md:w-12 md:h-12" />,
        description: 'Acceso inmediato al Parque Lineal La Tebaida y su aire puro.',
        isMain: false
    },
    {
        id: 7,
        name: 'LAVANDERÍA',
        icon: <ShoppingBag className="w-8 h-8 md:w-12 md:h-12" />,
        description: 'Servicio disponible para que tu estancia larga sea tan cómoda como estar en casa.',
        isMain: false
    }
];

export const AmenidadesCarousel = () => {
    // Duplicate services to create infinite effect
    const duplicatedServicios = [...servicios, ...servicios];

    return (
        <section className="py-24 bg-cardenal-cream border-t border-b border-cardenal-gold/10">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-cardenal-green mb-6 font-serif leading-tight">
                        Experiencia y Hospitalidad: <span className="text-cardenal-gold italic">El Hotel Familiar en Loja</span> con Todo Incluido
                    </h2>
                    <p className="text-lg md:text-xl text-text-main font-medium leading-relaxed">
                        En Hotel El Cardenal, combinamos la tradición lojana con servicios de alta calidad para que tu visita sea perfecta. Ya sea que busques el mejor hospedaje en Loja, un desayuno que te conecte con el sabor local o el lugar ideal para tus reuniones, nuestra infraestructura neoclásica y atención familiar marcan la diferencia.
                    </p>
                </div>

                {/* Infinite Slider */}
                <div className="relative overflow-hidden group">
                    {/* Slow continuous slide effect */}
                    <div className="flex animate-scroll hover:pause">
                        {duplicatedServicios.map((servicio, index) => (
                            <div
                                key={`${servicio.id}-${index}`}
                                className="flex-shrink-0 w-64 md:w-80 px-4"
                            >
                                <div className="bg-white p-8 shadow-sm h-full flex flex-col items-center text-center border-b-4 border-transparent hover:border-cardenal-gold transition-all duration-500 hover:shadow-xl group/item">
                                    {/* Icon Container */}
                                    <div className={`mb-6 transition-transform duration-500 group-hover/item:scale-110 ${servicio.isMain ? 'text-cardenal-gold' : 'text-cardenal-green'}`}>
                                        {servicio.icon}
                                    </div>

                                    {/* Name */}
                                    <h3 className={`text-lg font-bold mb-3 font-serif tracking-widest ${servicio.isMain ? 'text-cardenal-green' : 'text-cardenal-brown'}`}>
                                        {servicio.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs md:text-sm text-text-muted leading-relaxed font-body">
                                        {servicio.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Overlays for smooth edges */}
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-cardenal-cream to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-cardenal-cream to-transparent z-10"></div>
                </div>

                {/* Optional CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/servicios"
                        className="inline-flex items-center gap-2 bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-4 px-10 transition-all duration-500 shadow-lg font-serif tracking-widest text-sm"
                    >
                        EXPLORAR TODOS LOS SERVICIOS
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
                .hover\:pause:hover {
                    animation-play-state: paused;
                }
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-320px * 7)); }
                }
                @media (max-width: 768px) {
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(calc(-256px * 7)); }
                    }
                }
            `}</style>
        </section>
    );
};
