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
    <div className="min-h-screen bg-cardenal-cream font-sans">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" /> Volver
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-text-main font-serif">Gestión de Hero Dinámico</h1>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedPlato(null);
                setShowForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Plato
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {selectedPlato ? 'Editar Plato' : 'Nuevo Plato'}
              </h2>
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
