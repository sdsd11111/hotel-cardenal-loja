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
                        src="/images/sobre-mi/hero (10).webp?v=2"
                        alt="Historia Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-cardenal-cream"></div> */}

                    <div className="relative z-10 container mx-auto px-4 text-center text-white mt-10">
                        <span className="inline-block px-4 py-1 bg-cardenal-gold text-white text-xs font-black uppercase tracking-[0.3em] mb-4">
                            Nuestra Historia
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black mb-4 font-serif italic drop-shadow-2xl">
                            Sobre Nosotros
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide text-white/90">
                            Descubra los orígenes de una tradición familiar que nació de la fe, la música y el comercio.
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
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Raíces y Vocación</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-cardenal-green font-serif leading-tight">
                                    Tradición y <span className="italic text-cardenal-gold">Vocación</span>
                                </h2>

                                <div className="space-y-6 text-text-main leading-relaxed text-lg">
                                    <p>
                                        En 1917, en San Pedro de la Bendita, un joven de 15 años de edad comienza una intensa actividad comercial y musical. Ramón Agustín, hijo de Augusto Ojeda y Zoila Josefa Alvarado, fundó una fábrica textil, una planta procesadora de fibra de cabuya y un taller de prendas de vestir de lana y algodón.
                                    </p>
                                    <p>
                                        Posteriormente, junto con su esposa Mercedes Anatolia Córdova Maldonado instala un molino de piedra para granos, además de dedicarse a la fabricación de fulminantes, cigarrillos y artesanías.
                                    </p>
                                    <p>
                                        Posteriormente se asoció con Agustín Aguirre, Julia Gutiérrez, Humberto Maldonado y Raúl Córdova para construir la Primera Planta de Luz Eléctrica en el sur del país. Se instaló en la parroquia de San Pedro de la Bendita y funcionó desde 1950 hasta 1973.
                                    </p>
                                </div>
                            </div>
                            <div className="lg:w-2/5 relative">
                                <div className="relative aspect-[4/5] md:aspect-square max-w-[450px] mx-auto overflow-hidden shadow-2xl border-[15px] border-white ring-1 ring-gray-100">
                                    <Image
                                        src="/images/sobre-mi/foto.webp?v=2"
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
                            <div className="mb-10 max-w-[300px] mx-auto shadow-2xl border-4 border-cardenal-gold transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src="/images/sobre-mi/Reconocimiento.webp"
                                    alt="Reconocimiento Ramón Agustín Ojeda Alvarado"
                                    width={400}
                                    height={500}
                                    className="w-full h-auto"
                                />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black font-serif italic mb-6 uppercase">RAMON AGUSTIN OJEDA ALVARADO</h2>
                            <div className="w-24 h-1 bg-cardenal-gold mx-auto mb-8"></div>
                            <p className="text-xl italic font-light text-white/80">"El Cardenal"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg font-light leading-relaxed">
                            <div className="space-y-6">
                                <p>
                                    Ramón Agustín, hombre devoto y autodidacta buscó en los arpegios musicales expresar el profundo amor que sentía por la Santísima Virgen María en la Advocación de El Cisne.
                                </p>
                                <p>
                                    La Santísima Madre de Dios le concedió la gracia de servir como Maestro de Capilla en la iglesia en San Pedro de la Bendita. Y cuando evocaba y cantaba los cantos a la Virgen María se percibía y sentía la llegada de la Virgen María y un mensajero espiritual de Dios; los fieles se infundían del Espíritu de Dios y capturaban la esperanza y fortaleza que Dios prodigaba en cada Santa Misa celebrada en el pequeño pueblo de San Pedro de la Bendita.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <p>
                                    Así fue como Ramón Agustín adquirió misteriosamente el apodo de <span className="text-cardenal-gold font-bold italic">“El Cardenal”</span> por voz del pueblo. Este apodo se le otorgó por su incansable esfuerzo por mantener viva la fe en la Santísima Virgen María. Entre sus devociones puramente místicas se encontraba su inquebrantable amor por María, la Madre de Dios, bajo su advocación de Nuestra Señora del Cisne.
                                </p>
                                <p>
                                    Los principios y legados de El Cardenal Ojeda, trascendieron más tarde generación en generación. Actualmente los negocios están dirigidos por la 3ra generación de su familia.
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

                {/* Video Biográfico Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <div className="relative aspect-video shadow-2xl rounded-none overflow-hidden bg-black group">
                                <video
                                    controls
                                    className="w-full h-full object-cover"
                                    poster="/images/sobre-mi/hero (10).webp"
                                >
                                    <source src="/images/sobre-mi/video.mp4" type="video/mp4" />
                                    Tu navegador no soporta el formato de video.
                                </video>
                            </div>
                            <div className="mt-8 text-center">
                                <h3 className="text-2xl font-serif italic text-cardenal-green">Un recorrido por su vida y obra</h3>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Obra Musical Section */}
                <section className="py-20 bg-cardenal-sand">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-cardenal-green font-serif mb-4">Obra Musical</h2>
                            <p className="text-cardenal-gold font-serif italic text-xl mb-12">Un legado que perdura en el tiempo</p>

                            <div className="max-w-2xl mx-auto shadow-2xl border-[10px] border-white ring-1 ring-gray-200">
                                <Image
                                    src="/images/sobre-mi/Obra Musical.webp"
                                    alt="Partitura Obra Musical - Ramón Agustín Ojeda"
                                    width={800}
                                    height={500}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 shadow-sm group hover:shadow-xl transition-all duration-300 border-b-4 border-cardenal-gold">
                                <h4 className="text-cardenal-gold font-black uppercase tracking-widest text-[10px] mb-4">Himnos y Valses</h4>
                                <ul className="space-y-2 font-serif italic text-base text-cardenal-green">
                                    <li className="flex justify-between items-start gap-2">
                                        <span>“Himno a San Pedro de la Bendita”</span>
                                    </li>
                                    <li className="flex justify-between items-start gap-2">
                                        <span>“Melodías Nativas” (Vals)</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 shadow-sm group hover:shadow-xl transition-all duration-300 border-b-4 border-cardenal-gold">
                                <h4 className="text-cardenal-gold font-black uppercase tracking-widest text-[10px] mb-4">Pasillos</h4>
                                <ul className="space-y-2 font-serif italic text-base text-cardenal-green">
                                    <li>“Corazón Nostálgico”</li>
                                    <li>“Añorando el pasado”</li>
                                    <li>“Para tus ojos”</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 shadow-sm group hover:shadow-xl transition-all duration-300 border-b-4 border-cardenal-gold">
                                <h4 className="text-cardenal-gold font-black uppercase tracking-widest text-[10px] mb-4">Pasodobles</h4>
                                <ul className="space-y-2 font-serif italic text-base text-cardenal-green">
                                    <li>“Diana”</li>
                                    <li>“Adelante”</li>
                                    <li>“Tres Reyes”</li>
                                    <li>“Señorita Carnaval”</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 shadow-sm group hover:shadow-xl transition-all duration-300 border-b-4 border-cardenal-gold">
                                <h4 className="text-cardenal-gold font-black uppercase tracking-widest text-[10px] mb-4">Chilenas y Otros</h4>
                                <ul className="space-y-2 font-serif italic text-base text-cardenal-green">
                                    <li>“Noches de la fama”</li>
                                    <li>“Coquetonas”</li>
                                    <li>“El tono del Niño” (Villancico)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 text-center text-text-muted max-w-2xl mx-auto italic">
                            Y varios aires típicos de banda, motetes religiosos, letanías y villancicos. Muere el 19 de mayo de 1981 en San Pedro de la Bendita dejando un legado de colaboración en el ámbito musical, cultural, artesanal y económico de la parroquia.
                        </div>
                    </div>
                </section>

                {/* Resumen Final Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl font-serif italic text-cardenal-gold mb-10">
                                "Los principios y legados de El Cardenal Ojeda, trascendieron más tarde generación en generación. Actualmente los negocios están dirigidos por la 3ra generación de su familia."
                            </p>
                            <Link
                                href="/habitaciones"
                                className="inline-flex items-center gap-4 bg-cardenal-green hover:bg-cardenal-gold text-white px-10 py-5 font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-2xl"
                            >
                                Reserva tu Habitación
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
