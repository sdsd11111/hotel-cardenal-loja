'use client'; // Re-refresh 14:28

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ReservationSearchPanel from '@/components/ReservationSearchPanel';
import { RoomDetailBookingModal } from '@/components/RoomDetailBookingModal';
import { RoomAvailabilityModal } from '@/components/RoomAvailabilityModal';
import { headerData, Habitacion, PriceOption } from '@/types';
import {
    Bed, Eye, Briefcase, Coffee, Users, Tv, Bath, Car, Wind,
    ConciergeBell, Sparkles, Droplets, Award, Sofa, Wifi,
    Calendar, X, Minus, Plus, Info, Loader2, Clock, Check, ShoppingCart, ArrowRight
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
    // Context for detailed pricing in checkout
    adultos: number;
    ninos: number;
    ninosEdades: number[];
    opcionPrecio: PriceOption;
}

// Helper function to calculate dynamic price based on guest count
const getDynamicPrice = (habitacion: Habitacion, adultos: number, ninosEdades: number[], threshold: number, policy: string = 'free', fixedPrice: number = 0): number => {
    // 1. Identificar niños que se cobran como adultos (>= threshold)
    const ninosCobradosComoAdultos = ninosEdades.filter(age => age >= threshold).length;

    // 2. Identificar niños pequeños (< threshold)
    const ninosPequeños = ninosEdades.filter(age => age < threshold);

    // Total de personas que cuentan para los rangos de precios (Base + Niños adultos)
    let totalGuestsForTier = adultos + ninosCobradosComoAdultos;

    // REGLA ESPECIAL: En habitaciones Matrimoniales, los niños SIEMPRE cuentan como adultos
    if (habitacion.nombre.toLowerCase().includes('matrimonial')) {
        totalGuestsForTier = adultos + ninosEdades.length;
    } else if (policy === 'adult') {
        // POLÍTICA: Si la política es 'adult', TODOS los niños cuentan para el rango de precio
        totalGuestsForTier = adultos + ninosEdades.length;
    }

    // Buscamos la mejor opción de precio en base a la ocupación efectiva
    if (!habitacion.priceOptions || habitacion.priceOptions.length === 0 || (adultos <= 0 && ninosEdades.length <= 0)) {
        return habitacion.precioNumerico;
    }

    const sortedOptions = [...habitacion.priceOptions].sort((a, b) => a.personas - b.personas);

    // Encontrar la opción que mejor se adapte (o la superior)
    let bestOption = sortedOptions.find(opt => opt.personas >= totalGuestsForTier);

    // MEJORA: Si no hay personas seleccionadas (vista inicial), usar el precio más bajo disponible
    if (totalGuestsForTier === 0 && sortedOptions.length > 0) {
        bestOption = sortedOptions[0];
    }

    if (!bestOption) {
        bestOption = sortedOptions[sortedOptions.length - 1];
    }

    // Si aún no tenemos opción válida, fallback al precio numérico estático
    if (!bestOption) {
        return habitacion.precioNumerico;
    }

    let basicPrice = bestOption.precioBase;

    // POLÍTICA: Si la política es 'fixed', sumamos el valor fijo por cada niño pequeño
    if (policy === 'fixed') {
        basicPrice += ninosPequeños.length * fixedPrice;
    }

    return basicPrice;
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

    const [filtroHabitaciones, setFiltroHabitaciones] = useState(1);
    const [filtroAdultos, setFiltroAdultos] = useState(0);
    const [filtroNinos, setFiltroNinos] = useState(0);
    const [ninosEdades, setNinosEdades] = useState<number[]>([]);

    const [childAgeThreshold, setChildAgeThreshold] = useState(8);
    const [childPricingPolicy, setChildPricingPolicy] = useState('free');
    const [childFixedPrice, setChildFixedPrice] = useState(0);
    const [mealSettings, setMealSettings] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
    const [fechaEntrada, setFechaEntrada] = useState('');
    const [fechaSalida, setFechaSalida] = useState('');

    // Applied filters (the ones that actually trigger search/filtering)
    const [appliedFilters, setAppliedFilters] = useState({
        entrada: '',
        salida: '',
        habitaciones: 1,
        adultos: 0,
        ninos: 0,
        ninosEdades: [] as number[]
    });

    const getMinRoomsNeeded = (adultos: number, ninos: number): number => {
        // Obtenemos adultos efectivos basados en las edades (si ya están seteadas)
        const ninosCobradosComoAdultos = ninosEdades.filter(age => age >= childAgeThreshold).length;
        let adultosEfectivos = adultos + ninosCobradosComoAdultos;
        let ninosEfectivos = Math.max(0, ninos - ninosCobradosComoAdultos);

        if (childPricingPolicy === 'adult') {
            adultosEfectivos = adultos + ninos;
            ninosEfectivos = 0;
        }

        const totalPersonas = adultosEfectivos + ninosEfectivos;
        if (totalPersonas <= 0) return 1;

        // Inventario base referencial o usar el real si está cargado
        let minR = Infinity;

        if (habitaciones.length > 0) {
            // Greedy approach: try largest rooms first to minimize room count
            const sortedHabitaciones = [...habitaciones].sort((a, b) =>
                ((b.max_adultos ?? 0) + (b.max_ninos ?? 0)) - ((a.max_adultos ?? 0) + (a.max_ninos ?? 0))
            );

            let remAds = adultosEfectivos;
            let remNins = ninosEfectivos;
            let roomsCount = 0;

            while ((remAds > 0 || remNins > 0) && roomsCount < 20) {
                const room = sortedHabitaciones[0];
                if (!room) break;

                const canTakeAds = Math.min(remAds, room.max_adultos ?? 4);
                remAds -= canTakeAds;

                const remainingInRoom = ((room.max_adultos ?? 4) - canTakeAds) + (room.max_ninos ?? 0);
                const canTakeNins = Math.min(remNins, remainingInRoom);
                remNins -= canTakeNins;

                roomsCount++;
                if (remAds <= 0 && remNins <= 0) {
                    minR = roomsCount;
                    break;
                }
            }
        } else {
            minR = Math.ceil(totalPersonas / 2);
        }

        return minR === Infinity ? 1 : minR;
    };

    const handleAdultosChange = (val: number) => {
        let maxA = 18; // Default fallback
        if (habitaciones.length > 0) {
            maxA = habitaciones.reduce((sum, hab) => sum + ((hab.capacidad?.maxAdultos) || (hab as any).max_adultos || 0), 0);
        }
        val = Math.min(val, maxA);
        setFiltroAdultos(val);
        const minRooms = getMinRoomsNeeded(val, filtroNinos);
        if (minRooms > filtroHabitaciones) setFiltroHabitaciones(minRooms);
    };

    const handleNinosChange = (val: number) => {
        let maxN = 12; // Default fallback
        if (habitaciones.length > 0) {
            maxN = habitaciones.reduce((sum, hab) => Math.max(sum, ((hab.capacidad?.maxNiños) || (hab as any).max_ninos || 0)), 0) * habitaciones.length;
        }
        val = Math.min(val, Math.max(18, maxN)); // Absolute safety lid
        setFiltroNinos(val);
        setNinosEdades(prev => {
            if (val < prev.length) return prev.slice(0, val);
            return [...prev, ...Array(val - prev.length).fill(5)];
        });
        const minRooms = getMinRoomsNeeded(filtroAdultos, val);
        if (minRooms > filtroHabitaciones) setFiltroHabitaciones(minRooms);
    };

    const handleHabitacionesChange = (val: number) => {
        const minRooms = getMinRoomsNeeded(filtroAdultos, filtroNinos);
        setFiltroHabitaciones(Math.max(minRooms, val));
    };

    const getCombinacionSugerida = (adultos: number, ninos: number, Habitaciones: number): string => {
        if (Habitaciones <= 1 && (adultos + ninos) <= 4 && ninos === 0) return "";

        const ninosCobradosComoAdultos = appliedFilters.ninosEdades.filter(age => age >= childAgeThreshold).length;
        let adultosEfectivos = adultos + ninosCobradosComoAdultos;
        let ninosEfectivos = Math.max(0, ninos - ninosCobradosComoAdultos);

        if (childPricingPolicy === 'adult') {
            adultosEfectivos = adultos + ninos;
            ninosEfectivos = 0;
        }

        if (habitaciones.length > 0) {
            // Simplified suggestion based on actual room capacities
            return `Su selección de ${Habitaciones} habitación(es) debe cubrir el total de ${adultos} adultos y ${ninos} niños filtrados.`;
        }

        let bestCombo: { m: number, d: number, t: number } | null = null;
        let minWaste = Infinity;

        // Fallback hardcoded logic for suggestion text when rooms not in state
        const capM_A = 2, capM_N = 0;
        const capD_A = 3, capD_N = 2;
        const capT_A = 4, capT_N = 3;

        for (let m = 0; m <= 4; m++) {
            for (let d = 0; d <= 4; d++) {
                for (let t = 0; t <= 4; t++) {
                    if (m + d + t === Habitaciones) {
                        const capA = m * capM_A + d * capD_A + t * capT_A;
                        const capN = m * capM_N + d * capD_N + t * capT_N;
                        if (capA >= adultosEfectivos && (capA - adultosEfectivos + capN) >= ninosEfectivos) {
                            const waste = (capA - adultosEfectivos) + (capA - adultosEfectivos + capN - ninosEfectivos);
                            if (waste < minWaste) {
                                minWaste = waste;
                                bestCombo = { m, d, t };
                            }
                        }
                    }
                }
            }
        }

        if (bestCombo) {
            const parts = [];
            if (bestCombo.t > 0) parts.push(`${bestCombo.t} Habitación${bestCombo.t > 1 ? 'es' : ''} Triple${bestCombo.t > 1 ? 's' : ''}`);
            if (bestCombo.d > 0) parts.push(`${bestCombo.d} Habitación${bestCombo.d > 1 ? 'es' : ''} Doble${bestCombo.d > 1 ? 's' : ''} Twin`);
            if (bestCombo.m > 0) parts.push(`${bestCombo.m} Habitación${bestCombo.m > 1 ? 'es' : ''} Matrimonial${bestCombo.m > 1 ? 'es' : ''}`);
            return "Sugerencia: " + parts.join(" + ");
        }

        return `Sugerencia: Por favor ajuste sus filtros. No es posible acomodar de forma ideal a ${adultosEfectivos} adultos y ${ninosEfectivos} niños en ${Habitaciones} habitación(es) según nuestra distribución de camas actuales.`;
    };

    // Ref to always have the latest filters inside the setInterval closure
    const appliedFiltersRef = useRef(appliedFilters);
    useEffect(() => {
        appliedFiltersRef.current = appliedFilters;
    }, [appliedFilters]);

    const [roomConfigs, setRoomConfigs] = useState<any[]>([]);
    // Ref to avoid stale closures in the auto-refresh interval
    const roomConfigsRef = useRef<any[]>([]);
    useEffect(() => {
        roomConfigsRef.current = roomConfigs;
    }, [roomConfigs]);

    const [isConfigsLoaded, setIsConfigsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let freshConfigs = [];
                // 1. Fetch child age threshold
                const settingsRes = await fetch('/api/admin/settings');
                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    const threshold = data.find((s: any) => s.setting_key === 'child_age_threshold');
                    if (threshold) setChildAgeThreshold(parseInt(threshold.setting_value));

                    const policy = data.find((s: any) => s.setting_key === 'child_pricing_policy');
                    if (policy) setChildPricingPolicy(policy.setting_value);

                    const fixedPrice = data.find((s: any) => s.setting_key === 'child_fixed_price');
                    if (fixedPrice) setChildFixedPrice(parseFloat(fixedPrice.setting_value));

                    const bPrice = data.find((s: any) => s.setting_key === 'breakfast_price');
                    const lPrice = data.find((s: any) => s.setting_key === 'lunch_price');
                    const dPrice = data.find((s: any) => s.setting_key === 'dinner_price');

                    setMealSettings({
                        breakfast: bPrice ? parseFloat(bPrice.setting_value) : 0,
                        lunch: lPrice ? parseFloat(lPrice.setting_value) : 0,
                        dinner: dPrice ? parseFloat(dPrice.setting_value) : 0
                    });
                }

                // 2. Fetch centralized room configurations (for pricing)
                const configsRes = await fetch('/api/admin/room-configs');
                if (configsRes.ok) {
                    freshConfigs = await configsRes.json();
                    setRoomConfigs(freshConfigs);
                    roomConfigsRef.current = freshConfigs;
                    setIsConfigsLoaded(true);
                }

                // Initial fetch with current URL params
                const ent = searchParams.get('entrada') || '';
                const sal = searchParams.get('salida') || '';
                console.log('Initial fetch with configs:', freshConfigs.length);
                fetchHabitaciones(ent, sal, 0, freshConfigs);
            } catch (err) {
                console.error('Error fetching data:', err);
                fetchHabitaciones(); // Fallback if settings fail
            }
        };
        fetchData();

        // Auto-refresh every 10 seconds to keep availability up to date
        const refreshInterval = setInterval(() => {
            // Background refresh WITHOUT showing the loading spinner
            // We use the Ref to get the LATEST applied filters even inside this closure
            const filters = appliedFiltersRef.current;
            fetchHabitaciones(filters.entrada, filters.salida, 0, undefined, true);
        }, 10000);

        return () => clearInterval(refreshInterval);
    }, []);

    const handleAplicarFiltros = () => {
        // Validar que todos los niños tengan edad
        if (ninosEdades.length > 0 && ninosEdades.some(age => age === undefined || age === null || isNaN(age))) {
            setValidationMessage('Por favor, coloca la edad de todos los niños.');
            setTimeout(() => setValidationMessage(''), 5000);
            return;
        }

        // AUTO-CONVERSIÓN: Niños que exceden el umbral de edad se convierten en adultos
        const ninosMayores = ninosEdades.filter(age => age >= childAgeThreshold).length;
        const adultosEfectivos = filtroAdultos + ninosMayores;
        const ninosEfectivosEdades = ninosEdades.filter(age => age < childAgeThreshold);
        const ninosEfectivos = ninosEfectivosEdades.length;

        // Actualizar los filtros visibles si hubo conversión
        if (ninosMayores > 0) {
            setFiltroAdultos(adultosEfectivos);
            setFiltroNinos(ninosEfectivos);
            setNinosEdades(ninosEfectivosEdades);
            setValidationMessage(`${ninosMayores} niño(s) de ${childAgeThreshold}+ años se cuenta(n) como adulto(s). Adultos ajustados a ${adultosEfectivos}.`);
            setTimeout(() => setValidationMessage(''), 6000);
        }

        if (ninosEfectivos > 0 && adultosEfectivos === 0) {
            setValidationMessage('Es obligatorio incluir al menos un adulto si viaja con niños.');
            setTimeout(() => setValidationMessage(''), 5000);
            return;
        }

        // Detectar cambio en filtros para reiniciar el carrito
        const filtersChanged =
            fechaEntrada !== appliedFilters.entrada ||
            fechaSalida !== appliedFilters.salida ||
            filtroHabitaciones !== appliedFilters.habitaciones ||
            adultosEfectivos !== appliedFilters.adultos ||
            ninosEfectivos !== appliedFilters.ninos ||
            JSON.stringify(ninosEfectivosEdades) !== JSON.stringify(appliedFilters.ninosEdades);

        if (filtersChanged && cart.length > 0) {
            console.log('[Habitaciones] Filtros cambiados, reiniciando carrito.');
            setCart([]);
        }

        const params = new URLSearchParams();
        if (fechaEntrada) params.set('entrada', fechaEntrada);
        if (fechaSalida) params.set('salida', fechaSalida);
        if (filtroHabitaciones > 1) params.set('habitaciones', filtroHabitaciones.toString());
        if (adultosEfectivos > 0) params.set('adultos', adultosEfectivos.toString());
        if (ninosEfectivos > 0) {
            params.set('ninos', ninosEfectivos.toString());
            if (ninosEfectivosEdades.length > 0) {
                params.set('edades', ninosEfectivosEdades.join(','));
            }
        }
        router.push(`/habitaciones?${params.toString()}`, { scroll: false });

        // setAppliedFilters will be called by the useEffect watching searchParams
        // but we can also set it here to be immediate
        setAppliedFilters({
            entrada: fechaEntrada,
            salida: fechaSalida,
            habitaciones: filtroHabitaciones,
            adultos: adultosEfectivos,
            ninos: ninosEfectivos,
            ninosEdades: ninosEfectivosEdades
        });

        // Recalcular habitaciones mínimas con los valores efectivos
        const minRooms = getMinRoomsNeeded(adultosEfectivos, ninosEfectivos);
        if (minRooms > filtroHabitaciones) setFiltroHabitaciones(minRooms);

        fetchHabitaciones(fechaEntrada, fechaSalida);
    };

    const fetchHabitaciones = async (entradaVal?: string, salidaVal?: string, retryCount = 0, providedConfigs?: any[], isSilent = false) => {
        try {
            if (!isSilent) setIsLoading(true);
            const params = new URLSearchParams();

            // Always use the latest Ref to avoid stale closure state (like guest counts)
            const filters = appliedFiltersRef.current;
            const ent = entradaVal !== undefined ? entradaVal : filters.entrada;
            const sal = salidaVal !== undefined ? salidaVal : filters.salida;

            // Use the Ref to ensure we have the latest configs even in stale interval closures
            const activeConfigs = providedConfigs || roomConfigsRef.current;

            // CRITICAL SAFETY: If we are in the background and configs are missing, DO NOT procedeed
            // to avoid overwriting correct UI with base prices
            if (isSilent && activeConfigs.length === 0 && isConfigsLoaded) {
                console.warn('[Habitaciones] Abortando refresco silencioso por falta de configs.');
                return;
            }

            console.log(`[Habitaciones] Cargando con ${activeConfigs.length} configs. Per: ${filters.adultos}+${filters.ninos}. Silent: ${isSilent}`);

            if (ent) params.append('entrada', ent);
            if (sal) params.append('salida', sal);

            // Bypass cache with timestamp
            params.append('_t', Date.now().toString());

            const response = await fetch(`/api/habitaciones?${params.toString()}`, { cache: 'no-store', headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' } });


            if (!response.ok) {
                const errorText = await response.text().catch(() => 'No error details');
                console.error(`Fetch failed (Status: ${response.status}): ${errorText}`);

                // Retry up to 2 times on failure
                if (retryCount < 2) {
                    console.warn(`Retry ${retryCount + 1} for habitaciones...`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait longer on retry
                    return fetchHabitaciones(ent, sal, retryCount + 1, providedConfigs, isSilent);
                }
                throw new Error(`Error al cargar habitaciones (${response.status})`);
            }

            const data = await response.json();

            // Transform DB data to interface format
            let mappedData: Habitacion[] = data.map((room: any) => {
                const nombreLower = room.nombre.toLowerCase();
                let identifier = '303'; // Default logic to match modal

                // Improved categorization logic to handle 'Doble Matrimonial' correctly (Matrimonial takes precedence)
                if (nombreLower.includes('matrimonial') || nombreLower.includes('301')) {
                    identifier = '301';
                } else if (nombreLower.includes('triple') || nombreLower.includes('303')) {
                    identifier = '303';
                } else if (nombreLower.includes('twin') || nombreLower.includes('302') || (nombreLower.includes('doble') && !nombreLower.includes('matrimonial'))) {
                    identifier = '302';
                } else {
                    // Fallback based on capacity if name doesn't help
                    if (room.max_adultos <= 2) identifier = '301';
                    else if (room.max_adultos === 3) identifier = '302';
                    else identifier = '303';
                }

                // Try to use centralized config for price options
                // Try to use centralized config for price options
                const config = activeConfigs.find((c: any) => c.identifier === identifier);
                if (!config && activeConfigs.length > 0) {
                    console.warn(`[Habitaciones] No se encontró config para identifier: ${identifier} (${room.nombre})`);
                }

                let priceOptions: any[] = [];
                let basePriceOptions: any[] = [];
                let effectiveJson = room.price_options_json;

                if (config) {
                    // Start with room's own json, fallback to config if empty
                    if (!effectiveJson || (typeof effectiveJson === 'string' && (effectiveJson === '[]' || effectiveJson === ''))) {
                        effectiveJson = config.price_options_json;
                    }
                }

                try {
                    basePriceOptions = typeof effectiveJson === 'string' ? JSON.parse(effectiveJson) : (effectiveJson || []);
                } catch (e) {
                    console.error('Error parsing base price options', e);
                    basePriceOptions = [];
                }

                if (config && config.seasonal_prices && Array.isArray(config.seasonal_prices) && config.seasonal_prices.length > 0) {
                    const today = new Date();
                    let checkStart = ent ? new Date(ent + 'T12:00:00') : today;
                    let checkEnd = sal ? new Date(sal + 'T12:00:00') : new Date(checkStart);

                    if (isNaN(checkStart.getTime())) checkStart = new Date();
                    if (isNaN(checkEnd.getTime())) checkEnd = new Date();

                    checkStart.setHours(0, 0, 0, 0);
                    checkEnd.setHours(0, 0, 0, 0);

                    const matchedSeason = config.seasonal_prices.find((sp: any) => {
                        const spStart = new Date(sp.start_date);
                        const spEnd = new Date(sp.end_date);
                        spStart.setHours(0, 0, 0, 0);
                        spEnd.setHours(23, 59, 59, 999);
                        return checkStart <= spEnd && checkEnd >= spStart;
                    });

                    if (matchedSeason) {
                        let seasonalOptions: any[] = [];
                        try {
                            const seasonalJson = matchedSeason.price_options_json;
                            seasonalOptions = typeof seasonalJson === 'string' ? JSON.parse(seasonalJson) : (seasonalJson || []);
                        } catch (e) {
                            console.error('Error parsing seasonal price options', e);
                            seasonalOptions = [];
                        }

                        // MERGE: Seasonal overrides base by 'personas' count
                        // Start with seasonal, add missing from base
                        const merged = [...seasonalOptions];
                        basePriceOptions.forEach((baseOpt: any) => {
                            if (!merged.find((m: any) => m.personas === baseOpt.personas)) {
                                merged.push(baseOpt);
                            }
                        });
                        priceOptions = merged;
                    } else {
                        priceOptions = basePriceOptions;
                    }
                } else {
                    priceOptions = basePriceOptions;
                }

                if (priceOptions.length === 0 && activeConfigs.length > 0) {
                    console.error(`[Habitaciones] ADVERTENCIA: La habitación ${room.nombre} (${identifier}) no tiene opciones de precio.`);
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
                    max_adultos: room.max_adultos,
                    max_ninos: room.max_ninos,
                    ninos_gratis: room.ninos_gratis,
                    precio_nino_extra: room.precio_nino_extra,
                    ninosGratis: room.ninos_gratis ?? 1,
                    precioNinoExtra: Number(room.precio_nino_extra ?? 0),
                    incluyeDesayuno: room.incluye_desayuno === 1,
                    incluyeAlmuerzo: room.incluye_almuerzo === 1,
                    incluyeCena: room.incluye_cena === 1,
                    priceOptions: priceOptions,
                    disponible: room.disponible === 1,
                    fecha_entrada: room.fecha_entrada,
                    fecha_salida: room.fecha_salida
                };
            });

            setHabitaciones(mappedData);

            // Initialize pendingMeals for each room - Preserve existing state if present to avoid UI reset
            setPendingMeals(prev => {
                const updatedMeals = { ...prev };
                mappedData.forEach(room => {
                    // Only initialize if the room is NOT already in the state
                    if (!updatedMeals[room.id]) {
                        updatedMeals[room.id] = {
                            desayuno: !!room.incluyeDesayuno,
                            almuerzo: !!room.incluyeAlmuerzo,
                            cena: !!room.incluyeCena
                        };
                    }
                });
                return updatedMeals;
            });

        } catch (err) {
            console.error('Error loading habitaciones:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Only run this if configs are already loaded to avoid race condition on mount
        if (!isConfigsLoaded) return;

        const entrada = searchParams.get('entrada');
        const salida = searchParams.get('salida');
        const habitacionesStr = searchParams.get('habitaciones');
        const adultosStr = searchParams.get('adultos');
        const ninosStr = searchParams.get('ninos');
        const ninosEdadesStr = searchParams.get('edades');

        // Only update if we have actual parameters in the URL
        // to avoid resetting state to "empty" on partial navigations
        if (entrada || salida || adultosStr || ninosStr || habitacionesStr) {
            if (entrada) setFechaEntrada(entrada);
            if (salida) setFechaSalida(salida);

            const habitaciones = habitacionesStr ? parseInt(habitacionesStr) : 1;
            const adultos = adultosStr ? parseInt(adultosStr) : 0;
            const ninos = ninosStr ? parseInt(ninosStr) : 0;

            setFiltroHabitaciones(habitaciones);
            setFiltroAdultos(adultos);
            setFiltroNinos(ninos);

            let parsedEdades: number[] = [];
            if (ninosEdadesStr) {
                parsedEdades = ninosEdadesStr.split(',').map(Number);
            } else if (ninos > 0) {
                parsedEdades = Array(ninos).fill(5);
            }
            setNinosEdades(parsedEdades);

            // Update Applied Filters in one shot
            setAppliedFilters({
                entrada: entrada || '',
                salida: salida || '',
                habitaciones,
                adultos,
                ninos,
                ninosEdades: parsedEdades
            });

            // Trigger fetch with these values
            fetchHabitaciones(entrada || '', salida || '');
        } else {
            // If URL is empty, we still initial fetch once
            fetchHabitaciones();
        }
    }, [searchParams, isConfigsLoaded]);

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

    const habitacionesFiltradas = habitaciones.filter(hab => {
        // HIDE occupied rooms instead of showing them with a label
        if (!hab.disponible) return false;

        // NEW: Hide rooms already in cart
        if (cart.some(item => item.habitacion.id === hab.id)) return false;
        // Calcular conteos efectivos de adultos/niños según la política global
        const ninosCobradosComoAdultos = appliedFilters.ninosEdades.filter(age => age >= childAgeThreshold).length;
        let adultos = appliedFilters.adultos + ninosCobradosComoAdultos;
        let ninos = appliedFilters.ninosEdades.length - ninosCobradosComoAdultos;

        if (childPricingPolicy === 'adult') {
            adultos = appliedFilters.adultos + appliedFilters.ninosEdades.length;
            ninos = 0;
        }

        const total = adultos + ninos;

        // Si no hay filtros aplicados (0 personas en total), mostrar todo
        if (total === 0) return true;

        // SI SE SOLICITAN MÚLTIPLES HABITACIONES O EL GRUPO SUPERA LA CAPACIDAD MÁXIMA (4 PERSONAS)
        // Mostramos todas las habitaciones disponibles para que el usuario las combine en el carrito.
        if (appliedFilters.habitaciones > 1 || adultos > 4) {
            return true;
        }

        // Only filter by adult capacity, NOT by child capacity.
        // Children can always be added (extras will be charged per the room's pricing rules).
        // The validation for over-capacity happens at cart-add / checkout time.
        return adultos <= (hab.max_adultos ?? 4);
    }).sort((a, b) => {
        // Ordenar: Matrimonial (301) primero, luego Doble Twin (302), luego Triple (303)
        // Ordenar: Matrimonial (301) primero, luego Doble Twin (302), luego Triple (303)
        const getRoomTypeOrder = (hab: Habitacion) => {
            const nombre = hab.nombre.toLowerCase();
            if (nombre.includes('matrimonial')) return 1; // 301
            if (nombre.includes('twin') || (nombre.includes('doble') && !nombre.includes('matrimonial'))) return 2; // 302
            if (nombre.includes('triple')) return 3; // 303
            return 4; // Otras al final
        };
        return getRoomTypeOrder(a) - getRoomTypeOrder(b);
    });

    const resetFiltros = () => {
        setFiltroAdultos(0);
        setFiltroNinos(0);
        setNinosEdades([]);
    };

    const getRoomType = (nombre: string) => {
        const n = nombre.toUpperCase();
        if (n.includes('MATRIMONIAL') || n.includes('301')) return 'matrimonial';
        if (n.includes('DOBLE') || n.includes('TWIN') || n.includes('302')) return 'doble';
        if (n.includes('TRIPLE') || n.includes('303')) return 'triple';
        return 'triple';
    };

    const addToCart = (habitacion: Habitacion, mealsOverride?: { desayuno: boolean; almuerzo: boolean; cena: boolean }, personasOverride?: number) => {
        // PREVENCIÓN: No permitir añadir más habitaciones de las filtradas
        if (cart.length >= appliedFilters.habitaciones) {
            setValidationMessage(`Máximo ${appliedFilters.habitaciones} habitación(es) según tu búsqueda. Ajusta el filtro si necesitas más.`);
            setTimeout(() => setValidationMessage(''), 6000);
            return;
        }

        const meals = mealsOverride || pendingMeals[habitacion.id] || { desayuno: false, almuerzo: false, cena: false };

        const globalAdultos = appliedFilters.adultos;
        const globalNinos = appliedFilters.ninos;
        const globalPersonas = globalAdultos + globalNinos;
        const globalEdades = [...appliedFilters.ninosEdades];

        const effectivePersonas = personasOverride || globalPersonas;

        // Find the correct price option based on this occupancy
        setCart(prev => {
            const usedAdultos = prev.reduce((acc, curr) => acc + curr.adultos, 0);
            const usedNinos = prev.reduce((acc, curr) => acc + curr.ninos, 0);
            const usedEdades = prev.reduce((acc, curr) => acc + curr.ninosEdades.length, 0);

            let remAds = Math.max(0, globalAdultos - usedAdultos);
            let remNins = Math.max(0, globalNinos - usedNinos);

            // Determinar cuántos espacios intentamos llenar en esta habitación
            // Si viene del modal, personasOverride ES option.personas (número de adultos)
            let itemAdultos = 0;
            let itemNinos = 0;

            if (personasOverride !== undefined) {
                // Si el modal nos dice cuántos adultos son para esta opción específica, lo usamos.
                itemAdultos = personasOverride;
                // Disminuimos los adultos restantes (se asume que el usuario eligió bien su distribución)
                remAds = Math.max(0, remAds - itemAdultos);
            } else {
                // Auto-distribución (e.g. Añadir rápido sin pasar por el modal de opciones precisas)
                // 1. Siempre mínimo 1 adulto por habitación, incluso si ya no quedan (para evitar la validación de 0 adultos).
                if (remAds > 0) {
                    itemAdultos = 1;
                    remAds--;
                } else {
                    itemAdultos = 1;
                }

                // 2. Llenar los espacios restantes con adultos, PERO reservando 1 adulto para cada habitación que falte
                const roomsToBook = Math.max(1, appliedFilters.habitaciones);
                const roomsLeftToBook = Math.max(0, roomsToBook - (prev.length + 1));
                const maxAdultosParaEsta = Math.max(0, remAds - roomsLeftToBook);

                const roomMaxAds = Number(habitacion.max_adultos) || 4;
                const addAds = Math.min(maxAdultosParaEsta, Math.max(0, roomMaxAds - itemAdultos));

                itemAdultos += addAds;
                remAds -= addAds;
            }

            // 3. Niños: Se asignan hasta agotar el target de capacidad de la habitación o los niños restantes
            const maxNinos = Number(habitacion.max_ninos) || 0;
            const addNins = Math.min(remNins, maxNinos);
            itemNinos += addNins;
            remNins -= addNins;

            // 4. Obtener las edades correctas para los niños asignados a esta habitación
            const itemEdades = globalEdades.slice(usedEdades, usedEdades + itemNinos);
            while (itemEdades.length < itemNinos) itemEdades.push(childAgeThreshold - 1);

            // 5. Determinar la opción de precio basada en los adultos asignados
            const option = habitacion.priceOptions?.find(opt => opt.personas === itemAdultos)
                || habitacion.priceOptions?.find(opt => opt.personas >= itemAdultos)
                || habitacion.priceOptions?.[0]
                || { personas: Math.max(1, itemAdultos), precioBase: habitacion.precioNumerico, impuestos: 0 };

            const newItem: CartItem = {
                habitacion,
                cantidad: 1,
                comidas: { ...meals },
                adultos: itemAdultos,
                ninos: itemNinos,
                ninosEdades: itemEdades,
                opcionPrecio: option
            };

            return [...prev, newItem];
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
            const totalGuests = item.adultos + item.ninosEdades.length;
            let totalMealsPricePerNight = 0;

            // Only charge if NOT included
            if (item.comidas.desayuno && !item.habitacion.incluyeDesayuno) totalMealsPricePerNight += mealSettings.breakfast * totalGuests;
            if (item.comidas.almuerzo && !item.habitacion.incluyeAlmuerzo) totalMealsPricePerNight += mealSettings.lunch * totalGuests;
            if (item.comidas.cena && !item.habitacion.incluyeCena) totalMealsPricePerNight += mealSettings.dinner * totalGuests;

            // Use the correct base price from the selected option
            const basePrice = item.opcionPrecio.precioBase;

            // Room-specific child pricing logic
            const numNinos = item.ninosEdades.length;
            let childSupplementPerNight = 0;
            if (numNinos > 0) {
                const ninosGratis = item.habitacion.ninos_gratis ?? item.habitacion.ninosGratis ?? 0;
                const precioExtra = item.habitacion.precio_nino_extra ?? item.habitacion.precioNinoExtra ?? 0;
                const ninosACobrar = Math.max(0, numNinos - ninosGratis);
                childSupplementPerNight = ninosACobrar * precioExtra;
            }

            const pricePerNightPerRoom = basePrice + totalMealsPricePerNight + childSupplementPerNight;

            return total + (pricePerNightPerRoom * item.cantidad * noches);
        }, 0);
    };


    const handleReservar = async () => {
        if (!fechaEntrada || !fechaSalida) {
            setValidationMessage('Por favor, selecciona tus fechas de entrada y salida.');
            setTimeout(() => setValidationMessage(''), 5000);
            return;
        }

        // VALIDACIÓN DE CARRITO COMPLETO SEGÚN FILTRO
        if (cart.length < appliedFilters.habitaciones) {
            const faltantes = appliedFilters.habitaciones - cart.length;
            setValidationMessage(`Falta seleccionar ${faltantes} habitación${faltantes > 1 ? 'es' : ''} más para completar tu búsqueda de ${appliedFilters.habitaciones} habitaciones.`);
            window.scrollTo({ top: 300, behavior: 'smooth' });
            setTimeout(() => setValidationMessage(''), 7000);
            return;
        }

        let adultosEfectivosFiltrados = appliedFilters.adultos + appliedFilters.ninosEdades.filter(age => age >= childAgeThreshold).length;
        let ninosEfectivosFiltrados = appliedFilters.ninosEdades.filter(age => age < childAgeThreshold).length;

        if (childPricingPolicy === 'adult') {
            adultosEfectivosFiltrados = appliedFilters.adultos + appliedFilters.ninos;
            ninosEfectivosFiltrados = 0;
        }

        const adultosEnCarrito = cart.reduce((acc, curr) => acc + curr.adultos, 0);
        const ninosEnCarrito = cart.reduce((acc, curr) => acc + curr.ninos, 0);

        if (adultosEnCarrito < adultosEfectivosFiltrados) {
            const faltantes = adultosEfectivosFiltrados - adultosEnCarrito;
            setValidationMessage(`Aún faltan ${faltantes} adulto${faltantes > 1 ? 's' : ''} por asignar en las habitaciones para llegar a los ${adultosEfectivosFiltrados} filtrados.`);
            window.scrollTo({ top: 300, behavior: 'smooth' });
            setTimeout(() => setValidationMessage(''), 7000);
            return;
        }

        if (ninosEnCarrito < ninosEfectivosFiltrados) {
            const faltantes = ninosEfectivosFiltrados - ninosEnCarrito;
            setValidationMessage(`Aún faltan ${faltantes} niño${faltantes > 1 ? 's' : ''} por asignar para llegar a los ${ninosEfectivosFiltrados} filtrados.`);
            window.scrollTo({ top: 300, behavior: 'smooth' });
            setTimeout(() => setValidationMessage(''), 7000);
            return;
        }

        // VALIDACIÓN: Verificar que todos los items del carrito cumplan la capacidad individual
        for (const item of cart) {
            const hasTooManyChildren = item.ninos > (item.habitacion.max_ninos ?? 0);
            const hasTooManyAdults = item.adultos > (item.habitacion.max_adultos ?? 4);

            if (hasTooManyChildren || hasTooManyAdults) {
                setValidationMessage(`La capacidad de la habitación "${item.habitacion.nombre}" es excedida (${item.habitacion.max_adultos ?? 4} adultos, ${item.habitacion.max_ninos ?? 0} niños). Por favor ajuste su selección.`);
                window.scrollTo({ top: 300, behavior: 'smooth' });
                setTimeout(() => setValidationMessage(''), 8000);
                return;
            }
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
            adultos: appliedFilters.adultos > 0 ? appliedFilters.adultos.toString() : '2',
            ninos: appliedFilters.ninos.toString(),
            ninosEdades: appliedFilters.ninosEdades.join(','),
            habitacion: details,
            desayuno: hasDesayuno ? '1' : '0',
            almuerzo: hasAlmuerzo ? '1' : '0',
            cena: hasCena ? '1' : '0'
        });

        // PERSISTENCIA: Guardar en la base de datos antes de ir a WhatsApp/Contacto
        // Esto permite que el sistema "entienda" que la habitación está siendo reservada
        try {
            // Guardar cada ítem del carrito como una reserva individual
            const results = await Promise.all(cart.map(async (item) => {
                const response = await fetch('/api/reservas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        habitacion_id: item.habitacion.id,
                        fecha_entrada: fechaEntrada,
                        fecha_salida: fechaSalida,
                        nombre_cliente: 'Cliente Web (WhatsApp)',
                        meta: {
                            comidas: item.comidas,
                            adultos: appliedFilters.adultos,
                            ninos: appliedFilters.ninos,
                            ninosEdades: appliedFilters.ninosEdades,
                            total_items: cart.length
                        }
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al reservar');
                }
                return response;
            }));

            // Solo si todo salió bien, redirigimos
            router.push(`/contacto?${params.toString()}#formulario-contacto`);
        } catch (dbError: any) {
            console.error('Error al persistir reserva en la DB:', dbError);
            setValidationMessage(dbError.message || 'La habitación seleccionada ya no está disponible. Por favor intente con otras fechas.');

            // Scroll to error message
            window.scrollTo({ top: 300, behavior: 'smooth' });

            // Clear message after delay
            setTimeout(() => setValidationMessage(''), 8000);
        }
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
                <div className="relative h-[60vh] min-h-[400px] bg-gray-900 flex items-center justify-center overflow-hidden">
                    <Image
                        src="/images/habitaciones/triple-main.webp"
                        alt="Habitaciones Hotel El Cardenal"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-70"
                        priority
                        quality={75}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
                    <div className="relative z-10 text-center text-white px-4">
                        <h1 className="text-4xl md:text-7xl font-bold mb-6 font-serif uppercase tracking-tighter drop-shadow-2xl">Reserva tu Habitación</h1>
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
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-7 gap-2 md:gap-4 items-end">
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

                            {/* Habitaciones */}
                            <div className="col-span-1">
                                <label className="hidden md:flex text-[10px] md:text-sm font-bold text-gray-700 mb-1 md:mb-2 items-center gap-1 md:gap-2">
                                    <Bed className="w-3 h-3 md:w-4 md:h-4 text-amber-500" /> Hab.
                                </label>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleHabitacionesChange(Math.max(1, filtroHabitaciones - 1))}
                                        className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                        type="button"
                                    >
                                        <Minus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                    </button>
                                    <span className="w-5 md:w-10 text-center font-bold text-gray-800 text-[10px] md:text-base">{filtroHabitaciones}</span>
                                    <button
                                        onClick={() => handleHabitacionesChange(Math.min(6, filtroHabitaciones + 1))}
                                        className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                        type="button"
                                    >
                                        <Plus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Adultos */}
                            <div className="col-span-1">
                                <label className="hidden md:flex text-[10px] md:text-sm font-bold text-gray-700 mb-1 md:mb-2 items-center gap-1 md:gap-2">
                                    <Users className="w-3 h-3 md:w-4 md:h-4 text-amber-500" /> Ad.
                                </label>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleAdultosChange(Math.max(0, filtroAdultos - 1))}
                                        className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                        type="button"
                                    >
                                        <Minus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                    </button>
                                    <span className="w-5 md:w-10 text-center font-bold text-gray-800 text-[10px] md:text-base">{filtroAdultos}</span>
                                    <button
                                        onClick={() => handleAdultosChange(filtroAdultos === 0 ? 1 : Math.min(18, filtroAdultos + 1))}
                                        className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                        type="button"
                                    >
                                        <Plus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Niños */}
                            <div className="col-span-1 min-w-[120px]">
                                <label className="hidden md:flex text-[10px] md:text-sm font-bold text-gray-700 mb-1 md:mb-2 items-center gap-1 md:gap-2">
                                    <Users className="w-3 h-3 md:w-4 md:h-4 text-amber-500" /> Ni.
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleNinosChange(Math.max(0, filtroNinos - 1))}
                                            className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                            type="button"
                                        >
                                            <Minus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                        </button>
                                        <span className="w-5 md:w-10 text-center font-bold text-gray-800 text-[10px] md:text-base">{filtroNinos}</span>
                                        <button
                                            onClick={() => handleNinosChange(Math.min(18, filtroNinos + 1))}
                                            className="p-1 md:p-2 bg-gray-100 md:bg-gray-200 hover:bg-amber-500 hover:text-white rounded transition-all"
                                            type="button"
                                        >
                                            <Plus className="w-2.5 h-2.5 md:w-4 md:h-4" />
                                        </button>
                                    </div>

                                    {/* Inline Guest Ages Input */}
                                    {filtroNinos > 0 && (
                                        <div className="flex flex-col animate-slideDown">
                                            <div className="flex flex-wrap gap-1">
                                                {ninosEdades.map((edad, idx) => (
                                                    <select
                                                        key={idx}
                                                        value={edad}
                                                        onChange={(e) => {
                                                            const newEdades = [...ninosEdades];
                                                            newEdades[idx] = parseInt(e.target.value);
                                                            setNinosEdades(newEdades);
                                                        }}
                                                        className="border border-gray-300 rounded px-1 py-0.5 text-[10px] focus:border-amber-500 outline-none bg-white"
                                                    >
                                                        {[...Array(18)].map((_, i) => (
                                                            <option key={i} value={i}>{i} años</option>
                                                        ))}
                                                    </select>
                                                ))}
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 bg-amber-50 border border-amber-300 rounded px-2 py-1">
                                                <Info className="w-3 h-3 text-amber-500 shrink-0" />
                                                <p className="text-[11px] md:text-xs font-bold text-amber-700 leading-tight">
                                                    {childAgeThreshold}+ años = <span className="text-red-600">Adulto</span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Botón Aplicar */}
                            <div className="col-span-1 xs:col-span-2 md:col-span-2 flex gap-2">
                                <button
                                    onClick={handleAplicarFiltros}
                                    className="flex-1 bg-cardenal-gold hover:bg-cardenal-green text-white font-bold py-2 md:py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group tracking-widest text-xs md:text-sm"
                                >
                                    <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                                    APLICAR
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Suggestion bar - inside sticky so it stays visible on scroll */}
                    {appliedFilters.ninos > 0 && getCombinacionSugerida(appliedFilters.adultos, appliedFilters.ninos, appliedFilters.habitaciones) && (
                        <div className="container mx-auto px-4 pb-3">
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-4 py-2 animate-slideDown">
                                <span className="text-amber-700 font-bold text-xs md:text-sm">
                                    💡 {getCombinacionSugerida(appliedFilters.adultos, appliedFilters.ninos, appliedFilters.habitaciones)}
                                </span>
                            </div>
                        </div>
                    )}

                </div>

                {/* Filter Results Info */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 shadow-sm border border-cardenal-gold/10">
                        <div className="text-cardenal-green font-medium text-lg md:text-xl w-full">


                            {(appliedFilters.adultos > 0 || appliedFilters.ninos > 0) ? (
                                <>
                                    {(appliedFilters.adultos + appliedFilters.ninos > 4 || appliedFilters.habitaciones > 1) ? (
                                        <div className="flex flex-col gap-2">
                                            <span>
                                                <span className="font-serif italic text-cardenal-gold mr-2 text-2xl">Recomendación Exclusiva:</span>
                                                Para su grupo de <span className="font-bold text-gray-800">{appliedFilters.adultos} adultos y {appliedFilters.ninos} niños</span> en <span className="font-bold text-gray-800">{appliedFilters.habitaciones} habitaciones</span>, le sugerimos <span className="font-bold text-cardenal-green">seleccionar múltiples opciones</span> y agregarlas a su reserva.
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            {habitacionesFiltradas.length > 0 ? (
                                                <>
                                                    Hemos encontrado <span className="font-bold text-gray-800">{habitacionesFiltradas.length}</span> opciones ideales para su grupo de {appliedFilters.adultos} adultos y {appliedFilters.ninos} niños.
                                                </>
                                            ) : (
                                                <span className="text-red-500">
                                                    Lo sentimos, no hay habitaciones individuales disponibles para {appliedFilters.adultos + appliedFilters.ninos} personas en las fechas seleccionadas. <br />
                                                    <span className="text-cardenal-green font-bold text-base">💡 Sugerencia: Intente reservar 2 habitaciones separadas ajustando el filtro de Habitaciones.</span>
                                                </span>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    Mostrando <span className="font-bold text-amber-500 text-2xl px-2">{habitacionesFiltradas.length}</span> habitaciones exclusivas
                                </>
                            )}
                        </div>
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

                                    // Order by room type: Matrimonial, Doble, Triple
                                    let p = 4;

                                    if (n.includes('matrimonial')) p = 1;
                                    else if (n.includes('doble')) p = 2;
                                    else if (n.includes('triple')) p = 3;

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
                                                            src={habitacion.imagen || '/placeholder.jpg'}
                                                            alt={habitacion.nombre}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                                            quality={75}
                                                        />
                                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>

                                                        {/* Availability Badge */}
                                                        <div className={cn(
                                                            "absolute top-4 left-4 px-4 py-2 font-bold text-[10px] uppercase tracking-widest shadow-lg z-10",
                                                            habitacion.disponible ? "bg-cardenal-green text-white" : "bg-red-500 text-white"
                                                        )}>
                                                            {habitacion.disponible ? 'Disponible' : (habitacion.reservada ? 'Reservada' : 'Ocupada')}
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
                                                        {habitacion.ninosGratis !== undefined && habitacion.ninosGratis !== null && (
                                                            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 flex items-center gap-2">
                                                                <Users className="w-3 h-3" />
                                                                {habitacion.ninosGratis > 0 ? (
                                                                    <span>
                                                                        <strong>{habitacion.ninosGratis} niño{habitacion.ninosGratis > 1 ? 's' : ''} gratis</strong>
                                                                        {typeof habitacion.precioNinoExtra === 'number' && habitacion.precioNinoExtra > 0 && (
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
                                                                Agrega tu estancia con:
                                                            </p>
                                                            <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                                                                {([
                                                                    { key: 'desayuno', label: 'Desayuno', included: habitacion.incluyeDesayuno, price: mealSettings.breakfast },
                                                                    { key: 'almuerzo', label: 'Almuerzo', included: habitacion.incluyeAlmuerzo, price: mealSettings.lunch },
                                                                    { key: 'cena', label: 'Cena', included: habitacion.incluyeCena, price: mealSettings.dinner }
                                                                ] as const).map(({ key, label, included, price }) => (
                                                                    <button
                                                                        key={key}
                                                                        onClick={() => {
                                                                            // Only toggle if not included. Included means always ON.
                                                                            if (!included) toggleMeal(habitacion.id, key as any);
                                                                        }}
                                                                        disabled={!!included}
                                                                        className={cn(
                                                                            "relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded border transition-all duration-300 min-h-[56px]",
                                                                            included
                                                                                ? "bg-green-100 border-green-300 text-green-800 cursor-default"
                                                                                : (pendingMeals[habitacion.id]?.[key as 'desayuno' | 'almuerzo' | 'cena']
                                                                                    ? "bg-cardenal-gold text-white border-cardenal-gold shadow-md transform scale-105"
                                                                                    : "bg-white border-gray-200 text-gray-600 hover:border-cardenal-gold hover:text-cardenal-gold")
                                                                        )}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            {included ? (
                                                                                <Check className="w-3 h-3" />
                                                                            ) : (
                                                                                <div className={cn(
                                                                                    "w-3 h-3 rounded-full border border-current flex items-center justify-center transition-colors",
                                                                                    pendingMeals[habitacion.id]?.[key as 'desayuno' | 'almuerzo' | 'cena'] ? "bg-white/20" : "bg-transparent"
                                                                                )}>
                                                                                    {pendingMeals[habitacion.id]?.[key as 'desayuno' | 'almuerzo' | 'cena'] && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                                </div>
                                                                            )}
                                                                            <span className="text-[11px] font-black uppercase tracking-wider">{label}</span>
                                                                        </div>
                                                                        {!included && <span className="text-xs font-black text-gray-900">${price.toFixed(2)} c/u</span>}
                                                                        {included && <span className="text-[10px] bg-green-200 text-green-800 px-1.5 py-0.5 rounded font-black">Incluido</span>}
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

                                                                    if (cart.length >= appliedFilters.habitaciones) {
                                                                        setValidationMessage(`Ya tienes las ${appliedFilters.habitaciones} habitaciones de tu búsqueda. Quita una para agregar otra.`);
                                                                        setTimeout(() => setValidationMessage(''), 6000);
                                                                        return;
                                                                    }

                                                                    setAvailabilityRoom(habitacion);
                                                                }}
                                                                disabled={!habitacion.disponible}
                                                                className={cn(
                                                                    "flex-1 font-bold py-4 px-4 transition-all duration-300 flex items-center justify-center gap-2 tracking-[0.2em] text-xs shadow-md",
                                                                    habitacion.disponible
                                                                        ? (fechaEntrada && fechaSalida && (filtroAdultos + filtroNinos) > 0
                                                                            ? (cart.length >= appliedFilters.habitaciones
                                                                                ? "bg-gray-400 border-2 border-gray-400 text-white cursor-not-allowed"
                                                                                : "bg-cardenal-gold border-2 border-cardenal-gold text-white hover:bg-white hover:text-cardenal-gold")
                                                                            : "bg-amber-100 border-2 border-amber-200 text-amber-700 hover:bg-amber-200")
                                                                        : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                                                                )}
                                                            >
                                                                {habitacion.disponible ? (
                                                                    cart.length >= appliedFilters.habitaciones ? (
                                                                        <>
                                                                            <ShoppingCart className="w-4 h-4" />
                                                                            LÍMITE: {appliedFilters.habitaciones} HAB.
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Plus className="w-4 h-4" />
                                                                            AGREGAR
                                                                        </>
                                                                    )
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
                        onAddToCart={(hab) => {
                            addToCart(hab);
                            setSelectedRoom(null);
                        }}
                        isAlreadyInCart={cart.some(item => item.habitacion.id === selectedRoom.id)}
                    />
                )}

                {/* Room Availability Modal - Booking style */}
                {availabilityRoom && (
                    <RoomAvailabilityModal
                        habitacion={availabilityRoom}
                        inventoryCount={(() => {
                            const type = getRoomType(availabilityRoom.nombre);
                            // All available rooms of this type
                            const availableOfType = habitaciones.filter(h => getRoomType(h.nombre) === type && h.disponible);
                            // Rooms of this type already in cart
                            const inCartTypeIds = cart
                                .filter(item => getRoomType(item.habitacion.nombre) === type)
                                .map(item => item.habitacion.id);

                            // Remaining available rooms of this type
                            return Math.max(0, availableOfType.filter(h => !inCartTypeIds.includes(h.id)).length);
                        })()}
                        currentCartSize={cart.length}
                        maxRoomsFromFilter={appliedFilters.habitaciones}
                        initialOccupancy={
                            availabilityRoom.nombre.toLowerCase().includes('matrimonial')
                                ? appliedFilters.adultos + appliedFilters.ninosEdades.length
                                : appliedFilters.adultos +
                                (childPricingPolicy === 'adult'
                                    ? appliedFilters.ninosEdades.length
                                    : appliedFilters.ninosEdades.filter(age => age >= childAgeThreshold).length)
                        }
                        fechaEntrada={appliedFilters.entrada}
                        fechaSalida={appliedFilters.salida}
                        onClose={() => setAvailabilityRoom(null)}
                        initialMeals={pendingMeals[availabilityRoom.id]}
                        childAgeThreshold={childAgeThreshold}
                        childPricingPolicy={childPricingPolicy}
                        childFixedPrice={childFixedPrice}
                        ninosEdades={appliedFilters.ninosEdades}
                        mealSettings={mealSettings}
                        onAddToCart={(hab, cantidad, opciones) => {
                            const type = getRoomType(hab.nombre);

                            // 1. Guardar comidas pendientes para la habitación principal abierta
                            setPendingMeals(prev => ({
                                ...prev,
                                [hab.id]: {
                                    desayuno: opciones.desayuno,
                                    almuerzo: opciones.almuerzo,
                                    cena: opciones.cena
                                }
                            }));

                            // 2. Identificar habitaciones candidatas (del mismo tipo y disponibles)
                            const inCartIds = cart.map(item => item.habitacion.id);
                            const possibleRooms = habitaciones.filter(h =>
                                getRoomType(h.nombre) === type &&
                                h.disponible &&
                                !inCartIds.includes(h.id)
                            );

                            // 3. Tomar las N seleccionadas (incluyendo la actual si no estaba)
                            const roomsToAdd = possibleRooms.slice(0, cantidad);

                            // 4. Agregarlas al carrito
                            const mealsFromModal = {
                                desayuno: opciones.desayuno,
                                almuerzo: opciones.almuerzo,
                                cena: opciones.cena
                            };
                            roomsToAdd.forEach(room => {
                                // Copiar comidas a las otras habitaciones del mismo tipo
                                setPendingMeals(prev => ({
                                    ...prev,
                                    [room.id]: mealsFromModal
                                }));
                                // Pass meals AND personas directly to avoid stale state or global filter issues
                                addToCart(room, mealsFromModal, opciones.personas);
                            });

                            setAvailabilityRoom(null);
                        }}
                    />
                )}

                {/* Floating Bottom Cart Notification */}
                {cart.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[50] w-full max-w-2xl px-4 animate-fadeInUp">
                        <div className="bg-cardenal-green text-white p-4 md:p-6 shadow-2xl rounded-2xl border-2 border-cardenal-gold flex flex-col gap-4">
                            {/* Items List (Small dots or summary) */}
                            <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2 group animate-fadeIn">
                                        <span className="text-xs font-bold text-cardenal-gold flex items-center gap-1">
                                            <Bed className="w-3.5 h-3.5" />
                                            {item.habitacion.nombre}
                                        </span>
                                        <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded text-white">
                                            {item.adultos + (item.ninosEdades?.length || 0)} pers.
                                        </span>
                                        <button
                                            onClick={() => removeFromCart(idx)}
                                            className="hover:text-red-400 transition-colors p-0.5 rounded-full hover:bg-white/10"
                                            title="Quitar"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl">
                                        <ShoppingCart className="w-6 h-6 text-cardenal-gold" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg leading-tight">
                                            {cart.reduce((total, item) => total + item.cantidad, 0)} {cart.length === 1 && cart[0].cantidad === 1 ? 'Habitación seleccionada' : 'Habitaciones seleccionadas'}
                                        </p>
                                        <p className="text-white/80 text-sm font-medium">
                                            Total estimado: <span className="text-cardenal-gold font-bold text-base">US${calcularTotal().toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        let adultosEfectivos = appliedFilters.adultos + appliedFilters.ninosEdades.filter(age => age >= childAgeThreshold).length;
                                        let ninosEfectivos = appliedFilters.ninosEdades.filter(age => age < childAgeThreshold).length;

                                        if (childPricingPolicy === 'adult') {
                                            adultosEfectivos = appliedFilters.adultos + appliedFilters.ninos;
                                            ninosEfectivos = 0;
                                        }

                                        let capacidadAdultosTotal = 0;
                                        let capacidadNinosTotal = 0;
                                        cart.forEach(item => {
                                            const maxA = Number(item.habitacion.capacidad.maxAdultos) || 0;
                                            const maxN = Number(item.habitacion.capacidad.maxNiños) || 0;

                                            capacidadAdultosTotal += maxA * item.cantidad;
                                            capacidadNinosTotal += maxN * item.cantidad;
                                        });

                                        if (capacidadAdultosTotal < adultosEfectivos) {
                                            const thresholdTexto = childAgeThreshold ? ` (incluye niños de ${childAgeThreshold}+ años)` : '';
                                            setValidationMessage(`Debe seleccionar habitaciones con capacidad suficiente para ${adultosEfectivos} adultos${thresholdTexto}.`);
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                            setTimeout(() => setValidationMessage(''), 6000);
                                            return;
                                        }

                                        const espaciosLibresAdultos = capacidadAdultosTotal - adultosEfectivos;
                                        if ((espaciosLibresAdultos + capacidadNinosTotal) < ninosEfectivos) {
                                            setValidationMessage(`Debe seleccionar habitaciones adicionales con capacidad para alojar a los niños pequeños.`);
                                            window.scrollTo({ top: 300, behavior: 'smooth' });
                                            setTimeout(() => setValidationMessage(''), 6000);
                                            return;
                                        }

                                        localStorage.setItem('pendingCheckoutCart', JSON.stringify(cart));

                                        // Clear stale session IDs for new checkout
                                        localStorage.removeItem('savedReservaId');
                                        localStorage.removeItem('clientTxId');

                                        // Compatibility fallback: save the first item as the "single" item
                                        const firstItem = cart[0];
                                        const noches = (() => {
                                            if (!fechaEntrada || !fechaSalida) return 1;
                                            const start = new Date(fechaEntrada);
                                            const end = new Date(fechaSalida);
                                            return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                                        })();

                                        localStorage.setItem('pendingCheckout', JSON.stringify({
                                            habitacion: firstItem.habitacion,
                                            option: firstItem.opcionPrecio,
                                            cantidad: cart.length,
                                            fechaEntrada,
                                            fechaSalida,
                                            comidas: firstItem.comidas,
                                            adultos: firstItem.adultos,
                                            ninos: firstItem.ninos,
                                            ninosEdades: firstItem.ninosEdades,
                                            childPricingPolicy,
                                            childFixedPrice,
                                            childAgeThreshold,
                                            isMultiRoom: cart.length > 1
                                        }));

                                        window.location.href = '/checkout';
                                    }}
                                    className="w-full md:w-auto bg-cardenal-gold hover:bg-white hover:text-cardenal-green text-cardenal-green-dark font-black py-3 px-8 rounded-xl transition-all duration-300 shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
                                >
                                    Finalizar Reserva
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
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
                {/* Test Payment Button (Hidden/Dev) */}
                {/* <div className="py-8 bg-cardenal-cream/30 flex justify-center opacity-70 hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => {
                            const params = new URLSearchParams({
                                amount: '1.00',
                                description: 'PRUEBA PayPhone $1.00 TEST',
                                reserva: `PRUEBA-${Date.now()}`,
                                email: 'test@example.com',
                                nombre: 'Usuario Prueba',
                                entrada: new Date().toISOString().split('T')[0],
                                salida: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                habitacion_id: '0',
                                habitacion_nombre: 'HABITACIÓN DE PRUEBA',
                                adultos: '1',
                                whatsapp: '+593999999999',
                                reserva_para: 'mi',
                                pais: 'Ecuador',
                                peticiones: 'Esta es una prueba de pago de $1.00'
                            });
                            // Using window.location to force full reload if needed, or router.push
                            window.location.href = `/checkout/pagos?${params.toString()}`;
                        }}
                        className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-cardenal-gold border border-gray-300 hover:border-cardenal-gold px-4 py-2 rounded-full transition-all"
                    >
                        ⚡ Test PayPhone $1.00
                    </button>
                </div> */}

                <Footer />
            </div>
        }>
            <HabitacionesContent />
        </Suspense>
    );
}
