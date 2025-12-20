'use client';

import React from 'react';
import Image from 'next/image';
import { Habitacion } from '@/types';
import {
    X, Check, Bed, Coffee, Briefcase, Wifi, Users, Tv, Car, Bath, Wind,
    ConciergeBell, Award, Eye, Droplets, Sofa, Sparkles, Plus, ArrowRight
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

interface RoomDetailsModalProps {
    habitacion: Habitacion;
    onClose: () => void;
    onAddToCart: (habitacion: Habitacion) => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ habitacion, onClose, onAddToCart }) => {
    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-cardenal-cream border border-cardenal-gold/20 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-cardenal-green text-white p-3 hover:bg-cardenal-gold transition-colors shadow-xl"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 relative h-64 md:h-auto min-h-[400px]">
                    <Image
                        src={habitacion.imagen ? (habitacion.imagen.startsWith('/api') ? `${habitacion.imagen}${habitacion.imagen.includes('?') ? '&' : '?'}v=${Date.now()}` : habitacion.imagen) : '/placeholder.jpg'}
                        alt={habitacion.nombre}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    <div className="absolute bottom-0 left-0 bg-cardenal-green text-white px-8 py-4 font-serif font-bold italic text-xl shadow-2xl">
                        {habitacion.precio}
                    </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-6 xs:p-10 md:p-14 flex flex-col bg-white">
                    <div className="mb-8">
                        <h2 className="text-2xl xs:text-3xl md:text-5xl font-bold text-cardenal-green mb-4 font-serif tracking-tight">
                            {habitacion.nombre}
                        </h2>
                        <div className="w-20 h-1.5 bg-cardenal-gold mb-6"></div>
                        <p className="text-base xs:text-lg md:text-xl text-text-muted leading-relaxed font-medium italic mb-2">
                            Experiencia Cardenal Loja
                        </p>
                        <p className="text-sm xs:text-lg text-text-main leading-relaxed">
                            {habitacion.descripcion}
                        </p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-[10px] font-bold text-cardenal-green/60 uppercase tracking-[0.2em] xs:tracking-[0.3em] mb-4 font-serif flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-cardenal-gold" />
                            Amenidades Exclusivas
                        </h3>
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-3">
                            {habitacion.amenidades.map((amenidad, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-cardenal-green font-bold text-xs xs:text-sm tracking-wide group">
                                    <div className="text-cardenal-gold group-hover:scale-110 transition-transform">
                                        {amenidadesIconos[amenidad] || <Check className="w-5 h-5" />}
                                    </div>
                                    <span>{amenidad}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8 p-4 xs:p-6 bg-cardenal-cream/40 border border-cardenal-gold/10">
                        <h3 className="text-[10px] font-bold text-cardenal-green/60 uppercase tracking-[0.2em] mb-4 font-serif">
                            Detalles de Estancia
                        </h3>
                        <div className="flex gap-4 xs:gap-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-cardenal-green font-serif">{habitacion.capacidad.maxAdultos}</span>
                                <span className="text-[10px] uppercase tracking-widest text-cardenal-gold font-bold">Adultos</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-cardenal-green font-serif">{habitacion.capacidad.maxNiños}</span>
                                <span className="text-[10px] uppercase tracking-widest text-cardenal-gold font-bold">Niños</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-cardenal-green font-serif">{habitacion.capacidad.camas}</span>
                                <span className="text-[10px] uppercase tracking-widest text-cardenal-gold font-bold">{habitacion.capacidad.camas === 1 ? 'Cama' : 'Camas'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-10 border-t border-gray-100">
                        <button
                            onClick={() => {
                                onAddToCart(habitacion);
                                onClose();
                            }}
                            className="w-full bg-cardenal-green hover:bg-cardenal-gold text-white font-bold py-5 px-10 transition-all duration-500 shadow-xl flex items-center justify-center gap-4 tracking-widest uppercase text-sm font-serif"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar a mi Reserva
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
