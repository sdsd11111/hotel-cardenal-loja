'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import {
    Waves,
    Clock,
    Eye,
    Sparkles,
    Sun,
    Droplets,
    ArrowRight,
    Download,
    CheckCircle
} from 'lucide-react';

// Características clave de la piscina y spa
const caracteristicas = [
    {
        id: 1,
        icono: <Waves className="w-8 h-8" />,
        titulo: 'Tipo de Piscina',
        detalle: 'Climatizada y semi-cubierta, para uso los 365 días del año'
    },
    {
        id: 2,
        icono: <Eye className="w-8 h-8" />,
        titulo: 'Vistas',
        detalle: 'Panorámicas a la ciudad de Loja y las montañas de los Andes'
    },
    {
        id: 3,
        icono: <Clock className="w-8 h-8" />,
        titulo: 'Horario de Piscina',
        detalle: '08:00 a 20:00 (Uso exclusivo para huéspedes)'
    },
    {
        id: 4,
        icono: <Sparkles className="w-8 h-8" />,
        titulo: 'Servicios de Spa',
        detalle: 'Masajes relajantes, tratamientos faciales, sauna y turco'
    },
    {
        id: 5,
        icono: <Droplets className="w-8 h-8" />,
        titulo: 'Comodidades',
        detalle: 'Jacuzzi de hidromasaje y área de solárium'
    },
    {
        id: 6,
        icono: <Sun className="w-8 h-8" />,
        titulo: 'Ambiente',
        detalle: 'Sereno y tranquilo con música relajante ambiente'
    }
];

// Galería de imágenes de bienestar
const galeriaImagenes = [
    { id: 1, url: '/images/piscinas/galeria-piscina.webp', alt: 'Piscina de cerca' },
    { id: 2, url: '/images/piscinas/galeria-spa-masajes.webp', alt: 'Cabina de masajes' },
    { id: 3, url: '/images/piscinas/galeria-jacuzzi.webp', alt: 'Jacuzzi y sauna' },
    { id: 4, url: '/images/piscinas/galeria-vista-atardecer.webp', alt: 'Vista al atardecer' }
];

// Links de navegación a otros servicios
const serviciosLinks = [
    { label: 'Eventos', href: '/eventos' },
    { label: 'Restaurante', href: '/restaurante' },
    { label: 'Tours', href: '/servicios/tours-experiencias' }
];

export default function PiscinaPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Visual - 70% del viewport */}
                <div className="relative w-full h-[70vh]">
                    <Image
                        src="/images/piscinas/hero-piscina-spa.webp"
                        alt="Piscina y Spa Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>

                    {/* Títulos sobre el hero */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-5xl mx-auto text-center px-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Piscina Climatizada y Spa
                            </h1>
                            <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium">
                                Su oasis de relax con vistas panorámicas
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Navegación Secundaria */}
                <div className="bg-gray-50 border-y border-gray-200">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-wrap justify-center gap-4">
                            <span className="text-gray-600 font-semibold">Explore más servicios:</span>
                            {serviciosLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-amber-600 hover:text-amber-700 font-semibold underline underline-offset-4 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sección 1: Introducción */}
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                            <Waves className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            Nuestro espacio de bienestar es el lugar perfecto para culminar su día. La piscina está climatizada todo el año para su máximo confort y nuestro Spa ofrece un santuario de paz con tratamientos holísticos. Todo mientras disfruta de un ambiente sereno y vistas inigualables de la ciudad y el entorno natural.
                        </p>
                        <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mt-8"></div>
                    </div>
                </div>

                {/* Sección 2: Características y Horarios */}
                <div className="bg-gradient-to-b from-white to-gray-50 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                                Características y Servicios
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {caracteristicas.map((caracteristica) => (
                                    <div
                                        key={caracteristica.id}
                                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                                    >
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 text-amber-600">
                                            {caracteristica.icono}
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                                            {caracteristica.titulo}
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            {caracteristica.detalle}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección 3: Paquete Destacado */}
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                Paquete Especial de Bienestar
                            </h3>
                            <p className="text-lg text-gray-600">
                                Maximice su experiencia reservando uno de nuestros paquetes especiales de bienestar. Combine el confort de nuestra Suite Premium con un Ritual de Spa andino.
                            </p>
                        </div>

                        {/* Tarjeta de Paquete */}
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-200">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {/* Imagen */}
                                <div className="relative aspect-[4/3] md:aspect-auto">
                                    <Image
                                        src="/images/piscinas/paquete-wellness.webp"
                                        alt="Paquete Alojamiento + Spa"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Contenido */}
                                <div className="p-8 flex flex-col justify-center">
                                    <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 w-fit">
                                        <Sparkles className="w-4 h-4" />
                                        Paquete Premium
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                                        Suite Premium + Ritual de Spa Andino
                                    </h4>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">2 noches en Suite Premium con vista panorámica</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Masaje relajante de 60 minutos para 2 personas</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Acceso ilimitado a piscina, jacuzzi y sauna</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">Desayuno buffet incluido ambas mañanas</span>
                                        </li>
                                    </ul>
                                    <p className="text-3xl font-bold text-amber-600 mb-6">
                                        Desde $280 USD
                                    </p>
                                    <Link
                                        href="/checkout/disponibilidad?paquete=wellness"
                                        className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full"
                                    >
                                        RESERVAR PAQUETE
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Galería de Bienestar */}
                <div className="bg-gray-50 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                                Nuestra Área de Bienestar
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {galeriaImagenes.map((imagen) => (
                                    <div
                                        key={imagen.id}
                                        className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                                    >
                                        <Image
                                            src={imagen.url}
                                            alt={imagen.alt}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Principal */}
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Reserve su Estadía con Acceso Total
                        </h3>
                        <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
                            Todos nuestros huéspedes disfrutan de acceso completo a nuestras instalaciones de bienestar sin costo adicional.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link
                                href="/checkout/disponibilidad"
                                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                RESERVAR MI ESTADÍA CON ACCESO A AMENIDADES
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/spa-tratamientos.pdf"
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg"
                            >
                                <Download className="w-5 h-5" />
                                Carta de Tratamientos
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
