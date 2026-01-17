'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminPlatosList from '@/components/AdminPlatosList';
import PlatoForm from '@/components/PlatoForm';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, LayoutDashboard, Home, Users, ChevronLeft, UtensilsCrossed } from 'lucide-react';

type Plato = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  activo: boolean;
  created_at: string;
};

export default function AdminPlatosPage() {
  const router = useRouter();
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlato, setSelectedPlato] = useState<Plato | null>(null);

  const fetchPlatos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/platos');
      if (!response.ok) {
        throw new Error('Error al cargar los platos');
      }
      const data = await response.json();
      setPlatos(data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudieron cargar los platos. Por favor, intente más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatos();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedPlato(null);
    fetchPlatos();
  };

  const handleEdit = (plato: Plato) => {
    setSelectedPlato(plato);
    setShowForm(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const platoActual = platos.find(p => p.id === id);
      if (!platoActual) {
        throw new Error('Plato no encontrado');
      }

      const formData = new FormData();
      formData.append('titulo', platoActual.titulo);
      formData.append('descripcion', platoActual.descripcion);
      formData.append('precio', platoActual.precio.toString());
      formData.append('activo', (!currentStatus).toString());

      if (platoActual.imagen_url) {
        formData.append('imagen_url', platoActual.imagen_url);
      }

      const response = await fetch(`/api/platos/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el estado');
      }

      setPlatos(platos.map(plato =>
        plato.id === id ? { ...plato, activo: !currentStatus } : plato
      ));

    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el estado');
      fetchPlatos();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este plato? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/api/platos/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar el plato');
      }

      setPlatos(platos.filter(plato => plato.id !== id));

    } catch (error) {
      console.error('Error al eliminar:', error);
      setError(error instanceof Error ? error.message : 'Error al eliminar el plato');
      fetchPlatos();
    }
  };

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

  return (
    <div className="min-h-screen bg-cardenal-cream/30 font-sans">
      <header className="bg-white border-b-2 border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-2 border-gray-300 font-black text-black hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5 mr-1 stroke-[3px]" /> VOLVER
              </Button>
            </Link>
            <h1 className="text-3xl font-black text-cardenal-green uppercase tracking-tighter">Gestión de Hero Dinámico</h1>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => {
                setSelectedPlato(null);
                setShowForm(true);
              }}
              className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-black px-8 h-12 shadow-lg rounded-xl"
            >
              <Plus className="mr-2 h-5 w-5 stroke-[3px]" />
              AGREGAR PLATO
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-200">
              <div className="flex items-center gap-4 mb-8 border-b-2 border-gray-100 pb-6">
                <div className="p-3 bg-cardenal-gold/20 rounded-xl">
                  <UtensilsCrossed className="w-7 h-7 text-cardenal-gold" />
                </div>
                <h2 className="text-3xl font-black text-cardenal-green uppercase tracking-tight">
                  {selectedPlato ? 'Editar Plato' : 'Nuevo Plato'}
                </h2>
              </div>
              <PlatoForm
                plato={selectedPlato}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedPlato(null);
                }}
              />
            </div>
          </div>
        )}

        <AdminPlatosList
          platos={platos}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </main>
    </div>
  );
}
