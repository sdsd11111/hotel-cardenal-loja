
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, Megaphone, Edit2, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnnouncementForm from '@/components/AnnouncementForm';

export default function AdminAnunciosPage() {
    const [anuncios, setAnuncios] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedAnuncio, setSelectedAnuncio] = useState<any | null>(null);

    const fetchAnuncios = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/anuncios');
            if (!response.ok) throw new Error('Error al cargar anuncios');
            const data = await response.json();
            setAnuncios(data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnuncios();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este anuncio?')) return;
        try {
            const response = await fetch(`/api/anuncios/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar');
            fetchAnuncios();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleToggleStatus = async (anuncio: any) => {
        try {
            const response = await fetch(`/api/anuncios/${anuncio.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...anuncio, activo: !anuncio.activo }),
            });
            if (!response.ok) throw new Error('Error al cambiar estado');
            fetchAnuncios();
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
                        <h1 className="text-2xl font-bold text-cardenal-green font-serif">Gestión de Anuncios</h1>
                    </div>
                    <Button onClick={() => { setSelectedAnuncio(null); setShowForm(true); }} className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Nuevo Anuncio
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-cardenal-green font-serif">
                                    {selectedAnuncio ? 'Editar Anuncio' : 'Nuevo Anuncio'}
                                </h2>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <AnnouncementForm
                                announcement={selectedAnuncio}
                                onSuccess={() => { setShowForm(false); fetchAnuncios(); }}
                                onCancel={() => setShowForm(false)}
                            />
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b flex items-center gap-3">
                        <div className="p-2 bg-cardenal-gold/10 rounded-lg">
                            <Megaphone className="w-5 h-5 text-cardenal-gold" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-cardenal-green">Anuncios Configurados</h2>
                            <p className="text-sm text-gray-500">Administra las promociones que aparecen en la página de habitaciones.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Título / Descripción</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Llamativo</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Cargando...</td>
                                    </tr>
                                ) : anuncios.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No hay anuncios configurados.</td>
                                    </tr>
                                ) : anuncios.map((anuncio) => (
                                    <tr key={anuncio.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{anuncio.titulo}</div>
                                            <div className="text-sm text-gray-500 line-clamp-1">{anuncio.descripcion}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(anuncio)}
                                                className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors",
                                                    anuncio.activo
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                )}
                                            >
                                                {anuncio.activo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                                {anuncio.activo ? 'Visible' : 'Oculto'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            {anuncio.llamativo && (
                                                <span className="bg-cardenal-gold/20 text-cardenal-gold px-2 py-0.5 rounded text-[10px] font-black uppercase">
                                                    {anuncio.llamativo}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedAnuncio(anuncio); setShowForm(true); }}
                                                    className="p-1.5 text-gray-400 hover:text-cardenal-gold transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(anuncio.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
