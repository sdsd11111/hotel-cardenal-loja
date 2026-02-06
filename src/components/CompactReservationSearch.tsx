'use client';

import React from 'react';
import { ChevronRight, Users, Plus, Minus } from 'lucide-react';

interface CompactReservationSearchProps {
    fechaEntrada: string;
    fechaSalida: string;
    onFechaEntradaChange: (fecha: string) => void;
    onFechaSalidaChange: (fecha: string) => void;
    adultos: number;
    ninos: number;
    onAdultosChange: (cantidad: number) => void;
    onNinosChange: (cantidad: number) => void;
    onReservarClick: () => void;
}

export default function CompactReservationSearch({
    fechaEntrada,
    fechaSalida,
    onFechaEntradaChange,
    onFechaSalidaChange,
    adultos,
    ninos,
    onAdultosChange,
    onNinosChange,
    onReservarClick
}: CompactReservationSearchProps) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="flex items-center gap-2 bg-white shadow-md px-3 py-2 border-2 border-cardenal-gold">
            {/* Check-in */}
            <div className="flex-shrink-0">
                <input
                    type="date"
                    value={fechaEntrada}
                    onChange={(e) => onFechaEntradaChange(e.target.value)}
                    min={today}
                    className="w-28 px-2 py-1 text-xs border border-cardenal-sand focus:border-cardenal-gold focus:outline-none font-sans font-bold text-cardenal-green"
                />
            </div>

            {/* Arrow */}
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />

            {/* Check-out */}
            <div className="flex-shrink-0">
                <input
                    type="date"
                    value={fechaSalida}
                    onChange={(e) => onFechaSalidaChange(e.target.value)}
                    min={fechaEntrada || today}
                    className="w-28 px-2 py-1 text-xs border border-cardenal-sand rounded focus:border-cardenal-gold focus:outline-none font-sans font-bold text-cardenal-green"
                />
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Adults */}
            <div className="flex items-center gap-1 bg-cardenal-cream px-2 py-1 rounded border border-cardenal-sand flex-shrink-0">
                <button
                    onClick={() => onAdultosChange(Math.max(0, adultos - 1))}
                    className="p-0.5 bg-cardenal-sand hover:bg-cardenal-gold hover:text-white rounded transition-colors"
                    type="button"
                >
                    <Minus className="w-2.5 h-2.5" />
                </button>
                <Users className="w-3 h-3 text-cardenal-green" />
                <span className="text-xs font-black min-w-[12px] text-center font-sans text-cardenal-green">{adultos}</span>
                <button
                    onClick={() => onAdultosChange(Math.min(10, adultos + 1))}
                    className="p-0.5 bg-cardenal-sand hover:bg-cardenal-gold hover:text-white rounded transition-colors"
                    type="button"
                >
                    <Plus className="w-2.5 h-2.5" />
                </button>
            </div>

            {/* Children */}
            <div className="flex items-center gap-1 bg-cardenal-cream px-2 py-1 rounded border border-cardenal-sand flex-shrink-0">
                <button
                    onClick={() => onNinosChange(Math.max(0, ninos - 1))}
                    className="p-0.5 bg-cardenal-sand hover:bg-cardenal-gold hover:text-white rounded transition-colors"
                    type="button"
                >
                    <Minus className="w-2.5 h-2.5" />
                </button>
                <Users className="w-2.5 h-2.5 text-cardenal-green" />
                <span className="text-xs font-black min-w-[12px] text-center font-sans text-cardenal-green">{ninos}</span>
                <button
                    onClick={() => onNinosChange(Math.min(10, ninos + 1))}
                    className="p-0.5 bg-cardenal-sand hover:bg-cardenal-gold hover:text-white rounded transition-colors"
                    type="button"
                >
                    <Plus className="w-2.5 h-2.5" />
                </button>
            </div>

            {/* Reserve Button */}
            <button
                onClick={onReservarClick}
                className="bg-cardenal-green hover:bg-cardenal-gold text-white font-bold text-xs py-2 px-6 transition-all duration-300 font-serif tracking-widest shadow-sm"
                type="button"
            >
                RESERVAR
            </button>
        </div>
    );
}
