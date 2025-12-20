'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import {
    Users,
    Wifi,
    ArrowRight,
    CheckCircle,
    Bed,
    Utensils,
    Trees,
    PawPrint
} from 'lucide-react';

// SEO Optimized Services data
const servicios = [
    {
        id: 1,
        titulo: 'Habitaciones Exclusivas',
        descripcion: 'Descanso profundo en el sector más tranquilo de Loja, junto al río Malacatos.',
        imagen: '/images/habitaciones/habitacion-1.webp',
        icono: <Bed className="w-8 h-8" />,
        enlace: '/habitaciones'
    },
    {
        id: 2,
        titulo: 'Restaurante y Desayuno',
        descripcion: 'Sabor local con nuestro famoso desayuno casero incluido en su estancia.',
        imagen: '/images/restaurante/restaurante-1.webp',
        icono: <Utensils className="w-8 h-8" />,
        enlace: '/restaurante'
    },
    {
        id: 3,
        titulo: 'Eventos Corporativos',
        descripcion: 'Salones neoclásicos ideales para reuniones de negocios y celebraciones íntimas.',
        imagen: '/images/servicios/eventos-1.webp',
        icono: <Users className="w-8 h-8" />,
        enlace: '/eventos'
    },
    {
        id: 4,
        titulo: 'Entorno Natural',
        descripcion: 'Acceso directo al Parque Lineal La Tebaida para caminar o hacer ejercicio.',
        imagen: '/images/servicios/naturaleza-1.webp',
        icono: <Trees className="w-8 h-8" />,
        enlace: '#entorno'
    },
    {
        id: 5,
        titulo: 'Conectividad Total',
        descripcion: 'Wi-Fi de alta velocidad gratuito en todas las áreas y habitaciones.',
        imagen: '/images/servicios/amenidades-1.webp',
        icono: <Wifi className="w-8 h-8" />,
        enlace: '#conectividad'
    },
    {
        id: 6,
        titulo: 'Pet Friendly',
        descripcion: 'Aceptamos a sus mascotas sin cargos adicionales, somos un hotel familiar.',
        imagen: '/images/servicios/pet-friendly-1.webp',
        icono: <PawPrint className="w-8 h-8" />,
        enlace: '#petfriendly'
    }
];

// Amenidades detalladas
const amenidadesDetalle = [
    'Wi-Fi de alta velocidad en todas las áreas',
    'Parqueadero privado gratuito',
    'Servicio a la habitación 24 horas',
    'Recepción 24/7',
    'Conserjería y asistencia turística',
    'Caja de seguridad',
    'Servicio de lavandería',
    'Áreas de trabajo compartido'
];

export default function ServiciosClient() {
    return (
        <div className="flex flex-col min-h-screen bg-cardenal-cream">
            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Visual - 70% del viewport */}
                <div className="relative w-full h-[70vh]">
                    <Image
                        src="/images/servicios/hero-servicios.webp"
                        alt="Servicios Hotel El Cardenal"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>

                    {/* Títulos sobre el hero */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-5xl mx-auto text-center px-4">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 font-serif uppercase tracking-tighter drop-shadow-2xl">
                                Servicios en Hotel El Cardenal
                            </h1>
                            <h2 className="text-xl md:text-2xl lg:text-3xl text-cardenal-gold font-serif italic tracking-widest drop-shadow-xl">
                                Una Estancia Integral: Comodidad y Calidad en Loja
                            </h2>
                        </div>
                    </div>
                </div>

                {/* CTA Principal Superior */}
                <div className="bg-cardenal-gold py-8">
                    <div className="container mx-auto px-4 text-center">
                        <Link
                            href="/habitaciones"
                            className="inline-flex items-center justify-center gap-2 bg-cardenal-green hover:bg-cardenal-green-dark text-white font-bold py-4 px-10 border border-white/20 transition-all duration-500 shadow-lg font-serif tracking-widest"
                        >
                            RESERVAR MI HABITACIÓN AHORA
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Cuadrícula de Servicios */}
                <div className="container mx-auto px-4 py-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl md:text-5xl font-bold text-cardenal-green mb-6 font-serif">
                                Explore Nuestros Servicios
                            </h3>
                            <p className="text-lg md:text-xl text-text-main max-w-3xl mx-auto font-medium">
                                Cada detalle diseñado para hacer de su estadía una experiencia inolvidable con la calidez de la hospitalidad lojana.
                            </p>
                            <div className="w-24 h-1.5 bg-cardenal-gold mx-auto mt-8"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {servicios.map((servicio) => (
                                <Link
                                    key={servicio.id}
                                    href={servicio.enlace}
                                    className="group bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-cardenal-gold/10"
                                >
                                    {/* Imagen */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <Image
                                            src={servicio.imagen}
                                            alt={servicio.titulo}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Icono flotante */}
                                        <div className="absolute top-4 right-4 w-14 h-14 bg-cardenal-green flex items-center justify-center text-white shadow-lg z-10">
                                            {servicio.icono}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-cardenal-green mb-4 font-serif group-hover:text-cardenal-gold transition-colors">
                                            {servicio.titulo}
                                        </h3>
                                        <p className="text-text-muted mb-6 leading-relaxed font-body">
                                            {servicio.descripcion}
                                        </p>
                                        <div className="flex items-center gap-2 text-cardenal-gold font-bold uppercase tracking-widest text-xs">
                                            <span>Ver Detalle</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sección Amenidades Detalladas */}
                <div id="amenidades" className="bg-white py-24 border-t border-cardenal-gold/10">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-16">
                                <h3 className="text-3xl md:text-5xl font-bold text-cardenal-green mb-6 font-serif">
                                    Confort que hace la diferencia
                                </h3>
                                <p className="text-lg text-text-main font-medium">
                                    Todo lo que necesita para una estadía cómoda, productiva y segura en Loja.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {amenidadesDetalle.map((amenidad, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-6 bg-cardenal-cream border-l-4 border-cardenal-gold shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <CheckCircle className="w-6 h-6 text-cardenal-green group-hover:scale-110 transition-transform" />
                                        <span className="text-cardenal-green font-bold font-serif tracking-wide">{amenidad}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Final */}
                <div className="bg-cardenal-green py-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cardenal-gold/5 -mr-32 -mt-32 rotate-45"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cardenal-gold/5 -ml-32 -mb-32 rotate-45"></div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h3 className="text-3xl md:text-6xl font-bold text-white mb-8 font-serif leading-tight">
                            ¿Listo para una experiencia <br /><span className="text-cardenal-gold italic">auténticamente lojana</span>?
                        </h3>
                        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
                            Disfrute de la tranquilidad del río Malacatos y la mejor atención familiar en la ciudad.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/habitaciones"
                                className="inline-flex items-center justify-center gap-2 bg-cardenal-gold hover:bg-white text-cardenal-green font-bold py-5 px-10 transition-all duration-500 shadow-xl font-serif tracking-widest"
                            >
                                VER HABITACIONES
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contacto"
                                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white hover:bg-white hover:text-cardenal-green text-white font-bold py-5 px-10 transition-all duration-500 font-serif tracking-widest"
                            >
                                CONTACTAR
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
