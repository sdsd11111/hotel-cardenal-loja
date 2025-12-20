'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { Shield, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

export default function PrivacidadPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header logo={headerData.logo} />

            <main className="flex-1 bg-gray-50">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                    <div className="container mx-auto px-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <Shield className="w-12 h-12" />
                            <h1 className="text-4xl md:text-5xl font-bold">Política de Privacidad</h1>
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introducción</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Hotel El Cardenal se compromete a proteger la privacidad y seguridad de los datos personales de nuestros huéspedes, visitantes y usuarios de nuestro sitio web. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos su información personal de acuerdo con la Ley Orgánica de Protección de Datos Personales (LOPDP) de Ecuador.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Responsable del Tratamiento</h2>
                            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                                <p className="font-semibold text-gray-900 mb-2">Hotel El Cardenal Loja</p>
                                <div className="space-y-2 text-gray-700">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        Gladiolos 154-42 y Av. 18 de Noviembre, Loja - Ecuador
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                        099 661 6878
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        elcardenalhotel@gmail.com
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Datos que Recopilamos</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Recopilamos los siguientes tipos de información personal:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li><strong>Datos de identificación:</strong> Nombre completo, número de cédula o pasaporte, fecha de nacimiento</li>
                                <li><strong>Datos de contacto:</strong> Dirección de correo electrónico, número de teléfono, dirección postal</li>
                                <li><strong>Datos de reserva:</strong> Fechas de estadía, preferencias de habitación, solicitudes especiales</li>
                                <li><strong>Datos de pago:</strong> Información de tarjeta de crédito/débito (procesada de forma segura)</li>
                                <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas, cookies</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Finalidad del Tratamiento</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Utilizamos sus datos personales para:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Gestionar reservas y proporcionar servicios de alojamiento</li>
                                <li>Procesar pagos y facturación</li>
                                <li>Comunicarnos con usted sobre su reserva o estadía</li>
                                <li>Mejorar nuestros servicios y experiencia del cliente</li>
                                <li>Enviar ofertas promocionales (con su consentimiento previo)</li>
                                <li>Cumplir con obligaciones legales y fiscales</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Base Legal del Tratamiento</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                El tratamiento de sus datos personales se basa en:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li><strong>Ejecución de contrato:</strong> Para procesar su reserva y proporcionar servicios</li>
                                <li><strong>Consentimiento:</strong> Para comunicaciones de marketing y promociones</li>
                                <li><strong>Obligación legal:</strong> Para cumplir con requisitos fiscales y legales</li>
                                <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y seguridad</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Compartir Información</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Podemos compartir su información con:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>Proveedores de servicios de pago (procesamiento seguro de transacciones)</li>
                                <li>Autoridades gubernamentales cuando sea legalmente requerido</li>
                                <li>Proveedores de servicios técnicos (hosting, mantenimiento del sitio web)</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                <strong>No vendemos ni compartimos sus datos personales con terceros para fines de marketing.</strong>
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sus Derechos (Derechos ARCO)</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                De acuerdo con la LOPDP, usted tiene derecho a:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted</li>
                                <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                                <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos</li>
                                <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para ciertos fines</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                Para ejercer estos derechos, contáctenos en: <a href="mailto:elcardenalhotel@gmail.com" className="text-blue-600 hover:underline">elcardenalhotel@gmail.com</a>
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Seguridad de los Datos</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra acceso no autorizado, pérdida, destrucción o alteración. Esto incluye encriptación SSL, acceso restringido y auditorías de seguridad regulares.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Retención de Datos</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Conservamos sus datos personales durante el tiempo necesario para cumplir con las finalidades descritas en esta política, a menos que la ley requiera o permita un período de retención más largo (por ejemplo, obligaciones fiscales).
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cookies</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación. Para más información, consulte nuestra <Link href="/cookies" className="text-blue-600 hover:underline">Política de Cookies</Link>.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Cambios a esta Política</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Nos reservamos el derecho de actualizar esta Política de Privacidad. Los cambios significativos serán notificados a través de nuestro sitio web o por correo electrónico.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contacto</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Si tiene preguntas sobre esta Política de Privacidad o el tratamiento de sus datos personales, contáctenos:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:elcardenalhotel@gmail.com" className="text-blue-600 hover:underline">elcardenalhotel@gmail.com</a></p>
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
