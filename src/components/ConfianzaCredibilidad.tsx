'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Star, Coffee, PawPrint, Home, ChevronDown, ChevronUp, ExternalLink, ArrowRight } from 'lucide-react';

// Animated Counter Hook
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!startOnView) {
            setHasStarted(true);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasStarted, startOnView]);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [hasStarted, end, duration]);

    return { count, ref };
};

// Stats data
const stats = [
    {
        icon: <div className="flex"><Star className="w-5 h-5 fill-cardenal-gold text-cardenal-gold" /><Star className="w-5 h-5 fill-cardenal-gold text-cardenal-gold" /><Star className="w-5 h-5 fill-cardenal-gold text-cardenal-gold" /><Star className="w-5 h-5 fill-cardenal-gold text-cardenal-gold" /><Star className="w-5 h-5 fill-cardenal-gold text-cardenal-gold" /></div>,
        value: 140,
        suffix: '+',
        label: 'Reseñas Reales en Google'
    },
    {
        icon: <Coffee className="w-10 h-10" />,
        value: 9.9,
        suffix: ' / 10',
        label: 'Puntuación en Desayuno y Servicio',
        isDecimal: true
    },
    {
        icon: <PawPrint className="w-10 h-10" />,
        value: 100,
        suffix: '%',
        label: 'Pet Friendly & Pet Lovers'
    },
    {
        icon: <Home className="w-10 h-10" />,
        value: 6,
        suffix: '',
        label: 'Habitaciones Exclusivas'
    }
];

// Testimonials data
const testimonios = [
    {
        id: 1,
        texto: 'La ubicación es inmejorable, un sector seguro cerca al Supermaxi y al parque lineal. Se puede llegar caminando a lugares hermosos, especialmente al río que pasa a pocos metros. ¡Seguridad total!',
        autor: 'Andrés Ramírez',
        tipo: 'Vacaciones Familiares',
        inicial: 'A',
        color: 'bg-cardenal-green',
        size: 'large'
    },
    {
        id: 2,
        texto: 'Excelente servicio. Se inicia el día con un exquisito café con tamales lojanos. El mejor hospedaje en Loja si buscas tradición.',
        autor: 'Luis F. E.',
        tipo: 'Viajero de Negocios',
        inicial: 'L',
        color: 'bg-cardenal-gold',
        size: 'medium'
    },
    {
        id: 3,
        texto: 'Desde el gerente hasta el personal del desayuno, te tratan con una amabilidad excepcional. Recomendado 100%.',
        autor: 'Evy Joy Portilla',
        tipo: 'Huésped Frecuente',
        inicial: 'E',
        color: 'bg-cardenal-brown',
        size: 'medium'
    },
    {
        id: 4,
        texto: 'Excelente atención y una vista increíble. Un lugar muy cálido y acogedor.',
        autor: 'Liliana Gallardo',
        tipo: 'Turista',
        inicial: 'L',
        color: 'bg-cardenal-green-light',
        size: 'small'
    }
];

const GOOGLE_REVIEWS_URL = 'https://www.google.com/travel/search?q=hotel%20el%20cardenal%20loja&g2lb=4965990%2C72317059%2C72414906%2C72471280%2C72485658%2C72560029%2C72573224%2C72647020%2C72686036%2C72803964%2C72882230%2C72958624%2C73059275%2C73064764%2C73104946%2C73107089%2C73169520%2C73192290&hl=es-419&gl=ec&ssta=1&ts=CAEaRwopEicyJTB4OTFjYjM3OGFlMzY0YTgwNzoweDExNGQwYTAwMjM4MGE4MTUSGhIUCgcI6Q8QDBgbEgcI6Q8QDBgcGAEyAhAA&qs=CAEyE0Nnb0lsZENDbklMQXdxWVJFQUU4AkIJCRWogCMACk0RQgkJFaiAIwAKTRE&ap=ugEHcmV2aWV3cw&ictx=111&ved=0CAAQ5JsGahcKEwiw1PfJ1tuRAxUAAAAAHQAAAAAQBA';

export const ConfianzaCredibilidad = () => {
    const [expandedTestimonios, setExpandedTestimonios] = useState<number[]>([]);

    const toggleTestimonio = (id: number) => {
        setExpandedTestimonios(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const stat1 = useCountUp(stats[0].value, 2000);
    const stat2 = useCountUp(99, 2000); // 9.9 * 10 for animation
    const stat3 = useCountUp(stats[2].value, 2000);
    const stat4 = useCountUp(stats[3].value, 1500);

    return (
        <section className="py-24 bg-cardenal-cream relative overflow-hidden">
            {/* Subtle texture overlay - Pointer events none to prevent blocking clicks */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* COMPONENTE 1: Headline Magnético */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-cardenal-green mb-6 font-serif leading-tight">
                        4.7 Estrellas de Calidez: <span className="text-cardenal-gold italic">Lo que nos hace únicos en Loja</span>
                    </h2>
                    <h3 className="text-xl md:text-2xl text-cardenal-gold font-script italic leading-relaxed">
                        "No somos un hotel más, somos su familia en el sur del Ecuador."
                    </h3>
                    <div className="w-24 h-1.5 bg-cardenal-gold mx-auto mt-8"></div>
                </div>

                {/* COMPONENTE 2: Rediseño 50/50 - Estadísticas y Booking.com */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 max-w-6xl mx-auto items-stretch">

                    {/* LADO IZQUIERDO: Rejilla de 2x2 para estadísticas actuales */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {/* Stat 1: Google Reviews */}
                        <div ref={stat1.ref} className="bg-white p-6 shadow-md border border-cardenal-gold/10 flex flex-col items-center text-center justify-center hover:shadow-lg transition-all group">
                            <div className="text-cardenal-gold mb-3">
                                {stats[0].icon}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-cardenal-green font-serif">
                                {stat1.count}{stats[0].suffix}
                            </div>
                            <p className="text-[10px] md:text-xs text-text-muted font-bold uppercase tracking-tighter mt-1">{stats[0].label}</p>
                        </div>

                        {/* Stat 2: Breakfast */}
                        <div ref={stat2.ref} className="bg-white p-6 shadow-md border border-cardenal-gold/10 flex flex-col items-center text-center justify-center hover:shadow-lg transition-all group">
                            <Coffee className="w-8 h-8 text-cardenal-green mb-3" />
                            <div className="text-3xl md:text-4xl font-bold text-cardenal-green font-serif">
                                {(stat2.count / 10).toFixed(1)}{stats[1].suffix}
                            </div>
                            <p className="text-[10px] md:text-xs text-text-muted font-bold uppercase tracking-tighter mt-1">{stats[1].label}</p>
                        </div>

                        {/* Stat 3: Pet Friendly */}
                        <div ref={stat3.ref} className="bg-white p-6 shadow-md border border-cardenal-gold/10 flex flex-col items-center text-center justify-center hover:shadow-lg transition-all group">
                            <PawPrint className="w-8 h-8 text-cardenal-green mb-3" />
                            <div className="text-3xl md:text-4xl font-bold text-cardenal-green font-serif">
                                {stat3.count}{stats[2].suffix}
                            </div>
                            <p className="text-[10px] md:text-xs text-text-muted font-bold uppercase tracking-tighter mt-1">{stats[2].label}</p>
                        </div>

                        {/* Stat 4: Exlucisve Rooms */}
                        <div ref={stat4.ref} className="bg-white p-6 shadow-md border border-cardenal-gold/10 flex flex-col items-center text-center justify-center hover:shadow-lg transition-all group">
                            <Home className="w-8 h-8 text-cardenal-green mb-3" />
                            <div className="text-3xl md:text-4xl font-bold text-cardenal-green font-serif">
                                {stat4.count}{stats[3].suffix}
                            </div>
                            <p className="text-[10px] md:text-xs text-text-muted font-bold uppercase tracking-tighter mt-1">{stats[3].label}</p>
                        </div>
                    </div>

                    {/* LADO DERECHO: Desglose Detallado de Booking.com */}
                    <div className="bg-white p-8 shadow-xl border border-[#003580]/5 relative overflow-hidden flex flex-col" ref={stat1.ref}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="bg-[#003580] text-white font-bold text-2xl w-12 h-12 flex items-center justify-center rounded-sm shadow-sm ring-1 ring-white/20">
                                        9,2
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[#003580] font-extrabold text-xl leading-none">Fantástico</span>
                                        <span className="text-gray-500 text-xs mt-1">104 comentarios en Booking.com</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-[#003580] font-extrabold text-2xl tracking-tighter">Booking<span className="text-[#003580]">.com</span></span>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                            <h4 className="text-gray-800 font-bold text-sm border-b pb-2 mb-2">Categorías puntuadas por huéspedes reales:</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {/* Personal: 9.8 */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                        <span>Personal</span>
                                        <span>9,8</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 w-full rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#003580] transition-all duration-[1.5s] ease-out delay-300"
                                            style={{ width: stat1.count > 0 ? '98%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Limpieza: 9.6 */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                        <span>Limpieza</span>
                                        <span>9,6</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 w-full rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#003580] transition-all duration-[1.5s] ease-out delay-500"
                                            style={{ width: stat1.count > 0 ? '96%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Confort: 9.4 */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                        <span>Confort</span>
                                        <span>9,4</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 w-full rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#003580] transition-all duration-[1.5s] ease-out delay-700"
                                            style={{ width: stat1.count > 0 ? '94%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Relación Calidad-Precio: 9.4 */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                        <span>Calidad-Precio</span>
                                        <span>9,4</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 w-full rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#003580] transition-all duration-[1.5s] ease-out delay-900"
                                            style={{ width: stat1.count > 0 ? '94%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>

                                {/* WiFi Gratis: 9.5 */}
                                <div className="md:col-span-2">
                                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                        <span>WiFi Gratis</span>
                                        <span>9,5</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 w-full rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#003580] transition-all duration-[1.5s] ease-out delay-1100"
                                            style={{ width: stat1.count > 0 ? '95%' : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COMPONENTE 3: Bento Grid de Testimonios */}
            <div className="max-w-6xl mx-auto mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Large Testimonial */}
                    <div className="md:col-span-2 md:row-span-2 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-transparent hover:border-cardenal-gold group hover:-translate-y-1">
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`w-14 h-14 ${testimonios[0].color} text-white flex items-center justify-center text-2xl font-bold font-serif flex-shrink-0`}>
                                {testimonios[0].inicial}
                            </div>
                            <div>
                                <p className="font-bold text-cardenal-green font-serif">{testimonios[0].autor}</p>
                                <p className="text-xs text-cardenal-gold uppercase tracking-widest">{testimonios[0].tipo}</p>
                            </div>
                        </div>
                        <blockquote className="text-lg md:text-xl text-text-main leading-relaxed italic">
                            "{expandedTestimonios.includes(testimonios[0].id) || testimonios[0].texto.length <= 150
                                ? testimonios[0].texto
                                : `${testimonios[0].texto.substring(0, 150)}...`}"
                        </blockquote>
                        {testimonios[0].texto.length > 150 && (
                            <button
                                onClick={() => toggleTestimonio(testimonios[0].id)}
                                className="mt-4 text-cardenal-gold hover:text-cardenal-green text-sm font-bold flex items-center gap-1 transition-colors"
                            >
                                {expandedTestimonios.includes(testimonios[0].id) ? (
                                    <>Leer menos <ChevronUp className="w-4 h-4" /></>
                                ) : (
                                    <>Seguir leyendo <ChevronDown className="w-4 h-4" /></>
                                )}
                            </button>
                        )}
                        <div className="flex mt-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-cardenal-gold text-cardenal-gold" />
                            ))}
                        </div>
                    </div>

                    {/* Medium Testimonial 1 */}
                    <div className="bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-transparent hover:border-cardenal-gold group hover:-translate-y-1">
                        <div className="flex items-start gap-3 mb-3">
                            <div className={`w-10 h-10 ${testimonios[1].color} text-white flex items-center justify-center text-lg font-bold font-serif flex-shrink-0`}>
                                {testimonios[1].inicial}
                            </div>
                            <div>
                                <p className="font-bold text-cardenal-green font-serif text-sm">{testimonios[1].autor}</p>
                                <p className="text-[10px] text-cardenal-gold uppercase tracking-widest">{testimonios[1].tipo}</p>
                            </div>
                        </div>
                        <blockquote className="text-sm text-text-main leading-relaxed italic">
                            "{testimonios[1].texto}"
                        </blockquote>
                        <div className="flex mt-3">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-cardenal-gold text-cardenal-gold" />
                            ))}
                        </div>
                    </div>

                    {/* Medium Testimonial 2 */}
                    <div className="bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-transparent hover:border-cardenal-gold group hover:-translate-y-1">
                        <div className="flex items-start gap-3 mb-3">
                            <div className={`w-10 h-10 ${testimonios[2].color} text-white flex items-center justify-center text-lg font-bold font-serif flex-shrink-0`}>
                                {testimonios[2].inicial}
                            </div>
                            <div>
                                <p className="font-bold text-cardenal-green font-serif text-sm">{testimonios[2].autor}</p>
                                <p className="text-[10px] text-cardenal-gold uppercase tracking-widest">{testimonios[2].tipo}</p>
                            </div>
                        </div>
                        <blockquote className="text-sm text-text-main leading-relaxed italic">
                            "{testimonios[2].texto}"
                        </blockquote>
                        <div className="flex mt-3">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-cardenal-gold text-cardenal-gold" />
                            ))}
                        </div>
                    </div>

                    {/* Small Testimonial */}
                    <div className="md:col-span-3 bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-transparent hover:border-cardenal-gold group hover:-translate-y-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 ${testimonios[3].color} text-white flex items-center justify-center text-lg font-bold font-serif flex-shrink-0`}>
                                    {testimonios[3].inicial}
                                </div>
                                <div>
                                    <p className="font-bold text-cardenal-green font-serif text-sm">{testimonios[3].autor}</p>
                                    <p className="text-[10px] text-cardenal-gold uppercase tracking-widest">{testimonios[3].tipo}</p>
                                </div>
                            </div>
                            <blockquote className="text-sm text-text-main leading-relaxed italic flex-1">
                                "{testimonios[3].texto}"
                            </blockquote>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-cardenal-gold text-cardenal-gold" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Google Reviews Button */}
                <div className="text-center mt-10">
                    <a
                        href={GOOGLE_REVIEWS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-cardenal-green hover:text-cardenal-gold font-bold transition-colors font-serif tracking-wide group"
                    >
                        <ExternalLink className="w-5 h-5" />
                        Ver todas las reseñas en Google
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>

            {/* COMPONENTE 4: Sello de Garantía y CTA */}
            <div className="max-w-4xl mx-auto bg-[#F1E6D2] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
                <p className="text-lg md:text-xl text-cardenal-brown font-serif text-center md:text-left flex-1">
                    ¿Listo para vivir la experiencia calificada como <span className="font-bold text-cardenal-green">'Excelente'</span> por nuestros huéspedes?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                    <a
                        href={GOOGLE_REVIEWS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-gray-50 text-cardenal-brown font-bold py-3 px-6 transition-all duration-300 shadow-md font-serif text-xs whitespace-nowrap flex items-center gap-2 border border-cardenal-gold/20 w-full sm:w-auto justify-center"
                    >
                        Ver todas las reseñas en Google
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <Link
                        href="/habitaciones"
                        className="bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-4 px-8 transition-all duration-500 shadow-lg font-serif tracking-widest text-sm whitespace-nowrap flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        ¡Reserva tu estancia ahora!
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
