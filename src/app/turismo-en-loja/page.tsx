import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { MapPin, Phone, Mail, Camera, Coffee, Wifi, Star, ArrowRight, Utensils, Mountain, Building2, Palmtree, ShoppingCart, Sun } from 'lucide-react';
import { ImageLightbox } from '@/components/ImageLightbox';

export const metadata: Metadata = {
    title: 'Turismo en Loja, Ecuador | Guía de Lugares y Hospedaje',
    description: 'Descubre los mejores lugares turísticos en Loja: Parque Jipiro, La Tebaida, Pucará y más. Hospédate en Hotel El Cardenal y vive la cultura lojana de cerca.',
    keywords: ['Turismo en Loja', 'Qué hacer en Loja Ecuador', 'Lugares turísticos en Loja', 'Hotel cerca de Parque La Tebaida', 'Parque Jipiro', 'Parque Pucará'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/turismo-en-loja',
    }
};

export default function TurismoPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* 🤖 LLM & SEO Hidden Content */}
            <div
                style={{
                    position: 'absolute',
                    left: '-10000px',
                    top: 'auto',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                }}
                aria-hidden="true"
            >
                <h1>Turismo en Loja, Ecuador - Guía de Hotel El Cardenal</h1>
                <p>
                    Loja, conocida como la Centinela del Sur y la Capital Musical del Ecuador, ofrece una riqueza
                    cultural y natural incomparable. Desde Hotel El Cardenal, le brindamos acceso privilegiado
                    a los mejores destinos turísticos de la ciudad.
                </p>

                <h2>Lugares Turísticos Imperdibles en Loja</h2>

                <h3>Parque Lineal La Tebaida</h3>
                <p>
                    Ubicado a solo 2 minutos del hotel. Es el pulmón verde de la ciudad, ideal para caminatas junto al río Malacatos,
                    deporte al aire libre y visitas a su orquideario.
                </p>

                <h3>Parque Recreacional Jipiro</h3>
                <p>
                    A 12 minutos del hotel. Famoso por sus réplicas arquitectónicas mundiales (Torre Eiffel, Pagoda China)
                    y su laguna recreativa. Es un destino familiar por excelencia.
                </p>

                <h3>Parque Colinar Pucará</h3>
                <p>
                    A 10 minutos del hotel. Ofrece la mejor vista panorámica de Loja. Ideal para disfrutar el atardecer
                    y la geografía lojana desde sus miradores.
                </p>

                <h2>Cultura y Patrimonio</h2>
                <ul>
                    <li><strong>Puerta de la Ciudad:</strong> Símbolo arquitectónico de Loja, con museo y galerías de arte.</li>
                    <li><strong>Plaza de la Independencia:</strong> Corazón histórico rodeado de arquitectura colonial.</li>
                    <li><strong>Calle Lourdes:</strong> La calle más pintoresca, llena de colores, artesanías y café de altura.</li>
                </ul>

                <h2>Gastronomía Tradicional</h2>
                <p>
                    No deje de probar el Repe Lojano (sopa de guineo verde), los Tamales Lojanos, la Cecina
                    y, por supuesto, nuestro mundialmente premiado Café de Altura.
                </p>

                <h2>Hospedaje Estratégico</h2>
                <p>
                    Hotel El Cardenal se encuentra en la Urbanización Los Rosales, un sector residencial seguro
                    y tranquilo, perfecto para descansar después de explorar las maravillas de Loja.
                </p>
            </div>

            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Fullscreen Hero Section */}
                <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/turismo/hero.webp?v=2"
                        alt="Turismo en Loja - Hotel El Cardenal"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/60 md:bg-black/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                    <div className="relative z-10 text-center text-white px-6 md:px-4 max-w-5xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 drop-shadow-2xl leading-tight">
                            Turismo en Loja: Descubra la <span className="text-cardenal-gold">Centinela del Sur</span>
                        </h1>
                        <p className="text-lg md:text-2xl font-serif italic text-white/90 drop-shadow-md mb-10 max-w-3xl mx-auto">
                            Guía completa de lugares mágicos, cultura y naturaleza. Hospédese en el corazón de la tranquilidad.
                        </p>
                        <Link
                            href="/habitaciones"
                            className="inline-flex items-center gap-3 bg-cardenal-gold hover:bg-white text-cardenal-brown hover:text-cardenal-green font-bold py-5 px-10 rounded-lg transition-all duration-300 shadow-2xl uppercase tracking-widest text-sm"
                        >
                            Reservar mi Estancia
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Intro Section */}
                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <div className="prose prose-lg max-w-none text-center text-gray-700 font-sans mb-16">
                        <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6">
                            ¿Qué visitar en Loja? Naturaleza y Cultura a su alcance
                        </h2>
                        <p className="text-xl leading-relaxed">
                            Loja es la capital musical y cultural del Ecuador. Desde el <strong>Hotel El Cardenal</strong>, ubicado estratégicamente en la Urbanización Los Rosales, usted tiene acceso privilegiado a los tesoros mejor guardados de la ciudad.
                        </p>
                    </div>

                    {/* Destinos Imperdibles */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-serif font-bold text-center text-gray-900 mb-12">
                            Destinos Imperdibles cerca de Hotel El Cardenal
                        </h2>
                        <div className="space-y-12">
                            {/* 1. Parque Lineal La Tebaida */}
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <ImageLightbox
                                    src="/images/turismo/parque-lineal.webp?v=2"
                                    alt="Parque Lineal La Tebaida - Cerca de Hotel El Cardenal"
                                    className="w-full md:w-1/2"
                                    aspectRatio="h-64 md:h-80"
                                />
                                <div className="w-full md:w-1/2 p-8">
                                    <h3 className="text-2xl font-bold text-cardenal-brown mb-3 flex items-center gap-2">
                                        <span className="bg-cardenal-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                                        Parque Lineal La Tebaida <span className="text-sm font-normal text-gray-500 bg-white px-2 py-1 rounded border">(A 2 minutos)</span>
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Es el pulmón verde más cercano al hotel. Ideal para quienes buscan turismo de naturaleza en Loja. Cuenta con senderos junto al río Malacatos, canchas deportivas, áreas de picnic y un orquideario. Es perfecto para una caminata matutina antes del <Link href="/restaurante" className="text-cardenal-gold font-bold hover:underline">desayuno tradicional</Link> en nuestro hotel.
                                    </p>
                                    <a href="https://goo.gl/maps/example" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cardenal-green font-bold text-sm hover:underline">
                                        <MapPin size={16} /> Cómo llegar desde el hotel
                                    </a>
                                </div>
                            </div>

                            {/* 2. Parque Recreacional Jipiro */}
                            <div className="flex flex-col md:flex-row-reverse gap-8 items-center bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <ImageLightbox
                                    src="/images/turismo/parque-jipiro.webp?v=2"
                                    alt="Parque Recreacional Jipiro - Cerca de Hotel El Cardenal"
                                    className="w-full md:w-1/2"
                                    aspectRatio="h-64 md:h-80"
                                />
                                <div className="w-full md:w-1/2 p-8">
                                    <h3 className="text-2xl font-bold text-cardenal-brown mb-3 flex items-center gap-2">
                                        <span className="bg-cardenal-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                                        Parque Recreacional Jipiro <span className="text-sm font-normal text-gray-500 bg-white px-2 py-1 rounded border">(A 12 minutos)</span>
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Conocido como uno de los parques más bellos del Ecuador. Alberga réplicas arquitectónicas de las maravillas del mundo (como la Torre Eiffel y la Pagoda China). Es un destino obligado para familias y fotógrafos.
                                    </p>
                                    <a href="https://goo.gl/maps/example" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cardenal-green font-bold text-sm hover:underline">
                                        <MapPin size={16} /> Cómo llegar desde el hotel
                                    </a>
                                </div>
                            </div>

                            {/* 3. Parque Colinar Pucará */}
                            <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <ImageLightbox
                                    src="/images/turismo/Pucara.webp?v=2"
                                    alt="Parque Colinar Pucará Vista Panorámica - Cerca de Hotel El Cardenal"
                                    className="w-full md:w-1/2"
                                    aspectRatio="h-64 md:h-80"
                                />
                                <div className="w-full md:w-1/2 p-8">
                                    <h3 className="text-2xl font-bold text-cardenal-brown mb-3 flex items-center gap-2">
                                        <span className="bg-cardenal-gold text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
                                        Parque Colinar Pucará <span className="text-sm font-normal text-gray-500 bg-white px-2 py-1 rounded border">(A 10 minutos)</span>
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Ubicado en una zona alta, ofrece la mejor vista panorámica de Loja. Es el lugar ideal para ver el atardecer y comprender la geografía de la ciudad. Cuenta con cafeterías y miradores modernos.
                                    </p>
                                    <a href="https://wa.me/593996616878" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cardenal-green hover:text-cardenal-gold transition-colors font-bold group">
                                        <span className="bg-cardenal-gold/10 p-2 rounded-full group-hover:bg-cardenal-gold group-hover:text-white transition-all">
                                            <Phone className="w-4 h-4" />
                                        </span>
                                        099 661 6878
                                    </a>
                                    <a href="mailto:elcardenalhotel@gmail.com" className="flex items-center gap-2 text-cardenal-green hover:text-cardenal-gold transition-colors font-bold group">
                                        <span className="bg-cardenal-gold/10 p-2 rounded-full group-hover:bg-cardenal-gold group-hover:text-white transition-all">
                                            <Mail className="w-4 h-4" />
                                        </span>
                                        elcardenalhotel@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* H2: El Corazón Histórico */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-serif font-bold text-center text-gray-900 mb-12">
                            El Corazón Histórico y Cultural
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden hover:-translate-y-1 transition-transform">
                                <ImageLightbox
                                    src="/images/turismo/puerta-de-la-city.webp?v=2"
                                    alt="Puerta de la Ciudad Loja - Cerca de Hotel El Cardenal"
                                    aspectRatio="h-48"
                                />
                                <div className="p-6">
                                    <h4 className="font-bold text-xl text-cardenal-brown mb-2">4. Puerta de la Ciudad</h4>
                                    <p className="text-gray-600 text-sm">El monumento más emblemático de Loja. Funciona como un museo, galería de arte y mirador. Es la entrada simbólica al centro histórico.</p>
                                    <a href="https://goo.gl/maps/example" className="text-cardenal-gold text-xs font-bold mt-4 inline-block hover:underline">Ver ubicación</a>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden hover:-translate-y-1 transition-transform">
                                <ImageLightbox
                                    src="/images/turismo/plaza.webp?v=2"
                                    alt="Plaza de la Independencia Loja"
                                    aspectRatio="h-48"
                                />
                                <div className="p-6">
                                    <h4 className="font-bold text-xl text-cardenal-brown mb-2">5. Plaza de la Independencia</h4>
                                    <p className="text-gray-600 text-sm">Lugar donde se proclamó la independencia de Loja. Sus edificios coloniales y su torre del reloj la convierten en un punto de encuentro lleno de historia.</p>
                                    <a href="https://goo.gl/maps/example" className="text-cardenal-gold text-xs font-bold mt-4 inline-block hover:underline">Ver ubicación</a>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden hover:-translate-y-1 transition-transform">
                                <ImageLightbox
                                    src="/images/turismo/calle-lourdes.webp?v=2"
                                    alt="Calle Lourdes Loja"
                                    aspectRatio="h-48"
                                />
                                <div className="p-6">
                                    <h4 className="font-bold text-xl text-cardenal-brown mb-2">6. Calle Lourdes</h4>
                                    <p className="text-gray-600 text-sm">La calle más pintoresca de la ciudad. Con sus casas coloridas y faroles antiguos, ideal para comprar artesanías y probar el café local.</p>
                                    <a href="https://goo.gl/maps/example" className="text-cardenal-gold text-xs font-bold mt-4 inline-block hover:underline">Ver ubicación</a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* H2: Gastronomía Lojana */}
                    <section className="mb-20 bg-cardenal-cream/50 p-8 md:p-12 rounded-2xl">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6">
                                    Gastronomía Lojana: Un Viaje de Sabores
                                </h2>
                                <p className="text-gray-700 mb-6">
                                    No se puede hablar de turismo en Loja sin mencionar su comida.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 items-start">
                                        <Sun className="text-cardenal-gold shrink-0 mt-1" size={20} />
                                        <div>
                                            <strong className="text-cardenal-brown block">Tamales Lojanos</strong>
                                            <span className="text-gray-600 text-sm">Consumidos tradicionalmente en el desayuno (disponibles en nuestro hotel).</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <Sun className="text-cardenal-gold shrink-0 mt-1" size={20} />
                                        <div>
                                            <strong className="text-cardenal-brown block">Repe Lojano</strong>
                                            <span className="text-gray-600 text-sm">Una deliciosa sopa a base de guineo verde y quesillo.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <Sun className="text-cardenal-gold shrink-0 mt-1" size={20} />
                                        <div>
                                            <strong className="text-cardenal-brown block">Cecina Lojana</strong>
                                            <span className="text-gray-600 text-sm">Carne de cerdo fileteada y secada al sol, servida con yuca y mote.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <ImageLightbox
                                src="/images/turismo/gastronomia.png?v=2"
                                alt="Gastronomía Tradicional de Loja - Cerca de Hotel El Cardenal"
                                className="rounded-xl shadow-lg border-4 border-white"
                                aspectRatio="h-80"
                            />
                        </div>
                    </section>

                    {/* Final CTA */}
                    <div className="text-center pb-10">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">¿Listo para explorar Loja?</h3>
                        <Link
                            href="/habitaciones"
                            className="inline-flex items-center gap-2 bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-4 px-10 rounded-lg shadow-xl transition-all uppercase tracking-widest"
                        >
                            Reservar mi Estancia
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
