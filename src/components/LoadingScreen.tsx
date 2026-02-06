'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            // Desaparecer de inmediato si el sitio esta listo
            setIsVisible(false);
            setTimeout(() => setShouldRender(false), 800);
        };

        // Fallback: Maximo 3 segundos (seguridad para UX)
        const fallbackId = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => setShouldRender(false), 800);
        }, 3000);

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => {
            window.removeEventListener('load', handleLoad);
            clearTimeout(fallbackId);
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cardenal-cream transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="relative mb-8 animate-pulse">
                <Image
                    src="/logo.png"
                    alt="Hotel El Cardenal"
                    width={150}
                    height={150}
                    priority
                    className="object-contain"
                />
            </div>

            {/* Loading Bar Container */}
            <div className="w-48 h-1 bg-cardenal-gold/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-cardenal-gold animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>

            <p className="mt-4 text-cardenal-green text-xs font-bold tracking-[0.3em] uppercase opacity-60">
                Cargando Experiencia
            </p>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
