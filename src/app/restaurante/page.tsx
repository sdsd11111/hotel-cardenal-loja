import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import HeroPlatos from '@/components/HeroPlatos';
import { Coffee, Utensils, Clock, MapPin, ChevronRight, Image as ImageIcon, Phone, Mail, Sun, Info, Users, Heart, CheckCircle, Wifi, Car, Home } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Restaurante y Desayuno Tradicional en Loja | Hotel El Cardenal',
    description: 'Disfrute del mejor café lojano y desayunos tradicionales en el restaurante de Hotel El Cardenal. Ambiente cálido, sabores caseros y atención familiar en Loja.',
    keywords: ['Restaurante en Loja', 'Desayuno tradicional en Loja', 'Café lojano', 'Hotel familiar en Loja', 'Hotel El Cardenal Restaurante'],
    alternates: {
        canonical: 'https://hotelelcardenalloja.com/restaurante',
    }
};

export default function RestaurantePage() {
    return (
        <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
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
                <h1>Restaurante y Gastronomía Lojana - Hotel El Cardenal</h1>
                <p>
                    Disfrute de la auténtica gastronomía de Loja en nuestro restaurante íntimo y acogedor.
                    Nos especializamos en brindar una experiencia culinaria casera, destacando el café de altura
                    y los sabores tradicionales de la Centinela del Sur.
                </p>

                <h2>Nuestra Especialidad: El Desayuno Lojano</h2>
                <p>
                    Todas nuestras tarifas de hospedaje incluyen un desayuno tradicional completo.
                    Nuestra propuesta incluye:
                </p>
                <ul>
                    <li><strong>Café Lojano de Especialidad:</strong> Café de altura reconocido mundialmente por su aroma.</li>
                    <li><strong>Delicias de la Tierra:</strong> Tamales lojanos, humitas y quimbolitos preparados con recetas de casa.</li>
                    <li><strong>Frescura Matutina:</strong> Jugos naturales, frutas de estación y pan artesanal.</li>
                    <li><strong>Huevos al Gusto:</strong> Preparaciones al momento para un inicio de día con energía.</li>
                </ul>

                <h2>Ambiente Neoclásico e Íntimo</h2>
                <p>
                    Nuestro restaurante cuenta con capacidad para 12 comensales, lo que garantiza un servicio
                    personalizado y un ambiente libre de ruidos. Decorado con muebles Zuleta y detalles de época,
                    es el lugar ideal para planificar sus actividades en Loja.
                </p>

                <h2>Servicios Adicionales</h2>
                <ul>
                    <li>Horario flexible de desayuno para viajeros de negocios.</li>
                    <li>Opciones vegetarianas y atención a restricciones alimentarias (previa información).</li>
                    <li>Café de cortesía disponible para nuestros huéspedes.</li>
                </ul>

                <h2>Ubicación</h2>
                <p>Dentro de Hotel El Cardenal, en el exclusivo sector Los Rosales, Gladiolos 154-42, Loja - Ecuador.</p>
            </div>

            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Visual - Mantenido del original */}
                <HeroPlatos />

                <div className="container mx-auto px-4 py-16 max-w-5xl">

                    {/* H1 Section: Intro */}
                    <section className="mb-16 text-center">
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                            Restaurante en Loja: Sabores Tradicionales y <span className="text-cardenal-gold">Café de Altura</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 italic max-w-3xl mx-auto mb-8 font-serif leading-relaxed">
                            Disfrute de la auténtica gastronomía lojana en un ambiente acogedor y familiar, donde cada mañana comienza con el aroma de nuestra tierra.
                        </p>
                        <div className="mx-auto w-24 h-1 bg-cardenal-gold rounded-full mb-8"></div>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                            En el <strong>Restaurante de Hotel El Cardenal</strong>, creemos que el desayuno es el momento más importante del día. Por ello, hemos creado un espacio íntimo y cálido, diseñado exclusivamente para que nuestros huéspedes vivan una experiencia culinaria auténtica. Aquí, la tradición de Loja se sirve a la mesa con ingredientes frescos y una atención que le hará sentirse como en casa.
                        </p>
                    </section>

                    {/* H2 Section: El Desayuno */}
                    <section className="mb-20 grid md:grid-cols-2 gap-12 items-center bg-cardenal-cream/20 p-8 rounded-2xl border border-cardenal-gold/20">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-cardenal-green mb-4">
                                El Desayuno: Nuestra Especialidad
                            </h2>
                            <p className="text-gray-700 mb-8 text-lg">
                                Nos diferenciamos por ofrecer un desayuno casero y tradicional que captura la esencia de la "Centinela del Sur". No es solo una comida, es el inicio perfecto para su jornada de turismo o negocios.
                            </p>

                            <h3 className="text-xl font-bold text-cardenal-brown mb-6 flex items-center gap-2">
                                <Utensils className="text-cardenal-gold" /> ¿Qué incluye nuestra experiencia?
                            </h3>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-cardenal-gold shrink-0 h-min">
                                        <Coffee size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Café Lojano de Especialidad</h4>
                                        <p className="text-sm text-gray-600">Servimos café de altura, reconocido mundialmente por su aroma y cuerpo, cultivado en nuestras montañas.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-cardenal-gold shrink-0 h-min">
                                        <Sun size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Delicias Típicas</h4>
                                        <p className="text-sm text-gray-600">Acompañe sus mañanas con tamales lojanos, humitas o quimbolitos, preparados con recetas tradicionales.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-cardenal-gold shrink-0 h-min">
                                        <Heart size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Frescura Natural</h4>
                                        <p className="text-sm text-gray-600">Variedad de frutas de estación, jugos naturales recién exprimidos y opciones equilibradas.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="bg-white p-2 rounded-full shadow-sm text-cardenal-gold shrink-0 h-min">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Preparaciones al Gusto</h4>
                                        <p className="text-sm text-gray-600">Huevos al gusto y pan artesanal para garantizar un desayuno completo y energético.</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
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

                        {/* Visual Image */}
                        <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden shadow-xl bg-gray-100 group">
                            <Image
                                src="/images/restaurante/rest.webp?v=2"
                                alt="El Desayuno: Nuestra Especialidad en Hotel El Cardenal"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <p className="font-serif font-bold text-2xl drop-shadow-md">Sabores de Loja</p>
                            </div>
                        </div>
                    </section>

                    {/* H2 Section: Ambiente */}
                    <section className="mb-20">
                        <h2 className="text-3xl font-serif font-bold text-center text-gray-900 mb-12">
                            Un Ambiente Acogedor con Estilo Neoclásico
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center px-4">
                            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform">
                                <div className="w-16 h-16 mx-auto bg-cardenal-gold/10 rounded-full flex items-center justify-center text-cardenal-gold mb-6">
                                    <Users size={32} />
                                </div>
                                <h4 className="font-bold text-xl text-gray-900 mb-3">Diseño Íntimo</h4>
                                <p className="text-gray-600">Con capacidad para 12 personas, garantizamos una atención personalizada y un ambiente libre de ruidos.</p>
                            </div>
                            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform">
                                <div className="w-16 h-16 mx-auto bg-cardenal-gold/10 rounded-full flex items-center justify-center text-cardenal-gold mb-6">
                                    <Home size={32} />
                                </div>
                                <h4 className="font-bold text-xl text-gray-900 mb-3">Estética de Época</h4>
                                <p className="text-gray-600">Rodeado de detalles neoclásicos, muebles Zuleta y una decoración que evoca la historia de Loja.</p>
                            </div>
                            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform">
                                <div className="w-16 h-16 mx-auto bg-cardenal-gold/10 rounded-full flex items-center justify-center text-cardenal-gold mb-6">
                                    <Sun size={32} />
                                </div>
                                <h4 className="font-bold text-xl text-gray-900 mb-3">Vistas al Entorno</h4>
                                <p className="text-gray-600">Ventanales que permiten disfrutar de la luz natural matutina mientras planifica su día.</p>
                            </div>
                        </div>
                    </section>

                    {/* H2 Section: Beneficios */}
                    <section className="mb-16 bg-cardenal-green text-white rounded-2xl p-8 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-3xl font-serif font-bold text-cardenal-gold mb-8 text-center">
                                Beneficios para el Viajero: Desayuno Incluido y Calidad
                            </h2>
                            <p className="text-center text-white/90 mb-10 text-lg">
                                Al elegir su hospedaje en Loja con nosotros, el restaurante se convierte en su mejor aliado:
                            </p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="inline-block p-3 bg-white/10 rounded-lg text-cardenal-gold mb-4">
                                        <CheckCircle size={28} />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">Conveniencia Total</h4>
                                    <p className="text-white/80 text-sm">Todas nuestras tarifas de habitación incluyen el desayuno, permitiéndole ahorrar tiempo y dinero.</p>
                                </div>
                                <div className="text-center">
                                    <div className="inline-block p-3 bg-white/10 rounded-lg text-cardenal-gold mb-4">
                                        <MapPin size={28} />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">Ubicación Estratégica</h4>
                                    <p className="text-white/80 text-sm">Desayune con tranquilidad y salga a caminar directamente hacia el Parque Lineal La Tebaida.</p>
                                </div>
                                <div className="text-center">
                                    <div className="inline-block p-3 bg-white/10 rounded-lg text-cardenal-gold mb-4">
                                        <Heart size={28} />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">Atención Familiar</h4>
                                    <p className="text-white/80 text-sm">Nuestro equipo se encarga de que cada detalle del servicio sea impecable, amable y respetuoso.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* H3 Section: Info Comensales */}
                    <section className="mb-16 bg-gray-50 border-l-4 border-cardenal-gold p-8 rounded-r-lg max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Info className="text-cardenal-gold" /> Información para Comensales
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-cardenal-brown flex items-center gap-2">
                                    <Clock size={16} /> Horario del Desayuno
                                </h4>
                                <p className="text-gray-700 pl-6">De lunes a domingo (consultar horarios específicos en recepción).</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-cardenal-brown flex items-center gap-2">
                                    <Utensils size={16} /> Restricciones Alimentarias
                                </h4>
                                <p className="text-gray-700 pl-6">Si tiene alguna necesidad especial (dieta sin gluten o vegetariana), por favor infórmenos al momento de su reserva.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Button */}
                    <div className="text-center">
                        <Link
                            href="/habitaciones"
                            className="inline-flex items-center gap-3 bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-bold py-5 px-12 rounded-lg transform hover:-translate-y-1 transition-all duration-300 shadow-xl uppercase tracking-widest text-sm"
                        >
                            👉 Ver Habitaciones con Desayuno Incluido
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
                        "@type": "Restaurant",
                        "name": "Restaurante Hotel El Cardenal Loja",
                        "image": "https://hotelelcardenalloja.com/images/restaurante/rest.webp",
                        "url": "https://hotelelcardenalloja.com/restaurante",
                        "telephone": "+593996616878",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Gladiolos 154-42 y Av. 18 de Noviembre",
                            "addressLocality": "Loja",
                            "addressRegion": "Loja",
                            "postalCode": "110101",
                            "addressCountry": "EC"
                        },
                        "servesCuisine": "Tradicional Lojana",
                        "priceRange": "$$",
                        "openingHours": "Mo-Su 07:00-21:00"
                    })
                }}
            />
        </div>
    );
}
