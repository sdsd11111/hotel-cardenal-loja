import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { Wifi, Coffee, Car, MapPin, Users, Monitor, CalendarCheck, Lightbulb, UserCheck, ArrowRight, Phone, Mail } from 'lucide-react';
import { ImageLightbox } from '@/components/ImageLightbox';
import { EventForm } from '@/components/EventForm';

export const metadata: Metadata = {
    title: 'Eventos Corporativos y Reuniones en Loja | Hotel El Cardenal',
    description: 'El mejor espacio para eventos íntimos y reuniones de negocios en Loja. Privacidad, WiFi de alta velocidad, café lojano y parqueadero privado. ¡Reserve hoy!',
    keywords: ['Eventos en Loja', 'Reuniones de negocios en Loja', 'Salón para eventos pequeños', 'Hotel familiar en Loja', 'Hotel El Cardenal Eventos'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/eventos',
    }
};

export default function EventosPage() {
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
                <h1>Eventos y Reuniones Corporativas en Loja - Hotel El Cardenal</h1>
                <p>
                    Ofrecemos el escenario perfecto para sus reuniones de negocios, directorios y celebraciones íntimas
                    en Loja. Nuestro ambiente neoclásico y privado garantiza la distinción y exclusividad que su evento merece.
                </p>

                <h2>Espacios para Eventos Boutique</h2>
                <p>
                    Contamos con un salón exclusivo acondicionado para grupos pequeños (hasta 15 personas),
                    ideal para mantener la privacidad y el enfoque. Equipado con muebles Zuleta de alta gama.
                </p>

                <h2>Servicios Corporativos Incluidos</h2>
                <ul>
                    <li><strong>Conectividad Premium:</strong> WiFi de alta velocidad estable para videoconferencias.</li>
                    <li><strong>Coffee Break Lojano:</strong> Servicio de catering con café de altura y bocaditos típicos.</li>
                    <li><strong>Seguridad y Comodidad:</strong> Parqueadero privado gratuito para todos los asistentes.</li>
                    <li><strong>Ubicación Estratégica:</strong> Situados en el sector Los Rosales, facilitando el acceso y la seguridad.</li>
                </ul>

                <h2>Tipos de Eventos que Realizamos</h2>
                <ul>
                    <li><strong>Reuniones de Negocios:</strong> Firmas de contratos, entrevistas y directorios privados.</li>
                    <li><strong>Capacitaciones:</strong> Talleres para equipos de trabajo que buscan un entorno tranquilo.</li>
                    <li><strong>Celebraciones Íntimas:</strong> Cenas de aniversario, almuerzos ejecutivos y brindis familiares.</li>
                </ul>

                <h2>Solicite su Cotización</h2>
                <p>Personalizamos cada evento según sus necesidades. Contáctenos al 099 661 6878 para una propuesta a medida.</p>
            </div>

            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Fullscreen Hero Section */}
                <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/eventos/hero.webp?v=2"
                        alt="Salón de Eventos y Reuniones Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 drop-shadow-xl leading-tight">
                            Eventos y Reuniones en Loja: Exclusividad y Elegancia
                        </h1>
                        <p className="text-xl md:text-2xl font-serif italic text-cardenal-gold drop-shadow-sm">
                            El escenario perfecto para sus reuniones corporativas y celebraciones íntimas en un ambiente neoclásico y privado.
                        </p>
                    </div>
                </div>

                {/* Introduction Section */}
                <div className="container mx-auto px-4 py-16 max-w-5xl">
                    <div className="prose prose-lg max-w-none text-center text-gray-700 font-sans mb-16">
                        <p className="text-xl leading-relaxed">
                            En <strong>Hotel El Cardenal</strong>, transformamos sus encuentros en experiencias memorables. Contamos con un área exclusiva diseñada para quienes buscan un lugar para eventos en Loja que garantice privacidad, distinción y un servicio personalizado. Nuestra infraestructura es ideal para grupos pequeños que requieren un entorno tranquilo y profesional, alejado del ruido convencional.
                        </p>
                    </div>

                    {/* H2: Espacios Boutique */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-serif font-bold text-center text-cardenal-green mb-6">
                            Espacios Boutique para Encuentros de Éxito
                        </h2>
                        <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
                            Nuestra sala está acondicionada para ofrecer confort y funcionalidad en cada detalle, respetando siempre el estilo clásico que nos caracteriza.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-white p-2 rounded-full text-cardenal-gold shadow-sm">
                                        <Users size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-cardenal-brown">Capacidad Íntima</h3>
                                </div>
                                <p className="text-gray-600">Espacio optimizado para grupos de hasta 12 a 15 personas, ideal para mantener la exclusividad.</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-white p-2 rounded-full text-cardenal-gold shadow-sm">
                                        <UserCheck size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-cardenal-brown">Ambiente Profesional</h3>
                                </div>
                                <p className="text-gray-600">Equipado con mobiliario elegante (Muebles Zuleta) que aporta un aire de prestigio a sus reuniones de negocios o directorios.</p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-white p-2 rounded-full text-cardenal-gold shadow-sm">
                                        <Lightbulb size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-cardenal-brown">Iluminación y Clima</h3>
                                </div>
                                <p className="text-gray-600">Un entorno con luz natural y ventilación adecuada, creando una atmósfera productiva y agradable.</p>
                            </div>
                        </div>
                    </section>

                    {/* H2: Servicios Corporativos (Image Left, List Right) */}
                    <section className="mb-20 bg-cardenal-green rounded-2xl overflow-hidden shadow-2xl">
                        <div className="grid lg:grid-cols-2">
                            <div className="relative min-h-[400px] lg:min-h-full">
                                <Image
                                    src="/images/eventos/servicios-para-eventos.webp?v=2"
                                    alt="Reunión Corporativa Hotel Cardenal"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>

                            <div className="p-8 md:p-12 text-white flex flex-col justify-center">
                                <h2 className="text-3xl font-serif font-bold text-cardenal-gold mb-6">
                                    Servicios para Eventos Corporativos y Sociales
                                </h2>
                                <p className="text-white/90 mb-8">
                                    Para asegurar el éxito de su jornada, complementamos nuestro espacio con servicios esenciales que facilitan su logística:
                                </p>

                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <Wifi className="text-cardenal-gold shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-lg">Conectividad de Alta Velocidad</h4>
                                            <p className="text-sm text-white/70">WiFi estable y gratuito para presentaciones en línea y videoconferencias.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <Coffee className="text-cardenal-gold shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-lg">Servicio de Coffee Break</h4>
                                            <p className="text-sm text-white/70">Opción de catering con nuestro famoso café lojano y bocaditos tradicionales.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <Car className="text-cardenal-gold shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-lg">Parqueadero Privado</h4>
                                            <p className="text-sm text-white/70">Sus invitados contarán con estacionamiento seguro dentro del hotel.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <MapPin className="text-cardenal-gold shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-lg">Ubicación Estratégica</h4>
                                            <p className="text-sm text-white/70">Cerca del Supermaxi Los Rosales, facilitando el acceso y la seguridad.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* H2: Galería de Momentos */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-serif font-bold text-center text-cardenal-green mb-10">
                            Nuestros Espacios en Acción
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <ImageLightbox
                                    key={i}
                                    src={`/images/eventos/galeria-${i}.webp`}
                                    alt={`Evento en Hotel El Cardenal Loja ${i}`}
                                    className={`rounded-xl shadow-lg ${i === 4 ? 'md:hidden lg:block' : ''} ${i === 5 ? 'hidden lg:block' : ''}`}
                                />
                            ))}
                        </div>
                    </section>

                    {/* H2: Tipos de Eventos */}
                    <section className="mb-20 text-center">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12">
                            Tipos de Eventos que puede realizar con nosotros
                        </h2>
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
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-6 border border-gray-200 rounded-lg hover:border-cardenal-gold transition-colors">
                                <h4 className="font-bold text-xl text-cardenal-brown mb-2">Reuniones de Negocios</h4>
                                <p className="text-gray-600 text-sm">Firmas de contratos, directorios y entrevistas privadas.</p>
                            </div>
                            <div className="p-6 border border-gray-200 rounded-lg hover:border-cardenal-gold transition-colors">
                                <h4 className="font-bold text-xl text-cardenal-brown mb-2">Capacitaciones Boutique</h4>
                                <p className="text-gray-600 text-sm">Talleres para equipos de trabajo reducidos que buscan concentración.</p>
                            </div>
                            <div className="p-6 border border-gray-200 rounded-lg hover:border-cardenal-gold transition-colors">
                                <h4 className="font-bold text-xl text-cardenal-brown mb-2">Celebraciones Íntimas</h4>
                                <p className="text-gray-600 text-sm">Cenas de aniversario, brindis familiares o almuerzos ejecutivos.</p>
                            </div>
                        </div>
                    </section>

                    {/* H3: Reserva y CTA */}
                    <section className="bg-gray-50 border-l-4 border-cardenal-gold p-8 md:p-12 rounded-r-xl shadow-lg text-center max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Reserve su Espacio</h3>
                        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
                            Debido a nuestra exclusividad y cupo limitado, recomendamos coordinar su evento con anticipación para garantizar la disponibilidad total del área.
                        </p>

                        <Link
                            href="/contacto?motivo=Cotizacion+Eventos"
                            className="inline-flex items-center gap-3 bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-bold py-4 px-10 rounded-lg transform hover:-translate-y-1 transition-all duration-300 shadow-xl uppercase tracking-widest text-sm"
                        >
                            👉 Solicitar Cotización para Eventos
                        </Link>
                    </section>

                    {/* H2: Formulario de Solicitud Directa */}
                    <section className="mt-20">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-4">Solicite su Cotización para Eventos</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Complete el siguiente formulario y nos pondremos en contacto con usted en menos de 24 horas.</p>
                        </div>
                        <EventForm />
                    </section>

                </div>
            </main>

            <Footer />
            {/* 📊 Structured Data (JSON-LD) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "EventVenue",
                        "name": "Salón de Eventos Hotel El Cardenal Loja",
                        "description": "Espacio exclusivo para eventos corporativos íntimos, reuniones de negocios y celebraciones sociales en Loja.",
                        "url": "https://hotelelcardenalloja.com/eventos",
                        "image": "https://hotelelcardenalloja.com/images/eventos/hero.webp",
                        "telephone": "+593996616878",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Gladiolos 154-42 y Av. 18 de Noviembre",
                            "addressLocality": "Loja",
                            "addressRegion": "Loja",
                            "postalCode": "110101",
                            "addressCountry": "EC"
                        },
                        "occupancy": {
                            "@type": "QuantitativeValue",
                            "value": 15
                        },
                        "amenityFeature": [
                            { "@type": "LocationFeatureSpecification", "name": "WiFi de Alta Velocidad", "value": true },
                            { "@type": "LocationFeatureSpecification", "name": "Coffee Break Lojano", "value": true },
                            { "@type": "LocationFeatureSpecification", "name": "Parqueadero Privado", "value": true }
                        ]
                    })
                }}
            />
        </div>
    );
}
