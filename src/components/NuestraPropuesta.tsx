'use client';

import React, { useState } from 'react';
import { MapPin, Zap, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

const proposalContent = [
    {
        id: 'historia',
        label: 'Historia y Tradición',
        icon: <Zap className="w-5 h-5" />,
        title: 'La Esencia de Antaño',
        text: 'Somos un hotel familiar en Loja que conserva la esencia de antaño en un entorno privilegiado. Al cruzar nuestro zaguán coronado por el escudo familiar, te recibirá un ambiente íntimo donde la piedra volcánica del siglo XVIII y las techumbres de madera cuentan la historia de nuestra ciudad. A diferencia de los grandes hoteles, aquí ofrecemos un alojamiento auténtico.',
        highlight: 'Arquitectura del Siglo XVIII'
    },
    {
        id: 'hospitalidad',
        label: 'Hospitalidad Única',
        icon: <ShieldCheck className="w-5 h-5" />,
        title: 'Mucho más que un Servicio',
        text: 'En Hotel El Cardenal, la hospitalidad no es solo un servicio, es una leyenda que compartimos con cada huésped. Si buscas dónde hospedarse en Loja rodeado de paz y vegetación, nuestra casa te espera junto a las orillas del río Malacatos. Ofrecemos solo 6 exclusivas habitaciones diseñadas para capturar el aire fresco y la luz del sol.',
        highlight: 'Trato Humano y Cercano'
    },
    {
        id: 'entorno',
        label: 'Entorno y Cultura',
        icon: <MapPin className="w-5 h-5" />,
        title: 'Equilibrio Perfecto',
        text: 'Nuestra ubicación es estratégica: estamos a solo 10 minutos de la Iglesia Catedral y el centro histórico, pero lo suficientemente cerca de la naturaleza para disfrutar del sonido del río. En nuestro salón neoclásico, rodeado de piezas de arte como el cuadro de la "Romería de El Cisne" y muebles Zuleta, descubrirás el descanso que valoras.',
        highlight: 'Cerca de lo que amas'
    }
];

export const NuestraPropuesta = () => {
    const [activeTab, setActiveTab] = useState('historia');
    const [isExpanded, setIsExpanded] = useState(false);

    // Reset expansion when changing tabs
    const handleTabChange = (id: string) => {
        setActiveTab(id);
        setIsExpanded(false);
    };

    return (
        <section className="py-24 bg-cardenal-cream/40 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-6xl font-bold text-cardenal-green mb-6 leading-tight font-serif drop-shadow-sm">
                        El encanto de un hotel <span className="text-cardenal-gold italic">con alma</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 font-medium">Historia, tradición y naturaleza en el rincón más exclusivo de Loja.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Interactive Tabs */}
                    <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
                        {/* Tabs Navigation */}
                        <div className="flex flex-wrap gap-4">
                            {proposalContent.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex items-center gap-3 px-8 py-4 font-serif font-bold text-sm transition-all duration-300 rounded-lg border-2 ${activeTab === tab.id
                                        ? 'bg-cardenal-green border-cardenal-green text-white shadow-xl scale-105 ring-4 ring-cardenal-green/20'
                                        : 'bg-white border-cardenal-green/20 text-cardenal-green hover:border-cardenal-green hover:bg-cardenal-green/5'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="tracking-wide uppercase text-xs">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Animated Content Card */}
                        <div className="bg-white p-8 md:p-12 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.1)] border border-cardenal-gold/10 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cardenal-gold/5 -mr-16 -mt-16 rotate-45"></div>

                            {proposalContent.map((tab) => (
                                activeTab === tab.id && (
                                    <div key={tab.id} className="animate-fadeInRight space-y-6">
                                        <div className="inline-block px-4 py-1.5 bg-cardenal-gold/10 text-cardenal-gold text-xs font-bold uppercase tracking-widest mb-4 border-l-4 border-cardenal-gold">
                                            {tab.highlight}
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-cardenal-green font-serif">
                                            {tab.title}
                                        </h3>
                                        <div>
                                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-body">
                                                {isExpanded ? tab.text : `${tab.text.substring(0, 150)}...`}
                                            </p>
                                            <button
                                                onClick={() => setIsExpanded(!isExpanded)}
                                                className="text-cardenal-gold font-bold text-sm mt-4 hover:text-cardenal-green transition-colors uppercase tracking-widest border-b border-cardenal-gold inline-block"
                                            >
                                                {isExpanded ? 'Ocultar' : 'Seguir leyendo'}
                                            </button>
                                        </div>
                                        <div className="pt-4">
                                            <div className="w-16 h-1 bg-cardenal-gold/40"></div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Visual Component */}
                    <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:h-full lg:mb-0 mb-12 self-center">
                        <div className="relative aspect-video w-full overflow-hidden shadow-2xl rounded-2xl ring-4 ring-white/50 bg-black">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/-XnNorw5qmc?autoplay=0&controls=1&rel=0"
                                title="Experiencia Hotel El Cardenal"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full object-cover"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeInRight {
                    animation: fadeInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </section>
    );
};
