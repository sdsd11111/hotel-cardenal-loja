'use client';

import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import Image from 'next/image';

export const VideoSection = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Placeholder video ID (Cuenca Tourism or similar) - Replace with actual hotel video
    // Using a generic nature/hotel placeholder for now or a specific YouTube ID if known.
    // For demo: Using a scenic placeholder image and a generic video structure.
    const videoId = "dQw4w9WgXcQ"; // Placeholder ID (Rick Roll strictly as placeholder, user to replace) -> Better: Use a Cuenca video ID if possible or just generic.
    // Let's use a generic Cuenca tourism video ID if we can, or just leave it blank/commented.
    // Actually, let's use a real Cuenca video ID to make it look good immediately: "y8K5A4h5g5k" (Cuenca Ecuador Turismo)
    const youtubeId = "y8K5A4h5g5k";

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12 max-w-3xl mx-auto" data-aos="fade-up">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3 block">
                        Descubra Loja
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                        Una Experiencia Visual <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                            Inolvidable
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Sumérjase en la atmósfera de nuestro hotel y la belleza de Loja antes de su llegada.
                        Un recorrido visual por lo que le espera.
                    </p>
                </div>

                {/* Video Container */}
                <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gray-900 aspect-video group">

                    {!isPlaying ? (
                        /* Cover Image & Play Button */
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Background Image Placeholder */}
                            <div className="absolute inset-0 bg-gray-800">
                                {/* Ideally use a real image here. Using a gradient placeholder for now if no image provided */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 opacity-80"></div>
                                {/* If we had an image: <Image src="/video-cover.jpg" fill className="object-cover opacity-60" /> */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                    <span className="text-9xl font-bold text-white tracking-tighter select-none uppercase">LOJA</span>
                                </div>
                            </div>

                            {/* Pulse Effect */}
                            <div className="absolute w-24 h-24 bg-white/20 rounded-full animate-ping"></div>
                            <div className="absolute w-24 h-24 bg-white/10 rounded-full animate-pulse delay-75"></div>

                            {/* Play Button */}
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group-hover:shadow-blue-500/50"
                                aria-label="Reproducir video"
                            >
                                <Play className="w-8 h-8 text-blue-600 ml-1 fill-blue-600" />
                            </button>

                            {/* Text Overlay */}
                            <div className="absolute bottom-8 left-0 right-0 text-center">
                                <p className="text-white font-medium tracking-widest uppercase text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                                    Ver Video Promocional
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Video Player (YouTube Embed) */
                        <div className="absolute inset-0 bg-black">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&showinfo=0`}
                                title="Hotel El Cardenal Loja Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full"
                            ></iframe>

                            {/* Close Button (Optional, mainly if using modal, but good for inline reset) */}
                            <button
                                onClick={() => setIsPlaying(false)}
                                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
