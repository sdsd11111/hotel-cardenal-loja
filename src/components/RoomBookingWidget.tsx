'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Utensils, Phone, Mail, Loader2 } from 'lucide-react';

interface RoomBookingWidgetProps {
    price: string;
    roomName?: string;
}

export const RoomBookingWidget = ({ price: initialPrice, roomName }: RoomBookingWidgetProps) => {
    const router = useRouter();
    const [price, setPrice] = useState(initialPrice);
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);
    const [entrada, setEntrada] = useState('');
    const [salida, setSalida] = useState('');
    const [adultos, setAdultos] = useState(2);
    const [ninos, setNinos] = useState(0);
    const [meals, setMeals] = useState({
        desayuno: false,
        almuerzo: false,
        cena: false
    });

    // Dynamic Price Fetching
    useEffect(() => {
        const fetchCurrentPrice = async () => {
            if (!roomName) return;
            try {
                setIsLoadingPrice(true);
                const response = await fetch('/api/habitaciones');
                if (response.ok) {
                    const data = await response.json();
                    const room = data.find((h: any) => h.nombre.toLowerCase().includes(roomName.toLowerCase()));
                    if (room && room.precio_numerico) {
                        setPrice(Number(room.precio_numerico).toFixed(2));
                    }
                }
            } catch (error) {
                console.error('Error fetching room price:', error);
            } finally {
                setIsLoadingPrice(false);
            }
        };

        fetchCurrentPrice();
    }, [roomName]);

    const today = new Date().toISOString().split('T')[0];

    const handleCheckAvailability = () => {
        const params = new URLSearchParams({
            entrada,
            salida,
            adultos: adultos.toString(),
            ninos: ninos.toString(),
            desayuno: meals.desayuno ? '1' : '0',
            almuerzo: meals.almuerzo ? '1' : '0',
            cena: meals.cena ? '1' : '0',
            source: roomName || ''
        });
        router.push(`/habitaciones?${params.toString()}#habitaciones-list`);
    };

    return (
        <div className="bg-white shadow-2xl overflow-hidden border border-cardenal-gold/20 flex flex-col h-full sticky top-24 rounded-none">
            {/* Header: Brand Styling */}
            <div className="bg-cardenal-green text-white p-6 text-center space-y-1 relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cardenal-gold/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
                <p className="text-[10px] uppercase tracking-widest text-cardenal-gold font-bold">Reserva Tu Experiencia</p>
                <div className="flex items-baseline justify-center gap-1 relative z-10">
                    {isLoadingPrice ? (
                        <Loader2 className="w-6 h-6 animate-spin text-cardenal-gold" />
                    ) : (
                        <>
                            <span className="text-3xl font-serif font-bold text-white tracking-tight">${price}</span>
                            <span className="text-[10px] text-white/60 uppercase tracking-tighter">/ noche</span>
                        </>
                    )}
                </div>
                <p className="text-[9px] font-medium text-white/40 uppercase tracking-widest">Garantía de Mejor Precio Directo</p>
            </div>

            {/* Body: Form */}
            <div className="p-8 space-y-6">
                <div className="space-y-4">
                    {/* Dates */}
                    <div className="space-y-3">
                        <div className="relative">
                            <label className="block text-[10px] font-bold text-cardenal-brown uppercase tracking-widest mb-1.5">Fecha de Ingreso</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cardenal-gold" />
                                <input
                                    type="date"
                                    min={today}
                                    value={entrada}
                                    onChange={(e) => setEntrada(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3.5 bg-cardenal-cream/10 border-2 border-cardenal-cream/30 focus:border-cardenal-gold focus:ring-0 focus:outline-none text-sm transition-all text-cardenal-green font-medium rounded-none"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-[10px] font-bold text-cardenal-brown uppercase tracking-widest mb-1.5">Fecha de Salida</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cardenal-gold" />
                                <input
                                    type="date"
                                    min={entrada || today}
                                    value={salida}
                                    onChange={(e) => setSalida(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3.5 bg-cardenal-cream/10 border-2 border-cardenal-cream/30 focus:border-cardenal-gold focus:ring-0 focus:outline-none text-sm transition-all text-cardenal-green font-medium rounded-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Guests */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-[10px] font-bold text-cardenal-brown uppercase tracking-widest mb-1.5">Adultos</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cardenal-gold" />
                                <select
                                    value={adultos}
                                    onChange={(e) => setAdultos(parseInt(e.target.value))}
                                    className="w-full pl-10 pr-2 py-3 bg-white border-2 border-cardenal-cream/30 focus:border-cardenal-gold focus:outline-none text-sm appearance-none font-bold text-cardenal-green rounded-none"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Adulto' : 'Adultos'}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-[10px] font-bold text-cardenal-brown uppercase tracking-widest mb-1.5">Niños</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cardenal-gold" />
                                <select
                                    value={ninos}
                                    onChange={(e) => setNinos(parseInt(e.target.value))}
                                    className="w-full pl-10 pr-2 py-3 bg-white border-2 border-cardenal-cream/30 focus:border-cardenal-gold focus:outline-none text-sm appearance-none font-bold text-cardenal-green rounded-none"
                                >
                                    {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Niño' : 'Niños'}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Meal Selection */}
                    <div className="pt-2">
                        <label className="block text-[10px] font-bold text-cardenal-brown uppercase tracking-widest mb-3 border-b border-cardenal-gold/20 pb-1">Incluir Alimentación</label>
                        <div className="flex flex-wrap gap-2">
                            {(['desayuno', 'almuerzo', 'cena'] as const).map((meal) => (
                                <label key={meal} className="flex-1 min-w-[90px]">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={meals[meal]}
                                        onChange={() => setMeals(prev => ({ ...prev, [meal]: !prev[meal] }))}
                                    />
                                    <div className="w-full text-center px-1 py-2.5 border-2 border-cardenal-cream/30 bg-white peer-checked:bg-cardenal-gold peer-checked:text-white peer-checked:border-cardenal-gold cursor-pointer transition-all text-[9.5px] font-black uppercase tracking-widest text-cardenal-green/60 flex items-center justify-center gap-1 rounded-none shadow-sm peer-checked:shadow-inner">
                                        <Utensils className="w-3 h-3" />
                                        {meal}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleCheckAvailability}
                        className="w-full bg-cardenal-green hover:bg-cardenal-green/90 text-white font-black py-4.5 px-6 transition-all duration-500 uppercase tracking-[0.3em] text-xs font-sans mt-6 shadow-xl hover:translate-y-[-2px] active:translate-y-[0px] rounded-none flex items-center justify-center gap-3 border-b-4 border-cardenal-gold/50 hover:border-cardenal-gold"
                    >
                        <span>Comprobar Disponibilidad</span>
                    </button>

                    <p className="text-[10px] text-center text-cardenal-brown/60 font-medium italic mt-4">
                        * Niños menores de 8 años no pagan estancia.
                    </p>
                </div>
            </div>

            {/* Footer: Contact Info */}
            <div className="p-8 bg-cardenal-cream/20 mt-auto border-t border-cardenal-gold/10 flex flex-col gap-5">
                <div className="space-y-4">
                    <a href="tel:0996616878" className="flex items-center gap-4 text-cardenal-green hover:text-cardenal-gold transition-colors group">
                        <div className="bg-white p-2.5 rounded-full shadow-md group-hover:shadow-lg transition-all border border-cardenal-gold/20">
                            <Phone className="w-5 h-5 text-cardenal-gold" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-cardenal-brown uppercase tracking-wider">Atención 24/7</span>
                            <span className="font-black text-xl tracking-tighter">099 661 6878</span>
                        </div>
                    </a>
                    <a href="mailto:elcardenalhotel@gmail.com" className="flex items-center gap-4 text-cardenal-green hover:text-cardenal-gold transition-colors group">
                        <div className="bg-white p-2.5 rounded-full shadow-md group-hover:shadow-lg transition-all border border-cardenal-gold/20">
                            <Mail className="w-5 h-5 text-cardenal-gold" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] font-bold text-cardenal-brown uppercase tracking-wider">Email Directo</span>
                            <span className="font-bold text-xs truncate">elcardenalhotel@gmail.com</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};
