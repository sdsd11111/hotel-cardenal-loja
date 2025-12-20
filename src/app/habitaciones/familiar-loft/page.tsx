import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { Phone, Mail, Coffee, Wifi, Tv, Wind, ShieldCheck, MapPin, ChevronRight, Star, Users, ArrowRight, Bed, Layout, Home, ShoppingBag, Clock } from 'lucide-react';
import SimpleGallerySlider from '@/components/SimpleGallerySlider';
import { RoomBookingWidget } from '@/components/RoomBookingWidget';

export const metadata: Metadata = {
    title: 'Familiar Loft en Loja | Hotel El Cardenal (Habitación en 2 Niveles)',
    description: 'Descubra el Familiar Loft en Loja: habitación tipo dúplex de dos niveles ideal para familias. Confort, desayuno incluido, parking y cerca del Parque La Tebaida.',
    keywords: ['Familiar Loft en Loja', 'Hotel familiar en Loja', 'Habitación tipo loft en Loja', 'Alojamiento para familias en Loja', 'Hotel El Cardenal Loft'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/habitaciones/familiar-loft',
    }
};

const galleryImages = [
    '/images/habitaciones/familiar/familiar-loft-main.webp',
    '/images/habitaciones/familiar/familiar-loft-thumb.webp',
    '/images/habitaciones/familiar/3-1 OCT 2022.webp',
    '/images/habitaciones/familiar/304-4D.webp',
    '/images/habitaciones/familiar/room-economic-203-3-scaled (1) (1).webp'
];

export default function FamiliarLoftPage() {
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
                <h1>Habitación Familiar Loft - Hotel El Cardenal Loja</h1>
                <p>
                    El Familiar Loft es nuestra joya de la corona, diseñada específicamente para familias numerosas o grupos
                    que buscan la máxima independencia en Loja. Su diseño en dos niveles ofrece privacidad y amplitud
                    sin igual en el sector hotelero de la ciudad.
                </p>

                <h2>Características del Loft</h2>
                <ul>
                    <li><strong>Capacidad:</strong> Hasta 5 personas cómodamente distribuidas.</li>
                    <li><strong>Diseño:</strong> Estilo tipo suite en dos niveles (Loft) con acabados en madera y piedra volcánica.</li>
                    <li><strong>Independencia:</strong> Espacios amplios que permiten una convivencia armoniosa durante estancias largas.</li>
                </ul>

                <h2>Precio y Facilidades de Reserva</h2>
                <p>Precio base desde: $53.57 USD (más impuestos y servicios). Incluye desayuno tradicional completo para todos los huéspedes.</p>
                <p>Contacte directamente al 099 661 6878 para gestionar su reserva familiar con atención personalizada.</p>

                <h2>Servicios de Valor Añadido</h2>
                <ul>
                    <li>Desayuno tradicional lojano incluido (la mejor manera de empezar el día en Loja).</li>
                    <li>WiFi de alta velocidad estable para trabajo o entretenimiento.</li>
                    <li>Parqueadero privado gratuito dentro de las instalaciones.</li>
                    <li>TV LED con amplia variedad de canales por cable.</li>
                    <li>Baño privado moderno con agua caliente garantizada.</li>
                </ul>

                <h2>Ubicación Tranquila</h2>
                <p>Ubicado en el sector exclusivo Los Rosales, junto al río Malacatos, garantizando un sueño profundo sin ruidos de ciudad.</p>
            </div>

            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative h-screen flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/habitaciones/familiar/familiar-loft-main.webp"
                        alt="Habitación Familiar Loft - Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 drop-shadow-md leading-tight">
                            Familiar Loft en Loja: El Refugio Ideal para su Familia
                        </h1>
                        <p className="text-lg md:text-2xl font-serif italic text-cardenal-gold drop-shadow-sm">
                            Disfrute de la máxima amplitud y privacidad en nuestro exclusivo Loft de dos niveles
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
                                        Diseñado para familias que buscan una experiencia de hogar en Loja.
                                    </p>
                                    <p className="mt-4">
                                        La <strong>Familiar Loft</strong> es la joya de la corona del Hotel El Cardenal. Este espacio único, distribuido en dos niveles independientes, combina la arquitectura neoclásica con la funcionalidad moderna.
                                        Es la opción perfecta para quienes buscan un hotel familiar en Loja que no solo ofrezca camas, sino un entorno de convivencia seguro, amplio y rodeado de naturaleza.
                                    </p>
                                </div>

                                <SimpleGallerySlider images={galleryImages} />
                            </div>

                            {/* Details Section */}
                            <section>
                                <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6 border-b-2 border-cardenal-gold/30 pb-2 inline-block">
                                    Distribución en Dos Niveles: Privacidad y Confort
                                </h2>
                                <p className="text-gray-700 mb-8 text-lg">
                                    A diferencia de una habitación múltiple convencional, nuestro Loft permite que cada miembro de la familia encuentre su propio espacio de descanso.
                                </p>

                                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                                    <h3 className="text-2xl font-serif font-bold text-cardenal-green mb-6 flex items-center gap-3">
                                        <Home className="text-cardenal-gold" /> Configuración y Espacios
                                    </h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Planta Baja</h4>
                                            <p className="text-gray-600">Área social y de descanso con camas configuradas para la comodidad de los hijos o acompañantes.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Planta Alta (Mezzanine)</h4>
                                            <p className="text-gray-600">Un espacio íntimo y elevado, ideal para los padres, que garantiza privacidad total.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Capacidad Ampliada</h4>
                                            <p className="text-gray-600">Diseñada para alojar a familias grandes con total libertad de movimiento.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Vistas Panorámicas</h4>
                                            <p className="text-gray-600">Ventanales de doble altura que capturan la luz del sol y ofrecen una vista privilegiada al río y los jardines.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Services Section */}
                            <section className="bg-cardenal-green text-white p-8 md:p-12 rounded-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cardenal-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                                <h2 className="text-3xl font-serif font-bold text-cardenal-gold mb-8 relative z-10">
                                    Servicios Pensados para la Familia
                                </h2>
                                <p className="text-white/90 mb-8 text-lg relative z-10">
                                    Sabemos que viajar en familia requiere atención especial. Por eso, su reserva en el Loft incluye:
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Coffee size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Desayuno Familiar</h4>
                                            <p className="text-white/80 text-sm">Menú variado con opciones para niños y adultos, todo incluido.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Wifi size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">WiFi de Alta Capacidad</h4>
                                            <p className="text-white/80 text-sm">Para que todos los miembros de la familia estén conectados simultáneamente.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Ambiente Seguro</h4>
                                            <p className="text-white/80 text-sm">Instalaciones seguras para niños y parqueo privado en el sitio.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Cercanía a Parques</h4>
                                            <p className="text-white/80 text-sm">A pocos metros del Parque Lineal La Tebaida, ideal para caminatas familiares.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Why Choose Section */}
                            <section className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6">
                                        ¿Por qué Elegir el Familiar Loft?
                                    </h2>
                                    <p className="text-gray-700 mb-6 font-medium">
                                        No somos una habitación de hotel más; somos el espacio donde su familia creará recuerdos inolvidables en Loja.
                                    </p>

                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 rounded-full bg-cardenal-gold text-cardenal-gold shrink-0" />
                                            <span>Privacidad real con habitaciones en diferentes niveles.</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 rounded-full bg-cardenal-gold text-cardenal-gold shrink-0" />
                                            <span>Vistas espectaculares al río Malacatos y la ciudad.</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 rounded-full bg-cardenal-gold text-cardenal-gold shrink-0" />
                                            <span>Trato cercano y humano que le hará sentir en casa.</span>
                                        </li>
                                    </ul>
                                    <div className="mt-8 space-y-4">
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
                                <div className="relative h-[350px] rounded-lg overflow-hidden shadow-xl group">
                                    <Image
                                        src="/images/habitaciones/familiar/familiar-loft-main.webp"
                                        alt="Estancia Familiar Loja"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0"></div>
                                </div>
                            </section>

                            {/* Reserve Info & CTA */}
                            <section className="bg-white border-2 border-cardenal-gold/20 p-8 md:p-12 rounded-lg text-center shadow-lg">
                                <h3 className="text-2xl font-serif font-bold text-cardenal-green mb-8">Información de su Estancia</h3>

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
                                            <Users className="text-cardenal-gold w-6 h-6" />
                                            <span className="font-bold text-cardenal-brown">Familias</span>
                                        </div>
                                        <p className="text-gray-600">Ambiente 100% familiar</p>
                                    </div>
                                </div>

                                <Link
                                    href="/contacto?motivo=Reserva+Habitacion+Familiar+Loft#formulario-contacto"
                                    className="inline-flex items-center gap-3 bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-bold py-4 px-10 rounded-none transform hover:-translate-y-1 transition-all duration-300 shadow-xl uppercase tracking-widest text-sm"
                                >
                                    👨‍👩‍👧‍👦 Reservar Familiar Loft ahora
                                </Link>
                            </section>
                        </div>

                        {/* Right Column: Booking Widget */}
                        <aside className="lg:col-span-1 hidden lg:block sticky top-24">
                            <RoomBookingWidget price="53.57" roomName="Familiar Loft" />
                        </aside>

                        {/* Mobile Widget */}
                        <div className="lg:hidden order-last">
                            <RoomBookingWidget price="53.57" roomName="Familiar Loft" />
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
                        "name": "Familiar Loft - Hotel El Cardenal Loja",
                        "description": "Habitación tipo dúplex de dos niveles ideal para familias de hasta 5 personas.",
                        "image": "https://hotelelcardenalloja.com/images/habitaciones/familiar/familiar-loft-main.webp",
                        "occupancy": {
                            "@type": "QuantitativeValue",
                            "value": 5
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "53.57",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock"
                        },
                        "amenityFeature": [
                            { "@type": "LocationFeatureSpecification", "name": "WiFi Gratuito", "value": true },
                            { "@type": "LocationFeatureSpecification", "name": "Agua Caliente", "value": true },
                            { "@type": "LocationFeatureSpecification", "name": "TV por Cable", "value": true },
                            { "@type": "LocationFeatureSpecification", "name": "Desayuno Tradicional", "value": true }
                        ]
                    })
                }}
            />
        </div>
    );
}

