
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
            try {
                const response = await fetch('/api/anuncios?active=true');
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncements(data);
                    if (data.length > 0) {
                        // Show with a delay
                        setTimeout(() => setIsVisible(true), 1500);
                    }
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };
        fetchAnnouncements();
    }, []);

    if (announcements.length === 0 || isClosed) return null;

    const current = announcements[currentIndex];

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-[100] transition-all duration-700 transform",
                isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-90 pointer-events-none"
            )}
        >
            <div className="relative group overflow-hidden bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 w-full max-w-[340px] md:max-w-[400px]">
                {/* Decorative particles or backgrounds */}
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-16 h-16 text-cardenal-gold" />
                </div>

                {/* Image if exists */}
                {current.imagen_url && (
                    <div className="h-40 overflow-hidden relative">
                        <img
                            src={current.imagen_url}
                            alt={current.titulo}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {current.llamativo && (
                            <div className="absolute top-4 left-4">
                                <span className="bg-[#bd8b33] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                                    {current.llamativo}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                <div className="p-6">
                    <button
                        onClick={() => { setIsVisible(false); setTimeout(() => setIsClosed(true), 500); }}
                        className="absolute top-4 right-4 p-1.5 bg-gray-100/50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {!current.imagen_url && current.llamativo && (
                        <div className="mb-3">
                            <span className="bg-[#bd8b33]/10 text-[#bd8b33] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                                <Megaphone className="w-3 h-3" />
                                {current.llamativo}
                            </span>
                        </div>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight pr-6">
                        {current.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {current.descripcion}
                    </p>

                    {current.boton_texto && (
                        <Link
                            href={current.boton_link || '#'}
                            onClick={() => setIsVisible(false)}
                            className="inline-flex items-center justify-center gap-2 w-full bg-[#1a1a1a] hover:bg-[#bd8b33] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#bd8b33]/20 group/btn"
                        >
                            {current.boton_texto}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
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
