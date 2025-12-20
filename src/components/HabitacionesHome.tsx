'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight, BedDouble, Users, Maximize, Wind } from 'lucide-react';

// New Habitaciones data based on user request
const habitaciones = [
    {
        id: 1,
        nombre: 'Familiar Loft',
        tagline: 'El refugio ideal para la familia en Loja.',
        descripcion: 'Distribución en dos niveles para máxima privacidad con un diseño acogedor y seguro.',
        detalles: [
            'Distribución en dos niveles para máxima privacidad.',
            'Capacidad amplia con diseño acogedor y seguro.',
            'Vistas privilegiadas al entorno natural del sector Los Rosales.',
            'El espacio favorito para quienes buscan un hotel familiar en Loja.'
        ],
        keywords: 'hotel familiar en Loja',
        imagenPrincipal: '/images/habitaciones/familiar/familiar-loft-main.webp?v=3',
        imagenMiniatura: '/images/habitaciones/familiar/familiar-loft-thumb.webp?v=3',
        icon: <Users className="w-5 h-5" />
    },
    {
        id: 2,
        nombre: 'Triple',
        tagline: 'Versatilidad y comodidad compartida.',
        descripcion: 'Tres camas individuales con lencería de alta calidad en un ambiente iluminado.',
        detalles: [
            'Tres camas individuales con lencería de alta calidad.',
            'Ambiente iluminado con ventilación natural.',
            'Acceso directo a áreas comunes y senderos ecológicos.',
            'Ideal para grupos de amigos o viajes de trabajo en equipo.'
        ],
        imagenPrincipal: '/images/habitaciones/triple/triple-main.webp?v=3',
        imagenMiniatura: '/images/habitaciones/triple/triple-thumb.webp?v=3',
        icon: <BedDouble className="w-5 h-5" />
    },
    {
        id: 3,
        nombre: 'Doble Twin',
        tagline: 'Descanso independiente y profesional.',
        descripcion: 'Espacio funcional con escritorio y WiFi de alta velocidad para un sueño reparador.',
        detalles: [
            'Dos camas individuales de gran confort.',
            'Espacio funcional con escritorio y WiFi de alta velocidad.',
            'Ambiente libre de ruidos, perfecto para un sueño reparador.',
            'La opción preferida por viajeros de negocios y turistas.'
        ],
        imagenPrincipal: '/images/habitaciones/doble/doble-twin-main.webp?v=3',
        imagenMiniatura: '/images/habitaciones/doble/doble-twin-thumb.webp?v=3',
        icon: <Maximize className="w-5 h-5" />
    },
    {
        id: 4,
        nombre: 'Matrimonial',
        tagline: 'Intimidad y elegancia para dos.',
        descripcion: 'Cama matrimonial de lujo con detalles neoclásicos y ventanales de aire puro.',
        detalles: [
            'Cama matrimonial de lujo con detalles neoclásicos.',
            'Ventanales que capturan la luz natural y el aire puro.',
            'Ambiente cálido y privado para una estancia romántica.',
            'El rincón de paz ideal tras recorrer la ciudad de Loja.'
        ],
        imagenPrincipal: '/images/habitaciones/matrimonial/matrimonial-main.webp?v=3',
        imagenMiniatura: '/images/habitaciones/matrimonial/matrimonial-thumb.webp?v=3',
        icon: <Wind className="w-5 h-5" />
    }
];

export const HabitacionesHome = () => {
    const [activeId, setActiveId] = useState(habitaciones[0].id);
    const activeHabitacion = habitaciones.find(h => h.id === activeId) || habitaciones[0];

    return (
        <section className="py-24 bg-cardenal-cream/30">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-cardenal-green mb-6 font-serif">
                        Habitaciones y Alojamiento en Loja: <span className="text-cardenal-gold italic">Descanso Íntimo junto a la Naturaleza</span>
                    </h2>
                    <p className="text-lg md:text-xl text-text-main font-medium leading-relaxed">
                        Descubra la armonía entre el diseño neoclásico y el descanso moderno en nuestras 6 exclusivas habitaciones.
                    </p>
                    <div className="w-24 h-1.5 bg-cardenal-gold mx-auto mt-8"></div>
                </div>

                {/* Main Interactive Layout */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">

                        {/* 1. Sidebar Grid Selection (Left - 2x2 items) */}
                        <div className="lg:col-span-5 order-1 lg:order-1 flex flex-col">
                            <h3 className="text-xs font-bold text-cardenal-green/60 uppercase tracking-[0.2em] mb-6 font-serif">
                                Categorías Disponibles
                            </h3>
                            <div className="grid grid-cols-2 gap-3 md:gap-4 flex-grow">
                                {habitaciones.map((h) => (
                                    <button
                                        key={h.id}
                                        onClick={() => setActiveId(h.id)}
                                        className={`group relative flex flex-col p-1 transition-all duration-500 border ${activeId === h.id
                                            ? 'border-cardenal-gold bg-white shadow-xl scale-[1.02] z-10'
                                            : 'border-transparent bg-white/40 hover:border-cardenal-gold/30 hover:bg-white/60'
                                            }`}
                                    >
                                        <div className="relative aspect-square overflow-hidden mb-0">
                                            <Image
                                                src={h.imagenMiniatura}
                                                alt={h.nombre}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 20vw"
                                                className={`object-cover transition-transform duration-1000 ${activeId === h.id ? 'scale-110' : 'group-hover:scale-110'}`}
                                                unoptimized
                                            />
                                            {activeId === h.id && (
                                                <div className="absolute inset-0 bg-cardenal-green/10 ring-2 ring-inset ring-cardenal-gold"></div>
                                            )}
                                        </div>
                                        <div className="p-3 text-center">
                                            <p className={`text-[11px] md:text-xs font-bold font-serif uppercase tracking-widest transition-colors ${activeId === h.id ? 'text-cardenal-green' : 'text-gray-500'}`}>
                                                {h.nombre}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Main Content Detail Area (Right) */}
                        <div className="lg:col-span-7 order-2 lg:order-2">
                            <div className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-cardenal-gold/10 overflow-hidden h-full flex flex-col">

                                {/* Image Column */}
                                <div className="w-full relative aspect-[16/9] overflow-hidden">
                                    <Image
                                        src={activeHabitacion.imagenPrincipal}
                                        alt={activeHabitacion.nombre}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover animate-fadeIn"
                                        priority
                                        unoptimized
                                    />
                                    <div className="absolute top-6 left-6 bg-cardenal-green text-white p-3 shadow-lg flex items-center gap-2">
                                        {activeHabitacion.icon}
                                        <span className="text-xs font-bold uppercase tracking-widest">Premium</span>
                                    </div>
                                </div>

                                {/* Text content Column */}
                                <div className="w-full p-8 md:p-12 flex flex-col animate-fadeInRight">
                                    <div className="mb-6">
                                        <h3 className="text-3xl md:text-4xl font-bold text-[#1B5E5E] font-serif mb-2">
                                            {activeHabitacion.nombre}
                                        </h3>
                                        <p className="text-cardenal-gold font-serif italic text-lg">
                                            {activeHabitacion.tagline}
                                        </p>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-grow">
                                        {activeHabitacion.detalles.map((detalle, idx) => (
                                            <div key={idx} className="flex items-start gap-3 group">
                                                <div className="mt-1.5 flex-shrink-0">
                                                    <Check className="w-4 h-4 text-[#C9A86A]" />
                                                </div>
                                                <p className="text-[#2D3436] font-body leading-relaxed text-base md:text-lg">
                                                    {detalle}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-gray-100 mt-auto">
                                        <Link
                                            href="/habitaciones"
                                            className="inline-flex items-center justify-center gap-3 bg-cardenal-green hover:bg-cardenal-green-dark text-white font-bold py-4 px-10 transition-all duration-500 shadow-lg font-serif tracking-widest w-full md:w-auto"
                                        >
                                            RESERVAR AHORA
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Section CTA */}
                <div className="mt-20 text-center">
                    <Link
                        href="/habitaciones"
                        className="group inline-flex flex-col items-center gap-4 py-8 px-12 border-2 border-cardenal-gold/20 hover:border-cardenal-gold transition-all duration-700 bg-white/50 backdrop-blur-sm"
                    >
                        <span className="text-cardenal-green font-serif text-xl md:text-2xl font-bold">
                            Consultar disponibilidad de habitaciones
                        </span>
                        <div className="flex items-center gap-2 text-cardenal-gold font-bold uppercase tracking-[0.3em] text-xs">
                            <span>Ver todas</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-fadeInRight {
                    animation: fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </section>
    );
};
