'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Habitacion } from '@/types';
import {
    X, Check, Bed, Coffee, Wifi, Tv, Bath, Eye, Mountain, Building,
    MapPin, Sparkles, ChevronLeft, ChevronRight, Scaling
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomDetailBookingModalProps {
    habitacion: Habitacion;
    onClose: () => void;
    onAddToCart: (habitacion: Habitacion) => void;
}

// Imágenes por tipo de habitación
const getRoomImages = (roomName: string) => {
    const nombre = roomName.toLowerCase();

    if (nombre.includes('303') || nombre.includes('triple')) {
        return [
            '/images/habitaciones/triple/triple-main.webp',
            '/images/habitaciones/triple/triple-thumb.webp',
            '/images/habitaciones/triple/doble-twin-main.webp',
            '/images/habitaciones/triple/familiar-loft-main.webp',
            '/images/habitaciones/triple/matrimonial-main.webp',
        ];
    } else if (nombre.includes('302') || nombre.includes('2 camas') || nombre.includes('twin')) {
        return [
            '/images/habitaciones/doble/doble-twin-main.webp',
            '/images/habitaciones/doble/doble-twin-thumb.webp',
            '/images/habitaciones/doble/familiar-loft-main.webp',
            '/images/habitaciones/doble/matrimonial-main.webp',
            '/images/habitaciones/doble/triple-main.webp',
        ];
    } else {
        // Matrimonial / Doble simple (301)
        return [
            '/images/habitaciones/matrimonial/matrimonial-main.webp',
            '/images/habitaciones/matrimonial/matrimonial-thumb.webp',
            '/images/habitaciones/matrimonial/doble-twin-main.webp',
            '/images/habitaciones/matrimonial/familiar-loft-main.webp',
            '/images/habitaciones/matrimonial/triple-main.webp',
        ];
    }
};

// Room info por tipo
const getRoomInfo = (roomName: string) => {
    const nombre = roomName.toLowerCase();

    if (nombre.includes('303') || nombre.includes('triple')) {
        return {
            size: 30,
            beds: '2 camas individuales y 1 cama doble grande',
            bedIcons: 3,
            description: 'Esta habitación triple cuenta con TV de pantalla plana con canales por cable, baño privado y balcón con vistas al lago. La unidad dispone de 3 camas.',
            rating: '9,1',
            reviews: 47,
            bathAmenities: ['Artículos de aseo gratis', 'WC', 'Bañera o ducha', 'Toallas', 'Toallas / sábanas (por un suplemento)', 'Papel higiénico'],
            views: ['Vistas al lago', 'Vistas a la montaña', 'Vistas a un lugar de interés', 'Vistas a la ciudad', 'Vistas al río'],
            services: ['Balcón', 'Suelo de madera o parquet', 'Enchufe cerca de la cama', 'Productos de limpieza', 'Escritorio', 'Zona de estar', 'Vídeo', 'TV', 'TV de pantalla plana', 'Canales por cable', 'Armario', 'Acceso a pisos superiores solo mediante escaleras', 'Perchero', 'Detector de monóxido de carbono', 'Desinfectante de manos'],
            hasBalcony: true,
            quickAmenities: ['Balcón', 'Vistas al lago', 'Vistas a la montaña', 'Vistas a un lugar de interés', 'Vistas a la ciudad', 'Vistas al río', 'Baño privado', 'TV de pantalla plana', 'WiFi gratis']
        };
    } else if (nombre.includes('302') || nombre.includes('2 camas') || nombre.includes('twin')) {
        return {
            size: 28,
            beds: '1 cama individual y 1 cama doble grande',
            bedIcons: 2,
            description: 'A seating area with a flat-screen TV, a desk and a private bathroom are offered in this twin room. The unit has 2 beds.',
            rating: '9,1',
            reviews: 47,
            bathAmenities: ['Artículos de aseo gratis', 'WC', 'Bañera o ducha', 'Toallas', 'Toallas / sábanas (por un suplemento)', 'Papel higiénico'],
            views: ['Vistas a un lugar de interés', 'Vistas a la ciudad'],
            services: ['Suelo de madera o parquet', 'Enchufe cerca de la cama', 'Productos de limpieza', 'Escritorio', 'Zona de estar', 'Vídeo', 'TV', 'TV de pantalla plana', 'Canales por cable', 'Armario', 'Acceso a pisos superiores solo mediante escaleras', 'Perchero', 'Detector de monóxido de carbono', 'Desinfectante de manos'],
            hasBalcony: false,
            quickAmenities: ['Vistas a un lugar de interés', 'Vistas a la ciudad', 'Baño privado', 'TV de pantalla plana', 'WiFi gratis']
        };
    } else {
        // Matrimonial (301)
        return {
            size: 24,
            beds: '1 cama doble grande',
            bedIcons: 1,
            description: 'Esta habitación doble dispone de zona de estar con TV de pantalla plana, escritorio y baño privado. La unidad dispone de 1 cama.',
            rating: '9,1',
            reviews: 47,
            bathAmenities: ['Artículos de aseo gratis', 'WC', 'Bañera o ducha', 'Toallas', 'Toallas / sábanas (por un suplemento)', 'Papel higiénico'],
            views: ['Vistas a la montaña', 'Vistas a un lugar de interés', 'Vistas a la ciudad'],
            services: ['Suelo de madera o parquet', 'Enchufe cerca de la cama', 'Productos de limpieza', 'Escritorio', 'Zona de estar', 'Vídeo', 'TV', 'TV de pantalla plana', 'Canales por cable', 'Armario', 'Acceso a pisos superiores solo mediante escaleras', 'Perchero', 'Detector de monóxido de carbono', 'Desinfectante de manos'],
            hasBalcony: false,
            quickAmenities: ['Vistas a la montaña', 'Vistas a un lugar de interés', 'Vistas a la ciudad', 'Baño privado', 'TV de pantalla plana', 'WiFi gratis']
        };
    }
};

export const RoomDetailBookingModal: React.FC<RoomDetailBookingModalProps> = ({
    habitacion,
    onClose,
    onAddToCart
}) => {
    const images = getRoomImages(habitacion.nombre);
    const roomInfo = getRoomInfo(habitacion.nombre);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const prevImage = () => {
        setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
            onClick={handleBackdropClick}
        >
            <div className="bg-white shadow-2xl w-full max-w-5xl my-8 relative animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Left: Image Gallery */}
                    <div className="relative bg-gray-100">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] w-full">
                            <Image
                                src={images[currentImageIndex]}
                                alt={`${habitacion.nombre} - Imagen ${currentImageIndex + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                            />

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                            </button>

                            {/* Image Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={cn(
                                            "w-2.5 h-2.5 rounded-full transition-colors",
                                            idx === currentImageIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-1 p-2 bg-white">
                            {images.slice(0, 5).map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={cn(
                                        "relative w-16 h-12 overflow-hidden border-2 transition-colors",
                                        idx === currentImageIndex ? "border-blue-600" : "border-transparent hover:border-gray-300"
                                    )}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Room Details */}
                    <div className="p-6 overflow-y-auto max-h-[80vh]">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {habitacion.nombre}
                        </h2>

                        {/* Quick Amenities Row */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                                <Scaling className="w-4 h-4" />
                                {roomInfo.size} m²
                            </span>
                            {roomInfo.quickAmenities.slice(0, 5).map((amenity, idx) => (
                                <span key={idx} className="flex items-center gap-1">
                                    {amenity.includes('montaña') && <Mountain className="w-4 h-4" />}
                                    {amenity.includes('ciudad') && <Building className="w-4 h-4" />}
                                    {amenity.includes('interés') && <MapPin className="w-4 h-4" />}
                                    {amenity.includes('lago') && <Eye className="w-4 h-4" />}
                                    {amenity.includes('Baño') && <Bath className="w-4 h-4" />}
                                    {amenity.includes('TV') && <Tv className="w-4 h-4" />}
                                    {amenity.includes('WiFi') && <Wifi className="w-4 h-4" />}
                                    {amenity}
                                </span>
                            ))}
                        </div>

                        {/* Size & Bed */}
                        <div className="mb-4">
                            <p className="text-gray-700 font-medium">
                                <span className="font-bold">Tamaño de la habitación</span> {roomInfo.size} m²
                            </p>
                            <p className="text-gray-700 flex items-center gap-2 mt-2">
                                {roomInfo.beds}
                                {Array.from({ length: roomInfo.bedIcons }).map((_, i) => (
                                    <Bed key={i} className="w-5 h-5 text-gray-600" />
                                ))}
                            </p>
                        </div>

                        {/* Rating */}
                        <p className="text-gray-600 text-sm mb-4">
                            Camas cómodas: {roomInfo.rating}, según {roomInfo.reviews} comentarios
                        </p>

                        {/* Description */}
                        <p className="text-gray-700 mb-6">
                            {roomInfo.description}
                        </p>

                        {/* Bathroom Amenities */}
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-3">En el baño privado:</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {roomInfo.bathAmenities.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Views */}
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-3">Vista a:</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {roomInfo.views.map((view, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                                        <span>{view}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Services */}
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 mb-3">Servicios:</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {roomInfo.services.map((service, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                                        <span>{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Smoking Policy */}
                        <div className="mb-6 p-3 bg-gray-50 rounded">
                            <p className="text-gray-700 text-sm">
                                <span className="font-bold">Política de humo:</span> no se puede fumar
                            </p>
                        </div>
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
