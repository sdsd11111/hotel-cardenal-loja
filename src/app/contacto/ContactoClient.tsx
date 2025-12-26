'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { headerData } from '@/types';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    Shield,
    Calendar,
    Users,
    Bed,
    Plus,
    Minus
} from 'lucide-react';

// Links de navegación a servicios
const serviciosLinks = [
    { label: 'Habitaciones', href: '/habitaciones' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Galería', href: '/galeria' }
];

// Información de contacto
const contactInfo = [
    {
        id: 1,
        icono: <Phone className="w-6 h-6" />,
        titulo: 'Teléfono / WhatsApp',
        detalle: '099 661 6878',
        link: 'https://wa.me/593996616878'
    },
    {
        id: 2,
        icono: <Mail className="w-6 h-6" />,
        titulo: 'Correo Electrónico',
        detalle: 'elcardenalhotel@gmail.com',
        canonical: 'https://hotelelcardenalloja.com/contacto',
        link: 'mailto:elcardenalhotel@gmail.com'
    },
    {
        id: 3,
        icono: <MapPin className="w-6 h-6" />,
        titulo: 'Dirección',
        detalle: 'Gladiolos 154-42 y Av. 18 de Noviembre, Loja, Ecuador',
        link: 'https://maps.app.goo.gl/wKxH8UvFp7VvFm7S8'
    },
    {
        id: 4,
        icono: <Clock className="w-6 h-6" />,
        titulo: 'Horario de Atención',
        detalle: 'Recepción 24/7 / Admin: 08:00 - 20:00',
        link: null
    }
];

// Tipos de habitaciones disponibles
const tiposHabitacion = [
    'Familiar Loft',
    'Triple',
    'Doble Twin',
    'Matrimonial'
];

function ContactoContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        motivo: '',
        // Campos de reserva
        fechaEntrada: '',
        fechaSalida: '',
        adultos: 2,
        ninos: 0,
        habitacion: '',
        // Bloque 2: Facturación y Requerimientos
        deseaFacturacion: false,
        tipoDocumento: 'Cédula',
        identificacion: '',
        razonSocial: '',
        direccionFacturacion: '',
        traeMascota: false,
        comentarios: '',
        // Comidas
        desayuno: true,
        almuerzo: false,
        cena: false,
        // Mensaje
        mensaje: '',
        aceptaPrivacidad: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [noches, setNoches] = useState(0);

    // Pre-fill form from URL parameters
    useEffect(() => {
        const motivo = searchParams.get('motivo');
        const mensaje = searchParams.get('mensaje');
        const fechaEntrada = searchParams.get('entrada');
        const fechaSalida = searchParams.get('salida');
        const adultos = searchParams.get('adultos');
        const ninos = searchParams.get('ninos');
        const habitacion = searchParams.get('habitacion');
        const desayuno = searchParams.get('desayuno');
        const almuerzo = searchParams.get('almuerzo');
        const cena = searchParams.get('cena');

        if (motivo || mensaje || fechaEntrada || habitacion) {
            // Extract room type from habitacion param (e.g., "1x Matrimonial (+Desayuno)" -> "Matrimonial")
            let extractedRoomType = '';
            if (habitacion) {
                const decodedHabitacion = decodeURIComponent(habitacion);
                // Try to match one of our room types
                const roomTypes = ['Familiar Loft', 'Triple', 'Doble Twin', 'Matrimonial'];
                for (const roomType of roomTypes) {
                    if (decodedHabitacion.includes(roomType)) {
                        extractedRoomType = roomType;
                        break;
                    }
                }
            }

            setFormData(prev => ({
                ...prev,
                motivo: motivo || prev.motivo,
                mensaje: mensaje ? decodeURIComponent(mensaje) : prev.mensaje,
                fechaEntrada: fechaEntrada || prev.fechaEntrada,
                fechaSalida: fechaSalida || prev.fechaSalida,
                adultos: adultos ? parseInt(adultos) : prev.adultos,
                ninos: ninos ? parseInt(ninos) : prev.ninos,
                habitacion: extractedRoomType || prev.habitacion,
                desayuno: desayuno === '1' ? true : prev.desayuno,
                almuerzo: almuerzo === '1' ? true : prev.almuerzo,
                cena: cena === '1' ? true : prev.cena
            }));
        }
    }, [searchParams]);

    // WhatsApp Link Generation
    const getWhatsAppUrl = () => {
        const text = `Hola, acabo de completar el formulario de reserva.\n\n` +
            `*DATOS DEL HUÉSPED:*\n` +
            `- Nombre: ${formData.nombre}\n` +
            `- Email: ${formData.email}\n` +
            `- Teléfono: ${formData.telefono}\n\n` +
            `*DETALLES DE RESERVA:*\n` +
            `- Entrada: ${formData.fechaEntrada}\n` +
            `- Salida: ${formData.fechaSalida}\n` +
            `- Habitación: ${formData.habitacion || 'Sin preferencia'}\n` +
            `- Adultos: ${formData.adultos}, Niños: ${formData.ninos}\n` +
            `*COMIDAS:* ${[formData.desayuno ? 'Desayuno' : '', formData.almuerzo ? 'Almuerzo' : '', formData.cena ? 'Cena' : ''].filter(Boolean).join(', ') || 'Ninguna'}\n\n` +
            (formData.deseaFacturacion ?
                `*DATOS DE FACTURACIÓN:*\n` +
                `- ${formData.tipoDocumento}: ${formData.identificacion}\n` +
                `- Razón Social: ${formData.razonSocial}\n` +
                `- Dirección: ${formData.direccionFacturacion}\n\n` : '') +
            (formData.traeMascota ? `*Mascota:* Sí\n` : '') +
            `*Comentarios:* ${formData.comentarios || 'Ninguno'}\n\n` +
            `Quedo a la espera del link de pago seguro para confirmar mi reserva.`;

        return `https://wa.me/593996616878?text=${encodeURIComponent(text)}`;
    };

    // Calculate nights when dates change
    useEffect(() => {
        if (formData.fechaEntrada && formData.fechaSalida) {
            const entrada = new Date(formData.fechaEntrada);
            const salida = new Date(formData.fechaSalida);
            const diffTime = Math.abs(salida.getTime() - entrada.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setNoches(diffDays);
        } else {
            setNoches(0);
        }
    }, [formData.fechaEntrada, formData.fechaSalida]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.aceptaPrivacidad) {
            alert('Debe aceptar la Política de Privacidad para continuar.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Send data to API to save client and send confirmation email
            const response = await fetch('/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al enviar el formulario');
            }

            console.log('Cliente guardado correctamente');
            setSubmitStatus('success');

            // Scroll to top of the success message
            const element = document.getElementById('success-message');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Reset form
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                motivo: '',
                fechaEntrada: '',
                fechaSalida: '',
                adultos: 2,
                ninos: 0,
                habitacion: '',
                deseaFacturacion: false,
                tipoDocumento: 'Cédula',
                identificacion: '',
                razonSocial: '',
                direccionFacturacion: '',
                traeMascota: false,
                comentarios: '',
                desayuno: true,
                almuerzo: false,
                cena: false,
                mensaje: '',
                aceptaPrivacidad: false
            });

            // Clean URL parameters
            router.replace('/contacto', { scroll: false });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Hubo un error al enviar el formulario. Por favor, intente nuevamente.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleIncrement = (field: 'adultos' | 'ninos') => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field] + 1
        }));
    };

    const handleDecrement = (field: 'adultos' | 'ninos') => {
        setFormData(prev => ({
            ...prev,
            [field]: Math.max(field === 'adultos' ? 1 : 0, prev[field] - 1)
        }));
    };

    const esReservaHabitacion = formData.motivo === 'reservas' || formData.motivo === 'Reserva de Habitación';

    return (
        <div className="flex flex-col min-h-screen">
            <Header logo={headerData.logo} />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-screen flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/contacto/hero-contacto.webp?v=2"
                        alt="Contacto Hotel El Cardenal Loja"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>

                    <div className="relative z-10 container mx-auto px-4 text-center text-white">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Contacto: Estamos listos para recibirle en Loja
                        </h1>
                        <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto">
                            ¿Tiene alguna duda sobre su reserva o su estancia? Comuníquese directamente con nosotros. En Hotel El Cardenal, la hospitalidad comienza desde el primer contacto.
                        </p>

                        {/* Secondary Navigation */}
                        <div className="flex flex-wrap justify-center gap-4 mt-8">
                            {serviciosLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-6 py-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-all duration-300 text-sm font-semibold"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Info Cards */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {contactInfo.map((info) => (
                                <div
                                    key={info.id}
                                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                            {info.icono}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1">{info.titulo}</h3>
                                            {info.link ? (
                                                <a
                                                    href={info.link}
                                                    className="text-gray-600 hover:text-amber-600 transition-colors text-sm"
                                                    target={info.link.startsWith('http') ? '_blank' : undefined}
                                                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                >
                                                    {info.detalle}
                                                </a>
                                            ) : (
                                                <p className="text-gray-600 text-sm">{info.detalle}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section id="formulario-contacto" className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Canales de Atención Directa
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Para una respuesta inmediata, le recomendamos utilizar nuestro canal de WhatsApp, gestionado directamente por nuestro equipo de recepción.
                                </p>
                            </div>

                            {/* Success Message */}
                            {submitStatus === 'success' && (
                                <div id="success-message" className="mb-12 p-8 bg-white border-2 border-green-500 rounded-none shadow-2xl animate-fadeIn relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-none flex items-center justify-center text-green-600">
                                            <CheckCircle className="w-10 h-10" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">¡Gracias! Hemos recibido su solicitud.</h3>
                                            <p className="text-gray-600 mb-6 leading-relaxed">
                                                Su mensaje ha sido procesado correctamente. En breve le contactaremos para enviarle el <strong>link de pago seguro</strong> y confirmar su reserva.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <a
                                                    href={getWhatsAppUrl()}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-none transition-all duration-300 shadow-lg shadow-green-200"
                                                >
                                                    <Phone className="w-5 h-5" />
                                                    Contactar por WhatsApp con mis datos
                                                </a>
                                                <button
                                                    onClick={() => setSubmitStatus('idle')}
                                                    className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 px-6 rounded-none transition-all duration-300"
                                                >
                                                    Cerrar mensaje
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-none border border-gray-200 shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombre Completo */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:border-cardenal-gold focus:outline-none"
                                            placeholder="Juan Pérez"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Correo Electrónico *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:border-cardenal-gold focus:outline-none"
                                            placeholder="juan@ejemplo.com"
                                        />
                                    </div>

                                    {/* Teléfono */}
                                    <div>
                                        <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            id="telefono"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:border-cardenal-gold focus:outline-none"
                                            placeholder="0987654321"
                                        />
                                    </div>

                                    {/* Motivo */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="motivo" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Motivo de Consulta *
                                        </label>
                                        <select
                                            id="motivo"
                                            name="motivo"
                                            value={formData.motivo}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:border-cardenal-gold focus:outline-none"
                                        >
                                            <option value="">Seleccione un motivo</option>
                                            <option value="Reserva de Habitación">Reserva de Habitación</option>
                                            <option value="Consulta para Eventos Corporativos">Consulta para Eventos Corporativos</option>
                                            <option value="Tarifas para Grupos / Empresas">Tarifas para Grupos / Empresas</option>
                                            <option value="Información sobre Tours y Turismo">Información sobre Tours y Turismo</option>
                                            <option value="Consulta sobre Mascotas (Pet Friendly)">Consulta sobre Mascotas (Pet Friendly)</option>
                                            <option value="Facturación y Pagos">Facturación y Pagos</option>
                                            <option value="Otros">Otros</option>
                                        </select>
                                    </div>

                                    {/* Campos adicionales para Reserva de Habitación */}
                                    {esReservaHabitacion && (
                                        <>
                                            {/* Fechas */}
                                            <div>
                                                <label htmlFor="fechaEntrada" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Fecha de Entrada *
                                                </label>
                                                <input
                                                    type="date"
                                                    id="fechaEntrada"
                                                    name="fechaEntrada"
                                                    value={formData.fechaEntrada}
                                                    onChange={handleChange}
                                                    required
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:border-cardenal-gold focus:outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="fechaSalida" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Fecha de Salida *
                                                </label>
                                                <input
                                                    type="date"
                                                    id="fechaSalida"
                                                    name="fechaSalida"
                                                    value={formData.fechaSalida}
                                                    onChange={handleChange}
                                                    required
                                                    min={formData.fechaEntrada || new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:border-cardenal-gold focus:outline-none"
                                                />
                                            </div>

                                            {/* Noches */}
                                            {noches > 0 && (
                                                <div className="md:col-span-2">
                                                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                                                        <p className="text-amber-800 font-semibold">
                                                            Total: {noches} {noches === 1 ? 'noche' : 'noches'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Huéspedes */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    <Users className="w-4 h-4 inline mr-1" />
                                                    Adultos *
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDecrement('adultos')}
                                                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="flex-1 text-center font-bold text-lg">{formData.adultos}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleIncrement('adultos')}
                                                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    <Users className="w-4 h-4 inline mr-1" />
                                                    Niños
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDecrement('ninos')}
                                                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="flex-1 text-center font-bold text-lg">{formData.ninos}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleIncrement('ninos')}
                                                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Tipo de Habitación */}
                                            <div className="md:col-span-2">
                                                <label htmlFor="habitacion" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    <Bed className="w-4 h-4 inline mr-1" />
                                                    Tipo de Habitación (Opcional)
                                                </label>
                                                <select
                                                    id="habitacion"
                                                    name="habitacion"
                                                    value={formData.habitacion}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-none focus:border-cardenal-gold focus:outline-none"
                                                >
                                                    <option value="">Sin preferencia</option>
                                                    {tiposHabitacion.map((tipo) => (
                                                        <option key={tipo} value={tipo}>{tipo}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Servicios de Alimentación */}
                                            <div className="md:col-span-2 mt-4">
                                                <label className="block text-sm font-bold text-cardenal-green mb-3 uppercase tracking-widest font-serif">
                                                    Servicios de Alimentación
                                                </label>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    {[
                                                        { id: 'desayuno', label: 'Desayuno', sub: 'Incluido' },
                                                        { id: 'almuerzo', label: 'Almuerzo', sub: 'Opcional' },
                                                        { id: 'cena', label: 'Cena', sub: 'Opcional' }
                                                    ].map((item) => (
                                                        <label key={item.id} className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-none cursor-pointer hover:border-cardenal-gold transition-all group">
                                                            <div className={`w-6 h-6 rounded-none flex items-center justify-center border-2 transition-all ${(formData as any)[item.id] ? 'bg-cardenal-gold border-cardenal-gold text-white' : 'border-gray-200 group-hover:border-cardenal-gold'}`}>
                                                                {(formData as any)[item.id] && <CheckCircle className="w-4 h-4" />}
                                                                <input
                                                                    type="checkbox"
                                                                    name={item.id}
                                                                    checked={(formData as any)[item.id]}
                                                                    onChange={handleChange}
                                                                    className="hidden"
                                                                />
                                                            </div>
                                                            <div>
                                                                <span className="block text-sm font-bold text-gray-800">{item.label}</span>
                                                                <span className="block text-[10px] text-cardenal-gold uppercase tracking-widest font-black leading-none mt-1">{item.sub}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Bloque 2: Facturación y Requerimientos (Eliminado por petición de usuario) */}
                                        </>
                                    )}

                                    {/* Mensaje */}
                                    <div className="md:col-span-2 mt-4">
                                        <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-700 mb-2">
                                            {esReservaHabitacion ? 'Información adicional para nuestra recepción' : 'Escriba su mensaje aquí *'}
                                        </label>
                                        <textarea
                                            id="mensaje"
                                            name="mensaje"
                                            value={formData.mensaje}
                                            onChange={handleChange}
                                            required={!esReservaHabitacion}
                                            rows={4}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none resize-none"
                                            placeholder={esReservaHabitacion ? "Cualquier otro detalle que desee mencionarnos..." : "Su consulta o mensaje..."}
                                        ></textarea>
                                    </div>

                                    {/* Política de Privacidad */}
                                    <div className="md:col-span-2">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="aceptaPrivacidad"
                                                checked={formData.aceptaPrivacidad}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Acepto la{' '}
                                                <Link href="/privacidad" className="text-amber-600 hover:underline font-semibold" target="_blank">
                                                    Política de Privacidad
                                                </Link>{' '}
                                                y autorizo el tratamiento de mis datos personales *
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="md:col-span-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-4 px-8 rounded-none transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest font-serif"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Enviar Mensaje
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Nuestra Ubicación
                            </h2>
                            <p className="text-lg text-gray-600">
                                Encuéntrenos en el corazón de Loja
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto">
                            <div className="relative bg-cardenal-cream p-2 shadow-xl">
                                <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.1234567890123!2d-79.2123456!3d-4.0012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91cb378ae364a807%3A0x114d0a002380a815!2sHotel%20Cardenal!5e0!3m2!1ses!2sec!4v1234567890123"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Ubicación Hotel El Cardenal Loja"
                                        className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                </div>
                            </div>
                            <div className="text-center mt-6">
                                <a
                                    href="https://maps.app.goo.gl/wKxH8UvFp7VvFm7S8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-cardenal-gold hover:text-cardenal-gold-dark font-bold transition-colors uppercase tracking-widest text-sm"
                                >
                                    <MapPin className="w-5 h-5" />
                                    Ver ubicación exacta en Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default function ContactoClient() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <ContactoContent />
        </React.Suspense>
    );
}
