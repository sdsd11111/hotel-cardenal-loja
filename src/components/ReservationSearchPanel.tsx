'use client';

import React from 'react';
import { Calendar, Plus, Minus, Filter, ShoppingCart } from 'lucide-react';

interface ReservationSearchPanelProps {
    // Date state
    fechaEntrada: string;
    fechaSalida: string;
    onFechaEntradaChange: (fecha: string) => void;
    onFechaSalidaChange: (fecha: string) => void;

    // Filter state (adults/children)
    adultos: number;
    ninos: number;
    onAdultosChange: (cantidad: number) => void;
    onNinosChange: (cantidad: number) => void;

    // Cart state
    cartCount: number;
    cartItemsTotal: number;
    onCartClick: () => void;

    // Optional customization
    showCart?: boolean;
    sticky?: boolean;
    className?: string;
}

export default function ReservationSearchPanel({
    fechaEntrada,
    fechaSalida,
    onFechaEntradaChange,
    onFechaSalidaChange,
    adultos,
    ninos,
    onAdultosChange,
    onNinosChange,
    cartCount,
    cartItemsTotal,
    onCartClick,
    showCart = true,
    sticky = true,
    className = ''
}: ReservationSearchPanelProps) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className={`bg-white border-b-4 border-amber-500 shadow-lg ${sticky ? 'sticky top-0' : ''} z-40 ${className}`}>
            <div className="container mx-auto px-4 py-6">
                <div className={`grid grid-cols-1 gap-4 items-end ${showCart ? 'md:grid-cols-6' : 'md:grid-cols-4'}`}>
                    {/* Check-in */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Entrada
                        </label>
                        <input
                            type="date"
                            value={fechaEntrada}
                            onChange={(e) => onFechaEntradaChange(e.target.value)}
                            min={today}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                        />
                    </div>

                    {/* Check-out */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Salida
                        </label>
                        <input
                            type="date"
                            value={fechaSalida}
                            onChange={(e) => onFechaSalidaChange(e.target.value)}
                            min={fechaEntrada || today}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                        />
                    </div>

                    {/* Adults */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <Filter className="w-4 h-4 inline mr-1" />
                            Adultos
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onAdultosChange(Math.max(0, adultos - 1))}
                                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                type="button"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold">{adultos}</span>
                            <button
                                onClick={() => onAdultosChange(Math.min(18, adultos + 1))}
                                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                type="button"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Children */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            <Filter className="w-4 h-4 inline mr-1" />
                            Niños
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onNinosChange(Math.max(0, ninos - 1))}
                                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                type="button"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold">{ninos}</span>
                            <button
                                onClick={() => onNinosChange(Math.min(18, ninos + 1))}
                                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                                type="button"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Cart/Search Button */}
                    {showCart ? (
                        <div className="md:col-span-2">
                            <button
                                onClick={onCartClick}
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 relative"
                                type="button"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Carrito ({cartCount})
                                {cartItemsTotal > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                        {cartItemsTotal}
                                    </span>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="md:col-span-2">
                            <button
                                onClick={onCartClick}
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                type="button"
                            >
                                RESERVAR
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
