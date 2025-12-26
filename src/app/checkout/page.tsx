'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
    Calendar, Users, MapPin, CheckCircle2, Lock, CreditCard,
    Star, MessageSquare, Info, ChevronDown, Check,
    Wifi, Car, Utensils, Coffee, UserCircle, Phone, Globe,
    ChevronRight, Sparkles, AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const headerData = {
    logo: '/logo.jpg'
};
export default function CheckoutPage() {
    const router = useRouter();
    const [bookingData, setBookingData] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState(2); // 2: Tus datos, 3: Terminar reserva

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        pais: 'Ecuador',
        codigoPais: '+593',
        telefono: '',
        peticiones: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCambiaSeleccion = () => {
        if (!bookingData) return;
        const { fechaEntrada, fechaSalida, option } = bookingData;
        const params = new URLSearchParams({
            entrada: fechaEntrada || '',
            salida: fechaSalida || '',
            adultos: option?.personas?.toString() || '1',
            ninos: '0'
        });
        router.push(`/habitaciones?${params.toString()}`);
    };

    useEffect(() => {
        setMounted(true);
        const data = localStorage.getItem('pendingCheckout');
        if (data) {
            setBookingData(JSON.parse(data));
        }
    }, []);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'No definida';
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (!mounted) return null;

    if (!bookingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header logo={headerData.logo} />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center bg-white p-8 rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">No hay ninguna reserva pendiente</h1>
                        <p className="text-gray-600 mb-6">Tu sesión podría haber expirado o no has seleccionado una habitación.</p>
                        <a href="/habitaciones" className="inline-block bg-[#0071c2] text-white font-bold py-2 px-6 rounded hover:bg-[#003580] transition-colors">
                            Volver a habitaciones
                        </a>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const { habitacion, option, cantidad, fechaEntrada, fechaSalida, comidas } = bookingData;

    const getNoches = () => {
        if (!fechaEntrada || !fechaSalida) return 1;
        const start = new Date(fechaEntrada);
        const end = new Date(fechaSalida);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(1, diff);
    };

    const noches = getNoches();
    const totalBase = (option.precioBase) * cantidad * noches;
    const impuestos = (option.impuestos) * cantidad * noches;

    // Calcular extras de comidas
    const extraComidas = Object.entries(comidas || {}).reduce((total: number, [meal, selected]) => {
        if (!selected) return total;
        const isIncluded = meal === 'desayuno' ? habitacion.incluyeDesayuno :
            meal === 'almuerzo' ? habitacion.incluyeAlmuerzo :
                habitacion.incluyeCena;
        return total + (isIncluded ? 0 : 1.0 * cantidad * noches);
    }, 0);

    const total = totalBase + impuestos + extraComidas;

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans text-[#1a1a1a]">
            {/* Header especial para checkout con fondo blanco sólido */}
            <Header
                logo={headerData.logo}
                forceDarkText={true}
                showReservationSearch={false}
                className="!bg-white !shadow-md !border-b border-gray-200"
            />

            <main className="flex-1 container mx-auto px-4 pt-[160px] pb-8 max-w-[1100px]">

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8 max-w-[800px] mx-auto text-sm">
                    <div className="flex items-center gap-2 text-[#0071c2] font-bold">
                        <div className="w-6 h-6 rounded-full bg-[#0071c2] text-white flex items-center justify-center text-xs">
                            <Check className="w-4 h-4" />
                        </div>
                        <span>Tu selección</span>
                    </div>
                    <div className="flex-1 h-[1px] bg-gray-300 mx-4"></div>
                    <div className={cn(
                        "flex items-center gap-2 font-bold",
                        step >= 2 ? "text-[#0071c2]" : "text-gray-500"
                    )}>
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            step >= 2 ? "bg-[#0071c2] text-white" : "border border-gray-400"
                        )}>
                            {step > 2 ? <Check className="w-4 h-4" /> : "2"}
                        </div>
                        <span>Tus datos</span>
                    </div>
                    <div className="flex-1 h-[1px] bg-gray-300 mx-4"></div>
                    <div className={cn(
                        "flex items-center gap-2 font-bold",
                        step === 3 ? "text-[#0071c2]" : "text-gray-500"
                    )}>
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            step === 3 ? "bg-[#0071c2] text-white" : "border border-gray-400"
                        )}>3</div>
                        <span>Terminar reserva</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">

                    {/* Sidebar Izquierdo */}
                    <div className="lg:col-span-4 space-y-4">
                        {/* Hotel Info Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4">
                                <div className="flex gap-1 mb-1">
                                    {[1, 2, 3].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <h2 className="text-xl font-bold mb-1">El Cardenal Hotel</h2>
                                <p className="text-sm text-gray-600 mb-2">Calle Gladiolos y 18 de Noviembre, 110150 Loja, Ecuador</p>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-[#003580] text-white text-xs font-bold px-1.5 py-1 rounded">9.2</span>
                                    <span className="text-sm font-bold">Fantástico</span>
                                    <span className="text-xs text-gray-500">• 104 comentarios</span>
                                </div>

                                <div className="flex flex-wrap gap-3 text-xs text-gray-600 border-t border-gray-100 pt-3">
                                    <div className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5" /> WiFi gratis</div>
                                    <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Muy buena ubicación</div>
                                    <div className="flex items-center gap-1"><Utensils className="w-3.5 h-3.5" /> Restaurante</div>
                                </div>
                            </div>
                        </div>

                        {/* Reservation Details Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
                            <h3 className="font-bold border-b border-gray-100 pb-2">Los datos de tu reserva</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-r border-gray-100 pr-2">
                                    <p className="text-xs font-bold text-gray-900">Entrada</p>
                                    <p className="text-sm font-bold text-[#1a1a1a]">{formatDate(fechaEntrada)}</p>
                                    <p className="text-xs text-gray-500">14:00 - 22:00</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900">Salida</p>
                                    <p className="text-sm font-bold text-[#1a1a1a]">{formatDate(fechaSalida)}</p>
                                    <p className="text-xs text-gray-500">7:00 - 11:00</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <p className="text-xs font-bold text-gray-900">Duración total de la estancia:</p>
                                <p className="text-sm font-bold">{noches} {noches === 1 ? 'noche' : 'noches'}</p>
                            </div>

                            <div className="pt-2 border-t border-gray-100 pt-4 cursor-pointer hover:bg-gray-50 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 uppercase">Has seleccionado</p>
                                        <p className="text-sm font-bold text-[#0071c2]">{cantidad} {cantidad === 1 ? 'habitación' : 'habitaciones'} para {option.personas} {option.personas === 1 ? 'adulto' : 'adultos'}</p>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </div>
                                <button
                                    onClick={handleCambiaSeleccion}
                                    className="text-[#0071c2] text-xs font-bold mt-2 hover:underline"
                                >
                                    Cambia tu selección
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#ebf3ff] rounded-lg shadow-sm border border-gray-200 p-4">
                            <h3 className="text-xl font-bold mb-4">Desglose del precio</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>{cantidad}x {habitacion.nombre}</span>
                                    <span>US${totalBase + impuestos}</span>
                                </div>
                                {extraComidas > 0 && (
                                    <div className="flex justify-between text-blue-700">
                                        <span>Extras de comidas</span>
                                        <span>US${extraComidas}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-center border-t border-blue-200 pt-4 mt-4">
                                <span className="text-2xl font-bold">Precio</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold">US${total.toFixed(2)}</span>
                                    <p className="text-[10px] text-gray-500">Incluye impuestos y cargos</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenido Principal Derecho */}
                    <div className="lg:col-span-8 space-y-6">
                        {step === 2 ? (
                            <>
                                {/* Guest Details Form */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold mb-6">Datos del huésped</h2>




                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold block">Nombre <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full border border-gray-400 rounded px-3 py-2 outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold block">Apellido <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="apellido"
                                                    value={formData.apellido}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full border border-gray-400 rounded px-3 py-2 outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-2">
                                            <label className="text-sm font-bold block">E-mail <span className="text-red-500">*</span></label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full max-w-md border border-gray-400 rounded px-3 py-2 outline-none focus:border-blue-500"
                                            />
                                            <p className="text-xs text-gray-500">El e-mail de confirmación se enviará a esta dirección</p>
                                        </div>

                                        <div className="flex items-center gap-2 mb-8">
                                            <input type="checkbox" id="login-save" className="w-4 h-4" />
                                            <label htmlFor="login-save" className="text-sm">Inicia sesión para guardar tus datos (opcional)</label>
                                        </div>

                                        <div className="space-y-6 border-t border-gray-100 pt-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold block">País/región <span className="text-red-500">*</span></label>
                                                <div className="relative max-w-md">
                                                    <select
                                                        name="pais"
                                                        value={formData.pais}
                                                        onChange={handleInputChange}
                                                        className="w-full appearance-none border border-gray-400 rounded px-3 py-2 pr-10 outline-none focus:border-blue-500 bg-white"
                                                    >
                                                        <option>Ecuador</option>
                                                        <option>Perú</option>
                                                        <option>Colombia</option>
                                                        <option>Estados Unidos</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold block">Número de teléfono <span className="text-red-500">*</span></label>
                                                <div className="flex gap-2 max-w-md">
                                                    <div className="relative w-32 shrink-0">
                                                        <select
                                                            name="codigoPais"
                                                            value={formData.codigoPais}
                                                            onChange={handleInputChange}
                                                            className="w-full appearance-none border border-gray-400 rounded px-3 py-2 pr-8 outline-none focus:border-blue-500 bg-white text-sm"
                                                        >
                                                            <option value="+593">EC +593</option>
                                                            <option value="+51">PE +51</option>
                                                            <option value="+57">CO +57</option>
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-3 w-3 h-3 text-gray-500 pointer-events-none" />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        name="telefono"
                                                        value={formData.telefono}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="099 123 4567"
                                                        className="flex-1 border border-gray-400 rounded px-3 py-2 outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">Para verificar la reserva y para que el alojamiento contacte contigo si es necesario</p>
                                            </div>



                                            <div className="space-y-4 pt-4">
                                                <p className="text-sm font-bold">¿Para quién es esta reserva? (opcional)</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <input type="radio" name="reserva-para" id="para-mi" defaultChecked />
                                                        <label htmlFor="para-mi" className="text-sm font-medium">La reserva es para mí</label>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input type="radio" name="reserva-para" id="para-otro" />
                                                        <label htmlFor="para-otro" className="text-sm font-medium">La reserva es para otra persona</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <p className="text-sm font-bold">¿Viajas por trabajo? (opcional)</p>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <input type="radio" name="trabajo" id="trabajo-si" />
                                                        <label htmlFor="trabajo-si" className="text-sm font-medium">Sí</label>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input type="radio" name="trabajo" id="trabajo-no" defaultChecked />
                                                        <label htmlFor="trabajo-no" className="text-sm font-medium">No</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Add to reservation Section (Image 2) */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                                    <h3 className="text-xl font-bold">Habitación {habitacion.nombre}</h3>
                                    <div className="flex items-start gap-3 text-sm text-green-700">
                                        <Coffee className="w-5 h-5 shrink-0" />
                                        <div>
                                            <p className="font-bold">Comidas:</p>
                                            <ul className="list-disc list-inside text-xs">
                                                {Object.entries(comidas || {}).map(([meal, selected]) => {
                                                    if (!selected) return null;
                                                    const isIncluded = meal === 'desayuno' ? habitacion.incluyeDesayuno :
                                                        meal === 'almuerzo' ? habitacion.incluyeAlmuerzo :
                                                            habitacion.incluyeCena;
                                                    return (
                                                        <li key={meal} className="capitalize">
                                                            {meal} {isIncluded ? '(Incluido)' : '(Extra +$1.00/noche)'}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm text-gray-700">
                                        <Users className="w-5 h-5 shrink-0" />
                                        <p><span className="font-bold text-gray-900">Personas:</span> {option.personas} adultos</p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-6 space-y-4">
                                        <h4 className="font-bold">Opciones para añadir a tu reserva</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50">
                                                <input type="checkbox" className="mt-1" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-bold">Quiero solicitar el servicio de traslado desde el aeropuerto</p>
                                                        <Car className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Le diremos al alojamiento que te interesa este servicio para que puedan enviarte más información además de los precios.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50">
                                                <input type="checkbox" className="mt-1" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-bold">Quiero alquilar un coche</p>
                                                        <Car className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">¡Aprovecha al máximo el viaje! Consulta las opciones de alquiler de coches en la confirmación de la reserva.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Special Requests */}
                                    <div className="border-t border-gray-100 pt-6 space-y-4">
                                        <h4 className="font-bold">Peticiones especiales</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            Las peticiones especiales no se pueden garantizar, pero el alojamiento hará todo lo posible por satisfacerlas. ¡También puedes enviarnos tu petición especial cuando hayas realizado la reserva!
                                        </p>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Escribe tus peticiones en inglés o en español. <span className="text-gray-400 font-normal">(opcional)</span></label>
                                            <textarea
                                                name="peticiones"
                                                value={formData.peticiones}
                                                onChange={handleInputChange}
                                                placeholder="Ej: Necesito cuna para bebé o tengo alergias alimentarias..."
                                                className="w-full border border-gray-400 rounded p-3 min-h-[120px] outline-none focus:border-blue-500"
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Arrival Time */}
                                    <div className="border-t border-gray-100 pt-6 space-y-4">
                                        <h4 className="font-bold">Tu hora de llegada</h4>
                                        <div className="flex items-start gap-3 text-sm text-green-700">
                                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                                            <p>Tu habitación estará lista para el check-in entre las 14:00 y las 22:00</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold block">Añade tu hora de llegada aproximada <span className="text-gray-400 font-normal">(opcional)</span></label>
                                            <div className="relative max-w-xs">
                                                <select className="w-full appearance-none border border-gray-400 rounded px-3 py-2 pr-10 outline-none focus:border-blue-500 bg-white">
                                                    <option>Indica una hora</option>
                                                    <option>14:00 - 15:00</option>
                                                    <option>15:00 - 16:00</option>
                                                    <option>16:00 - 17:00</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Button */}
                                    <div className="pt-8 flex flex-col items-end gap-3">
                                        <div className="flex items-center gap-2 text-[#0071c2] text-xs font-bold hover:underline cursor-pointer">
                                            <Globe className="w-4 h-4" />
                                            <span>Igualamos el precio</span>
                                        </div>
                                        <button
                                            onClick={() => setStep(3)}
                                            className="bg-[#0071c2] text-white font-bold py-4 px-8 rounded flex items-center gap-2 hover:bg-[#003580] transition-colors shadow-lg shadow-blue-200"
                                        >
                                            Siguiente: últimos datos
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                        <button className="text-[#0071c2] text-xs font-bold hover:underline">¿Cuáles son las condiciones de mi reserva?</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Paso 3: Terminar Reserva */
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                                <div className="p-8 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold mb-2">Último paso: Pago y Confirmación</h2>
                                    <p className="text-gray-600">Completa tu pago de forma segura a través de nuestra pasarela asociada.</p>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                        <Lock className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Integración con TAB</h3>
                                    <p className="text-gray-500 max-w-md mb-8">
                                        En este paso se cargará el iframe oficial de Tab. Tus datos están cifrados y el pago es 100% seguro.
                                    </p>

                                    <div className="w-full max-w-2xl aspect-[16/10] bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden relative group">
                                        {/* Real TAB Iframe simulation / implementation */}
                                        <iframe
                                            src={`https://tab.com/pago?order_id=ORD-${Math.floor(Math.random() * 100000)}&amount=${total.toFixed(2)}&currency=USD&customer_name=${encodeURIComponent(formData.nombre + ' ' + formData.apellido)}&customer_email=${encodeURIComponent(formData.email)}`}
                                            width="100%"
                                            height="100%"
                                            className="border-none"
                                            title="Pasarela de Pago TAB"
                                        ></iframe>
                                    </div>

                                    <button
                                        onClick={() => setStep(2)}
                                        className="mt-8 text-[#0071c2] font-bold hover:underline flex items-center gap-2"
                                    >
                                        <ChevronDown className="w-4 h-4 rotate-90" />
                                        Volver a tus datos
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
