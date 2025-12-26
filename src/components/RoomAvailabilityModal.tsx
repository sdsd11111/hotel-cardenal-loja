'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Habitacion } from '@/types';
import {
    X, Check, Bed, Coffee, Briefcase, Wifi, Users, Tv, Car, Bath, Wind,
    ConciergeBell, Award, Eye, Droplets, Sofa, Sparkles, AlertCircle,
    Mountain, Building, Waves, MapPin, Toilet, ShowerHead, TreeDeciduous,
    Plug, SprayCan, CircleParking, Video, Armchair, Footprints, Hand, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Iconos de amenidades
const amenidadesIconos: Record<string, React.ReactNode> = {
    'Cama King': <Bed className="w-4 h-4" />,
    'Cama Queen': <Bed className="w-4 h-4" />,
    'Vistas': <Eye className="w-4 h-4" />,
    'Vistas al lago': <Eye className="w-4 h-4" />,
    'Vistas a la montaña': <Mountain className="w-4 h-4" />,
    'Vistas a la ciudad': <Building className="w-4 h-4" />,
    'Vistas al río': <Waves className="w-4 h-4" />,
    'Vistas a un lugar de interés': <MapPin className="w-4 h-4" />,
    'Escritorio': <Briefcase className="w-4 h-4" />,
    'Cafetera': <Coffee className="w-4 h-4" />,
    '2 Camas': <Users className="w-4 h-4" />,
    'TV Grande': <Tv className="w-4 h-4" />,
    'TV de pantalla plana': <Tv className="w-4 h-4" />,
    'Baño Amplio': <Bath className="w-4 h-4" />,
    'Baño en la habitación': <Bath className="w-4 h-4" />,
    'Bañera o ducha': <ShowerHead className="w-4 h-4" />,
    'Parqueo': <Car className="w-4 h-4" />,
    'Climatización': <Wind className="w-4 h-4" />,
    'Servicio': <ConciergeBell className="w-4 h-4" />,
    'Amenities': <Sparkles className="w-4 h-4" />,
    'Artículos de aseo gratis': <Sparkles className="w-4 h-4" />,
    'Jacuzzi': <Droplets className="w-4 h-4" />,
    'Balcón': <Eye className="w-4 h-4" />,
    'Mini-Bar': <Award className="w-4 h-4" />,
    'Tres Camas': <Users className="w-4 h-4" />,
    'Sofá': <Sofa className="w-4 h-4" />,
    'Diseño Moderno': <Sparkles className="w-4 h-4" />,
    'WiFi': <Wifi className="w-4 h-4" />,
    'WiFi gratis': <Wifi className="w-4 h-4" />,
    'WC': <Toilet className="w-4 h-4" />,
    'Suelo de madera o parquet': <TreeDeciduous className="w-4 h-4" />,
    'Toallas': <Bath className="w-4 h-4" />,
    'Enchufe cerca de la cama': <Plug className="w-4 h-4" />,
    'Productos de limpieza': <SprayCan className="w-4 h-4" />,
    'Zona de estar': <Armchair className="w-4 h-4" />,
    'Video': <Video className="w-4 h-4" />,
    'Vídeo': <Video className="w-4 h-4" />,
    'TV': <Tv className="w-4 h-4" />,
    'Canales por cable': <Tv className="w-4 h-4" />,
    'Armario': <Award className="w-4 h-4" />,
    'Perchero': <Award className="w-4 h-4" />,
    'Papel higiénico': <Toilet className="w-4 h-4" />,
    'Desinfectante de manos': <Hand className="w-4 h-4" />,
    'Detector de monóxido de carbono': <AlertTriangle className="w-4 h-4" />,
};

interface RoomAvailabilityModalProps {
    habitacion: Habitacion;
    initialOccupancy: number; // Added to filter options
    fechaEntrada?: string;
    fechaSalida?: string;
    onClose: () => void;
    onAddToCart: (habitacion: Habitacion, cantidad: number, opciones: {
        desayuno: boolean;
        almuerzo: boolean;
        cena: boolean;
        personas: number;
    }) => void;
}

// Opciones de precio basadas en número de personas
interface PriceOption {
    personas: number;
    personasIconos: number;
    precioBase: number;
    impuestos: number;
    incluye: string[];
}

export const RoomAvailabilityModal: React.FC<RoomAvailabilityModalProps> = ({
    habitacion,
    initialOccupancy,
    fechaEntrada,
    fechaSalida,
    onClose,
    onAddToCart
}) => {
    const [config, setConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selections, setSelections] = useState<Record<number, number>>({});
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showCheckoutSummary, setShowCheckoutSummary] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ option: PriceOption, cantidad: number } | null>(null);
    const [selectedMeals, setSelectedMeals] = useState<Record<number, { desayuno: boolean, almuerzo: boolean, cena: boolean }>>({});

    // Initialize meals logic
    useEffect(() => {
        if (!config) return;
        const initialMeals: Record<number, { desayuno: boolean, almuerzo: boolean, cena: boolean }> = {};
        const options = config.price_options_json as PriceOption[];
        options.forEach((_, idx) => {
            initialMeals[idx] = {
                desayuno: habitacion.incluyeDesayuno || false,
                almuerzo: habitacion.incluyeAlmuerzo || false,
                cena: habitacion.incluyeCena || false
            };
        });
        setSelectedMeals(initialMeals);
    }, [config, habitacion]);

    const toggleMealSelection = (optionIdx: number, meal: 'desayuno' | 'almuerzo' | 'cena') => {
        setSelectedMeals(prev => ({
            ...prev,
            [optionIdx]: {
                ...prev[optionIdx],
                [meal]: !prev[optionIdx][meal]
            }
        }));
    };

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const nombreLower = habitacion.nombre.toLowerCase();
                let identifier = '303'; // Default to triple if unclear
                if (nombreLower.includes('301') || (!nombreLower.includes('302') && !nombreLower.includes('303') && habitacion.capacidad.maxAdultos <= 2)) identifier = '301';
                else if (nombreLower.includes('302')) identifier = '302';

                const response = await fetch('/api/admin/room-configs');
                if (response.ok) {
                    const data = await response.json();
                    const roomConfig = data.find((c: any) => c.identifier === identifier);
                    if (roomConfig) {
                        setConfig({
                            ...roomConfig,
                            price_options_json: JSON.parse(roomConfig.price_options_json),
                            amenities_json: JSON.parse(roomConfig.amenities_json),
                            images_json: JSON.parse(roomConfig.images_json),
                        });
                    }
                }
            } catch (err) {
                console.error('Error loading modal config:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [habitacion]);

    // Fallbacks if config not loaded or loading
    const isTriple = config ? config.identifier === '303' : habitacion.nombre.toLowerCase().includes('303');
    const isDobleTwin = config ? config.identifier === '302' : habitacion.nombre.toLowerCase().includes('302');
    const displayTitle = config ? config.display_title : habitacion.nombre;
    const roomSize = config ? config.room_size : (isTriple ? 30 : isDobleTwin ? 28 : 24);
    const hasBalcony = config ? config.has_balcony : isTriple;

    const finalPriceOptions = React.useMemo(() => {
        if (!config) return [];
        const options = config.price_options_json as PriceOption[];
        const filtered = options.filter(option => option.personas <= initialOccupancy);
        return filtered.length > 0 ? filtered : options;
    }, [config, initialOccupancy]);

    const amenidadesUnicas = config ? config.amenities_json as string[] : habitacion.amenidades;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSelectChange = (index: number, value: number) => {
        setSelections(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const handleHoverSummary = (option: PriceOption | null, cantidad: number = 0) => {
        if (option) {
            setSelectedOption({ option, cantidad });
            setShowCheckoutSummary(true);
        } else {
            setShowCheckoutSummary(false);
        }
    };

    const handleConfirmBooking = (option: PriceOption, index: number, cantidad: number) => {
        const meals = selectedMeals[index] || { desayuno: false, almuerzo: false, cena: false };
        const checkoutData = {
            habitacion,
            option: option,
            cantidad: cantidad,
            fechaEntrada,
            fechaSalida,
            comidas: meals
        };
        localStorage.setItem('pendingCheckout', JSON.stringify(checkoutData));

        onAddToCart(habitacion, cantidad, {
            ...meals,
            personas: option.personas
        });

        window.location.href = "/checkout";
    };

    const getNoches = () => {
        if (!fechaEntrada || !fechaSalida) return 1;
        const start = new Date(fechaEntrada);
        const end = new Date(fechaSalida);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(1, diff);
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'No definida';
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('es-EC', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getBedDescription = () => {
        if (isTriple) {
            return (
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-1">
                        <span>2 camas individuales</span>
                        <Bed className="w-4 h-4" />
                        <Bed className="w-4 h-4" />
                    </div>
                    <span>y</span>
                    <div className="flex items-center gap-1">
                        <span>1 cama doble grande</span>
                        <Bed className="w-6 h-6" />
                    </div>
                </div>
            );
        } else if (isDobleTwin) {
            return (
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-1">
                        <span>1 cama individual</span>
                        <Bed className="w-4 h-4" />
                    </div>
                    <span>y</span>
                    <div className="flex items-center gap-1">
                        <span>1 cama doble grande</span>
                        <Bed className="w-6 h-6" />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-1">
                        <span>1 cama doble grande</span>
                        <Bed className="w-6 h-6" />
                    </div>
                </div>
            );
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
            onClick={handleBackdropClick}
        >
            <div className="bg-white shadow-2xl w-full max-w-6xl my-8 relative animate-fadeIn">
                {/* Header */}
                <div className="bg-[#003580] text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Todas las habitaciones disponibles</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 bg-[#003580] text-white text-sm font-semibold">
                    <div className="col-span-4 px-4 py-3 border-r border-white/20">
                        Tipo de habitación
                    </div>
                    <div className="col-span-1 px-4 py-3 border-r border-white/20 text-center">
                        Personas
                    </div>
                    <div className="col-span-2 px-4 py-3 border-r border-white/20">
                        Tus opciones
                    </div>
                    <div className="col-span-1 px-4 py-3 border-r border-white/20 text-center">
                        Precio de hoy
                    </div>
                    <div className="col-span-1 px-4 py-3 border-r border-white/20 text-center">
                        Habitaciones
                    </div>
                    <div className="col-span-3 px-4 py-3 text-center">
                        Seleccionar
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12">
                    {/* Room Info Panel - Left Side */}
                    <div className="md:col-span-4 p-4 border-r border-gray-200 bg-gray-50">
                        {/* Room Name */}
                        <h3 className="text-[#0071c2] font-bold text-lg underline decoration-1 underline-offset-2 hover:text-[#003580] cursor-pointer mb-2">
                            {displayTitle}
                        </h3>

                        {/* Availability Warning */}
                        <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-medium">Nos quedan 2</span>
                        </div>

                        {/* Location */}
                        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                            <span>↑</span> Planta superior
                        </p>

                        {/* Beds Info - Dynamic based on room type */}
                        {getBedDescription()}

                        {/* Size & Balcony */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                                <span>📐</span> {roomSize} m²
                            </span>
                            {isTriple && (
                                <span className="flex items-center gap-1">
                                    <span>🏠</span> Balcón
                                </span>
                            )}
                        </div>

                        {/* Amenities List */}
                        <div className="space-y-1.5 text-sm">
                            {(showAllAmenities ? amenidadesUnicas : amenidadesUnicas.slice(0, 3)).map((amenidad, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-gray-700">
                                    <span className="text-green-600">
                                        {amenidadesIconos[amenidad] || <Check className="w-4 h-4" />}
                                    </span>
                                    <span>{amenidad}</span>
                                </div>
                            ))}
                            <button
                                onClick={() => setShowAllAmenities(!showAllAmenities)}
                                className="text-[#0071c2] hover:underline text-sm font-medium mt-2 flex items-center gap-1"
                            >
                                {showAllAmenities ? 'Menos' : `Ver las ${amenidadesUnicas.length} amenidades`}
                            </button>
                        </div>

                        {/* Room Image */}
                        <div className="mt-4 relative aspect-video rounded overflow-hidden">
                            <Image
                                src={habitacion.imagen ? (habitacion.imagen.startsWith('/api') ? `${habitacion.imagen}${habitacion.imagen.includes('?') ? '&' : '?'}v=${Date.now()}` : habitacion.imagen) : '/placeholder.jpg'}
                                alt={habitacion.nombre}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>

                    {/* Price Options - Right Side */}
                    <div className="md:col-span-8">
                        {finalPriceOptions.map((option, index) => {
                            const cantidadSeleccionada = selections[index] || 0;

                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "grid grid-cols-1 md:grid-cols-8 border-b border-gray-200 transition-colors",
                                        cantidadSeleccionada > 0 ? "bg-[#ebf3ff]" : "hover:bg-blue-50/30",
                                        index === 0 && cantidadSeleccionada === 0 && "bg-yellow-50/50"
                                    )}
                                >
                                    {/* Personas */}
                                    <div className="md:col-span-1 px-4 py-4 flex items-center justify-center border-r border-gray-200">
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: option.personasIconos }).map((_, i) => (
                                                <Users key={i} className="w-5 h-5 text-gray-700" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Opciones (Tus opciones) */}
                                    <div className="md:col-span-2 px-4 py-4 border-r border-gray-200 text-sm space-y-2">
                                        <div className="font-bold text-gray-900 mb-2">Tus opciones:</div>
                                        {option.incluye.map((item, i) => (
                                            <div key={i} className={cn(
                                                "flex items-start gap-1",
                                                i === 0 ? "text-green-700" : "text-green-600"
                                            )}>
                                                {i === 0 ? (
                                                    <>
                                                        <Coffee className="w-4 h-4 mt-0.5 shrink-0" />
                                                        <span>{item}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4 mt-0.5 shrink-0" />
                                                        <span>{item}</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        <div className="text-gray-600 text-xs">
                                            • Pagas al alojamiento antes de llegar
                                        </div>
                                    </div>

                                    {/* Precio de hoy (Nueva Columna) */}
                                    <div className="md:col-span-1 px-4 py-4 flex flex-col items-center justify-center border-r border-gray-200 text-center bg-gray-50/50">
                                        <div className="font-bold text-gray-400 mb-2 md:hidden">Precio:</div>
                                        <div className="text-xl font-bold text-gray-900 leading-tight">
                                            US${option.precioBase + option.impuestos}
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                            Incluye impuestos y cargos
                                        </div>
                                    </div>

                                    {/* Selector de cantidad */}
                                    <div className="md:col-span-1 px-4 py-4 flex flex-col items-center justify-start border-r border-gray-200">
                                        <div className="font-bold text-gray-400 mb-2 md:hidden">Habitaciones:</div>
                                        <select
                                            value={cantidadSeleccionada}
                                            onChange={(e) => handleSelectChange(index, parseInt(e.target.value))}
                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 outline-none mb-3"
                                        >
                                            {[0, 1, 2].map((i) => (
                                                <option key={i} value={i}>{i}</option>
                                            ))}
                                        </select>

                                        {cantidadSeleccionada > 0 && (
                                            <div className="w-full space-y-2 mt-2 border-t pt-2 border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Comidas extra:</p>
                                                <div className="flex flex-col gap-1.5">
                                                    {(['desayuno', 'almuerzo', 'cena'] as const).map((meal) => {
                                                        const isIncluded = meal === 'desayuno' ? habitacion.incluyeDesayuno :
                                                            meal === 'almuerzo' ? habitacion.incluyeAlmuerzo :
                                                                habitacion.incluyeCena;
                                                        const isSelected = selectedMeals[index]?.[meal];

                                                        return (
                                                            <button
                                                                key={meal}
                                                                onClick={() => !isIncluded && toggleMealSelection(index, meal)}
                                                                className={cn(
                                                                    "flex items-center gap-2 px-2 py-1 rounded text-[10px] font-bold transition-all",
                                                                    isSelected ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200"
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-3 h-3 rounded-full border border-current flex items-center justify-center",
                                                                    isSelected ? "bg-blue-600" : ""
                                                                )}>
                                                                    {isSelected && <Check className="w-2 h-2 text-white" />}
                                                                </div>
                                                                <span className="capitalize">{meal}</span>
                                                                {!isIncluded && !isSelected && <span className="ml-auto text-[8px] opacity-70">+$1</span>}
                                                                {isIncluded && <span className="ml-auto text-[8px] bg-green-200 text-green-700 px-1 rounded">INC</span>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Resumen de Selección (Dinámico según imagen 1) */}
                                    <div className="md:col-span-3 px-6 py-4 flex flex-col gap-1 bg-[#f9fbff] relative">
                                        {/* Summary Hover Tooltip (Small and relative to button - Now to the RIGHT) */}
                                        {showCheckoutSummary && selectedOption && selectedOption.option === option && (
                                            <div className="absolute left-[102%] top-0 z-[1000] w-64 bg-[#1a2b49] text-white shadow-2xl rounded-lg overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200 hidden md:block">
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-bold text-sm">Resumen de estancia</h4>
                                                    </div>

                                                    <div className="space-y-3 mb-4">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="opacity-70">Duración:</span>
                                                            <span className="font-bold">{getNoches()} {getNoches() === 1 ? 'noche' : 'noches'}</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-3 border-t border-white/10 pt-3">
                                                            <div>
                                                                <p className="text-[10px] font-bold opacity-60 uppercase mb-0.5">Entrada</p>
                                                                <p className="text-[11px] font-medium leading-tight">{formatDate(fechaEntrada)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold opacity-60 uppercase mb-0.5">Salida</p>
                                                                <p className="text-[11px] font-medium leading-tight">{formatDate(fechaSalida)}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="text-center text-[10px] opacity-60 italic border-t border-white/5 pt-3">
                                                        Haz clic para continuar al pago.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {cantidadSeleccionada > 0 ? (
                                            <div className="animate-fadeIn">
                                                <div className="text-sm text-gray-700 font-medium">
                                                    {cantidadSeleccionada} {cantidadSeleccionada === 1 ? 'habitación' : 'habitaciones'} por
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900 leading-tight">
                                                    US${((option.precioBase + option.impuestos) +
                                                        (Object.values(selectedMeals[index] || {}).filter((v, i) => {
                                                            const mealKeys = ['desayuno', 'almuerzo', 'cena'] as const;
                                                            const meal = mealKeys[i];
                                                            const isIncluded = meal === 'desayuno' ? habitacion.incluyeDesayuno :
                                                                meal === 'almuerzo' ? habitacion.incluyeAlmuerzo :
                                                                    habitacion.incluyeCena;
                                                            return v && !isIncluded;
                                                        }).length * 1)) * cantidadSeleccionada * getNoches()}
                                                </div>
                                                <div className="text-xs text-gray-500 mb-4">
                                                    Total por {getNoches()} {getNoches() === 1 ? 'noche' : 'noches'}
                                                </div>

                                                <button
                                                    onMouseEnter={() => handleHoverSummary(option, cantidadSeleccionada)}
                                                    onMouseLeave={() => handleHoverSummary(null)}
                                                    onClick={() => handleConfirmBooking(option, index, cantidadSeleccionada)}
                                                    className="w-full bg-[#0071c2] hover:bg-[#003580] text-white font-bold py-3 px-4 rounded transition-colors text-center shadow-md mb-3"
                                                >
                                                    Reservaré
                                                </button>

                                                <div className="text-[11px] text-gray-600 mb-4 font-medium flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                                    Todavía no se te cobrará nada
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="text-xs font-bold text-gray-900 border-t border-gray-100 pt-3 uppercase tracking-wider">Tu paquete:</div>

                                                    <div className="flex items-start gap-2 text-[11px] text-gray-700">
                                                        <Coffee className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="font-bold">Desayuno</span> incluido (Fantástico)
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2 text-[11px] text-gray-700">
                                                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="font-bold">Cancelación gratis</span> antes del 24 de diciembre de 2025
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-2 text-[11px] text-gray-700 pl-5">
                                                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 shrink-0" />
                                                        <div>Pagas al alojamiento antes de llegar</div>
                                                    </div>

                                                    <div className="flex items-start gap-2 text-[11px] text-green-700">
                                                        <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                        <div>Reembolso completo durante el plazo de cancelación gratis</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-gray-300 italic text-sm">
                                                Selecciona cantidad
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Overlay Resumen Post-Selección (Mobile fallback) */}
                {showCheckoutSummary && selectedOption && (
                    <div className="md:hidden absolute inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
                        <div className="bg-[#1a2b49] text-white w-full max-w-sm shadow-2xl overflow-hidden animate-scaleUp">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold">Resumen</h3>
                                    <button onClick={() => setShowCheckoutSummary(false)} className="text-white/60">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <p><span className="opacity-70">Habitación:</span> {displayTitle}</p>
                                    <p><span className="opacity-70">Noches:</span> {getNoches()}</p>
                                    <div className="flex justify-between">
                                        <span>Entrada: {formatDate(fechaEntrada)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Salida: {formatDate(fechaSalida)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Note */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <span>•</span>
                        <span>Todavía no se te cobrará nada</span>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};
