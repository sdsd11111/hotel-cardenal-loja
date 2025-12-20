'use client';

import React from 'react';
import Image from 'next/image';
import { Trees, Landmark, ShoppingBag, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Local attractions data
const atracciones = [
    {
        id: 1,
        titulo: 'Parque Lineal La Tebaida y Río Malacatos',
        descripcion: 'A solo unos pasos del hotel. Disfrute de 3.5 km de senderos ecológicos, aire puro y naturaleza, ideales para caminar o hacer ejercicio junto al río.',
        icon: <Trees className="w-8 h-8" />,
        distancia: 'A pasos del hotel',
        imagen: '/images/tours/parque-lineal.webp'
    },
    {
        id: 2,
        titulo: 'Centro Histórico y Plaza de la Independencia',
        descripcion: 'A 10 minutos de distancia, sumérjase en la historia lojana, visite la Catedral y recorra las calles que respiran música y cultura.',
        icon: <Landmark className="w-8 h-8" />,
        distancia: '10 min en auto',
        imagen: '/images/tours/plaza-central.webp'
    },
    {
        id: 3,
        titulo: 'Supermaxi y C.C. La Pradera',
        descripcion: 'A solo 7 minutos caminando encontrará el Supermaxi y el C.C. La Pradera, facilitando todas sus necesidades de compras y servicios durante su hospedaje en Loja.',
        icon: <ShoppingBag className="w-8 h-8" />,
        distancia: '7 min caminando',
        imagen: '/images/tours/supermaxi.webp'
    }
];

// Google Maps embed URL for Hotel El Cardenal Loja
const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.1234567890123!2d-79.2123456!3d-4.0012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cb378ae364a807%3A0x114d0a002380a815!2sHotel%20Cardenal!5e0!3m2!1ses!2sec!4v1234567890123';

export const RestauranteHome = () => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cardenal-green/5 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cardenal-gold/5 translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <MapPin className="w-6 h-6 text-cardenal-gold" />
                        <span className="text-cardenal-gold font-bold text-xs uppercase tracking-[0.3em] font-serif">
                            Descubra Loja
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-cardenal-green mb-8 font-serif leading-tight">
                        Explore Loja desde el <span className="text-cardenal-gold italic">Corazón de la Tradición</span>
                    </h2>
                    <div className="text-lg md:text-xl text-text-main font-medium leading-relaxed max-w-3xl mx-auto">
                        <p>
                            {isExpanded
                                ? <>En Hotel El Cardenal, su experiencia va más allá de nuestras puertas. Ubicados en un sector privilegiado y seguro, somos el punto de partida ideal para descubrir la riqueza cultural y natural de la "Centinela del Sur". Ya sea por negocios o turismo, disfrute de un ambiente acogedor con el servicio excepcional que solo un <strong className="text-cardenal-green">hotel familiar en Loja</strong> puede brindar.</>
                                : <>En Hotel El Cardenal, su experiencia va más allá de nuestras puertas. Ubicados en un sector privilegiado y seguro, somos el punto de partida ideal...</>
                            }
                        </p>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-cardenal-gold font-bold text-sm mt-2 hover:text-cardenal-green transition-colors uppercase tracking-widest border-b border-cardenal-gold"
                        >
                            {isExpanded ? 'Ocultar' : 'Seguir leyendo'}
                        </button>
                    </div>
                    <div className="w-24 h-1.5 bg-cardenal-gold mx-auto mt-8"></div>
                </div>

                {/* Subtitle */}
                <h3 className="text-2xl md:text-3xl text-cardenal-gold font-script italic text-center mb-12">
                    Guía Local: Lo que no se puede perder
                </h3>

                {/* Attractions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-16">
                    {atracciones.map((atraccion) => (
                        <div
                            key={atraccion.id}
                            className="group bg-cardenal-cream border border-cardenal-gold/10 hover:border-cardenal-gold shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={atraccion.imagen}
                                    alt={atraccion.titulo}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                {/* Distance Badge */}
                                <div className="absolute bottom-4 left-4 bg-cardenal-green text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
                                    {atraccion.distancia}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Icon */}
                                <div className="w-14 h-14 bg-cardenal-gold/10 flex items-center justify-center text-cardenal-gold mb-4 group-hover:bg-cardenal-gold group-hover:text-white transition-all duration-500">
                                    {atraccion.icon}
                                </div>

                                <h4 className="text-xl font-bold text-cardenal-green font-serif mb-3">
                                    {atraccion.titulo}
                                </h4>
                                <p className="text-text-muted leading-relaxed text-sm">
                                    {atraccion.descripcion}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Google Maps Embed */}
                <div className="max-w-5xl mx-auto mb-12">
                    <div className="relative bg-cardenal-cream p-2 shadow-xl">
                        <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden">
                            <iframe
                                src={GOOGLE_MAPS_EMBED}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Ubicación Hotel El Cardenal Loja"
                                className="absolute inset-0 w-full h-full"
                            ></iframe>
                        </div>
                        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-cardenal-gold" />
                                <div>
                                    <p className="font-bold text-cardenal-green font-serif">Hotel El Cardenal</p>
                                    <p className="text-sm text-text-muted">Gladiolos 154-42 y Av. 18 de Noviembre, Loja, Ecuador</p>
                                </div>
                            </div>
                            <a
                                href="https://maps.app.goo.gl/K3wFHBL5ouhw9ivE6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-3 px-6 transition-all duration-500 text-sm font-serif tracking-widest"
                            >
                                CÓMO LLEGAR
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/habitaciones"
                        className="inline-flex items-center gap-3 bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-5 px-12 transition-all duration-500 shadow-xl font-serif tracking-widest text-sm group"
                    >
                        RESERVE SU ESTANCIA EN LOJA
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
