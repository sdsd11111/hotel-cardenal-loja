'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Info } from 'lucide-react';
import PayPhoneBox from '@/components/PayPhoneBox';

function PagosContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const amount = searchParams.get('amount') || '0.00';
    const reservaId = searchParams.get('reserva') || '';
    const description = searchParams.get('description') || `Reserva Hotel Cardenal #${reservaId}`;

    const [status, setStatus] = useState<'loading' | 'payment' | 'success' | 'error'>('payment');
    const [message, setMessage] = useState('');

    const id = searchParams.get('id');
    const clientTransactionId = searchParams.get('clientTransactionId');
    const email = searchParams.get('email') || '';
    const nombre = searchParams.get('nombre') || '';
    const entrada = searchParams.get('entrada') || '';
    const salida = searchParams.get('salida') || '';
    const habitacion_id = searchParams.get('habitacion_id') || '';
    const adultos = searchParams.get('adultos') || '';
    const whatsapp = searchParams.get('whatsapp') || '';
    const habitacion_nombre = searchParams.get('habitacion_nombre') || '';
    const reserva_para = searchParams.get('reserva_para') || '';
    const pais = searchParams.get('pais') || '';
    const peticiones = searchParams.get('peticiones') || '';

    // Efecto para verificar pago (cuando regresa de PayPhone)
    useEffect(() => {
        if (id && clientTransactionId) {
            setStatus('loading');
            setMessage('Verificando pago...');

            // Intentar recuperar datos de localStorage si los params están vacíos
            let finalReservationData: any = {
                numero_reserva: reservaId,
                precio: parseFloat(amount),
                email_cliente: email,
                nombre_cliente: nombre,
                fecha_entrada: entrada,
                fecha_salida: salida,
                habitacion_id: habitacion_id ? parseInt(habitacion_id) : undefined,
                habitacion_nombre: habitacion_nombre,
                adultos: adultos ? parseInt(adultos) : undefined,
                whatsapp: whatsapp,
                reserva_para: reserva_para,
                pais: pais,
                peticiones: peticiones
            };

            // Intentar recuperar de localStorage si faltan datos (caso Redirect)
            if (!nombre || !email || !entrada) {
                try {
                    const storedData = localStorage.getItem('fullPendingPayment');
                    if (storedData) {
                        const parsed = JSON.parse(storedData);
                        console.log("Recuperando datos perdidos desde localStorage (fullPendingPayment):", parsed);
                        // Mezclar, dando prioridad a lo guardado si lo actual es vacío
                        finalReservationData = { ...finalReservationData, ...parsed };

                        // Asegurar que si el ID viene en la URL, se respete (el de la url de retorno payphone)
                        // Pero el resto de datos de negocio vienen del storage
                    }
                } catch (e) {
                    console.error("Error leyendo localStorage fullPendingPayment", e);
                }
            }

            fetch('/api/payphone/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    clientTransactionId,
                    reservationData: finalReservationData
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.transactionStatus === "Approved" || data.statusCode === 3) {
                        setStatus('success');
                        // Limpiar storage tras éxito
                        localStorage.removeItem('fullPendingPayment');
                        localStorage.removeItem('pendingCheckout');
                        localStorage.removeItem('checkoutFormData');
                        localStorage.removeItem('savedReservaId');
                        localStorage.removeItem('clientTxId');
                    } else {
                        setStatus('error');
                        setMessage(data.message || 'El pago no pudo ser verificado.');
                    }
                })
                .catch(error => {
                    console.error("Error verifying payment:", error);
                    setStatus('error');
                    setMessage('Error de conexión al verificar el pago.');
                });
        }
    }, [id, clientTransactionId]);

    // Efecto para GUARDAR datos antes de pagar (apenas monta con params)
    useEffect(() => {
        // Si tenemos datos ricos en la URL (antes de ir a PayPhone), guardarlos
        // Verificamos si tenemos 'reservaId' y 'nombre' como indicativo de que estamos en la fase pre-pago
        if (reservaId && nombre && email && !id) {
            const dataToStore = {
                numero_reserva: reservaId,
                precio: parseFloat(amount),
                email_cliente: email,
                nombre_cliente: nombre,
                fecha_entrada: entrada,
                fecha_salida: salida,
                habitacion_id: habitacion_id ? parseInt(habitacion_id) : undefined,
                habitacion_nombre: habitacion_nombre,
                adultos: adultos ? parseInt(adultos) : undefined,
                whatsapp: whatsapp,
                reserva_para: reserva_para,
                pais: pais,
                peticiones: peticiones
            };
            console.log("Guardando contexto de pago en localStorage (fullPendingPayment):", dataToStore);
            localStorage.setItem('fullPendingPayment', JSON.stringify(dataToStore));
        }
    }, [reservaId, nombre, email, id, amount, entrada, salida, habitacion_id, habitacion_nombre, adultos, whatsapp, reserva_para, pais, peticiones]);

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
            <Header logo="/logo.png" />

            <main className="flex-1 pt-32 pb-12 px-4 flex flex-col items-center">
                <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Header Oscuro (Estilo Cesar Reyes) */}
                    <div className="bg-[#1f2937] p-6 relative">
                        <button
                            onClick={() => router.back()}
                            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="text-center">
                            <h2 className="text-white text-lg font-bold tracking-tight">Finalizar Pago</h2>
                            <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mt-0.5">Transacción segura vía PayPhone</p>
                        </div>
                    </div>

                    <div className="p-6">
                        {status === 'loading' && (
                            <div className="py-20 flex flex-col items-center">
                                <div className="relative mb-8">
                                    <div className="w-14 h-14 border-4 border-gray-100 border-t-[#1f2937] rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-gray-800">{message}</h3>
                            </div>
                        )}

                        {status === 'payment' && (
                            <>
                                {/* Resumen de Pago */}
                                <div className="flex justify-between items-end pb-5 mb-5 border-b border-gray-100">
                                    <div>
                                        <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1 block leading-none">Concepto</span>
                                        <p className="text-sm font-bold text-gray-700 leading-tight">{description}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1 block leading-none text-right">Total</span>
                                        <p className="text-2xl font-black text-[#f37021] leading-none">${amount}</p>
                                    </div>
                                </div>

                                {/* Banner Informativo */}
                                <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 mb-8 flex gap-3 items-center">
                                    <div className="bg-blue-500 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center">
                                        <Info className="w-3 h-3 text-white" />
                                    </div>
                                    <p className="text-[11px] text-blue-800/80 leading-snug font-medium">
                                        Al hacer clic en el botón de abajo, se abrirá el formulario de PayPhone para ingresar los datos de tu tarjeta.
                                    </p>
                                </div>

                                {/* Widget de PayPhone con el wrapper para resetear estilos */}
                                <div className="payphone-container min-h-[450px]">
                                    <PayPhoneBox
                                        amount={parseFloat(amount)}
                                        description={description}
                                    />
                                </div>
                            </>
                        )}

                        {status === 'success' && (
                            <div className="py-12 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">¡Pago Realizado!</h3>
                                <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed font-medium">
                                    Tu transacción ha sido exitosa. En breve recibirás los detalles de tu reserva por email.
                                </p>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="bg-[#1f2937] text-white w-full py-4 rounded-2xl font-bold hover:bg-black transition-all uppercase tracking-widest text-[10px]"
                                >
                                    Volver al Inicio
                                </button>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="py-12 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
                                    <XCircle className="w-10 h-10 text-red-600" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Vaya, algo salió mal</h3>
                                <p className="text-gray-500 text-sm mb-8 px-4 leading-relaxed font-medium">
                                    {message}
                                </p>
                                <div className="flex flex-col w-full gap-3">
                                    <button
                                        onClick={() => setStatus('payment')}
                                        className="bg-[#f37021] text-white w-full py-4 rounded-2xl font-bold hover:bg-[#d65f1a] transition-all uppercase tracking-widest text-[10px]"
                                    >
                                        Intentar nuevamente
                                    </button>
                                    <button
                                        onClick={() => router.back()}
                                        className="bg-gray-100 text-gray-600 w-full py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all uppercase tracking-widest text-[10px]"
                                    >
                                        Cancelar y Regresar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50/50 py-4 px-6 border-t border-gray-100 text-center">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                            Pagos protegidos con encriptación SSL de 256 bits
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PagosPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
            </div>
        }>
            <PagosContent />
        </Suspense>
    );
}
