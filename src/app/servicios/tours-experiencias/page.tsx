'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import {
    Map,
    TreePine,
    Camera,
    Landmark,
    UtensilsCrossed,
    Users,
    Car,
    Award,
    Shield,
    Tag,
    ArrowRight,
    MapPin
} from 'lucide-react';

// Paquetes de tours destacados
const toursDestacados = [
    {
        id: 1,
        titulo: 'Ruta al Parque Nacional Podocarpus',
        descripcion: 'Tour guiado por senderos milenarios en el Podocarpus, descubriendo lagunas y biodiversidad única. Ideal para trekking y observación de aves.',
        enfoque: 'Naturaleza y Biodiversidad',
        imagen: '/images/tours/tour-podocarpus.webp',
        icono: <TreePine className="w-6 h-6" />,
        duracion: 'Día completo (8 horas)',
        precio: 'Desde $45 USD por persona'
    },
    {
        id: 2,
        titulo: 'Eólico Villonaco y Miradores',
        descripcion: 'Visita al Parque Eólico Villonaco y los mejores miradores naturales, con vistas panorámicas de los valles de Loja y Catamayo. Perfecto para fotografía.',
        enfoque: 'Vistas y Aventura',
        imagen: '/images/tours/tour-villonaco.webp',
        icono: <Camera className="w-6 h-6" />,
        duracion: 'Medio día (4 horas)',
        precio: 'Desde $30 USD por persona'
    },
    {
        id: 3,
        titulo: 'Loja Histórica y Cultural',
        descripcion: 'Recorrido por el centro histórico, incluyendo la Puerta de la Ciudad, Calle Lourdes, Catedral de Loja y la Plaza de San Sebastián.',
        enfoque: 'Cultura y Arquitectura',
        imagen: '/images/tours/tour-loja-historica.webp',
        icono: <Landmark className="w-6 h-6" />,
        duracion: 'Medio día (3 horas)',
        precio: 'Desde $25 USD por persona'
    },
    {
        id: 4,
        titulo: 'Experiencia Gastronómica Local',
        descripcion: 'Tour culinario que incluye la visita a una plantación de café en Vilcabamba o a un mercado local con degustación de platos típicos lojanos.',
        enfoque: 'Sabor y Tradición',
        imagen: '/images/tours/tour-gastronomia.webp',
        icono: <UtensilsCrossed className="w-6 h-6" />,
        duracion: 'Medio día (4 horas)',
        precio: 'Desde $35 USD por persona'
    }
];

// Beneficios de reservar con el hotel
const beneficios = [
    {
        id: 1,
        icono: <Users className="w-8 h-8" />,
        titulo: 'Guías Certificados',
        descripcion: 'Expertos locales con conocimiento profundo de la región'
    },
    {
        id: 2,
        icono: <Car className="w-8 h-8" />,
        titulo: 'Transporte Privado Seguro',
        descripcion: 'Vehículos cómodos y seguros para su traslado'
    },
    {
        id: 3,
        icono: <Tag className="w-8 h-8" />,
        titulo: 'Descuentos Especiales',
        descripcion: 'Precios preferenciales al reservar con alojamiento'
    },
    {
        id: 4,
        icono: <Shield className="w-8 h-8" />,
        titulo: 'Seguro Incluido',
        descripcion: 'Cobertura de accidentes durante todas las excursiones'
    }
];

// Puntos de interés para el mapa
const puntosInteres = [
    { nombre: 'Hotel El Cardenal', distancia: 'Base de operaciones' },
    { nombre: 'Parque Nacional Podocarpus', distancia: '15 km - 25 min' },
    { nombre: 'Parque Eólico Villonaco', distancia: '14 km - 30 min' },
    { nombre: 'Puerta de la Ciudad', distancia: '1 km - 5 min' }
];

// Links de navegación a otros servicios
const serviciosLinks = [
    { label: 'Eventos', href: '/eventos' },
    { label: 'Piscina & Spa', href: '/servicios/piscina' },
    { label: 'Restaurante', href: '/restaurante' }
];

export default function ToursPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Visual - 70% del viewport */}
                <div className="relative w-full h-[70vh]">
                    <Image
                        src="/images/tours/hero-tours.webp"
                        alt="Tours y Experiencias en Loja"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>

                    {/* Títulos sobre el hero */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-5xl mx-auto text-center px-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                                Tours y Experiencias en Loja
                            </h1>
                            <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium">
                                Descubra el Podocarpus, Villonaco, Vilcabamba y el centro histórico con guías expertos
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
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                            <Map className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-xl text-gray-700 leading-relaxed">
                            El Hotel El Cardenal Loja es la base de operaciones ideal para su exploración. Trabajamos con los operadores turísticos más confiables de la región para ofrecerle una variedad de excursiones personalizadas. Nos encargamos de la logística, el transporte seguro y los detalles para que usted solo disfrute de la inmersión en la naturaleza y la cultura lojana.
                        </p>
                        <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mt-8"></div>
                    </div>
                </div>

                {/* Sección 2: Paquetes Destacados */}
                <div className="bg-gradient-to-b from-white to-gray-50 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-7xl mx-auto">
                            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                                Tours y Experiencias Destacadas
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {toursDestacados.map((tour) => (
                                    <div
                                        key={tour.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                                    >
                                        {/* Imagen */}
                                        <div className="relative aspect-[4/3]">
                                            <Image
                                                src={tour.imagen}
                                                alt={tour.titulo}
                                                fill
                                                className="object-cover"
                                            />
                                            {/* Badge de enfoque */}
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                                                {tour.enfoque}
                                            </div>
                                            {/* Icono */}
                                            <div className="absolute top-4 right-4 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                                {tour.icono}
                                            </div>
                                        </div>

                                        {/* Contenido */}
                                        <div className="p-6">
                                            <h4 className="text-lg font-bold text-gray-900 mb-3">
                                                {tour.titulo}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                                {tour.descripcion}
                                            </p>

                                            {/* Detalles */}
                                            <div className="mb-4 space-y-2">
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-semibold">Duración:</span> {tour.duracion}
                                                </p>
                                                <p className="text-sm font-bold text-amber-600">
                                                    {tour.precio}
                                                </p>
                                            </div>

                                            {/* CTA */}
                                            <Link
                                                href={`/contacto?tipo=tours&tour=${tour.id}`}
                                                className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                            >
                                                Consultar Detalle
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección 3: Beneficios */}
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                Beneficios de Reservar Tours con Nosotros
                            </h3>
                            <p className="text-lg text-gray-600">
                                Al reservar sus tours con Hotel El Cardenal Loja, obtiene beneficios exclusivos:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {beneficios.map((beneficio) => (
                                <div
                                    key={beneficio.id}
                                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 text-center"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 text-amber-600">
                                        {beneficio.icono}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                                        {beneficio.titulo}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {beneficio.descripcion}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mapa de Ubicación Estratégica */}
                <div className="bg-gray-50 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                                    <MapPin className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                    Ubicación Estratégica
                                </h3>
                                <p className="text-lg text-gray-600">
                                    Hotel El Cardenal Loja: Su base perfecta para explorar la región
                                </p>
                            </div>

                            {/* Mapa interactivo */}
                            <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200 mb-8">
                                <div className="relative aspect-[16/9] w-full">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.123456789012!2d-79.20456!3d-3.99312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cb37d6e6e6e6e7%3A0x637995655f417d45!2sLoja%2C%20Ecuador!5e0!3m2!1ses!2sus!4v1701720000000!5m2!1ses!2sus"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                </div>
                            </div>
                            <div className="text-center mb-8">
                                <a
                                    href="https://maps.app.goo.gl/M3W6xPt8dZPtytmy7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition-colors"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Ver ubicación exacta en Google Maps
                                </a>
                            </div>

                            {/* Puntos de interés */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {puntosInteres.map((punto, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center"
                                    >
                                        <h4 className="font-bold text-gray-900 mb-1">{punto.nombre}</h4>
                                        <p className="text-sm text-gray-600">{punto.distancia}</p>
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
                            ¿Listo para su Próxima Aventura?
                        </h3>
                        <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
                            Permítanos diseñar un itinerario personalizado que se adapte a sus intereses y tiempos.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link
                                href="/contacto?tipo=tours"
                                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                CONSULTAR TOURS PERSONALIZADOS
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/habitaciones"
                                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg"
                            >
                                VER ALOJAMIENTO
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
