import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { Phone, Mail, Wifi, Car, Coffee, Tv, Bath, UserCheck, MapPin, TreePine, Clock, ChevronRight, Star, Users, ArrowRight, BedDouble, Scaling } from 'lucide-react';
import SimpleGallerySlider from '@/components/SimpleGallerySlider';
import { RoomBookingWidget } from '@/components/RoomBookingWidget';

export const metadata: Metadata = {
    title: 'Habitación Doble Twin en Loja | Hotel El Cardenal (Desayuno Incluido)',
    description: 'Reserve su habitación Doble Twin en el mejor hotel familiar de Loja. 28m² de confort, WiFi gratis, parking y desayuno tradicional cerca del Parque La Tebaida.',
    keywords: ['Habitación Doble Twin en Loja', 'Hospedaje en Loja', 'Hotel familiar en Loja', 'Desayuno tradicional', 'Hotel en Loja con parking'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/doble-twin',
    }
};

const galleryImages = [
    '/images/habitaciones/doble/doble-twin-main.webp',
    '/images/habitaciones/doble/doble-twin-thumb.webp',
    '/images/habitaciones/doble/familiar-loft-main.webp',
    '/images/habitaciones/doble/matrimonial-main.webp',
    '/images/habitaciones/doble/triple-main.webp'
];

export default function DobleTwinPage() {
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
                <h1>Habitación Doble Twin - Hotel El Cardenal Loja</h1>
                <p>
                    La Habitación Doble Twin es ideal para amigos, colegas o familiares que buscan un descanso reparador
                    en Loja. Con un área de 28m², ofrece un ambiente neoclásico elegante y funcional.
                </p>

                <h2>Características de la Habitación</h2>
                <ul>
                    <li><strong>Camas:</strong> Dos camas cómodas para un descanso compartido pero independiente.</li>
                    <li><strong>Área:</strong> 28 metros cuadrados de espacio bien distribuido.</li>
                    <li><strong>Vistas:</strong> Ventanales amplios con vista al sector residencial Los Rosales.</li>
                </ul>

                <h2>Precio y Reservas</h2>
                <p>Consulte nuestras tarifas dinámicas según fechas y ocupación. El desayuno tradicional está incluido.</p>
                <p>Reserve directamente vía WhatsApp al 099 661 6878 para obtener las mejores tarifas.</p>

                <h2>Servicios Incluidos</h2>
                <ul>
                    <li>Desayuno tradicional lojano (café de altura, tamales, etc.).</li>
                    <li>WiFi de alta velocidad gratuito.</li>
                    <li>Parqueadero privado y seguro.</li>
                    <li>TV de pantalla plana con cable.</li>
                    <li>Baño privado con agua caliente.</li>
                </ul>

                <h2>Ubicación</h2>
                <p>Ubicada en Gladiolos 154-42 y Av. 18 de Noviembre, Loja, junto al río Malacatos y el Parque La Tebaida.</p>
            </div>

            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative h-screen flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/habitaciones/doble/doble-twin-thumb.webp"
                        alt="Habitación Doble Twin - Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                        quality={75}
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 drop-shadow-md leading-tight">
                            Habitación Doble Twin en Loja: Confort y Descanso Compartido
                        </h1>
                        <p className="text-lg md:text-2xl font-serif italic text-cardenal-gold drop-shadow-sm">
                            Disfrute de una estancia placentera en nuestro hotel familiar en Loja
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
                                        La <strong>Habitación Doble Twin de Hotel El Cardenal</strong> es la opción predilecta para amigos, familiares o colegas de trabajo.
                                        Con un área de <strong>28 m²</strong>, este espacio combina la elegancia de la arquitectura neoclásica con las comodidades modernas necesarias para un hospedaje en Loja productivo y relajante.
                                    </p>
                                </div>
                                <SimpleGallerySlider images={galleryImages} />
                            </div>

                            {/* Details Section */}
                            <section>
                                <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6 border-b-2 border-cardenal-gold/30 pb-2 inline-block">
                                    Detalles que Marcan la Diferencia en su Estancia
                                </h2>
                                <p className="text-gray-700 mb-8 text-lg">
                                    Nuestra prioridad es su descanso. Por ello, la habitación Doble Twin ha sido configurada pensando en la versatilidad y la privacidad de cada huésped.
                                </p>

                                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                                    <h3 className="text-2xl font-serif font-bold text-cardenal-green mb-6 flex items-center gap-3">
                                        <UserCheck className="text-cardenal-gold" /> Configuración de Camas y Capacidad
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Capacidad</h4>
                                            <p className="text-gray-600">Hasta 3 personas (según configuración).</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Camas</h4>
                                            <p className="text-gray-600">Equipadas con lencería de alta gama para garantizar un sueño reparador tras un día de turismo o negocios.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-cardenal-brown">Ambiente</h4>
                                            <p className="text-gray-600">Ventanales amplios que permiten la entrada de luz natural y aire puro, con vistas al sector residencial Los Rosales.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Services Section */}
                            <section className="bg-cardenal-green text-white p-8 md:p-12 rounded-xl shadow-2xl relative overflow-hidden">
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cardenal-gold/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                                <h2 className="text-3xl font-serif font-bold text-cardenal-gold mb-8 relative z-10">
                                    Servicios Incluidos para una Experiencia Superior
                                </h2>
                                <p className="text-white/90 mb-8 text-lg relative z-10">
                                    Al reservar nuestra Habitación Doble Twin, usted accede a todos los beneficios que nos posicionan como el hotel tranquilo en Loja mejor valorado:
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Coffee size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Desayuno Tradicional Incluido</h4>
                                            <p className="text-white/80 text-sm">Comience su mañana con nuestro famoso café lojano y tamales típicos en nuestro restaurante.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Wifi size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Conectividad Premium</h4>
                                            <p className="text-white/80 text-sm">WiFi gratuito de alta velocidad y escritorio de trabajo, ideal para nómadas digitales o viajeros corporativos.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Car size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Seguridad Total</h4>
                                            <p className="text-white/80 text-sm">Parqueadero privado y gratuito dentro de las instalaciones del hotel.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Tv size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Entretenimiento</h4>
                                            <p className="text-white/80 text-sm">Televisión de pantalla plana con canales por cable para sus momentos de ocio.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-full text-cardenal-gold">
                                            <Bath size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Comodidad Privada</h4>
                                            <p className="text-white/80 text-sm">Baño propio con ducha de agua caliente y artículos de aseo gratuitos.</p>
                                        </div>
                                    </div>
                                </div>
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
                            </section>

                            {/* Why Choose Section */}
                            <section className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-6">
                                        ¿Por qué elegir el Alojamiento Doble Twin en Hotel El Cardenal?
                                    </h2>
                                    <p className="text-gray-700 mb-6 font-medium">
                                        Ubicado a orillas del río Malacatos y a solo 7 minutos del Supermaxi, nuestro hotel ofrece un entorno libre de ruidos.
                                    </p>

                                    <ul className="space-y-6">
                                        <li className="flex gap-4">
                                            <div className="mt-1">
                                                <div className="w-2 h-2 rounded-full bg-cardenal-gold"></div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-cardenal-green flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" /> Ubicación Silenciosa
                                                </h4>
                                                <p className="text-sm text-gray-600">Perfecta para quienes huyen del bullicio del centro comercial pero desean estar cerca de todo.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="mt-1">
                                                <div className="w-2 h-2 rounded-full bg-cardenal-gold"></div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-cardenal-green flex items-center gap-2">
                                                    <UserCheck className="w-4 h-4" /> Trato Personalizado
                                                </h4>
                                                <p className="text-sm text-gray-600">Como hotel de solo 6 habitaciones, le brindamos una atención humana y dedicada.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="mt-1">
                                                <div className="w-2 h-2 rounded-full bg-cardenal-gold"></div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-cardenal-green flex items-center gap-2">
                                                    <TreePine className="w-4 h-4" /> Cercanía a la Naturaleza
                                                </h4>
                                                <p className="text-sm text-gray-600">Acceso inmediato a los senderos del Parque Lineal La Tebaida.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl group">
                                    <Image
                                        src="/images/habitaciones/triple-main.webp" // Using Triple image as fallback/secondary since user only provided 1 main image context
                                        alt="Entorno tranquilo Hotel Cardenal"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        quality={75}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-cardenal-green/80 to-transparent flex items-end p-6">
                                        <p className="text-white font-serif italic text-lg">"Un oasis de paz cerca de todo"</p>
                                    </div>
                                </div>
                            </section>

                            {/* Reserve Info & CTA */}
                            <section className="bg-white border-2 border-cardenal-gold/20 p-8 md:p-12 rounded-lg text-center shadow-lg">
                                <h3 className="text-2xl font-serif font-bold text-cardenal-green mb-8">Información de Reserva</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left md:text-center max-w-3xl mx-auto">
                                    <div className="p-4 bg-cardenal-cream/30 rounded-lg">
                                        <div className="flex md:flex-col items-center gap-3 md:gap-2 mb-2">
                                            <Clock className="text-cardenal-gold w-6 h-6" />
                                            <span className="font-bold text-cardenal-brown">Check-in</span>
                                        </div>
                                        <p className="text-gray-600">A partir de las 14:00</p>
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
                                            <div className="text-cardenal-gold font-bold text-xl">🐾</div>
                                            <span className="font-bold text-cardenal-brown">Pet Friendly</span>
                                        </div>
                                        <p className="text-gray-600">Aceptamos a su mascota (consultar condiciones)</p>
                                    </div>
                                </div>

                                <Link
                                    href="/contacto?motivo=Reserva+Habitacion+Doble+Twin#formulario-contacto"
                                    className="inline-flex items-center gap-3 bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-bold py-4 px-10 rounded-none transform hover:-translate-y-1 transition-all duration-300 shadow-xl uppercase tracking-widest text-sm"
                                >
                                    👉 Reservar Habitación Doble Twin ahora
                                </Link>
                            </section>
                        </div>

                        {/* Right Column: Booking Widget */}
                        <aside className="lg:col-span-1 hidden lg:block sticky top-24">
                            <RoomBookingWidget price="Cotizar" roomName="Doble Twin" />
                        </aside>

                        {/* Mobile Widget */}
                        <div className="lg:hidden order-last">
                            <RoomBookingWidget price="Cotizar" roomName="Doble Twin" />
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
                        "name": "Habitación Doble Twin - Hotel El Cardenal Loja",
                        "description": "Habitación de 28m² con dos camas, ideal para amigos, colegas o familiares.",
                        "image": "https://hotelelcardenalloja.com/images/habitaciones/doble/doble-twin-main.webp",
                        "occupancy": {
                            "@type": "QuantitativeValue",
                            "value": 2
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "35.71",
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
        </div >
    );
}
