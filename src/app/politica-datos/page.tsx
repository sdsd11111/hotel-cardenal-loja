'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

export default function PoliticaDatosPage() {
    return (
        <div className="flex flex-col min-h-screen bg-cardenal-cream/20 font-sans">
            <Header logo={headerData.logo} />

            <main className="flex-1 py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-2xl rounded-2xl border border-cardenal-gold/10">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-cardenal-gold/10 rounded-full mb-6 text-cardenal-gold">
                                <Shield className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-cardenal-green font-serif mb-6">
                                Protección de Datos Personales
                            </h1>
                            <p className="text-lg text-gray-500 italic font-serif">
                                Cumplimiento LOPDP - Hotel El Cardenal Loja
                            </p>
                            <div className="w-24 h-1 bg-cardenal-gold mx-auto mt-8"></div>
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-12">
                            <section>
                                <h2 className="text-2xl font-bold text-cardenal-green font-serif flex items-center gap-3 mb-6">
                                    <Lock className="w-6 h-6 text-cardenal-gold" />
                                    1. Compromiso de Privacidad
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </h2>
                                <p>
                                    En Hotel El Cardenal, la privacidad de nuestros huéspedes es una prioridad fundamental. Hemos adecuado nuestros procesos a la <strong>Ley Orgánica de Protección de Datos Personales (LOPDP)</strong> de Ecuador para garantizar que su información sea tratada con la mayor seguridad y transparencia.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-cardenal-green font-serif flex items-center gap-3 mb-6">
                                    <Eye className="w-6 h-6 text-cardenal-gold" />
                                    2. ¿Qué datos recolectamos?
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </h2>
                                <p>
                                    Para brindarle una experiencia excepcional, recolectamos datos mínimos indispensables:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <li className="flex items-start gap-2 bg-gray-50 p-4 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-cardenal-gold mt-1 shrink-0" />
                                        <span>Identificación (Cédula/RUC/Pasaporte) para registro legal.</span>
                                    </li>
                                    <li className="flex items-start gap-2 bg-gray-50 p-4 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-cardenal-gold mt-1 shrink-0" />
                                        <span>Datos de contacto (Email/Teléfono) para confirmaciones.</span>
                                    </li>
                                    <li className="flex items-start gap-2 bg-gray-50 p-4 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-cardenal-gold mt-1 shrink-0" />
                                        <span>Preferencias de estancia y dieta para su comodidad.</span>
                                    </li>
                                    <li className="flex items-start gap-2 bg-gray-50 p-4 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-cardenal-gold mt-1 shrink-0" />
                                        <span>Datos de facturación según normativa del SRI.</span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-cardenal-green font-serif flex items-center gap-3 mb-6">
                                    <FileText className="w-6 h-6 text-cardenal-gold" />
                                    3. Finalidad del Tratamiento
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </h2>
                                <p>
                                    Sus datos se utilizan exclusivamente para:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-600">
                                    <li>Gestión de reservas y confirmación de pagos.</li>
                                    <li>Emisión de comprobantes electrónicos legales.</li>
                                    <li>Mejora de nuestros servicios personalizados.</li>
                                    <li>Comunicaciones sobre su reserva vía WhatsApp o Email.</li>
                                </ul>
                            </section>

                            <section className="bg-cardenal-green/5 p-8 rounded-2xl border-l-4 border-cardenal-gold mt-12">
                                <h3 className="text-xl font-bold text-cardenal-green font-serif mb-4">Sus Derechos (ARCO)</h3>
                                <p className="mb-6">
                                    Usted tiene derecho a <strong>Aceder, Rectificar, Cancelar u Oponerse</strong> al tratamiento de sus datos en cualquier momento.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href="mailto:elcardenalhotel@gmail.com"
                                        className="bg-cardenal-green text-white font-bold py-3 px-6 rounded-lg text-center hover:bg-cardenal-gold transition-all"
                                    >
                                        Solicitar Rectificación
                                    </a>
                                    <a
                                        href="/contacto"
                                        className="bg-white border-2 border-cardenal-green text-cardenal-green font-bold py-3 px-6 rounded-lg text-center hover:bg-cardenal-cream transition-all"
                                    >
                                        Centro de Soporte
                                    </a>
                                </div>
                            </section>

                            <div className="pt-12 border-t border-gray-100 text-center text-sm text-gray-400 font-sans italic">
                                Última actualización: Diciembre 2025 | Hotel El Cardenal Loja
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
