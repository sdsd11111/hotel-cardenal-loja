'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ReservationSearchPanel from '@/components/ReservationSearchPanel';
import { RoomDetailsModal } from '@/components/RoomDetailsModal';
import { headerData, Habitacion } from '@/types';
import {
    Bed, Coffee, Briefcase, Wifi, Users, Tv, Car, Bath, Wind,
    ConciergeBell, Award, Eye, Droplets, Sofa, Sparkles,
    ArrowRight, Plus, Minus, X, Check, Loader2, Clock, Calendar
} from 'lucide-react';

// Tipos de amenidades
const amenidadesIconos: Record<string, React.ReactNode> = {
    'Cama King': <Bed className="w-5 h-5" />,
    'Cama Queen': <Bed className="w-5 h-5" />,
    'Vistas': <Eye className="w-5 h-5" />,
    'Escritorio': <Briefcase className="w-5 h-5" />,
    'Cafetera': <Coffee className="w-5 h-5" />,
    '2 Camas': <Users className="w-5 h-5" />,
    'TV Grande': <Tv className="w-5 h-5" />,
    'Baño Amplio': <Bath className="w-5 h-5" />,
    'Parqueo': <Car className="w-5 h-5" />,
    'Climatización': <Wind className="w-5 h-5" />,
    'Servicio': <ConciergeBell className="w-5 h-5" />,
    'Amenities': <Sparkles className="w-5 h-5" />,
    'Jacuzzi': <Droplets className="w-5 h-5" />,
    'Balcón': <Eye className="w-5 h-5" />,
    'Mini-Bar': <Award className="w-5 h-5" />,
    'Tres Camas': <Users className="w-5 h-5" />,
    'Sofá': <Sofa className="w-5 h-5" />,
    'Diseño Moderno': <Sparkles className="w-5 h-5" />,
    'WiFi': <Wifi className="w-5 h-5" />
};


interface CartItem {
    habitacion: Habitacion;
    cantidad: number;
    comidas: {
        desayuno: boolean;
        almuerzo: boolean;
        cena: boolean;
    };
}

function HabitacionesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Habitacion | null>(null);
    const [validationMessage, setValidationMessage] = useState('');
    const [scrolledPastHero, setScrolledPastHero] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolledPastHero(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // State for meals selection before adding to cart
    const [pendingMeals, setPendingMeals] = useState<Record<number, { desayuno: boolean; almuerzo: boolean; cena: boolean }>>({});

    const toggleMeal = (roomId: number, meal: 'desayuno' | 'almuerzo' | 'cena') => {
        setPendingMeals(prev => ({
            ...prev,
            [roomId]: {
                ...prev[roomId],
                [meal]: !prev[roomId][meal]
            }
        }));
    };

    const [filtroAdultos, setFiltroAdultos] = useState(0);
    const [filtroNinos, setFiltroNinos] = useState(0);
    const [fechaEntrada, setFechaEntrada] = useState('');
    const [fechaSalida, setFechaSalida] = useState('');

    const fetchHabitaciones = async (retryCount = 0) => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (fechaEntrada) params.append('entrada', fechaEntrada);
            if (fechaSalida) params.append('salida', fechaSalida);

            const response = await fetch(`/api/habitaciones?${params.toString()}`);

            if (!response.ok) {
                const errorText = await response.text().catch(() => 'No error details');
                console.error(`Fetch failed (Status: ${response.status}): ${errorText}`);

                // Retry up to 2 times on failure
                if (retryCount < 2) {
                    console.warn(`Retry ${retryCount + 1} for habitaciones...`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait longer on retry
                    return fetchHabitaciones(retryCount + 1);
                }
                throw new Error(`Error al cargar habitaciones (${response.status})`);
            }

            const data = await response.json();

            // Transform DB data to interface format
            const mappedData: Habitacion[] = data.map((room: any) => ({
                id: room.id,
                nombre: room.nombre,
                slug: room.slug,
                descripcion: room.descripcion,
                amenidades: typeof room.amenidades === 'string' ? JSON.parse(room.amenidades) : room.amenidades,
                precio: room.precio_texto,
                precioNumerico: Number(room.precio_numerico),
                imagen: room.imagen,
                capacidad: {
                    maxAdultos: room.max_adultos,
                    maxNiños: room.max_ninos,
                    camas: room.camas
                },
                disponible: room.disponible === 1 || (room.fecha_salida && new Date(room.fecha_salida) < new Date()),
                fecha_entrada: room.fecha_entrada,
                fecha_salida: room.fecha_salida
            }));

            setHabitaciones(mappedData);

            // Initialize pendingMeals for each room
            const initialMeals: Record<number, { desayuno: boolean; almuerzo: boolean; cena: boolean }> = {};
            mappedData.forEach(room => {
                initialMeals[room.id] = { desayuno: false, almuerzo: false, cena: false };
            });
            setPendingMeals(initialMeals);
        } catch (err) {
            console.error('Error loading habitaciones:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHabitaciones();
    }, [fechaEntrada, fechaSalida]);

    useEffect(() => {
        const entrada = searchParams.get('entrada');
        const salida = searchParams.get('salida');
        const adultos = searchParams.get('adultos');
        const ninos = searchParams.get('ninos');
        const desayuno = searchParams.get('desayuno');
        const almuerzo = searchParams.get('almuerzo');
        const cena = searchParams.get('cena');
        const source = searchParams.get('source');

        if (entrada) setFechaEntrada(entrada);
        if (salida) setFechaSalida(salida);
        if (adultos) setFiltroAdultos(parseInt(adultos));
        if (ninos) setFiltroNinos(parseInt(ninos));

        // If we have room data and meal/source params, pre-fill them
        if (habitaciones.length > 0 && (desayuno || almuerzo || cena)) {
            const hasDesayuno = desayuno === '1';
            const hasAlmuerzo = almuerzo === '1';
            const hasCena = cena === '1';

            setPendingMeals(prev => {
                const newMeals = { ...prev };

                // If specific room is requested
                if (source) {
                    const room = habitaciones.find(h => h.nombre.toLowerCase().includes(source.toLowerCase()));
                    if (room) {
                        newMeals[room.id] = {
                            desayuno: hasDesayuno,
                            almuerzo: hasAlmuerzo,
                            cena: hasCena
                        };
                    }
                } else {
                    // Apply to all as default if no source
                    Object.keys(newMeals).forEach(id => {
                        newMeals[Number(id)] = {
                            desayuno: hasDesayuno,
                            almuerzo: hasAlmuerzo,
                            cena: hasCena
                        };
                    });
                }
                return newMeals;
            });
        }
    }, [searchParams, habitaciones]);

    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);

    const habitacionesFiltradas = habitaciones.filter(hab => {
        // Filtrado por capacidad
        const cumpleCapacidad = (filtroAdultos === 0 && filtroNinos === 0) ||
            (hab.capacidad.maxAdultos >= filtroAdultos && hab.capacidad.maxNiños >= filtroNinos);

        if (!cumpleCapacidad) return false;

        // Filtrado por disponibilidad si hay fechas seleccionadas
        if (fechaEntrada && fechaSalida) {
            const selEntrada = new Date(fechaEntrada);
            const selSalida = new Date(fechaSalida);

            // Si la habitación está ocupada actualmente
            if (hab.fecha_entrada && hab.fecha_salida) {
                const occEntrada = new Date(hab.fecha_entrada);
                const occSalida = new Date(hab.fecha_salida);

                // Comprobar si hay solapamiento (Overlap check)
                // (StartA <= EndB) and (EndA >= StartB)
                const solapa = (selEntrada < occSalida) && (selSalida > occEntrada);
                if (solapa) return false;
            }
        }

        return true;
    });

    const resetFiltros = () => {
        setFiltroAdultos(0);
        setFiltroNinos(0);
    };

    const addToCart = (habitacion: Habitacion) => {
        const meals = pendingMeals[habitacion.id] || { desayuno: false, almuerzo: false, cena: false };
        setCart(prev => {
            // If the same room with the same meals exists, increment quantity
            const existing = prev.find(item =>
                item.habitacion.id === habitacion.id &&
                item.comidas.desayuno === meals.desayuno &&
                item.comidas.almuerzo === meals.almuerzo &&
                item.comidas.cena === meals.cena
            );
            if (existing) {
                return prev.map(item =>
                    (item.habitacion.id === habitacion.id &&
                        item.comidas.desayuno === meals.desayuno &&
                        item.comidas.almuerzo === meals.almuerzo &&
                        item.comidas.cena === meals.cena)
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prev, { habitacion, cantidad: 1, comidas: { ...meals } }];
        });
        setShowCart(true);
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const updateQuantity = (index: number, delta: number) => {
        setCart(prev => prev.map((item, i) => {
            if (i === index) {
                const newCantidad = Math.max(1, item.cantidad + delta);
                return { ...item, cantidad: newCantidad };
            }
            return item;
        }).filter(item => item.cantidad > 0));
    };

    const calcularTotal = () => {
        if (!fechaEntrada || !fechaSalida) return 0;
        const entrada = new Date(fechaEntrada);
        const salida = new Date(fechaSalida);
        const noches = Math.ceil((salida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24));
        if (noches <= 0) return 0;
        return cart.reduce((total, item) => {
            let mealsPrice = 0;
            if (item.comidas.desayuno) mealsPrice += 1.5;
            if (item.comidas.almuerzo) mealsPrice += 1.5;
            if (item.comidas.cena) mealsPrice += 1.5;
            return total + ((item.habitacion.precioNumerico + mealsPrice) * item.cantidad * noches);
        }, 0);
    };

    const handleReservar = async () => {
        if (!fechaEntrada || !fechaSalida) {
            setValidationMessage('Por favor, selecciona tus fechas de entrada y salida.');
            setTimeout(() => setValidationMessage(''), 5000);
            return;
        }
        if (cart.length === 0) {
            setValidationMessage('Selecciona al menos una habitación para continuar con tu reserva.');
            setTimeout(() => setValidationMessage(''), 6000);
            return;
        }

        // Collect all meals from all cart items
        const hasDesayuno = cart.some(item => item.comidas.desayuno);
        const hasAlmuerzo = cart.some(item => item.comidas.almuerzo);
        const hasCena = cart.some(item => item.comidas.cena);

        const details = cart.map(item => {
            const meals = [];
            if (item.comidas.desayuno) meals.push('Desayuno');
            if (item.comidas.almuerzo) meals.push('Almuerzo');
            if (item.comidas.cena) meals.push('Cena');
            return `${item.cantidad}x ${item.habitacion.nombre}${meals.length > 0 ? ` (+${meals.join(', ')})` : ''}`;
        }).join('\n');

        const params = new URLSearchParams({
            motivo: 'Reserva de Habitación',
            entrada: fechaEntrada,
            salida: fechaSalida,
            adultos: filtroAdultos > 0 ? filtroAdultos.toString() : '2',
            ninos: filtroNinos.toString(),
            habitacion: details,
            desayuno: hasDesayuno ? '1' : '0',
            almuerzo: hasAlmuerzo ? '1' : '0',
            cena: hasCena ? '1' : '0'
        });

        // PERSISTENCIA: Guardar en la base de datos antes de ir a WhatsApp/Contacto
        // Esto permite que el sistema "entienda" que la habitación está siendo reservada
        try {
            // Guardar cada ítem del carrito como una reserva individual
            await Promise.all(cart.map(item =>
                fetch('/api/reservas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        habitacion_id: item.habitacion.id,
                        fecha_entrada: fechaEntrada,
                        fecha_salida: fechaSalida,
                        nombre_cliente: 'Cliente Web (WhatsApp)',
                        meta: {
                            comidas: item.comidas,
                            adultos: filtroAdultos,
                            ninos: filtroNinos,
                            total_items: cart.length
                        }
                    })
                })
            ));
        } catch (dbError) {
            console.error('Error al persistir reserva en la DB:', dbError);
        }

        router.push(`/contacto?${params.toString()}#formulario-contacto`);
    };

    const [showHelpTip, setShowHelpTip] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!fechaEntrada && !fechaSalida) {
                setShowHelpTip(true);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [fechaEntrada, fechaSalida]);

    return (
        <div className="flex flex-col min-h-screen bg-cardenal-cream/20 font-sans">
            {!scrolledPastHero && (
                <div className="animate-fadeIn">
                    <Header logo={headerData.logo} disableSticky={true} />
                </div>
            )}

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[400px] bg-cardenal-green flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/habitaciones/hero-habitaciones.webp"
                        alt="Habitaciones Hotel El Cardenal"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-cardenal-green/60"></div>
                    <div className="relative z-10 text-center text-white px-4">
                        <h1 className="text-4xl md:text-7xl font-bold mb-6 font-serif uppercase tracking-tighter drop-shadow-2xl">Nuestras Habitaciones</h1>
                        <p className="text-xl md:text-2xl max-w-2xl mx-auto font-serif italic text-cardenal-gold drop-shadow-lg">
                            Diseño neoclásico y descanso moderno en el corazón de Loja.
                        </p>
                    </div>
                </div>

                {/* Help Tip */}
                {showHelpTip && (
                    <div className="container mx-auto px-4 relative z-40">
                        <div className="absolute -top-12 left-2 right-2 md:left-auto md:right-4 bg-cardenal-gold text-white py-3 px-4 xs:px-6 shadow-2xl animate-bounce flex items-center gap-3 max-w-[280px] xs:max-w-xs md:max-w-md border border-white/20">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-bold text-sm tracking-wide">
                                ¡Tip! Selecciona tus fechas para ver la disponibilidad real.
                            </span>
                            <button onClick={() => setShowHelpTip(false)} className="hover:bg-white/20 p-1 transition-colors shrink-0">
                                <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-[-8px] left-8 md:left-auto md:right-8 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-cardenal-gold border-r-[8px] border-r-transparent"></div>
                        </div>
                    </div>
                )}

                {/* Custom Sticky Search Bar */}
                <div className="sticky top-0 z-40 bg-white border-b-4 border-amber-500 shadow-lg">
                    <div className="container mx-auto px-4 py-3 md:py-6">
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 items-end">
                            {/* Entrada */}
                            <div className="col-span-1">
                                <label className="hidden md:flex text-[10px] md:text-sm font-bold text-gray-700 mb-1 md:mb-2 items-center gap-1 md:gap-2">
                                    <Calendar className="w-3 h-3 md:w-4 md:h-4 text-amber-500" /> Entrada
                                </label>
                                <div className="relative group">
                                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-amber-500 md:hidden" />
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={fechaEntrada}
                                        onChange={(e) => setFechaEntrada(e.target.value)}
                                        className="w-full pl-6 pr-1 py-1 px-2 md:px-3 md:py-2 border-2 border-gray-100 md:border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-sans text-[10px] md:text-base bg-gray-50 md:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Salida */}
                            <div className="col-span-1">
                                <label className="hidden md:flex text-[10px] md:text-sm font-bold text-gray-700 mb-1 md:mb-2 items-center gap-1 md:gap-2">
                                    <Calendar className="w-3 h-3 md:w-4 md:h-4 text-amber-500" /> Salida
                                </label>
                                <div className="relative group">
                                    <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-amber-500 md:hidden" />
                                    <input
                                        type="date"
                                        min={fechaEntrada || new Date().toISOString().split('T')[0]}
                                        value={fechaSalida}
                                        onChange={(e) => setFechaSalida(e.target.value)}
                                        className="w-full pl-6 pr-1 py-1 px-2 md:px-3 md:py-2 border-2 border-gray-100 md:border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-sans text-[10px] md:text-base bg-gray-50 md:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Adultos */}
                            <div className="col-span-1">
                                <label className="hidden md:flex text-[10px] md:text-sm font-bold text-gray-700 mb-1 md:mb-2 items-center gap-1 md:gap-2">
                                    <Users className="w-3 h-3 md:w-4 md:h-4 text-amber-500" /> Ad.
                                </label>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setFiltroAdultos(Math.max(1, filtroAdultos - 1))}
                                        className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                        type="button"
                                    >
                                        <Minus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                    </button>
                                    <span className="w-5 md:w-10 text-center font-bold text-gray-800 text-[10px] md:text-base">{filtroAdultos || 1}</span>
                                    <button
                                        onClick={() => setFiltroAdultos(filtroAdultos + 1)}
                                        className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                        type="button"
                                    >
                                        <Plus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Niños */}
                            <div className="col-span-1">
                                <label className="hidden md:flex text-[10px] md:text-sm font-bold text-gray-700 mb-1 md:mb-2 items-center gap-1 md:gap-2">
                                    <Users className="w-3 h-3 md:w-4 md:h-4 text-amber-500" /> Ni.
                                </label>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setFiltroNinos(Math.max(0, filtroNinos - 1))}
                                        className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                        type="button"
                                    >
                                        <Minus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                    </button>
                                    <span className="w-5 md:w-10 text-center font-bold text-gray-800 text-[10px] md:text-base">{filtroNinos}</span>
                                    <button
                                        onClick={() => setFiltroNinos(filtroNinos + 1)}
                                        className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                        type="button"
                                    >
                                        <Plus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Carrito / Reservar */}
                            <div className="col-span-1 xs:col-span-2">
                                <button
                                    onClick={() => setShowCart(true)}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-2 md:py-3 px-3 md:px-6 rounded shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-1 md:gap-3 uppercase tracking-wider text-[9px] md:text-xs"
                                    type="button"
                                >
                                    <div className="relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart w-3 h-3 md:w-5 md:h-5"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                                        {cart.length > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-white text-amber-600 w-3 h-3 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[7px] md:text-[10px] font-black border border-amber-500">
                                                {cart.reduce((sum, item) => sum + item.cantidad, 0)}
                                            </span>
                                        )}
                                    </div>
                                    {cart.length > 0 ? `Carrito (${cart.reduce((sum, item) => sum + item.cantidad, 0)})` : 'RESERVAR'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Results Info */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 shadow-sm border border-cardenal-gold/10">
                        <p className="text-cardenal-green font-medium text-lg md:text-xl">
                            Mostrando <span className="font-bold text-amber-500 text-2xl px-2">{habitacionesFiltradas.length}</span> habitaciones exclusivas
                            {(filtroAdultos > 0 || filtroNinos > 0) && (
                                <span className="text-cardenal-gold ml-2">
                                    (Búsqueda para: {filtroAdultos} adultos, {filtroNinos} niños)
                                </span>
                            )}
                        </p>
                        {(filtroAdultos > 0 || filtroNinos > 0) && (
                            <button
                                onClick={resetFiltros}
                                className="text-cardenal-gold hover:text-cardenal-green font-bold uppercase tracking-widest text-xs transition-colors underline decoration-2 underline-offset-4"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Cart Sidebar */}
                {showCart && (
                    <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
                        <div
                            className="absolute right-0 top-0 bottom-0 w-full md:w-[450px] bg-white shadow-2xl overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                    <h3 className="text-2xl font-bold font-serif text-cardenal-green uppercase tracking-tight">Tu Reserva</h3>
                                    <button
                                        onClick={() => setShowCart(false)}
                                        className="p-2 hover:bg-cardenal-cream transition-colors"
                                    >
                                        <X className="w-8 h-8 text-cardenal-green" />
                                    </button>
                                </div>

                                {cart.length === 0 ? (
                                    <div className="text-center py-20">
                                        <p className="text-gray-400 italic mb-4">No has seleccionado ninguna habitación todavía.</p>
                                        <button onClick={() => setShowCart(false)} className="text-cardenal-gold font-bold uppercase tracking-widest text-sm">Explorar categorías</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-6 mb-8">
                                            {cart.map((item, index) => (
                                                <div key={index} className="border-b border-gray-50 pb-6">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-lg text-cardenal-green font-serif">{item.habitacion.nombre}</h4>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {item.comidas.desayuno && <span className="text-[10px] bg-cardenal-gold/20 text-cardenal-green px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Desayuno</span>}
                                                                {item.comidas.almuerzo && <span className="text-[10px] bg-cardenal-gold/20 text-cardenal-green px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Almuerzo</span>}
                                                                {item.comidas.cena && <span className="text-[10px] bg-cardenal-gold/20 text-cardenal-green px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Cena</span>}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(index)}
                                                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => updateQuantity(index, -1)}
                                                                className="w-8 h-8 flex items-center justify-center bg-cardenal-cream hover:bg-cardenal-gold hover:text-white transition-colors"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-6 text-center font-bold text-cardenal-green">{item.cantidad}</span>
                                                            <button
                                                                onClick={() => updateQuantity(index, 1)}
                                                                className="w-8 h-8 flex items-center justify-center bg-cardenal-cream hover:bg-cardenal-gold hover:text-white transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <p className="font-bold text-cardenal-green italic">
                                                            ${(item.habitacion.precioNumerico + (item.comidas.desayuno ? 1.5 : 0) + (item.comidas.almuerzo ? 1.5 : 0) + (item.comidas.cena ? 1.5 : 0)).toFixed(2)} USD <span className="text-xs font-normal text-gray-400">/ noche</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {fechaEntrada && fechaSalida && (
                                            <div className="bg-cardenal-green text-white p-6 mb-8 shadow-inner shadow-black/20">
                                                <div className="flex justify-between mb-4 border-b border-white/10 pb-4 text-sm font-serif italic">
                                                    <span className="opacity-80">Duración:</span>
                                                    <span className="font-bold">{Math.ceil((new Date(fechaSalida).getTime() - new Date(fechaEntrada).getTime()) / (1000 * 60 * 60 * 24))} Noches</span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs uppercase tracking-[0.3em] font-bold opacity-60">Total Estimado:</span>
                                                    <span className="text-4xl font-bold font-serif text-cardenal-gold drop-shadow-lg">${calcularTotal().toFixed(2)} USD</span>
                                                </div>
                                            </div>
                                        )}

                                        {validationMessage && (
                                            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 text-xs font-bold animate-pulse">
                                                {validationMessage}
                                            </div>
                                        )}
                                        <button
                                            onClick={handleReservar}
                                            className="w-full bg-cardenal-gold hover:bg-white border-2 border-cardenal-gold text-cardenal-green hover:text-cardenal-gold font-bold py-5 px-6 transition-all duration-500 flex items-center justify-center gap-3 tracking-[0.2em] uppercase shadow-2xl text-xs"
                                        >
                                            <Check className="w-6 h-6" />
                                            CONFIRMAR RESERVA
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Rooms Grid */}
                <div className="container mx-auto px-4 pb-24">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <Loader2 className="w-12 h-12 text-cardenal-gold animate-spin" />
                            <p className="text-xl text-cardenal-green font-serif italic animate-pulse">
                                Preparando sus experiencias...
                            </p>
                        </div>
                    ) : habitacionesFiltradas.length === 0 ? (
                        <div className="text-center py-32 bg-white border border-dashed border-cardenal-gold/30">
                            <p className="text-2xl text-cardenal-green font-serif italic mb-8">
                                No encontramos categorías disponibles para los huéspedes seleccionados.
                            </p>
                            <button
                                onClick={resetFiltros}
                                className="bg-cardenal-green text-white font-bold py-4 px-10 hover:bg-cardenal-gold transition-colors tracking-widest uppercase text-sm shadow-lg"
                            >
                                Ver Todas las Habitaciones
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                            {habitacionesFiltradas.map((habitacion) => (
                                <div
                                    key={habitacion.id}
                                    className="group bg-white overflow-hidden shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 flex flex-col border border-cardenal-gold/10 rounded-2xl md:rounded-none"
                                >
                                    <div className="w-full relative aspect-[16/9] shrink-0 overflow-hidden border-b border-cardenal-gold/10">
                                        <Image
                                            src={habitacion.imagen ? (habitacion.imagen.startsWith('/api') ? `${habitacion.imagen}${habitacion.imagen.includes('?') ? '&' : '?'}v=${Date.now()}` : habitacion.imagen) : '/placeholder.jpg'}
                                            alt={habitacion.nombre}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>

                                        {/* Availability Badge */}
                                        <div className={cn(
                                            "absolute top-4 left-4 px-4 py-2 font-bold text-[10px] uppercase tracking-widest shadow-lg z-10",
                                            (() => {
                                                if (fechaEntrada && fechaSalida && habitacion.fecha_entrada && habitacion.fecha_salida) {
                                                    const selEntrada = new Date(fechaEntrada);
                                                    const selSalida = new Date(fechaSalida);
                                                    const occEntrada = new Date(habitacion.fecha_entrada);
                                                    const occSalida = new Date(habitacion.fecha_salida);
                                                    const solapa = (selEntrada < occSalida) && (selSalida > occEntrada);
                                                    return solapa ? false : true;
                                                }
                                                return habitacion.disponible;
                                            })()
                                                ? "bg-cardenal-green text-white"
                                                : "bg-red-500 text-white"
                                        )}>
                                            {(() => {
                                                if (fechaEntrada && fechaSalida && habitacion.fecha_entrada && habitacion.fecha_salida) {
                                                    const selEntrada = new Date(fechaEntrada);
                                                    const selSalida = new Date(fechaSalida);
                                                    const occEntrada = new Date(habitacion.fecha_entrada);
                                                    const occSalida = new Date(habitacion.fecha_salida);
                                                    const solapa = (selEntrada < occSalida) && (selSalida > occEntrada);
                                                    return solapa ? 'Ocupada en estas fechas' : 'Disponible';
                                                }
                                                return habitacion.disponible ? 'Disponible' : 'Ocupada';
                                            })()}
                                        </div>

                                        {/* Price overlay */}
                                        <div className="absolute bottom-0 left-0 bg-cardenal-green text-white px-6 py-3 font-serif font-bold italic text-lg shadow-2xl">
                                            ${habitacion.precioNumerico.toFixed(2)} <span className="text-[10px] font-normal not-italic">/ noche</span>
                                        </div>
                                    </div>

                                    <div className="w-full p-8 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-2xl md:text-3xl font-bold text-cardenal-green font-serif tracking-tight">
                                                {habitacion.nombre}
                                            </h3>
                                            <div className="flex items-center gap-2 bg-cardenal-cream px-3 py-1 border border-cardenal-gold/20">
                                                <Users className="w-4 h-4 text-cardenal-gold" />
                                                <span className="text-xs font-bold text-cardenal-green">Cap. {habitacion.capacidad.maxAdultos}</span>
                                            </div>
                                        </div>

                                        {!habitacion.disponible && habitacion.fecha_salida && (
                                            <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded text-[10px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                Disponible desde: {new Date(habitacion.fecha_salida).toLocaleString('es-EC', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        )}

                                        <p className="text-text-muted mb-6 leading-relaxed font-medium">
                                            {habitacion.descripcion}
                                        </p>

                                        {/* Meal Selection Integration */}
                                        <div className="mb-6 p-5 bg-white border-2 border-cardenal-gold/30 shadow-sm relative overflow-hidden group/meals">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-cardenal-gold/5 -rotate-45 translate-x-8 -translate-y-8 group-hover/meals:scale-150 transition-transform duration-700"></div>
                                            <p className="text-sm font-bold text-cardenal-green mb-4 flex items-center gap-2 font-serif italic">
                                                <Sparkles className="w-4 h-4 text-cardenal-gold animate-pulse" />
                                                Agrega si quieres tu residencia con:
                                            </p>
                                            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                                                {(['desayuno', 'almuerzo', 'cena'] as const).map((meal) => (
                                                    <button
                                                        key={meal}
                                                        onClick={() => toggleMeal(habitacion.id, meal)}
                                                        className={cn(
                                                            "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border-2 flex-1 text-center",
                                                            pendingMeals[habitacion.id]?.[meal]
                                                                ? "bg-cardenal-gold border-cardenal-gold text-white shadow-md shadow-cardenal-gold/20"
                                                                : "bg-white border-cardenal-gold/10 text-cardenal-green/50 hover:border-cardenal-gold hover:text-cardenal-gold"
                                                        )}
                                                    >
                                                        {meal}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 mb-8 border-t border-gray-50 pt-6">
                                            {habitacion.amenidades.slice(0, 4).map((amenidad, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 text-xs font-bold text-cardenal-green/70 uppercase tracking-widest"
                                                >
                                                    <div className="text-cardenal-gold">
                                                        {amenidadesIconos[amenidad]}
                                                    </div>
                                                    <span>{amenidad}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col xs:flex-row gap-3 mt-auto">
                                            <button
                                                onClick={() => addToCart(habitacion)}
                                                disabled={(() => {
                                                    if (fechaEntrada && fechaSalida && habitacion.fecha_entrada && habitacion.fecha_salida) {
                                                        const selEntrada = new Date(fechaEntrada);
                                                        const selSalida = new Date(fechaSalida);
                                                        const occEntrada = new Date(habitacion.fecha_entrada);
                                                        const occSalida = new Date(habitacion.fecha_salida);
                                                        const solapa = (selEntrada < occSalida) && (selSalida > occEntrada);
                                                        return solapa; // Si solapa, está deshabilitado
                                                    }
                                                    return !habitacion.disponible;
                                                })()}
                                                className={cn(
                                                    "flex-1 font-bold py-4 px-4 transition-all duration-300 flex items-center justify-center gap-2 tracking-[0.2em] text-xs shadow-md",
                                                    (() => {
                                                        if (fechaEntrada && fechaSalida && habitacion.fecha_entrada && habitacion.fecha_salida) {
                                                            const selEntrada = new Date(fechaEntrada);
                                                            const selSalida = new Date(fechaSalida);
                                                            const occEntrada = new Date(habitacion.fecha_entrada);
                                                            const occSalida = new Date(habitacion.fecha_salida);
                                                            const solapa = (selEntrada < occSalida) && (selSalida > occEntrada);
                                                            return !solapa;
                                                        }
                                                        return habitacion.disponible;
                                                    })()
                                                        ? "bg-cardenal-green hover:bg-cardenal-green-dark text-white"
                                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                )}
                                            >
                                                {(() => {
                                                    if (fechaEntrada && fechaSalida && habitacion.fecha_entrada && habitacion.fecha_salida) {
                                                        const selEntrada = new Date(fechaEntrada);
                                                        const selSalida = new Date(fechaSalida);
                                                        const occEntrada = new Date(habitacion.fecha_entrada);
                                                        const occSalida = new Date(habitacion.fecha_salida);
                                                        const solapa = (selEntrada < occSalida) && (selSalida > occEntrada);
                                                        return solapa ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />;
                                                    }
                                                    return habitacion.disponible ? <Plus className="w-4 h-4" /> : <X className="w-4 h-4" />;
                                                })()}
                                                {(() => {
                                                    if (fechaEntrada && fechaSalida && habitacion.fecha_entrada && habitacion.fecha_salida) {
                                                        const selEntrada = new Date(fechaEntrada);
                                                        const selSalida = new Date(fechaSalida);
                                                        const occEntrada = new Date(habitacion.fecha_entrada);
                                                        const occSalida = new Date(habitacion.fecha_salida);
                                                        const solapa = (selEntrada < occSalida) && (selSalida > occEntrada);
                                                        return solapa ? 'OCUPADA' : 'AGREGAR';
                                                    }
                                                    return habitacion.disponible ? 'AGREGAR' : 'OCUPADA';
                                                })()}
                                            </button>
                                            <button
                                                onClick={() => setSelectedRoom(habitacion)}
                                                className="flex-1 bg-transparent hover:bg-cardenal-cream border-2 border-cardenal-green text-cardenal-green font-bold py-4 px-4 transition-all duration-300 flex items-center justify-center gap-2 tracking-[0.2em] text-xs"
                                            >
                                                DETALLE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Room Details Modal */}
                {selectedRoom && (
                    <RoomDetailsModal
                        habitacion={selectedRoom}
                        onClose={() => setSelectedRoom(null)}
                        onAddToCart={addToCart}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}

export default function HabitacionesPageClient() {
    return (
        <Suspense fallback={
            <div className="flex flex-col min-h-screen bg-cardenal-cream">
                <Header logo={headerData.logo} />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 border-4 border-cardenal-gold border-t-cardenal-green animate-spin mx-auto mb-6"></div>
                        <p className="text-xl text-cardenal-green font-serif italic">Preparando su estancia...</p>
                    </div>
                </main>
                <Footer />
            </div>
        }>
            <HabitacionesContent />
        </Suspense>
    );
}
