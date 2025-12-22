'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  logo?: string;
  themeClass?: string;
}

export const Footer = ({ logo, themeClass }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cardenal-green-dark text-gray-300 pt-16 pb-8">
      <div className={`container mx-auto px-4 ${themeClass || ''}`}>
        {/* Main Footer Bands (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Column 1: Contacto Principal */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b-2 border-cardenal-gold inline-block pb-1 font-serif tracking-widest">
              Contáctenos
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cardenal-gold flex-shrink-0 mt-1" />
                <span className="text-sm leading-relaxed font-body font-medium">
                  Gladiolos 154-42 y Av. 18 de Noviembre, Loja, Ecuador
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cardenal-gold flex-shrink-0" />
                <a href="tel:+593996616878" className="text-sm hover:text-white transition-colors font-body font-bold">
                  099 661 6878
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cardenal-gold flex-shrink-0" />
                <a href="mailto:elcardenalhotel@gmail.com" className="text-sm hover:text-white transition-colors font-body font-bold">
                  elcardenalhotel@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Navegación Rápida */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b-2 border-cardenal-gold inline-block pb-1 font-serif tracking-widest">
              Navegación Rápida
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm hover:text-white transition-colors flex items-center gap-2 font-body font-bold">
                  <span className="text-cardenal-gold font-bold">›</span> Inicio
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-sm hover:text-white transition-colors flex items-center gap-2 font-body font-bold">
                  <span className="text-cardenal-gold font-bold">›</span> Galería
                </Link>
              </li>
              <li>
                <Link href="/habitaciones" className="text-sm hover:text-white transition-colors flex items-center gap-2 font-body font-bold">
                  <span className="text-cardenal-gold font-bold">›</span> Habitaciones
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-sm hover:text-white transition-colors flex items-center gap-2 font-body font-bold">
                  <span className="text-cardenal-gold font-bold">›</span> Servicios
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm hover:text-white transition-colors flex items-center gap-2 font-body font-bold">
                  <span className="text-cardenal-gold font-bold">›</span> Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Requisitos Legales (LOPDP) */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b-2 border-cardenal-gold inline-block pb-1 font-serif tracking-widest">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/politica-datos" className="text-sm hover:text-white transition-colors flex items-center gap-2 font-body font-black">
                  <span className="text-cardenal-gold font-bold">›</span> Protección de Datos (LOPDP)
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-sm hover:text-white transition-colors flex items-center gap-2 font-body font-black">
                  <span className="text-cardenal-gold font-bold">›</span> Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm hover:text-white transition-colors flex items-center gap-2 font-body font-black">
                  <span className="text-cardenal-gold font-bold">›</span> Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Redes Sociales y Marca */}
          <div>
            <h3 className="text-white font-black text-lg mb-6 border-b-2 border-cardenal-gold inline-block pb-1 font-serif tracking-widest">
              Síganos
            </h3>
            <div className="mb-6">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image
                  src={logo || "/logo.jpg"}
                  alt="Hotel El Cardenal Loja Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <span className="text-xl font-black text-white font-serif tracking-tighter">Hotel El Cardenal</span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed font-body">
                Su base premium para explorar la riqueza natural y cultural de Loja.
              </p>
            </div>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/elcardenalhotel?locale=es_LA" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-cardenal-gold transition-all duration-300 text-white" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/hotel_elcardenal/" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-cardenal-gold transition-all duration-300 text-white" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-cardenal-gold transition-all duration-300 text-white" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Sub-Footer: Attribution & Copyright */}
        <div className="border-t border-white/5 pt-8 mt-8 text-center pb-4">
          <p className="text-sm text-gray-400 font-body font-bold tracking-wide">
            Diseñado por{' '}
            <a
              href="https://cesarreyesjaramillo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-cardenal-gold transition-colors"
            >
              Cesar Reyes
            </a>{' '}
            | Hotel El Cardenal Loja {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};
