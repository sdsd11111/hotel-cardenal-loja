'use client';

import React, { useState } from 'react';
import { User, Phone, Mail, Clock, Calendar, Users, Send, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';

export const EventForm = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        hora_evento: '',
        fechaEntrada: '', // Using fechaEntrada as the event date for compatibility with the API
        adultos: 1,       // Using adultos as the number of people
        comentarios: '',
        aceptaPrivacidad: false,
        aceptaMarketing: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.aceptaPrivacidad) {
            alert('Debe aceptar el Aviso Legal y la Política de Privacidad.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    motivo: 'Consulta para Eventos Corporativos',
                    ninos: 0,
                    deseaFacturacion: false,
                    traeMascota: false,
                    desayuno: false,
                    almuerzo: false,
                    cena: false
                }),
            });

            if (!response.ok) throw new Error('Error al enviar el formulario');

            setSubmitStatus('success');
            setFormData({
                nombre: '',
                apellidos: '',
                email: '',
                telefono: '',
                hora_evento: '',
                fechaEntrada: '',
                adultos: 1,
                comentarios: '',
                aceptaPrivacidad: false,
                aceptaMarketing: false
            });
        } catch (error) {
            console.error('Error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="bg-white p-8 border-2 border-cardenal-green rounded shadow-2xl text-center animate-fadeIn">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-cardenal-green mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">¡Solicitud Enviada!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Hemos recibido su solicitud para su evento. Nuestro equipo se pondrá en contacto con usted en breve para coordinar todos los detalles.
                </p>
                <button
                    onClick={() => setSubmitStatus('idle')}
                    className="bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-3 px-8 transition-all duration-300 uppercase tracking-widest text-sm"
                >
                    Enviar otra solicitud
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 md:p-10 border border-gray-200 shadow-xl max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Nombre */}
                <div className="relative">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre..."
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 pr-12 border border-gray-300 focus:border-cardenal-gold outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-l pl-4 border-gray-200">
                        <User size={20} />
                    </div>
                </div>

                {/* Apellidos */}
                <div className="relative">
                    <input
                        type="text"
                        name="apellidos"
                        placeholder="Apellidos..."
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 pr-12 border border-gray-300 focus:border-cardenal-gold outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-l pl-4 border-gray-200">
                        <User size={20} />
                    </div>
                </div>

                {/* Teléfono */}
                <div className="relative">
                    <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono..."
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 pr-12 border border-gray-300 focus:border-cardenal-gold outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-l pl-4 border-gray-200">
                        <Phone size={20} />
                    </div>
                </div>

                {/* Email */}
                <div className="relative">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email..."
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 pr-12 border border-gray-300 focus:border-cardenal-gold outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-l pl-4 border-gray-200">
                        <Mail size={20} />
                    </div>
                </div>

                {/* Hora */}
                <div className="relative">
                    <div className="absolute left-4 top-2 text-[10px] text-gray-400 uppercase font-bold">Hora..</div>
                    <input
                        type="time"
                        name="hora_evento"
                        value={formData.hora_evento}
                        onChange={handleChange}
                        required
                        className="w-full px-4 pt-6 pb-2 pr-12 border border-gray-300 focus:border-cardenal-gold outline-none transition-all font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-l pl-4 border-gray-200">
                        <Clock size={20} />
                    </div>
                </div>

                {/* Fecha */}
                <div className="relative">
                    <div className="absolute left-4 top-2 text-[10px] text-gray-400 uppercase font-bold">Fecha..</div>
                    <input
                        type="date"
                        name="fechaEntrada"
                        value={formData.fechaEntrada}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 pt-6 pb-2 pr-12 border border-gray-300 focus:border-cardenal-gold outline-none transition-all font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-l pl-4 border-gray-200">
                        <Calendar size={20} />
                    </div>
                </div>

                {/* nº de personas */}
                <div className="relative md:col-span-2">
                    <input
                        type="number"
                        name="adultos"
                        placeholder="Nº de personas..."
                        value={formData.adultos}
                        onChange={handleChange}
                        required
                        min="1"
                        max="50"
                        className="w-full px-4 py-4 pr-12 border border-gray-300 focus:border-cardenal-gold outline-none transition-all placeholder:text-gray-400 font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-l pl-4 border-gray-200">
                        <Users size={20} />
                    </div>
                </div>

                {/* Comentarios */}
                <div className="md:col-span-2">
                    <textarea
                        name="comentarios"
                        placeholder="Comentarios..."
                        value={formData.comentarios}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-4 border border-gray-300 focus:border-cardenal-gold outline-none transition-all placeholder:text-gray-400 font-medium resize-none"
                    ></textarea>
                </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="aceptaPrivacidad"
                        checked={formData.aceptaPrivacidad}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-cardenal-green focus:ring-cardenal-green cursor-pointer"
                    />
                    <span className="text-[12px] text-gray-600 leading-tight">
                        Aceptar <Link href="/aviso-legal" className="text-gray-900 underline hover:text-cardenal-gold">Aviso legal</Link> y <Link href="/privacidad" className="text-gray-900 underline hover:text-cardenal-gold">política de privacidad</Link>
                    </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="aceptaMarketing"
                        checked={formData.aceptaMarketing}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-cardenal-green focus:ring-cardenal-green cursor-pointer"
                    />
                    <span className="text-[12px] text-gray-600 leading-tight">
                        Acepto el uso de mis datos personales para publicidad y comunicaciones electrónicas por parte de Hotel El Cardenal. Más información, derechos de protección de datos y garantías en nuestra política de privacidad.
                    </span>
                </label>
            </div>

            {/* Submit */}
            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-auto min-w-[180px] bg-white border border-gray-900 text-gray-900 font-bold py-3 px-12 hover:bg-gray-900 hover:text-white transition-all duration-300 uppercase tracking-widest text-sm disabled:opacity-50"
                >
                    {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
                </button>
            </div>

            {submitStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm font-bold bg-red-50 p-3 border-l-4 border-red-600">
                    <Info size={18} />
                    Hubo un error al enviar el formulario. Por favor, inténtelo de nuevo más tarde.
                </div>
            )}
        </form>
    );
};
