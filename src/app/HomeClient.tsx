"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NuestraPropuesta } from "@/components/NuestraPropuesta";
import { AmenidadesCarousel } from "@/components/AmenidadesCarousel";
import { HabitacionesHome } from "@/components/HabitacionesHome";
import { GaleriaPreview } from "@/components/GaleriaPreview";
import { ConfianzaCredibilidad } from "@/components/ConfianzaCredibilidad";
import { RestauranteHome } from "@/components/RestauranteHome";
import { FAQ } from "@/components/FAQ";
import { headerData } from "@/types";
import { ChevronLeft, ChevronRight, Minus, Plus, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnnouncementPopup from '@/components/AnnouncementPopup';

declare global {
    interface Window {
        hasSeenAnnouncement?: boolean;
    }
}

const HERO_CONTENT = {
    title: 'Hotel Familiar en Loja',
    subtitle: 'Un hotel con leyenda rodeado de Naturaleza',
    description: 'En Hotel El Cardenal ofrecemos una estancia acogedora y segura donde se sentirá como en casa. Situado en una hermosa zona residencial junto al rio Malacatos',
    cta: 'Reserva Aquí'
};

export default function HomeClient({ customLogo, themeClass }: { customLogo?: string, themeClass?: string }) {
    const router = useRouter();

    // Hero slides data moved inside to ensure reactivity/refresh
    const heroSlides = [
        {
            id: 1,
            image: '/images/hero/hero-main.webp?v=2',
        },
        {
            id: 2,
            image: '/images/hero/hero-services.webp?v=2',
        },
        {
            id: 3,
            image: '/images/hero/hero-tres.webp?v=2',
        },
        {
            id: 4,
            image: '/images/hero/hero-cuatro.webp?v=2',
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [expanded, setExpanded] = useState(false);

    // Reservation search state
    const [fechaEntrada, setFechaEntrada] = useState('');
    const [fechaSalida, setFechaSalida] = useState('');
    const [adultos, setAdultos] = useState(2);
    const [ninos, setNinos] = useState(0);

    // Handle search/reservation
    const handleBuscarHabitaciones = () => {
        const params = new URLSearchParams();
        if (fechaEntrada) params.set('entrada', fechaEntrada);
        if (fechaSalida) params.set('salida', fechaSalida);
        if (adultos > 0) params.set('adultos', adultos.toString());
        if (ninos > 0) params.set('ninos', ninos.toString());

        router.push(`/habitaciones?${params.toString()}`);
    };

    // Auto-rotation
    useEffect(() => {
        if (!isAutoRotating) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000); // Change slide every 6 seconds

        return () => clearInterval(interval);
    }, [isAutoRotating]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoRotating(false);
        setTimeout(() => setIsAutoRotating(true), 15000); // Resume after 15 seconds
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
        setIsAutoRotating(false);
        setTimeout(() => setIsAutoRotating(true), 15000);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAutoRotating(false);
        setTimeout(() => setIsAutoRotating(true), 15000);
    };

    return (
        <div className={cn("flex flex-col min-h-screen", themeClass)}>
            <Header
                logo={customLogo || headerData.logo}
                showReservationSearch={true}
                themeClass={themeClass}
                forceDarkText={false} // Default to white text over typical hero images
                reservationSearchProps={{
                    fechaEntrada,
                    fechaSalida,
                    onFechaEntradaChange: setFechaEntrada,
                    onFechaSalidaChange: setFechaSalida,
                    adultos,
                    ninos,
                    onAdultosChange: setAdultos,
                    onNinosChange: setNinos,
                    onReservarClick: handleBuscarHabitaciones
                }}
            />

            <AnnouncementPopup />

            <main className="flex-1 flex flex-col">
                {/* Hero Slider - Fullscreen */}
                <div className="relative w-full h-screen overflow-hidden">
                    {/* Slides */}
                    {heroSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                        >
                            <Image
                                src={slide.image}
                                alt={HERO_CONTENT.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                                quality={75}
                                sizes="100vw"
                            />
                            {/* Overlay 10% Dark per user request */}
                            <div className="absolute inset-0 bg-black/10 z-10" />

                            {/* Contenido del slide - Fijo para todos los slides */}
                            <div className="absolute inset-0 flex flex-col items-center justify-between md:justify-center z-20 px-4 pt-40 pb-32 md:pt-16 md:pb-0">
                                <div className="max-w-4xl md:max-w-full text-center space-y-6 md:space-y-8 px-4">
                                    <div className="inline-block px-4 py-2 bg-cardenal-gold/20 backdrop-blur-sm border-l-4 border-cardenal-gold mb-4 animate-fadeInDown">
                                        <span className={cn("text-white text-xs md:text-sm font-bold uppercase tracking-[0.4em]", themeClass ? "italic" : "")}>
                                            {HERO_CONTENT.subtitle}
                                        </span>
                                    </div>
                                    <h1 className={cn(
                                        "text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] md:leading-tight animate-fadeInUp drop-shadow-2xl font-serif text-center mx-auto",
                                        themeClass ? "tracking-wider" : ""
                                    )}>
                                        {HERO_CONTENT.title}
                                    </h1>
                                    <p className="hidden md:block text-base md:text-xl text-white/95 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-body animate-fadeInUp delay-200">
                                        {expanded
                                            ? HERO_CONTENT.description
                                            : "En Hotel El Cardenal ofrecemos una estancia acogedora y segura donde se sentirá como en casa..."}
                                    </p>
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="hidden md:inline-block mt-3 md:mt-4 text-cardenal-gold font-bold hover:text-white transition-colors uppercase text-xs md:text-sm tracking-widest border-b border-cardenal-gold"
                                    >
                                        {expanded ? 'Ocultar' : 'Seguir leyendo'}
                                    </button>
                                </div>

                                <div className="mt-8 md:mt-12 group cursor-default">
                                    <div className="flex flex-col items-center gap-1 md:gap-2">
                                        <span className="text-white font-bold text-xs md:text-xl tracking-widest uppercase font-serif drop-shadow-md">
                                            {HERO_CONTENT.cta}
                                        </span>
                                        <div className="animate-bounce">
                                            <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-cardenal-gold rotate-90 filter drop-shadow-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows - Professional Design */}
                    <button
                        onClick={goToPrevSlide}
                        className="absolute left-0 top-0 bottom-0 z-20 group w-16 md:w-20 bg-gradient-to-r from-black/30 to-transparent hover:from-black/50 transition-all duration-300"
                        aria-label="Slide anterior"
                    >
                        <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 flex items-center">
                            <div className="w-8 h-16 border-l-2 border-white/60 group-hover:border-cardenal-gold transition-all duration-300"></div>
                            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white/80 group-hover:text-cardenal-gold -ml-3 transition-all duration-300 group-hover:scale-125" />
                        </div>
                    </button>

                    <button
                        onClick={goToNextSlide}
                        className="absolute right-0 top-0 bottom-0 z-20 group w-16 md:w-20 bg-gradient-to-l from-black/30 to-transparent hover:from-black/50 transition-all duration-300"
                        aria-label="Siguiente slide"
                    >
                        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex items-center">
                            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white/80 group-hover:text-cardenal-gold -mr-3 transition-all duration-300 group-hover:scale-125" />
                            <div className="w-8 h-16 border-r-2 border-white/60 group-hover:border-cardenal-gold transition-all duration-300"></div>
                        </div>
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-3">
                        {heroSlides.map((slide, index) => (
                            <button
                                key={slide.id}
                                onClick={() => goToSlide(index)}
                                className={`h-2.5 transition-all duration-300 ${index === currentSlide
                                    ? 'bg-cardenal-gold w-12 shadow-[0_0_10px_rgba(201,168,106,0.6)]'
                                    : 'bg-white/50 hover:bg-white/70 w-2.5'
                                    }`}
                                aria-label={`Ir a slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Reservation Search Panel - Floating between sections */}
                <div className="relative -mt-20 mb-8 z-30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border-4 border-cardenal-gold">
                            <div className="px-6 py-6">
                                <div className="flex flex-wrap items-end justify-center gap-3">
                                    {/* Check-in */}
                                    <div className="flex-shrink-0">
                                        <label className="block text-xs font-bold text-cardenal-green mb-1 text-center font-serif tracking-widest">
                                            ENTRADA
                                        </label>
                                        <input
                                            type="date"
                                            value={fechaEntrada}
                                            onChange={(e) => setFechaEntrada(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-32 px-2 py-2 text-sm border-2 border-cardenal-sand rounded-lg focus:border-cardenal-gold focus:outline-none font-sans font-bold"
                                        />
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex-shrink-0 pb-6">
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>

                                    {/* Check-out */}
                                    <div className="flex-shrink-0">
                                        <label className="block text-xs font-bold text-cardenal-green mb-1 text-center font-serif tracking-widest">
                                            SALIDA
                                        </label>
                                        <input
                                            type="date"
                                            value={fechaSalida}
                                            onChange={(e) => setFechaSalida(e.target.value)}
                                            min={fechaEntrada || new Date().toISOString().split('T')[0]}
                                            className="w-32 px-2 py-2 text-sm border-2 border-cardenal-sand rounded-lg focus:border-cardenal-gold focus:outline-none font-sans font-bold"
                                        />
                                    </div>

                                    {/* Divider */}
                                    <div className="hidden md:block w-px h-12 bg-gray-300 mx-2"></div>

                                    {/* Adults */}
                                    <div className="flex-shrink-0">
                                        <label className="block text-xs font-bold text-cardenal-green mb-1 text-center font-serif tracking-widest">
                                            ADULTOS
                                        </label>
                                        <div className="flex items-center gap-2 bg-cardenal-cream px-3 py-2 rounded-lg border-2 border-cardenal-sand">
                                            <button
                                                onClick={() => setAdultos(Math.max(0, adultos - 1))}
                                                className="p-1 bg-cardenal-sand hover:bg-cardenal-gold hover:text-white rounded transition-colors"
                                                type="button"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <div className="flex items-center gap-2 min-w-[40px] justify-center">
                                                <Users className="w-4 h-4 text-cardenal-green" />
                                                <span className="text-sm font-bold font-sans">{adultos}</span>
                                            </div>
                                            <button
                                                onClick={() => setAdultos(Math.min(10, adultos + 1))}
                                                className="p-1 bg-cardenal-sand hover:bg-cardenal-gold hover:text-white rounded transition-colors"
                                                type="button"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Children */}
                                    <div className="flex-shrink-0">
                                        <label className="block text-xs font-bold text-cardenal-green mb-1 text-center font-serif tracking-widest">
                                            NIÑOS
                                        </label>
                                        <div className="flex items-center gap-2 bg-cardenal-cream px-3 py-2 rounded-lg border-2 border-cardenal-sand">
                                            <button
                                                onClick={() => setNinos(Math.max(0, ninos - 1))}
                                                className="p-1 bg-cardenal-sand hover:bg-cardenal-gold hover:text-white rounded transition-colors"
                                                type="button"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <div className="flex items-center gap-2 min-w-[40px] justify-center">
                                                <Users className="w-3 h-3 text-cardenal-green" />
                                                <span className="text-sm font-bold font-sans">{ninos}</span>
                                            </div>
                                            <button
                                                onClick={() => setNinos(Math.min(10, ninos + 1))}
                                                className="p-1 bg-cardenal-sand hover:bg-cardenal-gold hover:text-white rounded transition-colors"
                                                type="button"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reserve Button */}
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={handleBuscarHabitaciones}
                                            className={cn(
                                                "text-white font-bold py-3 px-10 rounded-lg transition-all duration-300 shadow-lg font-serif tracking-widest text-sm",
                                                themeClass ? "bg-cardenal-gold hover:bg-cardenal-green-dark" : "bg-cardenal-green hover:bg-cardenal-gold hover:shadow-cardenal-gold/20"
                                            )}
                                            type="button"
                                        >
                                            RESERVAR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección Nuestras Habitaciones - Moved before Nuestra Propuesta */}
                <HabitacionesHome themeClass={themeClass} />

                {/* Sección Nuestra Propuesta */}
                <NuestraPropuesta />

                {/* Sección Amenidades Destacadas */}
                <AmenidadesCarousel />

                {/* Sección Galería Preview */}
                <GaleriaPreview />

                {/* Sección Confianza y Credibilidad */}
                <ConfianzaCredibilidad />

                {/* Sección Ubicación y Turismo (Mapa Full Width) */}
                <RestauranteHome />

                {/* Sección Preguntas Frecuentes */}
                <FAQ />

                {/* Resto del contenido */}
                <div className="bg-white">
                    {/* Footer */}
                    <Footer logo={customLogo || headerData.logo} themeClass={themeClass} />
                </div>
            </main >
        </div >
    );
}
