'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHabitacionesList from '@/components/AdminHabitacionesList';
import HabitacionForm from '@/components/HabitacionForm';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, LogOut, LayoutDashboard, Home } from 'lucide-react';

export default function AdminHabitacionesPage() {
    const router = useRouter();
    const [habitaciones, setHabitaciones] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedHabitacion, setSelectedHabitacion] = useState<any | null>(null);

    const fetchHabitaciones = async (retryCount = 0) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/habitaciones?all=true');
            if (!response.ok) {
                if (retryCount < 2) {
                    console.warn(`Retry ${retryCount + 1} for admin habitaciones...`);
                    await new Promise(r => setTimeout(r, 1000));
                    return fetchHabitaciones(retryCount + 1);
                }
                const errData = await response.text().catch(() => 'No detail');
                throw new Error(`Error al cargar habitaciones (${response.status}): ${errData}`);
            }
            const data = await response.json();
            setHabitaciones(data);
            setError(null); // Clear error if successful
        } catch (err: any) {
            console.error('Admin Fetch Error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHabitaciones();
    }, []);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const habitacion = habitaciones.find(h => h.id === id);
            const response = await fetch(`/api/habitaciones/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...habitacion, activo: !currentStatus }),
            });
            if (!response.ok) throw new Error('Error al cambiar estado');
            fetchHabitaciones();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta habitación?')) return;
        try {
            const response = await fetch(`/api/habitaciones/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar');
            fetchHabitaciones();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-cardenal-cream/30 font-sans">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="sm">
                                <ChevronLeft className="w-4 h-4 mr-1" /> Volver
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-cardenal-green font-serif">Gestión de Habitaciones</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => { setSelectedHabitacion(null); setShowForm(true); }} className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white">
                            <Plus className="w-4 h-4 mr-2" /> Nueva Habitación
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        {error}
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-cardenal-green font-serif">
                                    {selectedHabitacion ? 'Editar Habitación' : 'Nueva Habitación'}
                                </h2>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <HabitacionForm
                                habitacion={selectedHabitacion}
                                onSuccess={() => { setShowForm(false); fetchHabitaciones(); }}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                )}

                <div className="mb-8 bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-cardenal-gold/10 rounded-lg">
                            <Home className="w-5 h-5 text-cardenal-gold" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-cardenal-green">Inventario Actual</h2>
                            <p className="text-sm text-gray-500">Configure los precios y detalles que verán los clientes.</p>
                        </div>
                    </div>

                    <AdminHabitacionesList
                        habitaciones={habitaciones}
                        isLoading={isLoading}
                        onEdit={(h) => { setSelectedHabitacion(h); setShowForm(true); }}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                    />
                </div>
            </main>
        </div>
    );
}

// Re-using the X icon from lucide-react not imported in main list
import { X } from 'lucide-react';
