'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CreditCard, ArrowLeft, ShieldCheck, Loader2, Lock } from 'lucide-react';

function PagosContent() {
    const searchParams = useSearchParams();
    const amount = searchParams.get('amount') || '0.00';
    const reservaId = searchParams.get('reserva') || '';
    const email = searchParams.get('email') || '';
    const [status, setStatus] = useState('Cargando widget de pago...');
    const [widgetReady, setWidgetReady] = useState(false);

    useEffect(() => {
        console.log("🛠️ PagosContent initialized");

        // Configuración global de Tab
        (window as any).widgetSettings = {
            businessCode: "xnxyq",
            baseURL: "https://checkout.tab.travel"
        };

        // Cargar el script de Tab
        const loadScript = () => {
            if (document.querySelector('script[src="https://checkout.tab.travel/widget.js"]')) {
                console.log("ℹ️ Tab script already loaded");
                setWidgetReady(true);
                return;
            }

            const script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://checkout.tab.travel/widget.js";

            script.onload = () => {
                console.log("✅ Tab script loaded");
                setWidgetReady(true);
                setStatus('Widget listo - Usa el botón para pagar');
            };

            script.onerror = () => {
                console.error("❌ Failed to load Tab script");
                setStatus('Error al cargar el widget de pago');
            };

            const firstScript = document.getElementsByTagName("script")[0];
            if (firstScript && firstScript.parentNode) {
                firstScript.parentNode.insertBefore(script, firstScript);
            }
        };

        loadScript();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header logo="/logo.jpg" />

            <main className="flex-1 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header Premium */}
                    <div className="bg-white rounded-t-2xl shadow-sm border-x border-t border-gray-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                                <ShieldCheck className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Finalizar Pago</h1>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5 text-green-500" /> Transacción Segura • Ref: #{reservaId}
                                </p>
                            </div>
                        </div>
                        <div className="text-center md:text-right bg-blue-50 px-6 py-2 rounded-xl border border-blue-100">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">Total de la reserva</span>
                            <span className="text-4xl font-black text-[#0071c2] tabular-nums">${amount}</span>
                        </div>
                    </div>

                    {/* Contenedor del Widget de Tab */}
                    <div className="bg-white shadow-2xl border-x border-gray-200 relative min-h-[500px] overflow-hidden flex flex-col items-center justify-center p-12 text-center">
                        {!widgetReady ? (
                            <div className="flex flex-col items-center">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 border-4 border-blue-50 border-t-[#0071c2] rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <CreditCard className="w-8 h-8 text-blue-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">{status}</h3>
                                <div className="flex items-center gap-3 text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Encriptación de 256 bits activa</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-lg">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100 mx-auto">
                                    <ShieldCheck className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase italic">Pagar con Tarjeta</h3>
                                <p className="text-gray-600 font-medium mb-8">
                                    Haz clic en el botón <span className="text-[#0071c2] font-bold">"Book Now"</span> de abajo para proceder al pago seguro.
                                </p>

                                {/* Información de la reserva */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-600">Reserva:</span>
                                        <span className="text-sm font-black text-gray-900">#{reservaId}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-600">Email:</span>
                                        <span className="text-sm font-bold text-gray-900">{email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-600">Total:</span>
                                        <span className="text-xl font-black text-[#0071c2]">${amount} USD</span>
                                    </div>
                                </div>

                                {/* Iframe del botón de Tab - Lo mostramos directamente */}
                                <div className="flex justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-dashed border-blue-200">
                                    <iframe
                                        src="https://checkout.tab.travel/xnxyq/button"
                                        style={{
                                            border: 'none',
                                            width: '200px',
                                            height: '60px',
                                            display: 'block'
                                        }}
                                        title="Tab Payment Button"
                                    />
                                </div>

                                <p className="text-xs text-gray-400 mt-6">
                                    <Lock className="w-3 h-3 inline mr-1 text-green-500" />
                                    Pago procesado de forma segura por Tab Travel
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer con Sellos de Confianza */}
                    <div className="bg-gray-50 rounded-b-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <button
                            onClick={() => window.history.back()}
                            className="text-gray-400 hover:text-[#0071c2] flex items-center gap-2 text-sm font-bold transition-all hover:-translate-x-1 uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Volver al Checkout
                        </button>

                        <div className="flex items-center gap-6 grayscale opacity-50">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-5" alt="Visa" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="Paypal" />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PagosPage() {
    return (
        <Suspense fallback={null}>
            <PagosContent />
        </Suspense>
    );
}
