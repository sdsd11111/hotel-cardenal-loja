'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Menu, X, Globe, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { restaurantMenuCategories } from '@/data/restaurantMenu';
import CompactReservationSearch from './CompactReservationSearch';

const GoogleTranslate = dynamic(
  () => import('./GoogleTranslate'),
  { ssr: false }
);

interface HeaderProps {
  logo?: string;
  className?: string;
  // Optional reservation search props
  showReservationSearch?: boolean;
  reservationSearchProps?: {
    fechaEntrada: string;
    fechaSalida: string;
    onFechaEntradaChange: (fecha: string) => void;
    onFechaSalidaChange: (fecha: string) => void;
    adultos: number;
    ninos: number;
    onAdultosChange: (cantidad: number) => void;
    onNinosChange: (cantidad: number) => void;
    onReservarClick: () => void;
  };
  forceDarkText?: boolean;
  disableSticky?: boolean;
  themeClass?: string;
}

// Habitaciones dropdown items
const habitacionesItems = [
  { label: 'Matrimonial', href: '/habitaciones/matrimonial' },
  { label: 'Triple', href: '/habitaciones/triple' },
  { label: 'Doble Twin', href: '/doble-twin' },
];

// Servicios dropdown items 
const serviciosItems = [
  { label: 'Restaurante', href: '/restaurante', description: 'Sabores lojanos auténticos' },
  { label: 'Eventos y Reuniones', href: '/eventos', description: 'Espacios para su celebración' },
];

// Guia dropdown items
const guiaItems = [
  { label: 'Experiencias', href: '/servicios', description: 'Descubre nuestros servicios exclusivos' },
  { label: 'Galería de Momentos', href: '/galeria', description: 'Explore nuestras instalaciones' },
  { label: 'Turismo en Loja', href: '/turismo-en-loja', description: 'Guía de lugares mágicos' },
];

// Hamburger menu items
const hamburgerNavigation = [
  { label: 'Galería', href: '/galeria' },
  { label: 'Blog', href: '/blog' },
];

import { useRouter } from 'next/navigation';

// ... imports

export const Header = ({
  logo,
  className,
  showReservationSearch = true,
  reservationSearchProps,
  forceDarkText = false,
  disableSticky = false,
  themeClass
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [restaurantMenuOpen, setRestaurantMenuOpen] = useState(false); // Mobile state for restaurant menu
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({}); // State for accordion
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  const pathname = usePathname();
  const router = useRouter();

  // Internal state for reservation search (used if props are not provided)
  const [internalFechaEntrada, setInternalFechaEntrada] = useState('');
  const [internalFechaSalida, setInternalFechaSalida] = useState('');
  const [internalAdultos, setInternalAdultos] = useState(2);
  const [internalNinos, setInternalNinos] = useState(0);

  // Handle internal search
  const handleInternalSearch = () => {
    const params = new URLSearchParams();
    if (internalFechaEntrada) params.set('entrada', internalFechaEntrada);
    if (internalFechaSalida) params.set('salida', internalFechaSalida);
    if (internalAdultos > 0) params.set('adultos', internalAdultos.toString());
    if (internalNinos > 0) params.set('ninos', internalNinos.toString());

    router.push(`/habitaciones?${params.toString()}`);
  };

  // Determine which props to use (passed props or internal state)
  const effectiveReservationProps = reservationSearchProps || {
    fechaEntrada: internalFechaEntrada,
    fechaSalida: internalFechaSalida,
    onFechaEntradaChange: setInternalFechaEntrada,
    onFechaSalidaChange: setInternalFechaSalida,
    adultos: internalAdultos,
    ninos: internalNinos,
    onAdultosChange: setInternalAdultos,
    onNinosChange: setInternalNinos,
    onReservarClick: handleInternalSearch
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Detect scroll position - activate after passing the floating search panel
  useEffect(() => {
    if (disableSticky) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      // Activate sticky header after passing the full-screen hero (100vh)
      const threshold = pathname === '/' ? (window.innerHeight - 80) : 100;
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, disableSticky]);

  // Color logic for transparent state

  // Color logic for transparent state
  const isActuallyDark = themeClass?.includes('text-white') || (forceDarkText === false && !isScrolled);
  const textColor = isActuallyDark ? "text-white" : "text-cardenal-brown";
  const textShadow = isActuallyDark ? "0 2px 4px rgba(0,0,0,0.5)" : "none";
  const iconShadow = isActuallyDark ? "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" : "none";

  return (
    <>
      {/* Container for Theme Class Overrides */}
      <div className={themeClass}>
        {/* Transparent Header with Topbar - Shows at top */}
        {!isScrolled && (
          <>
            {/* Top Bar - Full Featured */}
            <div className="w-full fixed top-0 z-[60] bg-cardenal-green">
              <div className="container mx-auto px-4">
                <div className="h-10 flex items-center justify-between text-white text-xs">
                  {/* Left - Location */}
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cardenal-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-white/90 truncate sm:whitespace-normal">Gladiolos 154-42 y Av. 18 de Noviembre, Loja</span>
                  </div>

                  {/* Center - Contact Info */}
                  <div className="hidden sm:flex items-center gap-4 md:gap-6">
                    <a href="tel:+593996616878" className="flex items-center gap-2 hover:text-cardenal-gold transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="hidden sm:inline">099 661 6878</span>
                    </a>
                    <span className="text-white/30 hidden sm:inline">|</span>
                    <a href="mailto:elcardenalhotel@gmail.com" className="flex items-center gap-2 hover:text-cardenal-gold transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden sm:inline">elcardenalhotel@gmail.com</span>
                    </a>
                  </div>

                  {/* Right - Social Icons */}
                  <div className="hidden md:flex items-center gap-4">
                    <a
                      href="https://www.instagram.com/hotel_elcardenal/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cardenal-gold transition-colors"
                      aria-label="Ir a nuestro perfil de Instagram"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.facebook.com/elcardenalhotel?locale=es_LA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cardenal-gold transition-colors"
                      aria-label="Ir a nuestra página de Facebook"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="https://wa.me/593996616878"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cardenal-gold transition-colors"
                      aria-label="Contactar por WhatsApp"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <header className={cn("w-full fixed top-10 z-50 bg-transparent transition-all duration-300", className)}>
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20 relative px-4">
                  {/* Left Side Group: Logo + Title (on desktop) */}
                  <div className="contents md:flex md:items-center md:gap-6 z-20">
                    <Link href="/" className="flex items-center flex-shrink-0">
                      <div className={cn(
                        "p-2 md:p-3 transition-all duration-300 scale-110 md:scale-125 filter rounded-full flex-shrink-0",
                        "bg-[radial-gradient(circle,_rgba(255,255,255,0.3)_0%,_transparent_70%)]",
                        "drop-shadow-[0_0_2px_rgba(255,255,255,1)]",
                        "drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                      )}>
                        <Image
                          src={logo || "/logo.png"}
                          alt="Hotel El Cardenal Loja Logo"
                          width={themeClass ? 80 : 65}
                          height={themeClass ? 80 : 65}
                          className="object-contain"
                        />
                      </div>
                    </Link>

                    {/* Title: Absolutely Centered on Mobile, Next to Logo on Desktop */}
                    <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center justify-center md:justify-start pointer-events-none z-10 w-full md:w-auto">
                      <Link href="/" className="pointer-events-auto">
                        <span className={cn(
                          "text-xl md:text-3xl lg:text-5xl font-black tracking-tight drop-shadow-xl font-serif whitespace-nowrap",
                          "text-center md:text-left",
                          themeClass ? "tracking-[0.05em] scale-105" : "",
                          textColor
                        )}>
                          Hotel El Cardenal
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Side: Hamburger + Language */}
                  <div className="flex items-center gap-4 md:gap-8 z-20">
                    {/* Language Selector */}
                    <div className={cn("hidden md:flex items-center gap-1", textColor)}>
                      <Globe className="h-5 w-5" />
                      <GoogleTranslate inHeader={true} textColor={textColor} />
                    </div>

                    <button
                      onClick={() => setMobileMenuOpen(true)}
                      className={cn("p-2 hover:text-cardenal-gold transition-colors flex items-center group", textColor)}
                      aria-label="Abrir menú"
                    >
                      <Menu className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            </header>
          </>
        )}

        {/* Global Right-Side Drawer Overlay */}
        {
          mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end">
              {/* Black Backdrop */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer Content */}
              <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 transform translate-x-0">
                <div className="p-6 flex items-center justify-end border-b border-gray-100">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-cardenal-brown hover:text-cardenal-gold transition-colors"
                    aria-label="Cerrar menú lateral"
                  >
                    <X className="h-8 w-8" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-8">
                  <div className="space-y-8">
                    {/* Primary Links */}
                    <div className="space-y-4">
                      <Link
                        href="/"
                        className={cn(
                          "block text-2xl text-cardenal-brown hover:text-cardenal-gold font-serif font-bold transition-colors uppercase tracking-widest",
                          pathname === '/' && "text-cardenal-gold"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Inicio
                      </Link>

                      <Link
                        href="/sobre-hotel-cardenal"
                        className={cn(
                          "block text-2xl text-cardenal-brown hover:text-cardenal-gold font-serif font-bold transition-colors uppercase tracking-widest",
                          pathname === '/sobre-hotel-cardenal' && "text-cardenal-gold"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sobre Nosotros
                      </Link>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Dropdowns / Sections */}
                    <div className="space-y-6">
                      {/* Habitaciones Accordion */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Link
                            href="/habitaciones"
                            className={cn(
                              "text-lg text-cardenal-brown hover:text-cardenal-gold font-bold transition-colors uppercase tracking-widest",
                              pathname === '/habitaciones' && "text-cardenal-gold"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Habitaciones
                          </Link>
                          <button
                            onClick={() => toggleCategory('drawer-habitaciones')}
                            className="p-2 text-cardenal-brown hover:text-cardenal-gold transition-colors"
                            aria-label={openCategories['drawer-habitaciones'] ? 'Cerrar submenú habitaciones' : 'Abrir submenú habitaciones'}
                          >
                            {openCategories['drawer-habitaciones'] ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {openCategories['drawer-habitaciones'] && (
                          <div className="pl-4 space-y-3 border-l-2 border-cardenal-gold/30 ml-1">
                            {habitacionesItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block text-gray-600 hover:text-cardenal-gold text-base font-serif py-1"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Guia Accordion (NEW) */}
                      <div className="space-y-4">
                        <button
                          onClick={() => toggleCategory('drawer-guia')}
                          className="w-full flex items-center justify-between text-lg text-cardenal-brown hover:text-cardenal-gold font-bold transition-colors uppercase tracking-widest"
                        >
                          Guia
                          {openCategories['drawer-guia'] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                        {openCategories['drawer-guia'] && (
                          <div className="pl-4 space-y-3 border-l-2 border-cardenal-gold/30 ml-1">
                            {guiaItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block text-gray-600 hover:text-cardenal-gold text-base font-serif py-1"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Servicios Accordion */}
                      <div className="space-y-4">
                        <button
                          onClick={() => toggleCategory('drawer-servicios')}
                          className="w-full flex items-center justify-between text-lg text-cardenal-brown hover:text-cardenal-gold font-bold transition-colors uppercase tracking-widest"
                        >
                          Servicios
                          {openCategories['drawer-servicios'] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                        {openCategories['drawer-servicios'] && (
                          <div className="pl-4 space-y-3 border-l-2 border-cardenal-gold/30 ml-1">
                            {serviciosItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block text-gray-600 hover:text-cardenal-gold text-base font-serif py-1"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Secondary Links */}
                    <div className="space-y-4">
                      <Link
                        href="/blog"
                        className={cn(
                          "block text-lg text-cardenal-brown hover:text-cardenal-gold font-bold transition-colors uppercase tracking-widest",
                          pathname === '/blog' && "text-cardenal-gold"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Blog
                      </Link>
                    </div>
                  </div>
                </nav>

                {/* Drawer Footer */}
                <div className="p-8 bg-cardenal-green text-white">
                  <Link
                    href="/habitaciones"
                    className="block w-full text-center bg-cardenal-gold py-4 text-sm font-bold uppercase tracking-widest font-serif"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reserva Ahora
                  </Link>
                </div>
              </div>
            </div>
          )
        }

        {/* White Solid Header - Shows when scrolled */}
        {
          isScrolled && !disableSticky && (
            <header className={cn("w-full fixed top-0 z-50 shadow-md transition-colors duration-300", themeClass ? "bg-cardenal-green text-white" : "bg-white")}>
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20 relative px-4">
                  {/* Left Side Group: Logo + Title (on desktop) */}
                  <div className="contents md:flex md:items-center md:gap-4 z-20">
                    <Link href="/" className="flex items-center flex-shrink-0">
                      <Image
                        src={logo || "/logo.png"}
                        alt="Hotel El Cardenal Loja Logo"
                        width={65}
                        height={65}
                        className="object-contain flex-shrink-0"
                      />
                    </Link>

                    {/* Title: Absolutely Centered on Mobile, Next to Logo on Desktop */}
                    <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center justify-center md:justify-start pointer-events-none z-10 w-full md:w-auto">
                      <Link href="/" className="pointer-events-auto">
                        <span className={cn(
                          "text-xl md:text-2xl font-black tracking-tight font-serif whitespace-nowrap",
                          "text-center md:text-left",
                          themeClass ? "text-white" : "text-cardenal-brown"
                        )}>
                          Hotel El Cardenal
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Center - Compact Reservation Search (Desktop Only) */}
                  {showReservationSearch && effectiveReservationProps && (
                    <div className="hidden lg:flex flex-1 justify-center px-4">
                      <CompactReservationSearch {...effectiveReservationProps} />
                    </div>
                  )}

                  {/* Right Side - Hamburger Menu Only */}
                  <div className="flex items-center gap-3 z-20">
                    {/* Global Menu Button (Hamburger) */}
                    <button
                      onClick={() => setMobileMenuOpen(true)}
                      className={cn("p-4 transition-colors", themeClass ? "text-white" : "text-cardenal-brown hover:text-cardenal-gold")}
                      aria-label="Abrir menú"
                    >
                      <Menu className="h-10 w-10" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            </header>
          )
        }
      </div >
    </>
  );
};
