'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import { Cookie, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function CookiesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header logo={headerData.logo} />

            <main className="flex-1 bg-gray-50">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
                    <div className="container mx-auto px-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <Cookie className="w-12 h-12" />
                            <h1 className="text-4xl md:text-5xl font-bold">Política de Cookies</h1>
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. ¿Qué son las Cookies?</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet o móvil) cuando visita nuestro sitio web. Estas cookies nos ayudan a mejorar su experiencia de navegación, recordar sus preferencias y analizar cómo utiliza nuestro sitio.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Tipos de Cookies que Utilizamos</h2>

                            <div className="space-y-6">
                                {/* Cookies Esenciales */}
                                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                                    <div className="flex items-start gap-3 mb-3">
                                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cookies Esenciales (Necesarias)</h3>
                                            <p className="text-gray-700 mb-2">
                                                Estas cookies son necesarias para el funcionamiento básico del sitio web y no pueden desactivarse.
                                            </p>
                                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                                                <li>Gestión de sesiones de usuario</li>
                                                <li>Seguridad y prevención de fraudes</li>
                                                <li>Funcionalidad del carrito de reservas</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Cookies de Rendimiento */}
                                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                                    <div className="flex items-start gap-3 mb-3">
                                        <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cookies de Rendimiento y Analíticas</h3>
                                            <p className="text-gray-700 mb-2">
                                                Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.
                                            </p>
                                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                                                <li>Google Analytics: Análisis de tráfico y comportamiento</li>
                                                <li>Métricas de rendimiento del sitio</li>
                                                <li>Identificación de errores técnicos</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Cookies de Funcionalidad */}
                                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
                                    <div className="flex items-start gap-3 mb-3">
                                        <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cookies de Funcionalidad</h3>
                                            <p className="text-gray-700 mb-2">
                                                Permiten recordar sus preferencias y mejorar su experiencia.
                                            </p>
                                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                                                <li>Preferencias de idioma</li>
                                                <li>Configuración de visualización</li>
                                                <li>Recordar información de formularios</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Cookies de Marketing */}
                                <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-600">
                                    <div className="flex items-start gap-3 mb-3">
                                        <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cookies de Marketing (Opcionales)</h3>
                                            <p className="text-gray-700 mb-2">
                                                Se utilizan para mostrar anuncios relevantes. Requieren su consentimiento.
                                            </p>
                                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                                                <li>Publicidad personalizada</li>
                                                <li>Seguimiento de conversiones</li>
                                                <li>Remarketing</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies de Terceros</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Utilizamos servicios de terceros que pueden establecer sus propias cookies:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <ul className="space-y-3 text-gray-700">
                                    <li>
                                        <strong>Google Analytics:</strong> Para análisis de tráfico web
                                        <br />
                                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">
                                            Ver política de privacidad de Google
                                        </a>
                                    </li>
                                    <li>
                                        <strong>Google Maps:</strong> Para mostrar mapas interactivos
                                        <br />
                                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">
                                            Ver política de privacidad de Google
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Duración de las Cookies</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies de Sesión</h3>
                                    <p className="text-gray-700 text-sm">
                                        Se eliminan automáticamente cuando cierra su navegador. Se utilizan para funciones temporales como el carrito de reservas.
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookies Persistentes</h3>
                                    <p className="text-gray-700 text-sm">
                                        Permanecen en su dispositivo durante un período específico (generalmente hasta 2 años) para recordar sus preferencias.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cómo Gestionar las Cookies</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Puede controlar y/o eliminar las cookies según desee. Tiene las siguientes opciones:
                            </p>

                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-2">Configuración del Navegador</h3>
                                    <p className="text-gray-700 text-sm mb-2">
                                        Puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envía una cookie:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                                        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Google Chrome</a></li>
                                        <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Mozilla Firefox</a></li>
                                        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Safari</a></li>
                                        <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Microsoft Edge</a></li>
                                    </ul>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                                    <p className="text-gray-700 text-sm">
                                        <strong>Nota:</strong> Si desactiva las cookies, algunas funciones del sitio web pueden no funcionar correctamente, como el proceso de reserva o la personalización de contenido.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Consentimiento</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Al continuar navegando en nuestro sitio web, usted acepta el uso de cookies de acuerdo con esta política. Para cookies no esenciales, solicitaremos su consentimiento explícito a través de nuestro banner de cookies.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Actualizaciones de esta Política</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en nuestras prácticas o por razones legales. Le recomendamos revisar esta página regularmente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Más Información</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Para más información sobre cómo protegemos su privacidad, consulte nuestra <Link href="/privacidad" className="text-green-600 hover:underline font-semibold">Política de Privacidad</Link>.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Si tiene preguntas sobre nuestra Política de Cookies:
                            </p>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:elcardenalhotel@gmail.com" className="text-green-600 hover:underline">elcardenalhotel@gmail.com</a></p>
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
