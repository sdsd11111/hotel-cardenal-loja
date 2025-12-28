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
    const [status, setStatus] = useState('Iniciando...');
    const [isEmbedding, setIsEmbedding] = useState(true);

    useEffect(() => {
        console.log("🛠️ PagosContent initialized");

        // 1. Configuración global de Tab
        (window as any).widgetSettings = {
            businessCode: "xnxyq",
            baseURL: "https://checkout.tab.travel"
        };

        // 2. Carga del script oficial
        const loadScript = () => {
            if (document.querySelector('script[src="https://checkout.tab.travel/widget.js"]')) {
                console.log("ℹ️ Tab script already exists");
                return;
            }

            console.log("📥 Loading Tab script...");
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://checkout.tab.travel/widget.js";

            script.onload = () => console.log("✅ Tab script loaded via onload");

            const firstScript = document.getElementsByTagName("script")[0];
            if (firstScript && firstScript.parentNode) {
                firstScript.parentNode.insertBefore(script, firstScript);
            }
        };

        loadScript();

        // 3. Watcher para forzar apertura y capturar el iframe
        let attempts = 0;
        const watcher = setInterval(() => {
            attempts++;
            const Tab = (window as any).Tab;

            if (attempts % 10 === 0) {
                console.log(`⏱️ Watcher attempt ${attempts}...`);
            }

            // Paso A: Intentar abrir el checkout si Tab está listo
            if (attempts === 30 && Tab && Tab.checkout && Tab.checkout.open) {
                console.log("🚀 Attempting window.Tab.checkout.open()...");
                setStatus('Abriendo pasarela de pago...');
                try {
                    Tab.checkout.open({
                        businessCode: "xnxyq",
                        amount: amount,
                        currency: "USD"
                    });
                } catch (e) {
                    console.error("❌ Error opening Tab checkout:", e);
                }
            }

            // Paso B: Intentar clic en el botón inyectado por el script como último recurso
            if (attempts === 60) {
                const tabBtn = document.querySelector('.tab-book-now-button') as HTMLElement;
                if (tabBtn) {
                    console.log("⚡ Fallback: Clicking injected Tab button");
                    tabBtn.click();
                }
            }

            // Paso C: Buscar el iframe de PAGO (no el launcher)
            const iframes = Array.from(document.querySelectorAll('iframe'));
            const paymentIframe = iframes.find(f =>
                f.src.includes('tab.travel') &&
                f.id !== 'tab-widget-launcher' &&
                !f.src.includes('launcher') &&
                !f.src.includes('button') // El checkout real no suele decir button en el src
            );

            if (paymentIframe) {
                console.log("🎯 DETECTED PAYMENT IFRAME:", paymentIframe.src);
                const container = document.getElementById('tab-direct-container');

                if (container && paymentIframe.parentElement !== container) {
                    console.log("🚚 Moving iframe to page container...");
                    setStatus('Cargando formulario de tarjeta...');

                    // Reset de estilos para integración total
                    paymentIframe.style.position = 'relative';
                    paymentIframe.style.top = '0';
                    paymentIframe.style.left = '0';
                    paymentIframe.style.width = '100%';
                    paymentIframe.style.height = '850px';
                    paymentIframe.style.border = 'none';
                    paymentIframe.style.zIndex = '1';
                    paymentIframe.style.display = 'block';
                    paymentIframe.style.visibility = 'visible';
                    paymentIframe.style.opacity = '1';

                    container.appendChild(paymentIframe);

                    setTimeout(() => {
                        setIsEmbedding(false);
                        console.log("✨ Integration complete!");
                    }, 1000);

                    clearInterval(watcher);
                }
            }

            if (attempts > 300) {
                console.log("⚠️ Watcher timed out (30s)");
                setStatus('Error de conexión o Dominio no autorizado');
                setIsEmbedding(false);
                clearInterval(watcher);
            }
        }, 100);

        // Estilo para forzar ocultación de elementos redundantes
        const style = document.createElement('style');
        style.innerHTML = `
            #tab-widget-launcher, .tab-widget-launcher, iframe[src*="button"] { 
                display: none !important; 
            }
            #tab-direct-container iframe {
                display: block !important;
                visibility: visible !important;
            }
        `;
        document.head.appendChild(style);

        // Mensaje de fallback si no aparece nada
        const timeoutWarn = setTimeout(() => {
            if (isEmbedding) {
                setStatus('¿Sigue cargando? Revisa la configuración de dominios en Tab.');
            }
        }, 10000);

        return () => {
            clearInterval(watcher);
            clearTimeout(timeoutWarn);
            if (style.parentNode) style.parentNode.removeChild(style);
        };
    }, [amount]);

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

                    {/* Contenedor del Formulario Directo */}
                    <div className="bg-white shadow-2xl border-x border-gray-200 relative min-h-[750px] overflow-hidden">
                        {isEmbedding && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 text-[#0071c2] animate-spin mb-6" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-blue-400" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 font-serif">{status}</h3>
                                <p className="text-gray-400 text-sm font-medium italic">Tab Travel Secure Checkout</p>
                            </div>
                        )}

                        {/* Aquí inyectaremos el iframe de TAB */}
                        <div id="tab-direct-container" className="w-full h-full min-h-[850px]"></div>

                        {/* Botón oculto requerido por el script para inyectar su lógica */}
                        <div className="invisible h-0 overflow-hidden">
                            <button
                                className="tab-book-now-button"
                                data-tab-business-code="xnxyq"
                                data-tab-amount={amount}
                                data-tab-currency="USD"
                            >
                                Trigger
                            </button>
                        </div>
                    </div>

                    {/* Footer con Sellos de Confianza */}
                    <div className="bg-gray-50 rounded-b-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <button
                            onClick={() => window.history.back()}
                            className="text-gray-400 hover:text-[#0071c2] flex items-center gap-2 text-sm font-bold transition-all hover:-translate-x-1"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            VOLVER ATRÁS
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
