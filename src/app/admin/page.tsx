'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Home, Users, UtensilsCrossed, Calendar, Megaphone } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const menuItems = [
    {
      title: 'Gestión de Habitaciones',
      description: 'Administra tipos de habitación, precios y disponibilidad.',
      icon: Home,
      href: '/admin/habitaciones',
      color: 'bg-cardenal-gold text-white',
      hover: 'hover:bg-cardenal-gold/90'
    },
    {
      title: 'Hero Dinámico (Platos)',
      description: 'Administra los platos destacados en el slider principal.',
      icon: UtensilsCrossed,
      href: '/admin/platos',
      color: 'bg-orange-500 text-white',
      hover: 'hover:bg-orange-600'
    },
    {
      title: 'Gestión de Anuncios',
      description: 'Crea y administra promociones y avisos tipo popup.',
      icon: Megaphone,
      href: '/admin/anuncios',
      color: 'bg-indigo-600 text-white',
      hover: 'hover:bg-indigo-700'
    },
    {
      title: 'Gestión del Blog',
      description: 'Publica y edita artículos para el posicionamiento SEO.',
      icon: LayoutDashboard,
      href: '/admin/blog',
      color: 'bg-cardenal-green text-white',
      hover: 'hover:bg-cardenal-green-dark'
    },
    {
      title: 'Gestión de Clientes',
      description: 'Base de datos de clientes, historial y CRM.',
      icon: Users,
      href: '/admin/clientes',
      color: 'bg-blue-600 text-white',
      hover: 'hover:bg-blue-700'
    },
    {
      title: 'Recepción',
      description: 'Control de ocupación y reservas manuales por habitación.',
      icon: Calendar,
      href: '/admin/recepcion',
      color: 'bg-cardenal-gold text-white',
      hover: 'hover:bg-cardenal-gold/90'
    }
  ];

  return (
    <div className="min-h-screen bg-cardenal-cream/30 font-sans">
      <header className="bg-white border-b-2 border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-black text-cardenal-green uppercase tracking-tighter">Panel de Administración</h1>
          <Button
            variant="outline"
            className="text-red-600 border-2 border-red-300 font-black hover:bg-red-50 h-12 px-6 rounded-xl uppercase tracking-widest"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5 stroke-[2.5px]" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-black uppercase tracking-tight mb-4">Bienvenido al Panel de Control</h2>
          <p className="text-lg text-gray-800 font-bold max-w-2xl mx-auto uppercase tracking-tighter">
            Selecciona una opción para comenzar a gestionar el contenido de su hotel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-gray-300 hover:border-cardenal-gold hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center group-hover:-translate-y-1">
                <div className={`p-4 rounded-3xl mb-6 ${item.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-10 h-10 stroke-[2px]" />
                </div>
                <h3 className="text-xl font-black text-black mb-3 group-hover:text-cardenal-green transition-colors uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 font-bold text-base leading-snug">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
