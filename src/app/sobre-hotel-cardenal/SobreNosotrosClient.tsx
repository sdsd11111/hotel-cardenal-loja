'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { ChevronRight, Music, Sparkles, Building2 } from 'lucide-react';

export default function SobreNosotrosClient() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/hero/hero-main.webp"
                        alt="Historia Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-cardenal-cream"></div>

                    <div className="relative z-10 container mx-auto px-4 text-center text-white mt-10">
                        <span className="inline-block px-4 py-1 bg-cardenal-gold text-white text-xs font-black uppercase tracking-[0.3em] mb-4">
                            Nuestra Historia
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 font-serif italic drop-shadow-2xl">
                            Sobre Nosotros
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide text-white/90">
                            Descubra los orígenes de una tradición familiar que nació de la fe, la música y el amor por Loja.
                        </p>
                    </div>
                </section>

                {/* Orígenes Section */}
                <section className="py-20 bg-cardenal-cream relative overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="lg:w-3/5 space-y-8">
                                <div className="inline-flex items-center gap-2 text-cardenal-gold mb-2">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Raíces y Devoción</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-cardenal-green font-serif leading-tight">
                                    Orígenes de <span className="italic text-cardenal-gold">El Cardenal</span>
                                </h2>

                                <div className="space-y-6 text-text-main leading-relaxed text-lg">
                                    <p>
                                        Desde la aparición de la Virgen de El Cisne el 12 de octubre de 1594, da inicio a las caminatas a la población de El Cisne, los peregrinos marcados por la fe y devoción a la Santísima Virgen hacen peregrinaciones a este lugar.
                                    </p>
                                    <p>
                                        En 1829 después de haber visitado El Cisne, Simón Bolívar promulgó desde Guayaquil el Decreto que oficializaba el desarrollo de la feria de Loja y la romería del Cisne a la Loja, autorizando que cada año se traslade a la Imagen de la Santísima Virgen de El Cisne a Loja.
                                    </p>
                                    <p>
                                        En la travesía entre El Cisne y Loja, tanto de ida y retorno se da una estadía en la parroquia de San Pedro de la Bendita de la Imagen Taumaturga de la Virgen de El Cisne, principalmente el 17 de agosto de cada año.
                                    </p>
                                </div>
                            </div>
                            <div className="lg:w-2/5 relative">
                                <div className="relative aspect-[4/5] md:aspect-square max-w-[450px] mx-auto overflow-hidden shadow-2xl border-[15px] border-white ring-1 ring-gray-100">
                                    <Image
                                        src="/images/sobre-mi/foto.webp"
                                        alt="Ramón Agustín Ojeda Alvarado - El Cardenal"
                                        fill
                                        className="object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-cardenal-gold p-8 hidden md:block">
                                    <Music className="text-white w-10 h-10 mb-2" />
                                    <span className="text-white font-serif italic text-xl block">Un legado musical</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Biografía Section */}
                <section className="py-20 bg-cardenal-green text-white relative">
                    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
                            <Music className="w-[500px] h-[500px]" />
                        </div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <h2 className="text-4xl md:text-6xl font-black font-serif italic mb-6">RAMON AGUSTIN OJEDA ALVARADO</h2>
                            <div className="w-24 h-1 bg-cardenal-gold mx-auto mb-8"></div>
                            <p className="text-xl italic font-light text-white/80">"El Cardenal"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg font-light leading-relaxed">
                            <div className="space-y-6">
                                <p>
                                    Muchos poetas y cantores le han dicho tantas cosas lindas, buscando las más bellas rosas del jardín; para 1902 nace en San Pedro de la Bendita, Ramón Agustín Ojeda Alvarado, un 18 de diciembre de 1902.
                                </p>
                                <p>
                                    Sus padres fueron Augusto Ojeda y Zoila Josefa Alvarado. Curso sus estudios primarios en su parroquia natal. Contrajo matrimonio con la Sra. Mercedes Anatolia Córdova Maldonado. Fue un hombre autodidacta con profunda labor musical y un hombre público.
                                </p>
                                <p>
                                    Este joven poco a poco adquirió una profunda riqueza espiritual, con su admirable alma de creyente busco en los arpegios musicales el expresar el profundo amor que sentía por la Santísima Virgen María en la Advocación de El Cisne.
                                </p>
                                <p>
                                    El favor que le prodigo la bendita Madre de Dios es ser Maestro de Capilla en la iglesia en San Pedro y cuando evocaba y cantaba los cantos a la Virgen María se percibía y sentía la llegada de la Virgen María y un mensajero espiritual de Dios.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <p>
                                    Es como aparece misteriosamente el sobrenombre para Ramón Agustín como <span className="text-cardenal-gold font-bold italic">“El Cardenal”</span>, así lo apodaron por todos sus esfuerzos en mantener viva la fe en la Santísima Virgen María.
                                </p>
                                <p>
                                    Los principios y legados de El Cardenal Ojeda, trascendieron más tarde en su familia de generación en generación y sus cantos son cantados también por los trovadores cercanos a San Pedro y Loja.
                                </p>
                                <p>
                                    Ejerció la docencia en la enseñanza musical con lealtad y optimismo en su afán de preparar músicos para la banda de la localidad. Realizó varias creaciones musicales para piano en el ámbito religioso, para instrumentos de viento, creaciones que no fueron publicadas ni discutidas.
                                </p>
                                <p>
                                    Desarrollo una intensa actividad en los negocios como la fábrica de tejidos, una desfibradora de cabuya y una tejedora de prendas de vestir de lana y algodón. Instaló un molino de piedra para granos, además de dedicarse a la fabricación de fulminantes, cigarrillos y artesanías.
                                </p>
                            </div>
                        </div>

                        {/* Milestone - Planta de luz */}
                        <div className="mt-20 bg-white/5 backdrop-blur-sm p-8 md:p-12 border border-white/10 rounded-none flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0 w-20 h-20 bg-cardenal-gold flex items-center justify-center">
                                <Building2 className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold font-serif mb-2 text-cardenal-gold">Visión y Progreso</h4>
                                <p className="text-white/70">
                                    Adquirió con su propia sociedad la primera planta de luz eléctrica en San Pedro de la Bendita (1950-1973) y organizó la construcción del tanque de agua para la distribución de agua potable a todas las viviendas de la parroquia.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Obra Musical Section */}
                <section className="py-20 bg-cardenal-sand">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-cardenal-green font-serif mb-4">Obra Musical</h2>
                            <p className="text-cardenal-gold font-serif italic text-xl">Un legado que perdura en el tiempo</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-8 shadow-sm group hover:shadow-xl transition-all duration-300 border-b-4 border-cardenal-gold">
                                <h4 className="text-cardenal-gold font-black uppercase tracking-widest text-xs mb-4">Himnos y Valses</h4>
                                <ul className="space-y-3 font-serif italic text-lg text-cardenal-green">
                                    <li className="flex justify-between items-center">
                                        <span>“Himno a San Pedro de la Bendita”</span>
                                        <Music className="w-4 h-4 opacity-30" />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>“Melodías Nativas” (Vals)</span>
                                        <Music className="w-4 h-4 opacity-30" />
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-8 shadow-sm group hover:shadow-xl transition-all duration-300 border-b-4 border-cardenal-gold">
                                <h4 className="text-cardenal-gold font-black uppercase tracking-widest text-xs mb-4">Pasillos</h4>
                                <ul className="space-y-3 font-serif italic text-lg text-cardenal-green">
                                    <li className="flex justify-between items-center">
                                        <span>“Corazón Nostálgico”</span>
                                        <Music className="w-4 h-4 opacity-30" />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>“Añorando el pasado”</span>
                                        <Music className="w-4 h-4 opacity-30" />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>“Para tus ojos”</span>
                                        <Music className="w-4 h-4 opacity-30" />
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-8 shadow-sm group hover:shadow-xl transition-all duration-300 border-b-4 border-cardenal-gold">
                                <h4 className="text-cardenal-gold font-black uppercase tracking-widest text-xs mb-4">Pasodobles</h4>
                                <ul className="space-y-3 font-serif italic text-lg text-cardenal-green">
                                    <li className="flex justify-between items-center">
                                        <span>“Diana”</span>
                                        <Music className="w-4 h-4 opacity-30" />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>“Adelante”</span>
                                        <Music className="w-4 h-4 opacity-30" />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>“Tres Reyes”</span>
                                        <Music className="w-4 h-4 opacity-30" />
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>“Señorita Carnaval”</span>
                                        <Music className="w-4 h-4 opacity-30" />
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 text-center text-text-muted max-w-2xl mx-auto italic">
                            Y varios aires típicos de banda, motetes religiosos, letanías y villancicos. Ramón Agustín Ojeda Alvarado muere el 19 de mayo de 1981 en San Pedro de la Bendita dejando un legado invaluable de colaboración en el ámbito musical, cultural, artesanal y económico.
                        </div>
                    </div>
                </section>

                {/* Resumen y Diferenciadores Section */}
                <section className="py-20 bg-white relative">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-cardenal-green p-10 md:p-16 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-cardenal-gold"></div>

                                <div className="relative z-10 space-y-8">
                                    <p className="text-xl md:text-2xl text-white leading-relaxed font-serif italic border-b border-white/10 pb-8">
                                        "En el Cardenal en Loja, encuentras una fusión única de historia, naturaleza, modernidad y buen servicio personalizado, destacando los jardines y senderos junto al rio Malacatos y su ubicación es cerca a centros comerciales, y la distinción de sus habitaciones clásicas y modernas, todo ello en un ambiente histórico restaurado con elegancia, ideal para experimentar Loja de forma tradicional y confortable."
                                    </p>

                                    <div className="space-y-8">
                                        <h3 className="text-cardenal-gold text-2xl font-black uppercase tracking-[0.2em] font-serif">
                                            Lo Diferente que Encontrarás:
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white/90">
                                            <div className="space-y-2">
                                                <h4 className="font-bold text-lg text-white">Historia Viva</h4>
                                                <p className="text-sm leading-relaxed">Es una antigua residencia del siglo XVIII del Cardenal Ojeda, que conserva la esencia de sus muebles originales, ofreciendo un viaje al pasado.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-bold text-lg text-white">Jardínes y parques</h4>
                                                <p className="text-sm leading-relaxed">Un oasis interior con vegetación, fuentes, canales de agua y una terraza chill-out, ideal para relajarse y tomar algo en un ambiente encantador.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-bold text-lg text-white">Ubicación Privilegiada</h4>
                                                <p className="text-sm leading-relaxed">Está dentro del parque La Tebaida de Loja, cerca al Parque Podocarpus, Universidad Nacional de Loja y a poca distancia a pie de Centro Comercial "La Pradera" el mas grande de Loja.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-bold text-lg text-white">Habitaciones con Carácter</h4>
                                                <p className="text-sm leading-relaxed">Ofrece habitaciones con decoraciones distintas con encanto clásico, en un edificio bien cuidado y restaurado.</p>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <h4 className="font-bold text-lg text-white">Atmósfera Única</h4>
                                                <p className="text-sm leading-relaxed text-white/80 italic">Logra un ambiente relajado y tradicional que contrasta con la vida bulliciosa de la ciudad, ofreciendo una experiencia auténtica de Loja.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/10">
                                        <p className="text-cardenal-gold font-bold text-lg font-serif">
                                            En resumen, hotel El Cardenal te ofrece una estancia histórica, con un entorno único que combina jardines y arquitectura tradicional, todo dentro del parque La Tebaida.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-20 bg-white text-center">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-5xl font-black text-cardenal-green font-serif mb-8 leading-tight">
                            Viva la Tradición en <br /><span className="text-cardenal-gold italic">Hotel El Cardenal</span>
                        </h2>
                        <Link
                            href="/contacto"
                            className="inline-flex items-center gap-4 bg-cardenal-green hover:bg-cardenal-gold text-white px-10 py-5 font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-2xl"
                        >
                            Reservar Ahora
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
