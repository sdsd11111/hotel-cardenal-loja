import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { Phone, Mail, Wifi, Car, Coffee, Tv, Bath, UserCheck, MapPin, TreePine, Clock, Heart, ShieldCheck, ShoppingBag, ChevronRight, Star, Users, ArrowRight, Bed, Scaling } from 'lucide-react';
import SimpleGallerySlider from '@/components/SimpleGallerySlider';
import { RoomBookingWidget } from '@/components/RoomBookingWidget';

export const metadata: Metadata = {
    title: 'Habitación Matrimonial en Loja | Hotel El Cardenal (Privacidad y Confort)',
    description: 'La mejor habitación matrimonial en Loja para parejas. Confort neoclásico, desayuno tradicional, parking gratuito y vistas al río. ¡Reserve su escapada hoy!',
    keywords: ['Habitación Matrimonial en Loja', 'Estancia romántica en Loja', 'Alojamiento en Loja', 'Hotel cerca del río Malacatos', 'Hotel El Cardenal Matrimonial'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/habitaciones/matrimonial',
    }
};

const galleryImages = [
    '/images/habitaciones/matrimonial/matrimonial-main.webp?v=2',
    '/images/habitaciones/matrimonial/matrimonial-thumb.webp?v=2',
    '/images/habitaciones/matrimonial/detalle-1.webp?v=2',
    '/images/habitaciones/matrimonial/detalle-2.webp?v=2'
];

export default function MatrimonialPage() {
    return (
        <div className="flex flex-col min-h-screen bg-cardenal-cream/20">
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
                <h1>Habitación Matrimonial - Hotel El Cardenal Loja</h1>
                <p>
                    Nuestra Habitación Matrimonial es el refugio perfecto para parejas que buscan tranquilidad y romanticismo
                    en Loja. Con un diseño neoclásico cálido, ofrece el máximo confort para una estancia inolvidable.
                </p>

                <h2>Características Destacadas</h2>
                <ul>
                    <li><strong>Cama:</strong> Una cama matrimonial de alta gama para un descanso profundo.</li>
                    <li><strong>Ambiente:</strong> Tranquilo, privado y acogedor, ideal para aniversarios o escapadas.</li>
                    <li><strong>Vistas:</strong> Vistas al entorno natural y residencial del sector Los Rosales.</li>
                </ul>

                <h2>Tarifas y Reservas</h2>
                <p>Precio base desde: $26.78 USD (más impuestos y servicios). El desayuno típico de Loja está incluido sin costo adicional.</p>
                <p>Reserve online o por WhatsApp al 099 661 6878 para confirmar su habitación matrimonial.</p>

                <h2>Servicios de Cortesía</h2>
                <ul>
                    <li>Desayuno tradicional incluido (café lojano, frutas, huevos al gusto).</li>
                    <li>WiFi de alta velocidad ilimitado.</li>
                    <li>Parqueadero privado con seguridad.</li>
                    <li>TV LED con cable.</li>
                    <li>Baño privado con ducha de agua caliente.</li>
                </ul>

                <h2>Ubicación Privilegiada</h2>
                <p>En el corazón del sector Los Rosales (Gladiolos 154-42), a pocos pasos del Parque Lineal La Tebaida y el río Malacatos.</p>
            </div>

            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative h-screen flex items-end justify-center overflow-hidden pb-12 md:pb-24">
                    <Image
                        src="/images/habitaciones/matrimonial/matrimonial-main.webp"
                        alt="Habitación Matrimonial - Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 drop-shadow-md leading-tight">
                            Habitación Matrimonial en Loja: Elegancia y Descanso Privado
                        </h1>
                        <p className="text-lg md:text-2xl font-serif italic text-cardenal-gold drop-shadow-sm">
                            Disfrute de una estancia romántica y acogedora en nuestro hotel con estilo neoclásico
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-16 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* Left Column: Room Details */}
                        <div className="lg:col-span-2 space-y-16">
                            {/* Introduction with Gallery */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
                                <div className="prose prose-lg max-w-none text-gray-700 font-sans">
                                    <p className="text-xl leading-relaxed">
                                        El refugio perfecto para parejas en el corazón de Loja.
                                    </p>
                                    <p className="mt-4">
                                        La <strong>Habitación Matrimonial del Hotel El Cardenal</strong> ha sido diseñada como un santuario de paz.
                                        Ubicada en una zona privilegiada frente al río Malacatos, combina la calidez de los detalles en madera con la comodidad de un servicio de primera clase, siendo la opción ideal tanto para escapadas románticas como para viajeros que exigen el máximo confort.
                                    </p>
                                </div>

                                <SimpleGallerySlider images={galleryImages} />
                            </div>

                            {/* Details Section */}
                            <section>
                                <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6 border-b-2 border-cardenal-gold/30 pb-2 inline-block">
                                    Un Espacio Diseñado para su Bienestar
                                </h2>
                                <p className="text-gray-700 mb-8 text-lg">
                                    Cada rincón de nuestra suite matrimonial está pensado para ofrecer una atmósfera de tranquilidad y exclusividad.
                                </p>

                                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                                    <h3 className="text-2xl font-serif font-bold text-cardenal-green mb-6 flex items-center gap-3">
                                        <Heart className="text-cardenal-gold" /> Características de la Habitación
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Cama Matrimonial Premium</h4>
                                            <p className="text-gray-600">Equipada con colchón ortopédico y lencería de algodón de alta calidad para un sueño profundo.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Vistas Relajantes</h4>
                                            <p className="text-gray-600">Amplios ventanales que ofrecen una vista increíble hacia el entorno natural de Los Rosales y el sonido relajante del río.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Ambiente Íntimo</h4>
                                            <p className="text-gray-600">Decoración neoclásica que crea un entorno cálido, seguro y alejado del ruido urbano.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Services Section */}
                            <section className="bg-cardenal-green text-white p-8 md:p-12 rounded-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cardenal-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                                <h2 className="text-3xl font-serif font-bold text-cardenal-gold mb-8 relative z-10">
                                    Servicios Exclusivos para Parejas
                                </h2>
                                <p className="text-white/90 mb-8 text-lg relative z-10">
                                    Su estancia matrimonial incluye todo lo necesario para que solo se preocupe de disfrutar:
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Coffee size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Desayuno Gourmet</h4>
                                            <p className="text-white/80 text-sm">Pruebe las delicias de Loja en un ambiente íntimo y acogedor.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Wifi size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">WiFi de Alta Velocidad</h4>
                                            <p className="text-white/80 text-sm">Comparta sus mejores momentos sin interrupciones.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Seguridad y Privacidad</h4>
                                            <p className="text-white/80 text-sm">Vigilancia 24/7 y parqueo privado incluido.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Cerca de Todo</h4>
                                            <p className="text-white/80 text-sm">A pocos minutos del Supermaxi y las mejores zonas de la ciudad.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Why Choose Section */}
                            <section className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6">
                                        ¿Por qué Somos su Mejor Opción en Loja?
                                    </h2>
                                    <p className="text-gray-700 mb-6 font-medium">
                                        A diferencia de los hoteles tradicionales, en El Cardenal priorizamos la paz de nuestros huéspedes.
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
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 rounded-full bg-cardenal-gold text-cardenal-gold shrink-0" />
                                            <span>Entorno natural y silencioso frente al río.</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 rounded-full bg-cardenal-gold text-cardenal-gold shrink-0" />
                                            <span>Arquitectura neoclásica con historia lojana.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="relative h-[350px] rounded-lg overflow-hidden shadow-xl group">
                                    <Image
                                        src="/images/habitaciones/matrimonial/matrimonial-main.webp"
                                        alt="Vista panorámica Loja"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                </div>
                            </section>

                            {/* Reserve Info & CTA */}
                            <section className="bg-white border-2 border-cardenal-gold/20 p-8 md:p-12 rounded-lg text-center shadow-lg">
                                <h3 className="text-2xl font-serif font-bold text-cardenal-green mb-8">Gestione su Reserva</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left md:text-center max-w-3xl mx-auto">
                                    <div className="p-4 bg-cardenal-cream/30 rounded-lg">
                                        <div className="flex md:flex-col items-center gap-3 md:gap-2 mb-2">
                                            <Clock className="text-cardenal-gold w-6 h-6" />
                                            <span className="font-bold text-cardenal-brown">Check-in</span>
                                        </div>
                                        <p className="text-gray-600">Desde las 14:00</p>
                                    </div>

                                    <div className="p-4 bg-cardenal-cream/30 rounded-lg">
                                        <div className="flex md:flex-col items-center gap-3 md:gap-2 mb-2">
                                            <Clock className="text-cardenal-gold w-6 h-6" />
                                            <span className="font-bold text-cardenal-brown">Check-out</span>
                                        </div>
                                        <p className="text-gray-600">Hasta las 11:00</p>
                                    </div>

                                    <div className="p-4 bg-cardenal-cream/30 rounded-lg">
                                        <div className="flex md:flex-col items-center gap-3 md:gap-2 mb-2 text-xl">
                                            ☕
                                            <span className="font-bold text-cardenal-brown ml-1">Desayuno</span>
                                        </div>
                                        <p className="text-gray-600">Incluido en su tarifa</p>
                                    </div>
                                </div>

                                <Link
                                    href="/habitaciones"
                                    className="inline-flex items-center gap-3 bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-bold py-4 px-10 rounded-none transform hover:-translate-y-1 transition-all duration-300 shadow-xl uppercase tracking-widest text-sm"
                                >
                                    ✨ Reservar Habitación Matrimonial ahora
                                </Link>
                            </section>
                        </div>

                        {/* Right Column: Booking Widget */}
                        <aside className="lg:col-span-1 hidden lg:block sticky top-24">
                            <RoomBookingWidget price="Cotizar" roomName="Matrimonial" />
                        </aside>

                        {/* Mobile Widget */}
                        <div className="lg:hidden order-last">
                            <RoomBookingWidget price="Cotizar" roomName="Matrimonial" />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            {/* 📊 Structured Data (JSON-LD) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HotelRoom",
                        "name": "Habitación Matrimonial - Hotel El Cardenal Loja",
                        "description": "Habitación acogedora y romántica para parejas, con vistas al río Malacatos.",
                        "image": "https://hotelelcardenalloja.com/images/habitaciones/matrimonial/matrimonial-main.webp",
                        "occupancy": {
                            "@type": "QuantitativeValue",
                            "value": 2
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "26.78",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock"
                        },
                        "amenityFeature": [
                            { "@type": "LocationFeatureSpecification", "name": "WiFi Gratuito", "value": true },
                            { "@type": "LocationFeatureSpecification", "name": "Ambiente Romántico", "value": true },
                            { "@type": "LocationFeatureSpecification", "name": "Desayuno Tradicional", "value": true }
                        ]
                    })
                }}
            />
        </div>
    );
}

