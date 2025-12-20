import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { Wifi, Car, Coffee, Tv, Bath, UserCheck, MapPin, TreePine, Clock, Users, ShieldCheck, ShoppingBag, Layout, Phone, Mail, ChevronRight, Star, ArrowRight, Bed } from 'lucide-react';
import SimpleGallerySlider from '@/components/SimpleGallerySlider';
import { RoomBookingWidget } from '@/components/RoomBookingWidget';

export const metadata: Metadata = {
    title: 'Habitación Triple en Loja | Hotel El Cardenal (Espacio para 3 personas)',
    description: 'Reserve nuestra habitación Triple en Loja. El alojamiento ideal para grupos o amigos con desayuno incluido, WiFi gratis y parking privado. ¡Cerca de todo!',
    keywords: ['Habitación Triple en Loja', 'Alojamiento para grupos en Loja', 'Hotel en Loja cerca del Supermaxi', 'Hotel familiar en Loja'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/habitaciones/triple',
    }
};

const galleryImages = [
    '/images/habitaciones/triple/triple-main.webp?v=2',
    '/images/habitaciones/triple/triple-thumb.webp?v=2',
    '/images/habitaciones/triple/doble-twin-main.webp?v=2',
    '/images/habitaciones/triple/familiar-loft-main.webp?v=2',
    '/images/habitaciones/triple/matrimonial-main.webp?v=2'
];

export default function TriplePage() {
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
                <h1>Habitación Triple - Hotel El Cardenal Loja</h1>
                <p>
                    La Habitación Triple es nuestra opción más versátil para grupos de amigos o familias pequeñas que visitan Loja.
                    Espaciosa y con una iluminación natural inmejorable, garantiza una estancia cómoda para todos los huéspedes.
                </p>

                <h2>Detalles de la Habitación</h2>
                <ul>
                    <li><strong>Capacidad:</strong> Hasta 3 adultos con total comodidad.</li>
                    <li><strong>Configuración:</strong> Tres camas individuales equipadas con lencería de primera calidad.</li>
                    <li><strong>Entorno:</strong> Ubicada en una zona libre de ruidos para asegurar el descanso del grupo.</li>
                </ul>

                <h2>Tarifas y Reserva Directa</h2>
                <p>Precio base desde: $40.18 USD (más impuestos y servicios). El desayuno lojano tradicional está incluido en la tarifa.</p>
                <p>Reserve directamente al 099 661 6878 para asegurar su estancia en grupo en Loja.</p>

                <h2>Servicios Destacados</h2>
                <ul>
                    <li>Desayuno completo incluido (café de altura, tamales lojanos y más).</li>
                    <li>WiFi de alta velocidad gratuito en toda la habitación.</li>
                    <li>Parqueadero privado y gratuito dentro del hotel.</li>
                    <li>Televisión por cable y pantalla plana.</li>
                    <li>Baño privado funcional con agua caliente 24/7.</li>
                </ul>

                <h2>Localización Estratégica</h2>
                <p>En el sector Los Rosales, Loja. A pocos minutos de la zona comercial pero con la paz de la naturaleza cercana.</p>
            </div>

            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative h-screen flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/habitaciones/triple/triple-main.webp?v=2"
                        alt="Habitación Triple - Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 drop-shadow-md leading-tight">
                            Habitación Triple en Loja: Espacio y Confort para Grupos
                        </h1>
                        <p className="text-lg md:text-2xl font-serif italic text-cardenal-gold drop-shadow-sm">
                            La solución ideal de alojamiento compartido en Loja
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
                                        Espacio y versatilidad para grupos o familias en el corazón residencial de Loja.
                                    </p>
                                    <p className="mt-4">
                                        La <strong>Habitación Triple de Hotel El Cardenal</strong> ha sido diseñada para ofrecer la máxima funcionalidad sin sacrificar el estilo neoclásico que nos caracteriza.
                                        Con capacidad para tres personas en camas independientes, es la solución perfecta para delegaciones, amigos en viaje de turismo o familias que buscan un hotel en Loja con parqueadero y desayuno incluido.
                                    </p>
                                </div>
                                <SimpleGallerySlider images={galleryImages} />
                            </div>

                            {/* Details Section */}
                            <section>
                                <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6 border-b-2 border-cardenal-gold/30 pb-2 inline-block">
                                    Configuración Triple: Independencia y Descanso
                                </h2>
                                <p className="text-gray-700 mb-8 text-lg">
                                    Cada huésped cuenta con su propio espacio de descanso, asegurando una estancia placentera para todos los integrantes del grupo.
                                </p>

                                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                                    <h3 className="text-2xl font-serif font-bold text-cardenal-green mb-6 flex items-center gap-3">
                                        <Users className="text-cardenal-gold" /> Características de la Habitación
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Triple Independencia</h4>
                                            <p className="text-gray-600">Tres camas individuales o configuración mixta según disponibilidad.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Espacio Generoso</h4>
                                            <p className="text-gray-600">Área optimizada para el movimiento de tres adultos y su equipaje.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Iluminación Natural</h4>
                                            <p className="text-gray-600">Ventanales que permiten disfrutar del clima privilegiado de Loja.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Services Section */}
                            <section className="bg-cardenal-green text-white p-8 md:p-12 rounded-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cardenal-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                                <h2 className="text-3xl font-serif font-bold text-cardenal-gold mb-8 relative z-10">
                                    Servicios Pensados para Grupos
                                </h2>
                                <p className="text-white/90 mb-8 text-lg relative z-10">
                                    Su reserva triple incluye beneficios exclusivos para que su grupo disfrute al máximo:
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Coffee size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Desayuno para Todos</h4>
                                            <p className="text-white/80 text-sm">Tres servicios de desayuno tradicional incluidos en su tarifa.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Wifi size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">WiFi de Alta Velocidad</h4>
                                            <p className="text-white/80 text-sm">Conexión estable para múltiples dispositivos simultáneamente.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Car size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Parqueo Privado</h4>
                                            <p className="text-white/80 text-sm">Seguridad total para su vehículo sin costo adicional.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Atención 24 Horas</h4>
                                            <p className="text-white/80 text-sm">Recepción disponible para cualquier requerimiento de su grupo.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Why Choose Section */}
                            <section className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6">
                                        Hospitalidad Lojana para Grupos
                                    </h2>
                                    <p className="text-gray-700 mb-6 font-medium">
                                        En El Cardenal entendemos la dinámica de viajar en grupo. Por eso ofrecemos un entorno tranquilo frente al río Malacatos.
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
                                            <div className="w-2 h-2 rounded-full bg-cardenal-gold shrink-0" />
                                            <span>La mejor relación calidad-precio para grupos en Loja.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="relative h-[350px] rounded-lg overflow-hidden shadow-xl group">
                                    <Image
                                        src="/images/habitaciones/triple/triple-main.webp?v=2"
                                        alt="Habitación Triple Loja"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                </div>
                            </section>

                            {/* Reserve Info & CTA */}
                            <section className="bg-white border-2 border-cardenal-gold/20 p-8 md:p-12 rounded-lg text-center shadow-lg">
                                <h3 className="text-2xl font-serif font-bold text-cardenal-green mb-8">Información de Estancia</h3>

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
                                        <div className="flex md:flex-col items-center gap-3 md:gap-2 mb-2">
                                            <MapPin className="text-cardenal-gold w-6 h-6" />
                                            <span className="font-bold text-cardenal-brown">Ubicación</span>
                                        </div>
                                        <p className="text-gray-600">Frente al Río Malacatos</p>
                                    </div>
                                </div>

                                <Link
                                    href="/contacto?motivo=Reserva+Habitacion+Triple#formulario-contacto"
                                    className="inline-flex items-center gap-3 bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-bold py-4 px-10 rounded-none transform hover:-translate-y-1 transition-all duration-300 shadow-xl uppercase tracking-widest text-sm"
                                >
                                    🛌 Reservar Habitación Triple ahora
                                </Link>
                            </section>
                        </div>

                        {/* Right Column: Booking Widget */}
                        <aside className="lg:col-span-1 hidden lg:block sticky top-24">
                            <RoomBookingWidget price="40.18" roomName="Triple" />
                        </aside>

                        {/* Mobile Widget */}
                        <div className="lg:hidden order-last">
                            <RoomBookingWidget price="40.18" roomName="Triple" />
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
                        "name": "Habitación Triple - Hotel El Cardenal Loja",
                        "description": "Habitación espaciosa para 3 personas con tres camas individuales, ideal para amigos o familias.",
                        "image": "https://hotelelcardenalloja.com/images/habitaciones/triple/triple-main.webp",
                        "occupancy": {
                            "@type": "QuantitativeValue",
                            "value": 3
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "40.18",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock"
                        },
                        "amenityFeature": [
                            { "@type": "LocationFeatureSpecification", "name": "WiFi Gratuito", "value": true },
                            { "@type": "LocationFeatureSpecification", "name": "Parqueadero Privado", "value": true },
                            { "@type": "LocationFeatureSpecification", "name": "Desayuno Tradicional", "value": true }
                        ]
                    })
                }}
            />
        </div>
    );
}
