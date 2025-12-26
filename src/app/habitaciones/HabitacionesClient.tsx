'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ReservationSearchPanel from '@/components/ReservationSearchPanel';
import { RoomDetailBookingModal } from '@/components/RoomDetailBookingModal';
import { RoomAvailabilityModal } from '@/components/RoomAvailabilityModal';
import { headerData, Habitacion } from '@/types';
import {
    Bed, Coffee, Briefcase, Wifi, Users, Tv, Car, Bath, Wind,
    ConciergeBell, Award, Eye, Droplets, Sofa, Sparkles,
    ArrowRight, Plus, Minus, X, Check, Loader2, Clock, Calendar
} from 'lucide-react';
import AnnouncementPopup from '@/components/AnnouncementPopup';

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

// Helper function to calculate dynamic price based on guest count
const getDynamicPrice = (habitacion: Habitacion, adultos: number, ninos: number): number => {
    const totalGuests = adultos + ninos;

    // If no priceOptions or totalGuests is 0, return base price
    if (!habitacion.priceOptions || habitacion.priceOptions.length === 0 || totalGuests <= 0) {
        return habitacion.precioNumerico;
    }

    // Sort priceOptions by personas ascending
    const sortedOptions = [...habitacion.priceOptions].sort((a, b) => a.personas - b.personas);

    // Find the option that best matches the guest count
    // We want the option with personas >= totalGuests, or the highest if none match
    let bestOption = sortedOptions.find(opt => opt.personas >= totalGuests);
    if (!bestOption) {
        // Use the highest tier if guest count exceeds all options
        bestOption = sortedOptions[sortedOptions.length - 1];
    }

    return bestOption.precioBase + bestOption.impuestos;
};


function HabitacionesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Habitacion | null>(null);
    const [availabilityRoom, setAvailabilityRoom] = useState<Habitacion | null>(null);
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

    // Applied filters (the ones that actually trigger search/filtering)
    const [appliedFilters, setAppliedFilters] = useState({
        entrada: '',
        salida: '',
        adultos: 0,
        ninos: 0
    });

    const handleAplicarFiltros = () => {
        setAppliedFilters({
            entrada: fechaEntrada,
            salida: fechaSalida,
            adultos: filtroAdultos,
            ninos: filtroNinos
        });
        fetchHabitaciones(fechaEntrada, fechaSalida);
    };

    const fetchHabitaciones = async (entradaVal?: string, salidaVal?: string, retryCount = 0) => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            const ent = entradaVal !== undefined ? entradaVal : appliedFilters.entrada;
            const sal = salidaVal !== undefined ? salidaVal : appliedFilters.salida;

            if (ent) params.append('entrada', ent);
            if (sal) params.append('salida', sal);

            const response = await fetch(`/api/habitaciones?${params.toString()}`, { cache: 'no-store', headers: { 'Pragma': 'no-cache' } });


            if (!response.ok) {
                const errorText = await response.text().catch(() => 'No error details');
                console.error(`Fetch failed (Status: ${response.status}): ${errorText}`);

                // Retry up to 2 times on failure
                if (retryCount < 2) {
                    console.warn(`Retry ${retryCount + 1} for habitaciones...`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait longer on retry
                    return fetchHabitaciones(ent, sal, retryCount + 1);
                }
                throw new Error(`Error al cargar habitaciones (${response.status})`);
            }

            const data = await response.json();

            // Transform DB data to interface format
            const mappedData: Habitacion[] = data.map((room: any) => {
                let priceOptions = [];
                if (room.price_options_json) {
                    try {
                        priceOptions = typeof room.price_options_json === 'string'
                            ? JSON.parse(room.price_options_json)
                            : room.price_options_json;
                    } catch { priceOptions = []; }
                }

                return {
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
                    ninosGratis: room.ninos_gratis ?? 1,
                    precioNinoExtra: Number(room.precio_nino_extra ?? 0),
                    incluyeDesayuno: room.incluye_desayuno === 1,
                    incluyeAlmuerzo: room.incluye_almuerzo === 1,
                    incluyeCena: room.incluye_cena === 1,
                    priceOptions: priceOptions,
                    // Trust database/API value primarily. 
                    disponible: room.disponible === 1,
                    fecha_entrada: room.fecha_entrada,
                    fecha_salida: room.fecha_salida
                };
            });

            setHabitaciones(mappedData);

            // Initialize pendingMeals for each room - Preselect included meals which have no extra cost
            const initialMeals: Record<number, { desayuno: boolean; almuerzo: boolean; cena: boolean }> = {};
            mappedData.forEach(room => {
                initialMeals[room.id] = {
                    desayuno: !!room.incluyeDesayuno,
                    almuerzo: !!room.incluyeAlmuerzo,
                    cena: !!room.incluyeCena
                };
            });
            setPendingMeals(initialMeals);

        } catch (err) {
            console.error('Error loading habitaciones:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const entrada = searchParams.get('entrada');
        const salida = searchParams.get('salida');
        const adultos = searchParams.get('adultos');
        const ninos = searchParams.get('ninos');

        if (entrada) {
            setFechaEntrada(entrada);
            setAppliedFilters(prev => ({ ...prev, entrada }));
        }
        if (salida) {
            setFechaSalida(salida);
            setAppliedFilters(prev => ({ ...prev, salida }));
        }
        if (adultos) {
            const val = parseInt(adultos);
            setFiltroAdultos(val);
            setAppliedFilters(prev => ({ ...prev, adultos: val }));
        }
        if (ninos) {
            const val = parseInt(ninos);
            setFiltroNinos(val);
            setAppliedFilters(prev => ({ ...prev, ninos: val }));
        }

        // Initial fetch with URL params (or default empty)
        fetchHabitaciones(entrada || '', salida || '');
    }, [searchParams]);

    useEffect(() => {
        const desayuno = searchParams.get('desayuno');
        const almuerzo = searchParams.get('almuerzo');
        const cena = searchParams.get('cena');
        const source = searchParams.get('source');

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
    }, [habitaciones, searchParams]);

    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCart, setShowCart] = useState(false);

    const habitacionesFiltradas = habitaciones.sort((a, b) => {
        // Ordenar: Matrimonial (301) primero, luego Doble Twin (302), luego Triple (303)
        const getRoomTypeOrder = (hab: Habitacion) => {
            const nombre = hab.nombre.toLowerCase();
            if (nombre.includes('triple')) return 3; // 303
            if (nombre.includes('2 camas') || nombre.includes('twin')) return 2; // 302
            if (nombre.includes('doble') || nombre.includes('matrimonial')) return 1; // 301
            return 4; // Otras al final
        };
        return getRoomTypeOrder(a) - getRoomTypeOrder(b);
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
            // Only charge if NOT included
            if (item.comidas.desayuno && !item.habitacion.incluyeDesayuno) mealsPrice += 1.0;
            if (item.comidas.almuerzo && !item.habitacion.incluyeAlmuerzo) mealsPrice += 1.0;
            if (item.comidas.cena && !item.habitacion.incluyeCena) mealsPrice += 1.0;

            // Calculate dynamic base price
            const basePrice = getDynamicPrice(item.habitacion, filtroAdultos, filtroNinos);

            return total + ((basePrice + mealsPrice) * item.cantidad * noches);
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
                                        onClick={() => setFiltroAdultos(prev => Math.max(0, prev - 1))}
                                        className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                        type="button"
                                    >
                                        <Minus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                    </button>
                                    <span className="w-5 md:w-10 text-center font-bold text-gray-800 text-[10px] md:text-base">{filtroAdultos}</span>
                                    <button
                                        onClick={() => setFiltroAdultos(prev => prev === 0 ? 1 : prev + 1)}
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

                            {/* Botón Aplicar */}
                            <div className="col-span-1 xs:col-span-2 md:col-span-2">
                                <button
                                    onClick={handleAplicarFiltros}
                                    className="w-full bg-cardenal-gold hover:bg-cardenal-green text-white font-bold py-2 md:py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group tracking-widest text-xs md:text-sm"
                                >
                                    <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                                    APLICAR CAMBIOS
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
                            {(appliedFilters.adultos > 0 || appliedFilters.ninos > 0) && (
                                <span className="text-cardenal-gold ml-2">
                                    (Búsqueda para: {appliedFilters.adultos} adultos, {appliedFilters.ninos} niños)
                                </span>
                            )}
                        </p>
                        {(appliedFilters.adultos > 0 || appliedFilters.ninos > 0) && (
                            <button
                                onClick={resetFiltros}
                                className="text-cardenal-gold hover:text-cardenal-green font-bold uppercase tracking-widest text-xs transition-colors underline decoration-2 underline-offset-4"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Cart Sidebar has been removed according to user request */}

                {validationMessage && (
                    <div className="container mx-auto px-4 mb-8">
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-md animate-slideInRight">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                <p className="text-amber-800 font-bold text-sm">{validationMessage}</p>
                                <button onClick={() => setValidationMessage('')} className="ml-auto text-amber-500 hover:text-amber-700">
                                    <X className="w-4 h-4" />
                                </button>
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
                        <div className="space-y-16">
                            {[1, 2, 3, 4].map(priority => {
                                const groupRooms = habitacionesFiltradas.filter(h => {
                                    const n = h.nombre.toLowerCase();

                                    // Explicit Priority Logic based on User Screenshot Numbers (301, 302, 303)
                                    let p = 4;

                                    if (n.includes('301')) p = 1;
                                    else if (n.includes('302')) p = 2;
                                    else if (n.includes('303')) p = 3;
                                    else {
                                        // Fallback to name-based if number missing
                                        if (n.includes('triple')) p = 3;
                                        else if (n.includes('2 camas') || n.includes('twin')) p = 2;
                                        else if (n.includes('doble') || n.includes('matrimonial')) p = 1;
                                    }

                                    return p === priority;
                                });

                                if (groupRooms.length === 0) return null;

                                return (
                                    <div key={priority} className="w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                                            {groupRooms.map((habitacion) => (
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
                                                            habitacion.disponible ? "bg-cardenal-green text-white" : "bg-red-500 text-white"
                                                        )}>
                                                            {habitacion.disponible ? 'Disponible' : (habitacion.reservada ? 'Reservada' : 'Ocupada')}
                                                        </div>

                                                        {/* Price overlay - Dynamic pricing based on guest count */}
                                                        <div className="absolute bottom-0 left-0 bg-cardenal-green text-white px-6 py-3 font-serif font-bold italic text-3xl shadow-2xl">
                                                            ${getDynamicPrice(habitacion, appliedFilters.adultos, appliedFilters.ninos).toFixed(2)} <span className="text-[10px] font-normal not-italic">/ noche</span>
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

                                                        {/* Children pricing info badge */}
                                                        {habitacion.ninosGratis !== undefined && (
                                                            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 flex items-center gap-2">
                                                                <Users className="w-3 h-3" />
                                                                {habitacion.ninosGratis > 0 ? (
                                                                    <span>
                                                                        <strong>{habitacion.ninosGratis} niño{habitacion.ninosGratis > 1 ? 's' : ''} gratis</strong>
                                                                        {habitacion.precioNinoExtra && habitacion.precioNinoExtra > 0 && (
                                                                            <> • Niño extra: +${habitacion.precioNinoExtra.toFixed(2)}</>
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span>
                                                                        Niños: +${(habitacion.precioNinoExtra || 0).toFixed(2)} c/u
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

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
                                                            <p className="text-base font-extrabold text-cardenal-green mb-4 flex items-center gap-2 font-serif italic">
                                                                <Sparkles className="w-5 h-5 text-cardenal-gold animate-pulse" />
                                                                Agrega si quieres tu residencia con:
                                                            </p>
                                                            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                                                                {([
                                                                    { key: 'desayuno', label: 'Desayuno', included: habitacion.incluyeDesayuno },
                                                                    { key: 'almuerzo', label: 'Almuerzo', included: habitacion.incluyeAlmuerzo },
                                                                    { key: 'cena', label: 'Cena', included: habitacion.incluyeCena }
                                                                ] as const).map(({ key, label, included }) => (
                                                                    <button
                                                                        key={key}
                                                                        onClick={() => {
                                                                            // Only toggle if not included. Included means always ON.
                                                                            if (!included) toggleMeal(habitacion.id, key as any);
                                                                        }}
                                                                        disabled={!!included}
                                                                        className={cn(
                                                                            "relative flex items-center justify-center gap-2 px-3 py-2 rounded border transition-all duration-300",
                                                                            included
                                                                                ? "bg-green-100 border-green-300 text-green-800 cursor-default"
                                                                                : (pendingMeals[habitacion.id]?.[key as 'desayuno' | 'almuerzo' | 'cena']
                                                                                    ? "bg-cardenal-gold text-white border-cardenal-gold shadow-md transform scale-105"
                                                                                    : "bg-white border-gray-200 text-gray-600 hover:border-cardenal-gold hover:text-cardenal-gold")
                                                                        )}
                                                                    >
                                                                        {included ? (
                                                                            // Add Check icon import if needed, or use text/emoji
                                                                            <Check className="w-3 h-3" />
                                                                        ) : (
                                                                            <div className={cn(
                                                                                "w-3 h-3 rounded-full border border-current flex items-center justify-center transition-colors",
                                                                                pendingMeals[habitacion.id]?.[key as 'desayuno' | 'almuerzo' | 'cena'] ? "bg-white/20" : "bg-transparent"
                                                                            )}>
                                                                                {pendingMeals[habitacion.id]?.[key as 'desayuno' | 'almuerzo' | 'cena'] && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                            </div>
                                                                        )}
                                                                        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
                                                                        {included && <span className="text-[9px] ml-1 bg-green-200 text-green-800 px-1 rounded">Incluido</span>}
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
                                                                onClick={() => {
                                                                    if (!fechaEntrada || !fechaSalida || (filtroAdultos + filtroNinos) === 0) {
                                                                        setValidationMessage('Por favor, selecciona tus fechas y número de personas antes de agregar.');
                                                                        // Scroll to search bar
                                                                        window.scrollTo({ top: 300, behavior: 'smooth' });
                                                                        setTimeout(() => setValidationMessage(''), 5000);
                                                                        return;
                                                                    }
                                                                    setAvailabilityRoom(habitacion);
                                                                }}
                                                                disabled={!habitacion.disponible}
                                                                className={cn(
                                                                    "flex-1 font-bold py-4 px-4 transition-all duration-300 flex items-center justify-center gap-2 tracking-[0.2em] text-xs shadow-md",
                                                                    habitacion.disponible
                                                                        ? (fechaEntrada && fechaSalida && (filtroAdultos + filtroNinos) > 0
                                                                            ? "bg-cardenal-gold border-2 border-cardenal-gold text-white hover:bg-white hover:text-cardenal-gold"
                                                                            : "bg-amber-100 border-2 border-amber-200 text-amber-700 hover:bg-amber-200")
                                                                        : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                                                                )}
                                                            >
                                                                {habitacion.disponible ? (
                                                                    <>
                                                                        <Plus className="w-4 h-4" />
                                                                        AGREGAR
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <X className="w-4 h-4" />
                                                                        OCUPADA
                                                                    </>
                                                                )}
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
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Room Details Modal - New Booking Style */}
                {selectedRoom && (
                    <RoomDetailBookingModal
                        habitacion={selectedRoom}
                        onClose={() => setSelectedRoom(null)}
                        onAddToCart={addToCart}
                    />
                )}

                {/* Room Availability Modal - Booking style */}
                {availabilityRoom && (
                    <RoomAvailabilityModal
                        habitacion={availabilityRoom}
                        initialOccupancy={appliedFilters.adultos + appliedFilters.ninos}
                        fechaEntrada={appliedFilters.entrada}
                        fechaSalida={appliedFilters.salida}
                        onClose={() => setAvailabilityRoom(null)}
                        initialMeals={pendingMeals[availabilityRoom.id]}
                        onAddToCart={(hab, cantidad, opciones) => {
                            // Agregar al carrito con las opciones seleccionadas
                            for (let i = 0; i < cantidad; i++) {
                                setPendingMeals(prev => ({
                                    ...prev,
                                    [hab.id]: {
                                        desayuno: opciones.desayuno,
                                        almuerzo: opciones.almuerzo,
                                        cena: opciones.cena
                                    }
                                }));
                                addToCart(hab);
                            }
                            setAvailabilityRoom(null);
                        }}
                    />
                )}

                <AnnouncementPopup />
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
