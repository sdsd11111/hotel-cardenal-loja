import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { Wifi, Coffee, Car, MapPin, ShieldCheck, Users, ArrowRight, CheckCircle, Heart, PawPrint, Activity, Phone, Mail } from 'lucide-react';
import { ImageLightbox } from '@/components/ImageLightbox';

export const metadata: Metadata = {
    title: 'Servicios Hotel El Cardenal Loja | Desayuno, Parking y WiFi',
    description: 'Conozca los servicios de Hotel El Cardenal en Loja: desayuno tradicional, parqueadero privado, WiFi gratuito y espacios para eventos íntimos. ¡Todo para su confort!',
    keywords: ['Servicios de hotel en Loja', 'Hotel con parqueadero en Loja', 'Hotel en Loja con desayuno', 'Hotel Pet Friendly en Loja', 'Hotel El Cardenal Servicios'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/servicios',
    }
};

export default function ServiciosPage() {
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
                <h1>Servicios Integrales - Hotel El Cardenal Loja</h1>
                <p>
                    En Hotel El Cardenal, ofrecemos una gama completa de servicios diseñados para que su estancia en Loja
                    sea cómoda, segura y auténtica. Desde gastronomía local hasta conectividad para negocios.
                </p>

                <h2>Servicios Destacados</h2>

                <h3>Desayuno Tradicional y Restaurante</h3>
                <p>
                    Todas nuestras tarifas incluyen un delicioso desayuno tradicional lojano.
                    Disfrute de café de altura, tamales, humitas y frutas frescas en nuestro restaurante íntimo.
                </p>

                <h3>Seguridad y Parqueadero</h3>
                <p>
                    Contamos con parqueadero privado y gratuito dentro de las instalaciones para la seguridad de su vehículo.
                    Ubicados en un sector residencial exclusivo y seguro de Loja (Los Rosales).
                </p>

                <h3>Conectividad y Eventos</h3>
                <p>
                    Ofrecemos WiFi de alta velocidad en todo el hotel y espacios versátiles para eventos corporativos
                    o reuniones privadas de hasta 15 personas.
                </p>

                <h2>Beneficios Especiales</h2>
                <ul>
                    <li><strong>Pet Friendly:</strong> Aceptamos mascotas bajo coordinación previa.</li>
                    <li><strong>Entorno Natural:</strong> Cercanía inmediata al río Malacatos y Parque La Tebaida para ejercicio.</li>
                    <li><strong>Atención Boutique:</strong> Servicio personalizado al ser un hotel de solo 6 habitaciones.</li>
                </ul>

                <h2>Amenidades en Habitación</h2>
                <p>
                    Todas las habitaciones cuentan con baño privado, agua caliente 24h, TV por cable, WiFi gratuito
                    y lencería premium para un descanso absoluto.
                </p>
            </div>

            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Fullscreen Hero Section */}
                <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/servicios/hero.webp?v=2"
                        alt="Servicios Integrales Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 drop-shadow-xl leading-tight">
                            Servicios de Excelencia: Su Hogar en Loja
                        </h1>
                        <p className="text-xl md:text-2xl font-serif italic text-cardenal-gold drop-shadow-sm">
                            Disfrute de una estancia integral en Hotel El Cardenal, donde cada servicio está diseñado para ofrecerle seguridad, confort y el auténtico sabor lojano.
                        </p>
                    </div>
                </div>

                {/* Introduction Section */}
                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <div className="prose prose-lg max-w-none text-center text-gray-700 font-sans mb-20">
                        <p className="text-xl leading-relaxed">
                            En <strong>Hotel El Cardenal</strong>, entendemos que la diferencia entre un alojamiento y una experiencia inolvidable reside en los detalles. Hemos configurado nuestra oferta de servicios para satisfacer las necesidades del viajero moderno, ya sea que visite Loja por turismo familiar, negocios o descanso, garantizando siempre una atención cálida en un entorno neoclásico exclusivo.
                        </p>
                    </div>

                    {/* H2: Servicios Destacados */}
                    <section className="mb-24">
                        <h2 className="text-3xl font-serif font-bold text-center text-cardenal-green mb-12 border-b-2 border-cardenal-gold/20 pb-4 inline-block w-full">
                            Servicios Destacados para su Comodidad
                        </h2>
                        <p className="text-center text-gray-600 mb-12 -mt-6">Nuestra propuesta de valor se basa en tres pilares: Seguridad, Gastronomía y Conectividad.</p>

                        {/* H3: Gastronomía */}
                        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                            <div className="order-2 md:order-1">
                                <h3 className="text-2xl font-bold text-cardenal-brown mb-4 flex items-center gap-3">
                                    <Coffee className="text-cardenal-gold" /> Gastronomía y Sabor Local
                                </h3>
                                <p className="text-gray-600 italic mb-4">No solo ofrecemos un lugar donde dormir, sino un lugar donde disfrutar.</p>
                                <ul className="space-y-4 mb-6">
                                    <li className="flex gap-3">
                                        <CheckCircle className="text-cardenal-green w-5 h-5 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-cardenal-brown">Desayuno Tradicional:</strong>
                                            <p className="text-sm text-gray-600">Todas nuestras tarifas incluyen el famoso café lojano y delicias típicas (tamales, humitas).</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <CheckCircle className="text-cardenal-green w-5 h-5 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-cardenal-brown">Restaurante Íntimo:</strong>
                                            <p className="text-sm text-gray-600">Un espacio acogedor con capacidad para 12 personas, ideal para empezar el día con tranquilidad.</p>
                                        </div>
                                    </li>
                                </ul>
                                <Link
                                    href="/restaurante"
                                    className="text-cardenal-gold font-bold uppercase tracking-wider text-sm hover:underline flex items-center gap-2"
                                >
                                    Descubra nuestro Restaurante <ArrowRight size={16} />
                                </Link>
                            </div>
                            <ImageLightbox
                                src="/images/servicios/gastronomia.webp?v=2"
                                alt="Desayuno Lojano Hotel Cardenal"
                                className="order-1 md:order-2 rounded-lg shadow-lg"
                                aspectRatio="h-64"
                            />
                        </div>

                        {/* H3: Seguridad */}
                        <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
                            <ImageLightbox
                                src="/images/servicios/seguridad.webp?v=2"
                                alt="Seguridad y Parking Hotel Cardenal"
                                className="relative rounded-lg shadow-lg"
                                aspectRatio="h-64"
                            />
                            <div>
                                <h3 className="text-2xl font-bold text-cardenal-brown mb-4 flex items-center gap-3">
                                    <Car className="text-cardenal-gold" /> Seguridad y Conveniencia
                                </h3>
                                <p className="text-gray-600 italic mb-4">Sabemos que su tranquilidad es lo primero.</p>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <ShieldCheck className="text-cardenal-green w-5 h-5 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-cardenal-brown">Parqueadero Privado Gratuito:</strong>
                                            <p className="text-sm text-gray-600">Olvídese de buscar estacionamiento en la calle; contamos con espacios seguros dentro del hotel.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <MapPin className="text-cardenal-green w-5 h-5 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-cardenal-brown">Ubicación Estratégica:</strong>
                                            <p className="text-sm text-gray-600">Situados en la Urbanización Los Rosales, a 7 minutos del Supermaxi y pasos del Parque Lineal La Tebaida.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <Heart className="text-cardenal-green w-5 h-5 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-cardenal-brown">Entorno Residencial:</strong>
                                            <p className="text-sm text-gray-600">Una zona exclusiva y silenciosa que garantiza un descanso reparador.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* H3: Conectividad */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="order-2 md:order-1">
                                <h3 className="text-2xl font-bold text-cardenal-brown mb-4 flex items-center gap-3">
                                    <Wifi className="text-cardenal-gold" /> Conectividad y Negocios
                                </h3>
                                <p className="text-gray-600 italic mb-4">Ideal para nómadas digitales y ejecutivos.</p>
                                <ul className="space-y-4 mb-6">
                                    <li className="flex gap-3">
                                        <CheckCircle className="text-cardenal-green w-5 h-5 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-cardenal-brown">WiFi de Alta Velocidad:</strong>
                                            <p className="text-sm text-gray-600">Conexión estable en todas las habitaciones y áreas sociales.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <Users className="text-cardenal-green w-5 h-5 shrink-0 mt-1" />
                                        <div>
                                            <strong className="text-cardenal-brown">Espacios para Reuniones:</strong>
                                            <p className="text-sm text-gray-600">Área para eventos corporativos y directorios íntimos (hasta 15 personas).</p>
                                        </div>
                                    </li>
                                </ul>
                                <Link
                                    href="/eventos"
                                    className="text-cardenal-gold font-bold uppercase tracking-wider text-sm hover:underline flex items-center gap-2"
                                >
                                    Organice su Evento con nosotros <ArrowRight size={16} />
                                </Link>
                            </div>
                            <ImageLightbox
                                src="/images/servicios/conectividad.webp?v=2"
                                alt="Reuniones de Negocios Hotel Cardenal"
                                className="order-1 md:order-2 rounded-lg shadow-lg"
                                aspectRatio="h-64"
                            />
                        </div>
                    </section>

                    {/* H2: Hospitalidad Familiar */}
                    <section className="mb-20 bg-gray-50 p-8 rounded-xl border border-gray-100">
                        <h2 className="text-3xl font-serif font-bold text-center text-gray-900 mb-8">
                            Hospitalidad que se siente en Familia
                        </h2>
                        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                            Hospedarse en el mejor hotel familiar en Loja significa tener acceso a beneficios pensados para cada miembro de la familia:
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <PawPrint className="text-cardenal-gold w-10 h-10 mx-auto mb-4" />
                                <h4 className="font-bold text-lg mb-2">Pet Friendly</h4>
                                <p className="text-sm text-gray-600">Somos amantes de los animales; su mascota es bienvenida (previa coordinación).</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <Activity className="text-cardenal-gold w-10 h-10 mx-auto mb-4" />
                                <h4 className="font-bold text-lg mb-2">Ambiente Saludable</h4>
                                <p className="text-sm text-gray-600">Cercanía inmediata al río Malacatos para caminatas y ejercicio al aire libre.</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <Users className="text-cardenal-gold w-10 h-10 mx-auto mb-4" />
                                <h4 className="font-bold text-lg mb-2">Atención Personalizada</h4>
                                <p className="text-sm text-gray-600">Como hotel boutique de 6 habitaciones, nuestro servicio es directo, amable y respetuoso.</p>
                            </div>
                        </div>
                    </section>

                    {/* H3: Resumen de Amenidades */}
                    <section className="mb-20 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8">Resumen de Amenidades</h3>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
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
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                            <span className="bg-cardenal-cream px-4 py-2 rounded-full text-cardenal-green font-bold text-sm border border-cardenal-gold/20">
                                Baño privado con agua caliente
                            </span>
                            <span className="bg-cardenal-cream px-4 py-2 rounded-full text-cardenal-green font-bold text-sm border border-cardenal-gold/20">
                                Televisión por cable
                            </span>
                            <span className="bg-cardenal-cream px-4 py-2 rounded-full text-cardenal-green font-bold text-sm border border-cardenal-gold/20">
                                Lencería de cama premium
                            </span>
                            <span className="bg-cardenal-cream px-4 py-2 rounded-full text-cardenal-green font-bold text-sm border border-cardenal-gold/20">
                                Servicio de limpieza diario
                            </span>
                        </div>
                    </section>

                    {/* H2: Nuestra Infraestructura */}
                    <section className="mb-24">
                        <h2 className="text-3xl font-serif font-bold text-center text-cardenal-green mb-10">
                            Nuestra Infraestructura
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <ImageLightbox
                                    key={i}
                                    src={`/images/servicios/galeria-${i}.webp?v=2`}
                                    alt={`Instalaciones Hotel El Cardenal Loja ${i}`}
                                    className="rounded-xl shadow-md"
                                    aspectRatio="aspect-video"
                                />
                            ))}
                        </div>
                    </section>

                    {/* CTA Button */}
                    <div className="text-center pb-10">
                        <Link
                            href="/habitaciones"
                            className="inline-flex items-center gap-3 bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-5 px-12 rounded-lg transform hover:-translate-y-1 transition-all duration-300 shadow-xl uppercase tracking-widest text-sm"
                        >
                            👉 Ver Habitaciones y Reservar Estancia
                        </Link>
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
                        "@type": "Service",
                        "serviceType": "Hospitalidad y Alojamiento",
                        "provider": {
                            "@type": "Hotel",
                            "name": "Hotel El Cardenal Loja"
                        },
                        "areaServed": {
                            "@type": "City",
                            "name": "Loja"
                        },
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Servicios de Hotel El Cardenal",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Desayuno Tradicional Lojano"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Parqueadero Privado Gratuito"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "WiFi de Alta Velocidad"
                                    }
                                }
                            ]
                        }
                    })
                }}
            />
        </div>
    );
}
