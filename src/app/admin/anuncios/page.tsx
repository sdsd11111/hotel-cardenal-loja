
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, Megaphone, Edit2, Trash2, Eye, EyeOff, X, Calendar } from 'lucide-react';
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

    // Grouping Logic
    // Grouping Logic - Using local date string
    const getLocalDate = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const now = getLocalDate();

    const normalizeDate = (d: any) => {
        if (!d) return '';
        if (typeof d === 'string') return d.slice(0, 10);
        return new Date(d).toISOString().slice(0, 10);
    };

    const activeAnuncios = anuncios.filter(a => {
        const start = normalizeDate(a.fecha_inicio);
        const end = normalizeDate(a.fecha_fin);
        return a.activo && start <= now && end >= now;
    });
    const scheduledAnuncios = anuncios.filter(a => {
        const start = normalizeDate(a.fecha_inicio);
        return a.activo && start > now;
    });
    const pastAnuncios = anuncios.filter(a => {
        const end = normalizeDate(a.fecha_fin);
        return !a.activo || (end && end < now);
    });

    const AnuncioTable = ({ items, title, icon: Icon, colorClass }: any) => (
        <div className="bg-white rounded-3xl border-2 border-gray-300 shadow-xl overflow-hidden mb-8">
            <div className={`p-8 border-b-2 border-gray-100 flex items-center gap-4 ${colorClass}`}>
                <div className="p-3 bg-white/50 rounded-xl">
                    <Icon className="w-7 h-7 text-gray-800" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</h2>
                    <p className="text-sm font-bold text-gray-600 uppercase tracking-tighter">{items.length} anuncios</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b-2 border-gray-200">
                        <tr>
                            <th className="px-8 py-4 text-xs font-black text-black uppercase tracking-widest">Anuncio</th>
                            <th className="px-8 py-4 text-xs font-black text-black uppercase tracking-widest">Fechas</th>
                            <th className="px-8 py-4 text-xs font-black text-black uppercase tracking-widest">Estado</th>
                            <th className="px-8 py-4 text-right text-xs font-black text-black uppercase tracking-widest">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 font-bold uppercase">No hay anuncios en esta sección</td></tr>
                        ) : items.map((anuncio: any) => (
                            <tr key={anuncio.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="font-black text-black text-lg uppercase tracking-tight">{anuncio.titulo}</div>
                                    <div className="text-sm font-bold text-gray-500">{anuncio.descripcion}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-xs font-black text-gray-600 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-lg inline-block">
                                        {anuncio.fecha_inicio} <span className="text-gray-400">→</span> {anuncio.fecha_fin}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <button
                                        onClick={() => handleToggleStatus(anuncio)}
                                        className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border-2",
                                            anuncio.activo
                                                ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                        )}
                                    >
                                        {anuncio.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        {anuncio.activo ? 'Visible' : 'Oculto'}
                                    </button>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setSelectedAnuncio(anuncio); setShowForm(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(anuncio.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

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
            formData.append('fecha_inicio', anuncio.fecha_inicio || '');
            formData.append('fecha_fin', anuncio.fecha_fin || '');
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

                <div className="space-y-8">
                    <AnuncioTable
                        items={activeAnuncios}
                        title="En Curso (Activos Hoy)"
                        icon={Megaphone}
                        colorClass="bg-green-50"
                    />
                    <AnuncioTable
                        items={scheduledAnuncios}
                        title="Programados (Futuro)"
                        icon={Calendar}
                        colorClass="bg-blue-50"
                    />
                    <AnuncioTable
                        items={pastAnuncios}
                        title="Historial / Inactivos"
                        icon={Trash2}
                        colorClass="bg-gray-50"
                    />
                </div>
            </main>
        </div>
    );
}
