
'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, Megaphone, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AnnouncementPopup() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (typeof window !== 'undefined' && window.hasSeenAnnouncement) return;

            try {
                // Fetch activeNow=true for Home Popup
                const response = await fetch('/api/anuncios?activeNow=true');
                if (response.ok) {
                    const data = await response.json();
                    console.log('DEBUG Popup: Received data:', data);

                    // Filter in case API returns potential array but we specifically want active currently
                    const validData = Array.isArray(data) ? data : (data ? [data] : []);

                    setAnnouncements(validData);
                    console.log('DEBUG Popup: Valid announcements count:', validData.length);
                    if (validData.length > 0) {
                        setTimeout(() => setIsVisible(true), 1500);
                    }
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };
        fetchAnnouncements();
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setIsClosed(true), 500);
        if (typeof window !== 'undefined') window.hasSeenAnnouncement = true;
    };

    if (announcements.length === 0 || isClosed) return null;

    const current = announcements[currentIndex];

    return (
        <div
            className={cn(
                "fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[100] transition-all duration-700 transform",
                "max-w-[280px] md:max-w-[400px]", // Ultra compact on mobile
                isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-90 pointer-events-none"
            )}
        >
            <div className="relative group overflow-hidden bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 w-full max-h-[80vh] flex flex-col">
                {/* Decorative particles or backgrounds */}
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-16 h-16 text-cardenal-gold" />
                </div>

                {/* Image if exists */}
                {current.imagen_url && (
                    <div className="h-20 md:h-40 overflow-hidden relative flex-shrink-0">
                        <img
                            src={current.imagen_url}
                            alt={current.titulo}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {current.llamativo && (
                            <div className="absolute top-2.5 left-2.5">
                                <span className="bg-[#bd8b33] text-white px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-lg">
                                    {current.llamativo}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="p-3 md:p-6 overflow-y-auto">
                    <button
                        onClick={handleClose}
                        className="absolute top-2.5 right-2.5 p-1 bg-gray-100/50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all z-10"
                    >
                        <X className="w-3 h-3" />
                    </button>

                    {!current.imagen_url && current.llamativo && (
                        <div className="mb-1.5 md:mb-2 text-center md:text-left">
                            <span className="bg-[#bd8b33]/10 text-[#bd8b33] px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                                <Megaphone className="w-2.5 h-2.5" />
                                {current.llamativo}
                            </span>
                        </div>
                    )}

                    <h3 className="text-xs md:text-xl font-bold text-gray-900 mb-0.5 md:mb-2 leading-tight pr-6">
                        {current.titulo}
                    </h3>
                    <p className="text-[11px] md:text-sm text-gray-600 mb-2.5 md:mb-6 line-clamp-2 md:line-clamp-3 leading-tight md:leading-relaxed">
                        {current.descripcion}
                    </p>

                    {current.boton_texto && (
                        <Link
                            href={current.boton_link || '#'}
                            onClick={handleClose}
                            className="inline-flex items-center justify-center gap-2 w-full bg-[#1a1a1a] hover:bg-[#bd8b33] text-white font-bold py-1.5 md:py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#bd8b33]/20 group/btn text-[11px] md:text-base"
                        >
                            {current.boton_texto}
                            <ArrowRight className="w-2.5 h-2.5 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    )}
                </div>

                {/* Footer progress for multiple announcements if needed */}
                {announcements.length > 1 && (
                    <div className="flex gap-1 px-6 pb-2">
                        {announcements.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "h-1 flex-1 rounded-full transition-all cursor-pointer",
                                    idx === currentIndex ? "bg-cardenal-gold" : "bg-gray-100"
                                )}
                                onClick={() => setCurrentIndex(idx)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
