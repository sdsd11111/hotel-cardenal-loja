'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { FileText, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

export default function TerminosPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header logo={headerData.logo} />

            <main className="flex-1 bg-gray-50">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white py-16">
                    <div className="container mx-auto px-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <FileText className="w-12 h-12" />
                            <h1 className="text-4xl md:text-5xl font-bold">Términos y Condiciones</h1>
                        </div>
                        <p className="text-xl text-white/90">
                            Última actualización: Diciembre 2024
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Al acceder y utilizar el sitio web de Hotel El Cardenal y/o realizar una reserva, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Reservas</h2>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Proceso de Reserva</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                                <li>Las reservas pueden realizarse a través de nuestro sitio web, por teléfono o correo electrónico</li>
                                <li>Todas las reservas están sujetas a disponibilidad</li>
                                <li>Se requiere una tarjeta de crédito válida para garantizar la reserva</li>
                                <li>Recibirá un correo electrónico de confirmación con los detalles de su reserva</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Tarifas y Pagos</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Todas las tarifas están expresadas en dólares estadounidenses (USD)</li>
                                <li>Las tarifas incluyen impuestos aplicables según la legislación ecuatoriana</li>
                                <li>El pago puede realizarse con tarjeta de crédito, débito o efectivo</li>
                                <li>Nos reservamos el derecho de modificar las tarifas sin previo aviso</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Políticas de Cancelación</h2>
                            <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-600 mb-4">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cancelación Estándar</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                    <li><strong>Más de 48 horas antes del check-in:</strong> Cancelación gratuita, reembolso completo</li>
                                    <li><strong>Entre 24-48 horas antes del check-in:</strong> Cargo del 50% de la primera noche</li>
                                    <li><strong>Menos de 24 horas o no-show:</strong> Cargo del 100% de la primera noche</li>
                                </ul>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Nota:</strong> Las tarifas no reembolsables y paquetes especiales pueden tener políticas de cancelación diferentes. Consulte los términos específicos al momento de la reserva.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Check-in y Check-out</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-in</h3>
                                    <p className="text-gray-700 mb-2"><strong>Hora:</strong> 15:00</p>
                                    <p className="text-gray-700 text-sm">Check-in anticipado sujeto a disponibilidad (puede aplicar cargo adicional)</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Check-out</h3>
                                    <p className="text-gray-700 mb-2"><strong>Hora:</strong> 12:00</p>
                                    <p className="text-gray-700 text-sm">Check-out tardío sujeto a disponibilidad (puede aplicar cargo adicional)</p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Normas de la Casa</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Se requiere identificación válida (cédula o pasaporte) al momento del check-in</li>
                                <li>Prohibido fumar en habitaciones y áreas cerradas del hotel</li>
                                <li>Las mascotas no están permitidas (excepto animales de servicio)</li>
                                <li>Respetar las horas de silencio (22:00 - 07:00)</li>
                                <li>Capacidad máxima por habitación según tipo reservado</li>
                                <li>El hotel no se hace responsable por objetos de valor no depositados en caja fuerte</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Responsabilidad</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Hotel El Cardenal se esfuerza por proporcionar servicios de alta calidad, sin embargo:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>No nos hacemos responsables por pérdidas o daños a pertenencias personales</li>
                                <li>Los huéspedes son responsables de cualquier daño causado a la propiedad del hotel</li>
                                <li>No somos responsables por interrupciones de servicios debido a causas de fuerza mayor</li>
                                <li>El hotel se reserva el derecho de negar servicio o solicitar que un huésped abandone las instalaciones en caso de comportamiento inapropiado</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modificaciones de Reserva</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Las modificaciones a reservas existentes están sujetas a disponibilidad y pueden resultar en cambios de tarifa. Para modificar su reserva, contáctenos al menos 48 horas antes de su fecha de llegada.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacidad</h2>
                            <p className="text-gray-700 leading-relaxed">
                                El uso de sus datos personales está regido por nuestra <Link href="/privacidad" className="text-amber-600 hover:underline font-semibold">Política de Privacidad</Link>, la cual cumple con la Ley Orgánica de Protección de Datos Personales (LOPDP) de Ecuador.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Propiedad Intelectual</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Todo el contenido de este sitio web, incluyendo textos, imágenes, logotipos y diseño, es propiedad de Hotel El Cardenal y está protegido por las leyes de propiedad intelectual de Ecuador. No se permite su reproducción sin autorización expresa.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Ley Aplicable</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Estos Términos y Condiciones se rigen por las leyes de la República del Ecuador. Cualquier disputa será resuelta en los tribunales competentes de Loja, Ecuador.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contacto</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Para preguntas sobre estos Términos y Condiciones:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:elcardenalhotel@gmail.com" className="text-amber-600 hover:underline">elcardenalhotel@gmail.com</a></p>
                                <p className="text-gray-700 mb-2"><strong>Teléfono:</strong> 099 661 6878</p>
                                <p className="text-gray-700"><strong>Dirección:</strong> Gladiolos 154-42 y Av. 18 de Noviembre, Loja - Ecuador</p>
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
