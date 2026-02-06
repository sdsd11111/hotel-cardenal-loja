'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-cardenal-cream animate-pulse flex items-center justify-center font-serif text-cardenal-green">Cargando mapa...</div>
});

// Google Maps fallback URL for the "CÓMO LLEGAR" button
const GOOGLE_MAPS_EXTERNAL = 'https://maps.app.goo.gl/K3wFHBL5ouhw9ivE6';

export const RestauranteHome = () => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cardenal-green/5 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cardenal-gold/5 translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <MapPin className="w-6 h-6 text-cardenal-gold" />
                        <span className="text-cardenal-gold-dark font-bold text-xs uppercase tracking-[0.3em] font-serif">
                            Ubicación Privilegiada
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-cardenal-green font-serif leading-tight">
                        Explore Loja desde el <span className="text-cardenal-gold-dark italic">Corazón de la Tradición</span>
                    </h2>
                </div>

            </div>
            {/* End Container for Grid */}

            {/* Leaflet Map - Full Width Section */}
            <div className="w-full mb-12 relative shadow-2xl">
                <div className="w-full aspect-[16/9] md:aspect-[32/9] relative overflow-hidden grayscale-[50%] hover:grayscale-0 transition-all duration-700">
                    <Map />
                    {/* Overlay Gradient for integration */}
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.1)] z-10"></div>
                </div>

                {/* Info Bar Strip */}
                <div className="bg-cardenal-cream border-t border-cardenal-gold/30">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 max-w-5xl mx-auto">
                            <div className="flex items-center gap-4 text-center md:text-left">
                                <div className="bg-white p-3 rounded-full shadow-md">
                                    <MapPin className="w-6 h-6 text-cardenal-gold" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-cardenal-green font-serif">Hotel El Cardenal</p>
                                    <p className="text-sm text-text-muted">Gladiolos 154-42 y Av. 18 de Noviembre, Loja, Ecuador</p>
                                </div>
                            </div>
                            <a
                                href={GOOGLE_MAPS_EXTERNAL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-3 px-8 transition-all duration-500 text-sm font-serif tracking-widest shadow-lg hover:-translate-y-1"
                            >
                                CÓMO LLEGAR
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Re-open Container for CTA */}
            <div className="container mx-auto px-4 relative z-10">

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
        </section >
    );
};
