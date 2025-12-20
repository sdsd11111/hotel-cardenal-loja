'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GalleryGrid } from '@/components/GalleryGrid';
import { headerData } from '@/types';
import { ArrowRight, Camera, Home, Utensils, TreePine } from 'lucide-react';

export default function GaleriaClient() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Visual - Full Screen */}
                <div className="relative w-full h-screen">
                    <Image
                        src="/images/galeria/hero-galeria.webp?v=2"
                        alt="Galería Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center px-4 max-w-5xl">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white drop-shadow-lg mb-6 leading-tight">
                                Galería Visual: Un Recorrido por el Hotel El Cardenal
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 font-serif max-w-3xl mx-auto drop-shadow-md">
                                Explore a través de imágenes la elegancia neoclásica y el entorno natural que nos convierten en el mejor hotel familiar en Loja.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido Principal (Intro + Categorías) */}
                <div className="container mx-auto px-4 py-16 max-w-5xl">

                    {/* Intro Section - Now H2 since H1 is in Hero */}
                    <section className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                            Nuestra Ventana al Mundo
                        </h2>
                        <div className="mx-auto w-24 h-1 bg-cardenal-gold rounded-full mb-8"></div>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                            Bienvenidos a nuestra ventana visual. En cada fotografía reflejamos nuestro compromiso con la excelencia y la calidez familiar. Desde detalles de confort en nuestras habitaciones hasta la vitalidad de nuestra cocina.
                        </p>
                    </section>

                    {/* H2: Espacios Diseñados */}
                    <section className="mb-20 bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100">
                        <h2 className="text-3xl font-serif font-bold text-center text-cardenal-green mb-10">
                            Espacios Diseñados para su Experiencia en Loja
                        </h2>
                        <p className="text-center text-gray-600 mb-10">
                            Para facilitar su navegación, hemos dividido nuestra muestra visual en los aspectos que más valoran nuestros huéspedes:
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-md text-center group hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 bg-cardenal-gold/10 rounded-full flex items-center justify-center text-cardenal-gold mx-auto mb-4 group-hover:bg-cardenal-gold group-hover:text-white transition-colors">
                                    <Home size={28} />
                                </div>
                                <h3 className="font-bold text-xl text-cardenal-brown mb-3">Habitaciones y Confort</h3>
                                <p className="text-sm text-gray-600">
                                    Un vistazo a nuestro Familiar Loft, suites matrimoniales y habitaciones dobles, donde la limpieza y el estilo neoclásico son protagonistas.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md text-center group hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 bg-cardenal-gold/10 rounded-full flex items-center justify-center text-cardenal-gold mx-auto mb-4 group-hover:bg-cardenal-gold group-hover:text-white transition-colors">
                                    <Utensils size={28} />
                                </div>
                                <h3 className="font-bold text-xl text-cardenal-brown mb-3">Sabores y Tradición</h3>
                                <p className="text-sm text-gray-600">
                                    Imágenes de nuestro restaurante y el delicioso desayuno tradicional lojano que servimos cada mañana.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md text-center group hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 bg-cardenal-gold/10 rounded-full flex items-center justify-center text-cardenal-gold mx-auto mb-4 group-hover:bg-cardenal-gold group-hover:text-white transition-colors">
                                    <TreePine size={28} />
                                </div>
                                <h3 className="font-bold text-xl text-cardenal-brown mb-3">Arquitectura y Entorno</h3>
                                <p className="text-sm text-gray-600">
                                    Detalles de nuestra fachada, los muebles Zuleta y nuestra envidiable cercanía al Parque Lineal La Tebaida y al río Malacatos.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* H3: Lo que nuestros huéspedes capturan (FULL WIDTH) */}
                <section className="w-full bg-gray-50 py-20">
                    <div className="container mx-auto px-4 text-center mb-10">
                        <h3 className="text-3xl font-serif font-bold text-gray-900 flex items-center justify-center gap-3">
                            <Camera className="text-cardenal-gold" /> Lo que nuestros huéspedes capturan
                        </h3>
                        <p className="text-gray-500 mt-2">Momentos reales de nuestros visitantes en Loja</p>
                    </div>

                    {/* Gallery Grid Container - Full Width or very wide */}
                    <div className="w-full px-2 md:px-6">
                        <GalleryGrid />
                    </div>
                </section>

                {/* CTA Final */}
                <div className="bg-gradient-to-r from-cardenal-gold to-yellow-500 py-16 text-white text-center">
                    <div className="container mx-auto px-4">
                        <h3 className="text-3xl font-serif font-bold mb-6">¿Le Gusta lo que Ve?</h3>
                        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                            Reserve ahora y experimente en persona cada detalle que ha descubierto en nuestra galería.
                        </p>
                        <Link
                            href="/reservas"
                            className="inline-flex items-center gap-2 bg-white text-cardenal-brown hover:bg-gray-100 font-bold py-4 px-10 rounded-lg shadow-xl transition-all uppercase tracking-widest"
                        >
                            Reservar Ahora
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
