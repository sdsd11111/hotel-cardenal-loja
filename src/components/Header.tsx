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
  { label: 'Doble Twin', href: '/habitaciones/doble-twin' },
];

// Experiencia dropdown items (no main page)
const experienciaItems = [
  { label: 'Gastronomía y Desayunos', href: '/restaurante', description: 'Sabores lojanos auténticos' },
  { label: 'Galería de Momentos', href: '/galeria', description: 'Explore nuestras instalaciones' },
  { label: 'Eventos y Reuniones', href: '/eventos', description: 'Espacios para su celebración' },
  { label: 'Servicios Exclusivos', href: '/servicios', description: 'Parking, WiFi y más' },
  { label: 'Turismo en Loja', href: '/turismo-en-loja', description: 'Guía de lugares mágicos' },
];

// Hamburger menu items
const hamburgerNavigation = [
  { label: 'Galería', href: '/galeria' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
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
  const textColor = forceDarkText ? "text-cardenal-green" : "text-white";
  const textShadow = forceDarkText ? "none" : "0 2px 4px rgba(0,0,0,0.8)";
  const iconShadow = forceDarkText ? "none" : "drop-shadow(0 2px 4px rgba(0,0,0,0.8))";

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
                      aria-label="Instagram"
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
                      aria-label="Facebook"
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
                      aria-label="WhatsApp"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Transparent Header - Fixed during hero scroll */}
            <header className={cn("w-full fixed top-10 z-50 backdrop-blur-[2px] bg-black/5", className)}>
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                  <div className="flex items-center flex-shrink-0">
                    <Link href="/" className="flex items-center gap-2">
                      <div className={cn(
                        "p-1 transition-all duration-300 bg-transparent shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                      )}>
                        <Image
                          src={logo || "/logo.jpg"}
                          alt="Hotel El Cardenal Loja Logo"
                          width={themeClass ? 55 : 40}
                          height={themeClass ? 55 : 40}
                          className="object-contain"
                        />
                      </div>
                      <span className={cn(
                        "text-2xl font-black tracking-tight drop-shadow-lg font-serif",
                        themeClass ? "tracking-[0.05em] scale-105" : "",
                        textColor
                      )}>
                        Hotel El Cardenal
                      </span>
                    </Link>
                  </div>

                  {/* Right Side - Desktop Navigation + Reserva + Language */}
                  <div className="flex items-center gap-4">
                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1">
                      {/* Inicio - Only show if NOT on homepage */}
                      {pathname !== '/' && (
                        <Link
                          href="/"
                          className={cn("px-4 py-2 text-xs font-black hover:text-cardenal-gold transition-colors uppercase tracking-widest font-serif", textColor)}
                          style={{ textShadow }}
                        >
                          Inicio
                        </Link>
                      )}

                      {/* Sobre Nosotros */}
                      <Link
                        href="/sobre-hotel-cardenal"
                        className={cn(
                          "px-4 py-2 text-xs font-black hover:text-cardenal-gold transition-colors uppercase font-serif",
                          themeClass ? "tracking-[0.2em]" : "tracking-widest",
                          textColor,
                          pathname === '/sobre-hotel-cardenal' && "text-cardenal-gold"
                        )}
                        style={{ textShadow }}
                      >
                        Sobre Nosotros
                      </Link>

                      {/* Habitaciones with Dropdown */}
                      <div className="relative group">
                        <div className="flex items-center">
                          <Link
                            href="/habitaciones"
                            className={cn(
                              "px-4 py-2 text-xs font-black hover:text-cardenal-gold transition-colors uppercase font-serif",
                              themeClass ? "tracking-[0.2em]" : "tracking-widest",
                              textColor,
                              pathname?.startsWith('/habitaciones') && "text-cardenal-gold"
                            )}
                            style={{ textShadow }}
                          >
                            Habitaciones
                          </Link>
                          <ChevronDown className={cn("h-3 w-3 group-hover:text-cardenal-gold transition-colors", textColor)} style={{ filter: iconShadow }} />
                        </div>

                        {/* Habitaciones Dropdown */}
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[70] border-t-4 border-cardenal-gold">
                          <div className="py-2">
                            {habitacionesItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-5 py-3 text-sm text-cardenal-green hover:bg-cardenal-cream hover:text-cardenal-gold font-serif font-bold transition-colors border-l-4 border-transparent hover:border-cardenal-gold"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Experiencia with Dropdown (no main page) */}
                      <div className="relative group">
                        <button
                          className={cn("flex items-center px-4 py-2 text-xs font-black hover:text-cardenal-gold transition-colors uppercase tracking-widest font-serif", textColor)}
                          style={{ textShadow }}
                        >
                          Experiencia
                          <ChevronDown className={cn("h-3 w-3 ml-1 group-hover:text-cardenal-gold transition-colors", textColor)} style={{ filter: iconShadow }} />
                        </button>

                        {/* Experiencia Dropdown */}
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[70] border-t-4 border-cardenal-gold">
                          <div className="py-2">
                            {experienciaItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block px-5 py-4 hover:bg-cardenal-cream transition-colors border-l-4 border-transparent hover:border-cardenal-gold group/item"
                              >
                                <span className="block text-sm text-cardenal-green font-serif font-bold group-hover/item:text-cardenal-gold transition-colors">
                                  {item.label}
                                </span>
                                <span className="block text-xs text-text-muted mt-1">
                                  {item.description}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Blog */}
                      <Link
                        href="/blog"
                        className={cn(
                          "px-4 py-2 text-xs font-black hover:text-cardenal-gold transition-colors uppercase font-serif",
                          themeClass ? "tracking-[0.2em]" : "tracking-widest",
                          textColor,
                          pathname === '/blog' && "text-cardenal-gold"
                        )}
                        style={{ textShadow }}
                      >
                        Blog
                      </Link>
                    </nav>

                    {/* Reserva Button */}
                    <Link
                      href="/contacto"
                      className="hidden md:inline-flex bg-cardenal-gold hover:bg-white text-white hover:text-cardenal-green font-bold py-2 px-6 transition-all duration-300 text-xs uppercase tracking-widest font-serif shadow-lg"
                    >
                      Reserva
                    </Link>

                    {/* Language Selector */}
                    <div className={cn("hidden md:flex items-center gap-1", textColor)}>
                      <Globe className="h-4 w-4" />
                      <GoogleTranslate inHeader={true} />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className={cn("lg:hidden p-2 hover:text-cardenal-gold transition-colors", textColor)}
                      aria-label="Toggle menu"
                    >
                      {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                      ) : (
                        <Menu className="h-6 w-6" />
                      )}
                    </button>
                  </div>

                  {/* Hamburger Menu Dropdown */}
                  {mobileMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-xl border border-gray-200 overflow-hidden">
                      <nav className="px-3 py-3 max-h-[80vh] overflow-y-auto">
                        <div className="space-y-4">
                          {/* Inicio */}
                          <Link
                            href="/"
                            className={cn(
                              "block text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide",
                              pathname === '/' && "text-cardenal-gold"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Inicio
                          </Link>

                          {/* Sobre Nosotros */}
                          <Link
                            href="/sobre-hotel-cardenal"
                            className={cn(
                              "block text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide",
                              pathname === '/sobre-hotel-cardenal' && "text-cardenal-gold"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sobre Nosotros
                          </Link>

                          {/* Habitaciones Accordion - Split Link and Toggle */}
                          <div>
                            <div className="flex items-center justify-between w-full">
                              <Link
                                href="/habitaciones"
                                className="text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide flex-grow"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                Habitaciones
                              </Link>
                              <button
                                onClick={() => toggleCategory('mobile-habitaciones')}
                                className="p-2 text-cardenal-green hover:text-cardenal-gold"
                              >
                                {openCategories['mobile-habitaciones'] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            {openCategories['mobile-habitaciones'] && (
                              <div className="pl-4 mt-2 space-y-2 border-l-2 border-cardenal-gold/20 ml-1">
                                {habitacionesItems.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block text-gray-600 hover:text-cardenal-gold text-xs font-serif font-bold py-1"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Experiencia Accordion */}
                          <div>
                            <button
                              onClick={() => toggleCategory('mobile-experiencia')}
                              className="w-full flex items-center justify-between text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide"
                            >
                              Experiencia
                              {openCategories['mobile-experiencia'] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            {openCategories['mobile-experiencia'] && (
                              <div className="pl-4 mt-2 space-y-2 border-l-2 border-cardenal-gold/20 ml-1">
                                {experienciaItems.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block py-1 group"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    <span className="block text-gray-600 group-hover:text-cardenal-gold text-xs font-serif font-bold">
                                      {item.label}
                                    </span>
                                    {item.description && (
                                      <span className="block text-[10px] text-gray-400">
                                        {item.description}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Blog */}
                          <Link
                            href="/blog"
                            className={cn(
                              "block text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide",
                              pathname === '/blog' && "text-cardenal-gold"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Blog
                          </Link>

                          {/* Reserva Button (Highlighted) */}
                          <Link
                            href="/contacto"
                            className={cn(
                              "block text-center border-2 border-cardenal-gold text-cardenal-gold hover:bg-cardenal-gold hover:text-white font-bold transition-all duration-300 text-sm uppercase tracking-widest py-2",
                              pathname === '/contacto' && "bg-cardenal-gold text-white"
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Reserva
                          </Link>
                        </div>

                        {/* Mobile Language Selector */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Globe className="h-4 w-4" />
                            <GoogleTranslate inHeader={true} />
                          </div>
                        </div>
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </header>
          </>
        )}

        {/* White Solid Header - Shows when scrolled */}
        {isScrolled && !disableSticky && (
          <header className={cn("w-full fixed top-0 z-50 shadow-md transition-colors duration-300", themeClass ? "bg-cardenal-green text-white" : "bg-white")}>
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center h-20 gap-4">
                {/* Logo - Left */}
                <div className="flex items-center flex-shrink-0">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src={logo || "/logo.jpg"}
                      alt="Hotel El Cardenal Loja Logo"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                    <span className={cn("hidden md:block text-xl font-black tracking-tight font-serif", themeClass ? "text-white" : "text-cardenal-green")}>
                      Hotel El Cardenal
                    </span>
                  </Link>
                </div>

                {/* Center - Compact Reservation Search (if enabled) */}
                {showReservationSearch && effectiveReservationProps && (
                  <div className="hidden lg:flex flex-1 justify-center">
                    <CompactReservationSearch {...effectiveReservationProps} />
                  </div>
                )}

                {/* Right Side - Hamburger Menu Only */}
                <div className="flex items-center gap-3">
                  {/* Mobile Reservation Button */}
                  <Link
                    href="/contacto?motivo=Reserva+de+Habitación#formulario-contacto"
                    className={cn("md:hidden text-white text-xs font-bold py-2 px-4 shadow-md transition-colors uppercase tracking-wider", themeClass ? "bg-cardenal-gold" : "bg-cardenal-green hover:bg-cardenal-gold")}
                  >
                    Reserva
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className={cn("p-4 transition-colors", themeClass ? "text-white" : "text-cardenal-green hover:text-cardenal-gold")}
                      aria-label="Toggle menu"
                    >
                      {mobileMenuOpen ? (
                        <X className="h-12 w-12" strokeWidth={2.5} />
                      ) : (
                        <Menu className="h-12 w-12" strokeWidth={2.5} />
                      )}
                    </button>

                    {/* Hamburger Menu Dropdown - All Navigation */}
                    {mobileMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-xl border border-gray-200 z-[80] overflow-hidden">
                        <nav className="px-4 py-4 max-h-[80vh] overflow-y-auto">
                          <div className="space-y-4">
                            {/* Inicio */}
                            <Link
                              href="/"
                              className={cn(
                                "block text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide",
                                pathname === '/' && "text-cardenal-gold"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Inicio
                            </Link>

                            {/* Sobre Nosotros */}
                            <Link
                              href="/sobre-hotel-cardenal"
                              className={cn(
                                "block text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide",
                                pathname === '/sobre-hotel-cardenal' && "text-cardenal-gold"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Sobre Nosotros
                            </Link>

                            {/* Habitaciones Accordion - Split Link and Toggle */}
                            <div>
                              <div className="flex items-center justify-between w-full">
                                <Link
                                  href="/habitaciones"
                                  className="text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide flex-grow"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Habitaciones
                                </Link>
                                <button
                                  onClick={() => toggleCategory('mobile-habitaciones')}
                                  className="p-2 text-cardenal-green hover:text-cardenal-gold"
                                >
                                  {openCategories['mobile-habitaciones'] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              {openCategories['mobile-habitaciones'] && (
                                <div className="pl-4 mt-2 space-y-2 border-l-2 border-cardenal-gold/20 ml-1">
                                  {habitacionesItems.map((item) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      className="block text-gray-600 hover:text-cardenal-gold text-xs font-serif font-bold py-1"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Experiencia Accordion */}
                            <div>
                              <button
                                onClick={() => toggleCategory('mobile-experiencia')}
                                className="w-full flex items-center justify-between text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide"
                              >
                                Experiencia
                                {openCategories['mobile-experiencia'] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                              {openCategories['mobile-experiencia'] && (
                                <div className="pl-4 mt-2 space-y-2 border-l-2 border-cardenal-gold/20 ml-1">
                                  {experienciaItems.map((item) => (
                                    <Link
                                      key={item.href}
                                      href={item.href}
                                      className="block py-1 group"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      <span className="block text-gray-600 group-hover:text-cardenal-gold text-xs font-serif font-bold">
                                        {item.label}
                                      </span>
                                      {item.description && (
                                        <span className="block text-[10px] text-gray-400">
                                          {item.description}
                                        </span>
                                      )}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Blog */}
                            <Link
                              href="/blog"
                              className={cn(
                                "block text-cardenal-green hover:text-cardenal-gold font-bold transition-colors text-sm uppercase tracking-wide",
                                pathname === '/blog' && "text-cardenal-gold"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Blog
                            </Link>

                            {/* Reserva Button (Highlighted) */}
                            <Link
                              href="/contacto"
                              className={cn(
                                "block text-center border-2 border-cardenal-gold text-cardenal-gold hover:bg-cardenal-gold hover:text-white font-bold transition-all duration-300 text-sm uppercase tracking-widest py-2",
                                pathname === '/contacto' && "bg-cardenal-gold text-white"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Reserva
                            </Link>
                          </div>

                          {/* Mobile Language Selector */}
                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Globe className="h-4 w-4" />
                              <GoogleTranslate inHeader={true} />
                            </div>
                          </div>
                        </nav>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}
      </div>
    </>
  );
};
