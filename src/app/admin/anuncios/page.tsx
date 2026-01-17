
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
            const formData = new FormData();
            formData.append('titulo', anuncio.titulo);
            formData.append('descripcion', anuncio.descripcion || '');
            formData.append('llamativo', anuncio.llamativo || '');
            formData.append('boton_texto', anuncio.boton_texto || '');
            formData.append('boton_link', anuncio.boton_link || '');
            formData.append('activo', String(!anuncio.activo));
            formData.append('posicion', anuncio.posicion || 'bottom-right');
            formData.append('estilo', anuncio.estilo || '{}');
            // If there's an existing image_url, we keep it
            if (anuncio.imagen_url) {
                formData.append('imagen_url', anuncio.imagen_url);
            }

            const response = await fetch(`/api/anuncios/${anuncio.id}`, {
                method: 'PUT',
                body: formData,
            });
            if (!response.ok) throw new Error('Error al cambiar estado');
            fetchAnuncios();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-cardenal-cream/30 font-sans">
            <header className="bg-white shadow-md border-b-2 border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/admin">
                            <Button variant="outline" size="sm" className="border-2 border-gray-300 font-black text-black hover:bg-gray-100">
                                <ChevronLeft className="w-5 h-5 mr-1 stroke-[3px]" /> VOLVER
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-black text-cardenal-green uppercase tracking-tighter">Gestión de Anuncios</h1>
                    </div>
                    <Button onClick={() => { setSelectedAnuncio(null); setShowForm(true); }} className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-black px-6 h-12 shadow-lg">
                        <Plus className="w-5 h-5 mr-2 stroke-[3px]" /> NUEVO ANUNCIO
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

                <div className="bg-white rounded-3xl border-2 border-gray-300 shadow-xl overflow-hidden">
                    <div className="p-8 border-b-2 border-gray-100 flex items-center gap-4 bg-gray-50/50">
                        <div className="p-3 bg-cardenal-gold/20 rounded-xl">
                            <Megaphone className="w-7 h-7 text-cardenal-gold" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-cardenal-green uppercase tracking-tight">Anuncios Configurados</h2>
                            <p className="text-sm font-black text-gray-700 uppercase tracking-tighter">Administra las promociones que aparecen en la página de habitaciones.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-200 border-b-2 border-gray-300">
                                <tr>
                                    <th className="px-8 py-4 text-xs font-black text-black uppercase tracking-widest">Título / Descripción</th>
                                    <th className="px-8 py-4 text-xs font-black text-black uppercase tracking-widest">Estado</th>
                                    <th className="px-8 py-4 text-xs font-black text-black uppercase tracking-widest">Llamativo</th>
                                    <th className="px-8 py-4 text-right text-xs font-black text-black uppercase tracking-widest">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Cargando...</td>
                                    </tr>
                                ) : anuncios.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Megaphone className="w-16 h-16 text-gray-300 stroke-[1px]" />
                                                <p className="text-xl font-black text-gray-500 uppercase tracking-widest">No hay anuncios configurados.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : anuncios.map((anuncio) => (
                                    <tr key={anuncio.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-black text-lg uppercase tracking-tight">{anuncio.titulo}</div>
                                            <div className="text-sm font-bold text-gray-700 line-clamp-2 mt-1">{anuncio.descripcion}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => handleToggleStatus(anuncio)}
                                                className={cn(
                                                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border-2",
                                                    anuncio.activo
                                                        ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                                )}
                                            >
                                                {anuncio.activo ? <Eye className="w-4 h-4 stroke-[3px]" /> : <EyeOff className="w-4 h-4 stroke-[3px]" />}
                                                {anuncio.activo ? 'Visible' : 'Oculto'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6">
                                            {anuncio.llamativo && (
                                                <span className="bg-cardenal-gold text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                                                    {anuncio.llamativo}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => { setSelectedAnuncio(anuncio); setShowForm(true); }}
                                                    className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-cardenal-gold hover:text-white transition-all border-2 border-transparent hover:border-cardenal-gold shadow-sm"
                                                >
                                                    <Edit2 className="w-5 h-5 stroke-[2.5px]" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(anuncio.id)}
                                                    className="p-2.5 bg-gray-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border-2 border-transparent hover:border-red-500 shadow-sm"
                                                >
                                                    <Trash2 className="w-5 h-5 stroke-[2.5px]" />
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
