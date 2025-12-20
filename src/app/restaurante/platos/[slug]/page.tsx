import { getDishBySlug, restaurantMenuCategories } from '@/data/restaurantMenu';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Clock, Utensils, Tag, Star, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { QuickReservationWidget } from '@/components/QuickReservationWidget';

interface DishPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function DishPage({ params }: DishPageProps) {
    const { slug } = await params;
    const dish = getDishBySlug(slug);

    if (!dish) {
        notFound();
    }

    // Logic for "Most Ordered" - Taking first 3 main courses as example
    // In a real app, this would come from analytics or a specific DB flag
    const mostOrdered = restaurantMenuCategories
        .find(c => c.id === 'de-la-tierra')?.items.slice(0, 3) || [];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header
                logo={headerData.logo}
                showReservationSearch={false}
            />

            <main className="flex-1">
                {/* Hero Section - 70% viewport height */}
                <section className="relative w-full h-[70vh] flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={dish.image || '/images/hero/hero-main.webp'}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center">
                        {dish.category && (
                            <span className="inline-block px-4 py-1 mb-4 bg-amber-500/90 text-white text-sm font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                                {dish.category}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 font-display drop-shadow-lg max-w-5xl mx-auto leading-tight">
                            {dish.name}
                        </h1>
                        <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        {/* Back Button */}
                        <div className="mb-10">
                            <Link
                                href="/restaurante"
                                className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors font-medium group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                Volver al Menú
                            </Link>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-16">
                            {/* Main Info - Left Column */}
                            <div className="lg:col-span-2 space-y-12">

                                {/* Description and Inline Image Block */}
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display border-l-4 border-amber-500 pl-4">
                                            Descripción del Plato
                                        </h2>
                                        <div className="prose prose-lg text-gray-700 leading-relaxed text-justify">
                                            {dish.description}
                                        </div>
                                    </div>

                                    {/* Inline Dish Image */}
                                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl skew-y-1 transform transition-all hover:skew-y-0 duration-500 group">
                                        <Image
                                            src={dish.image || '/images/hero/hero-main.webp'}
                                            alt={`Detalle de ${dish.name}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                            <p className="text-white font-bold text-lg">Presentación Sugerida</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ingredients */}
                                {dish.ingredients && dish.ingredients.length > 0 && (
                                    <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <Utensils className="w-6 h-6 text-amber-500" />
                                            Ingredientes Principales
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {dish.ingredients.map((ingredient, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-bold border border-amber-200 shadow-sm flex items-center gap-2"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                    {ingredient}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* "Lo más Pedido" Section */}
                                <div className="pt-8 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 font-display">
                                            Lo más Pedido
                                        </h3>
                                        <Link href="/restaurante" className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                                            Ver todo <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        {mostOrdered.map((item, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/restaurante/platos/${item.slug}`}
                                                className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
                                            >
                                                <div className="relative h-40 overflow-hidden">
                                                    <Image
                                                        src={item.image || '/images/platos/placeholder_main.webp'}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-amber-600 shadow-sm">
                                                        Top {idx + 1}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                                        {item.name}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-yellow-400 text-xs mb-2">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <Star className="w-3 h-3 fill-current" />
                                                        <span className="text-gray-400 ml-1">(4.9)</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        ${Number(item.price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Info - Right Column */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 space-y-8">

                                    {/* Price Card */}
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg text-center relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                                        {dish.price && (
                                            <>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 relative z-10">Precio por persona</p>
                                                <div className="flex items-center justify-center gap-1 relative z-10">
                                                    <span className="text-2xl text-amber-500 font-bold">$</span>
                                                    <span className="text-6xl font-black text-gray-900 tracking-tighter font-display">
                                                        {Math.floor(dish.price)}
                                                    </span>
                                                    <span className="text-2xl font-bold text-gray-900 mt-4">
                                                        .{(Number(dish.price) % 1).toFixed(2).substring(2)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Reservation Widget */}
                                    <QuickReservationWidget />

                                    {/* Additional Info */}
                                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Tag className="w-5 h-5 text-blue-500 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-900">Categoría</p>
                                                <p className="text-gray-600">{dish.category || 'Especialidad'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-green-500 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-900">Disponibilidad</p>
                                                <p className="text-gray-600">Todos los días</p>
                                                <p className="text-xs text-gray-500">12:00 PM - 10:00 PM</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
