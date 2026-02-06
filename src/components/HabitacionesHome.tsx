'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Room data
const habitaciones = [
    {
        id: 'matrimonial',
        nombre: 'Habitación Matrimonial',
        tagline: 'Intimidad y elegancia para dos',
        descripcion: 'Cama matrimonial de lujo con detalles neoclásicos y ventanales de aire puro. El rincón de paz ideal tras recorrer la ciudad de Loja.',
        detalles: [
            'Cama matrimonial de lujo con detalles neoclásicos',
            'Ventanales que capturan la luz natural y el aire puro',
            'Ambiente cálido y privado para una estancia romántica',
            'Perfecto para parejas que buscan tranquilidad'
        ],
        imagen: '/images/habitaciones/matrimonial/matrimonial-main.webp?v=2',
        href: '/habitaciones/matrimonial'
    },
    {
        id: 'doble-twin',
        nombre: 'Habitación Doble Twin',
        tagline: 'Descanso independiente y profesional',
        descripcion: 'Espacio funcional con escritorio y WiFi de alta velocidad para un sueño reparador. La opción preferida por viajeros de negocios y turistas.',
        detalles: [
            'Dos camas individuales de gran confort',
            'Espacio funcional con escritorio y WiFi de alta velocidad',
            'Ambiente libre de ruidos, perfecto para un sueño reparador',
            'Ideal para compañeros de viaje o viajes de negocios'
        ],
        imagen: '/images/habitaciones/doble/doble-twin-main.webp?v=2',
        href: '/doble-twin'
    },
    {
        id: 'triple',
        nombre: 'Habitación Triple',
        tagline: 'Versatilidad y comodidad compartida',
        descripcion: 'Tres camas individuales con lencería de alta calidad en un ambiente iluminado. Ideal para grupos de amigos o viajes de trabajo en equipo.',
        detalles: [
            'Tres camas individuales con lencería de alta calidad',
            'Ambiente iluminado con ventilación natural',
            'Acceso directo a áreas comunes y senderos ecológicos',
            'Perfecta para familias o grupos pequeños'
        ],
        imagen: '/images/habitaciones/triple/triple-main.webp?v=2',
        href: '/habitaciones/triple'
    }
];

export const HabitacionesHome = ({ themeClass }: { themeClass?: string }) => {
    const [activeTab, setActiveTab] = useState('matrimonial');
    const activeHabitacion = habitaciones.find(h => h.id === activeTab) || habitaciones[0];

    const isTheme2 = themeClass === 'theme-home-2';

    return (
        <section className={cn("py-24 transition-colors duration-700", isTheme2 ? "bg-[#0a1f0a] text-white" : "bg-cardenal-cream/30")}>
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className={cn("text-3xl md:text-5xl font-bold mb-6 font-serif", isTheme2 ? "text-white" : "text-cardenal-green")}>
                        Habitaciones y Alojamiento en Loja: <span className="text-cardenal-gold italic">Descanso Íntimo junto a la Naturaleza</span>
                    </h2>
                    <p className={cn("text-lg md:text-xl font-medium leading-relaxed", isTheme2 ? "text-white/90" : "text-text-main")}>
                        Descubra la armonía entre el diseño neoclásico y el descanso moderno en nuestras 6 exclusivas habitaciones.
                    </p>
                    <div className="w-24 h-1.5 bg-cardenal-gold mx-auto mt-8"></div>
                </div>

                {/* Tabs Navigation - Text Only */}
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {habitaciones.map((hab) => (
                        <button
                            key={hab.id}
                            onClick={() => setActiveTab(hab.id)}
                            className={cn(
                                "px-8 py-4 font-serif font-bold text-sm md:text-base transition-all duration-300 border-b-4",
                                activeTab === hab.id
                                    ? "border-cardenal-gold text-cardenal-gold scale-105"
                                    : isTheme2
                                        ? "border-transparent text-white/70 hover:text-white hover:border-cardenal-gold/50"
                                        : "border-transparent text-cardenal-green/70 hover:text-cardenal-green hover:border-cardenal-gold/50"
                            )}
                        >
                            {hab.nombre}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="max-w-6xl mx-auto">
                    <div className={cn(
                        "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 transition-all duration-500",
                        isTheme2 ? "bg-white/5" : "bg-white shadow-xl"
                    )}>
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden order-2 lg:order-1">
                            <Image
                                src={activeHabitacion.imagen}
                                alt={activeHabitacion.nombre}
                                fill
                                className="object-cover transition-opacity duration-500"
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-6 order-1 lg:order-2">
                            <div className="inline-block px-4 py-1.5 bg-cardenal-gold/10 text-cardenal-gold text-xs font-bold uppercase tracking-widest border-l-4 border-cardenal-gold">
                                {activeHabitacion.tagline}
                            </div>

                            <h3 className={cn(
                                "text-3xl md:text-4xl font-bold font-serif",
                                isTheme2 ? "text-white" : "text-cardenal-green"
                            )}>
                                {activeHabitacion.nombre}
                            </h3>

                            <p className={cn(
                                "text-lg leading-relaxed",
                                isTheme2 ? "text-white/80" : "text-gray-700"
                            )}>
                                {activeHabitacion.descripcion}
                            </p>

                            <ul className="space-y-3">
                                {activeHabitacion.detalles.map((detalle, index) => (
                                    <li key={index} className={cn(
                                        "flex items-start gap-3",
                                        isTheme2 ? "text-white/70" : "text-gray-600"
                                    )}>
                                        <span className="text-cardenal-gold mt-1">✓</span>
                                        <span>{detalle}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={activeHabitacion.href}
                                className="inline-flex items-center gap-2 bg-cardenal-gold hover:bg-cardenal-green text-white font-bold py-3 px-8 transition-all duration-300 text-sm uppercase tracking-widest shadow-lg group"
                            >
                                Ver detalles
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
