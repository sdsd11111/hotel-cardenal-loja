import { restaurantMenuCategories } from '@/data/restaurantMenu';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Coffee, Wine } from 'lucide-react';

export default function BebidasPage() {
    const bebidasCategory = restaurantMenuCategories.find(c => c.id === 'bebidas-licores');
    const bebidas = bebidasCategory?.items || [];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header logo={headerData.logo} showReservationSearch={false} />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full h-[60vh] flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/hero/hero-main.webp" // Consider a specific drinks hero 
                            alt="Bebidas y Licores de Loja"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white/10"></div>
                    </div>
                    <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                        <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-white/90 text-sm uppercase tracking-widest mb-4 backdrop-blur-sm">
                            Nuestra Bodega
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display drop-shadow-2xl">
                            {bebidasCategory?.title || 'Bebidas'}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-100 font-light leading-relaxed">
                            {bebidasCategory?.subtitle}
                        </p>
                        <div className="w-24 h-1 bg-amber-500 mx-auto mt-8 rounded-full"></div>
                    </div>
                </section>

                {/* Intro / Philosophy Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-amber-600 mb-2">
                                    <Coffee className="w-6 h-6" />
                                    <span className="text-sm font-bold uppercase tracking-widest">El Arte del Café</span>
                                </div>
                                <h2 className="text-4xl font-bold text-gray-900 font-display leading-tight">
                                    De la Altura de Loja a su Taza
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                                    En el Hotel El Cardenal Loja, creemos que un gran café es el cierre perfecto para una experiencia culinaria.
                                    Seleccionamos exclusivamente granos de altura de las mejores zonas de <strong>Loja</strong>, reconocida mundialmente por su calidad excepcional.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                                    Nuestro método de prensa francesa permite extraer los aceites naturales y el cuerpo completo del grano,
                                    ofreciendo un perfil de sabor con notas a chocolate, nuez y frutas cítricas, característico del sur del Ecuador.
                                </p>
                            </div>
                            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
                                <Image
                                    src="/images/platos/placeholder_coffee_experience.webp"
                                    alt="Experiencia de Café"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-bold text-lg">Método Artesanal</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
                            <div className="order-2 md:order-1 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl -skew-y-2 hover:skew-y-0 transition-transform duration-700">
                                <Image
                                    src="/images/platos/placeholder_liquor_tradition.webp"
                                    alt="Tradición de Licores"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-bold text-lg">Sabor Lojano</p>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 space-y-6">
                                <div className="flex items-center gap-3 text-amber-600 mb-2">
                                    <Wine className="w-6 h-6" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Tradición Lojana</span>
                                </div>
                                <h2 className="text-4xl font-bold text-gray-900 font-display leading-tight">
                                    Espíritus con Historia
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed text-justify">
                                    Ninguna visita a Loja está completa sin probar nuestro <strong>Canelazo Lojano</strong> o la refrescante <strong>Horchata</strong>.
                                    Celebramos la herencia gastronómica de nuestra provincia con una selección que honra los sabores más auténticos del sur.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5"></div>
                                        <p className="text-gray-700"><strong>Horchata Lojana:</strong> Una infusión de más de 20 hierbas medicinales y flores.</p>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5"></div>
                                        <p className="text-gray-700"><strong>Canelazo:</strong> La bebida caliente tradicional que reconforta el espíritu.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-display">Nuestra Selección de Bebidas</h2>
                            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="mb-10">
                            <Link
                                href="/restaurante"
                                className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors font-medium group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                Volver al Restaurante
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {bebidas.map((item, idx) => (
                                <div key={idx} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="relative h-72 overflow-hidden">
                                        <Image
                                            src={item.image || '/images/platos/placeholder_drink.webp'}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-600 shadow-sm border border-amber-100">
                                            {item.category}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 font-display leading-tight min-h-[3.5rem] flex items-center">{item.name}</h3>
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Precio</span>
                                                <span className="text-2xl font-bold text-amber-600">${Number(item.price).toFixed(2)}</span>
                                            </div>
                                            <button className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-amber-600 transition-colors shadow-md">
                                                <Star className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
