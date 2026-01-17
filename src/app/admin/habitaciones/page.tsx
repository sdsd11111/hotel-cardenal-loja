'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminHabitacionesList from '@/components/AdminHabitacionesList';
import HabitacionForm from '@/components/HabitacionForm';
import RoomConfigForm from '@/components/RoomConfigForm';
import { Button } from '@/components/ui/button';
import GeneralSettingsForm from '@/components/GeneralSettingsForm';
import { Plus, ChevronLeft, LogOut, LayoutDashboard, Home, Settings2, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminHabitacionesPage() {
    const router = useRouter();
    const [habitaciones, setHabitaciones] = useState<any[]>([]);
    const [roomConfigs, setRoomConfigs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingConfigs, setIsLoadingConfigs] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedHabitacion, setSelectedHabitacion] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'inventory' | 'configs' | 'general'>('inventory');

    const fetchHabitaciones = async (retryCount = 0) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/habitaciones?all=true', { cache: 'no-store' });
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
            setError(null);
        } catch (err: any) {
            console.error('Admin Fetch Error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConfigs = async () => {
        try {
            setIsLoadingConfigs(true);
            const response = await fetch('/api/admin/room-configs');
            if (!response.ok) throw new Error('Error al cargar configuraciones');
            const data = await response.json();
            setRoomConfigs(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoadingConfigs(false);
        }
    };

    useEffect(() => {
        fetchHabitaciones();
    }, []);

    useEffect(() => {
        if (activeTab === 'configs') {
            fetchConfigs();
        }
    }, [activeTab]);

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
                        <h1 className="text-3xl font-black text-cardenal-green flex items-center gap-3 font-serif">
                            <Home className="w-8 h-8" />
                            Gestión de Habitaciones
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex bg-gray-200 p-2 rounded-2xl border-2 border-gray-300 shadow-sm gap-2">
                            <button
                                onClick={() => setActiveTab('inventory')}
                                className={cn(
                                    "px-6 py-2 text-base font-black rounded-xl transition-all",
                                    activeTab === 'inventory' ? "bg-white text-cardenal-green shadow-md scale-105" : "text-gray-700 hover:bg-gray-300 hover:text-black"
                                )}
                            >
                                Inventario
                            </button>
                            <button
                                onClick={() => setActiveTab('configs')}
                                className={cn(
                                    "px-6 py-2 text-base font-black rounded-xl transition-all",
                                    activeTab === 'configs' ? "bg-white text-cardenal-green shadow-md scale-105" : "text-gray-700 hover:bg-gray-300 hover:text-black"
                                )}
                            >
                                Configuración de Modales
                            </button>
                            <button
                                onClick={() => setActiveTab('general')}
                                className={cn(
                                    "px-6 py-2 text-base font-black rounded-xl transition-all",
                                    activeTab === 'general' ? "bg-white text-cardenal-green shadow-md scale-105" : "text-gray-700 hover:bg-gray-300 hover:text-black"
                                )}
                            >
                                General
                            </button>
                        </div>
                        {activeTab === 'inventory' && (
                            <Button onClick={() => { setSelectedHabitacion(null); setShowForm(true); }} className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-black h-12 px-8 text-lg shadow-lg">
                                <Plus className="w-6 h-6 mr-2 stroke-[3px]" /> Nueva Habitación
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {error && (activeTab === 'inventory' || activeTab === 'configs') && (
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

                {activeTab === 'inventory' ? (
                    <div className="mb-8 bg-white p-10 rounded-3xl border-2 border-gray-300 shadow-xl animate-fadeIn">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-cardenal-gold/20 rounded-2xl">
                                <Home className="w-8 h-8 text-cardenal-gold" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-cardenal-green font-serif">Inventario Actual</h2>
                                <p className="text-base text-black font-black uppercase tracking-widest mt-1">Configure los precios y detalles que verán los clientes.</p>
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
                ) : activeTab === 'configs' ? (
                    <div className="mb-8 bg-white p-10 rounded-3xl border-2 border-gray-300 shadow-xl animate-fadeIn">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-cardenal-gold/20 rounded-2xl">
                                <Settings2 className="w-8 h-8 text-cardenal-gold" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-cardenal-green font-serif">Configuración de Modales</h2>
                                <p className="text-base text-black font-black uppercase tracking-widest mt-1">Modifica los detalles, precios y opciones de los botones "AGREGAR" y "DETALLE".</p>
                            </div>
                        </div>

                        {isLoadingConfigs ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cardenal-gold"></div>
                            </div>
                        ) : (
                            <RoomConfigForm configs={roomConfigs} onUpdate={fetchConfigs} />
                        )}
                    </div>
                ) : (
                    <div className="mb-8 bg-white p-10 rounded-3xl border-2 border-gray-300 shadow-xl animate-fadeIn">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-cardenal-gold/20 rounded-2xl">
                                <Globe className="w-8 h-8 text-cardenal-gold" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-cardenal-green font-serif">Configuración General</h2>
                                <p className="text-base text-black font-black uppercase tracking-widest mt-1">Ajuste políticas globales como edades de niños, impuestos base, etc.</p>
                            </div>
                        </div>

                        <GeneralSettingsForm onUpdate={() => { }} />
                    </div>
                )}
            </main>
        </div>
    );
}
