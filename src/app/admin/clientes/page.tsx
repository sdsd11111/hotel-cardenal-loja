'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Users, Search, Download, Plus, Eye, Trash2, Star,
    Phone, Mail, Calendar, ArrowLeft, RefreshCw, Crown,
    ChevronDown, ChevronUp, Save, X, Instagram, Facebook,
    Cake, Briefcase, Building, MapPin, MessageSquare, StickyNote
} from 'lucide-react';

interface Cliente {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    motivo: string;
    fecha_entrada: string;
    fecha_salida: string;
    adultos: number;
    ninos: number;
    habitacion_preferida: string;
    total_estadias: number;
    ultima_estadia: string;
    es_vip: boolean;
    calificacion: number;
    created_at: string;
    // Additional fields
    fecha_nacimiento?: string;
    ciudad_residencia?: string;
    pais?: string;
    profesion?: string;
    empresa?: string;
    como_nos_conocio?: string;
    instagram?: string;
    facebook?: string;
    preferencias_habitacion?: string;
    alergias_alimentarias?: string;
    notas_internas?: string;
}

export default function AdminClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Cliente>>({});
    const [newNote, setNewNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [stats, setStats] = useState({ total: 0, nuevosEsteMes: 0, vips: 0 });
    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);

    const fetchClientes = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (search) params.set('search', search);

            const response = await fetch(`/api/clientes?${params.toString()}`);
            if (!response.ok) throw new Error('Error al cargar clientes');

            const data = await response.json();
            setClientes(data.clientes || []);

            const total = data.pagination?.total || data.clientes?.length || 0;
            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            const nuevos = (data.clientes || []).filter((c: Cliente) => {
                const created = new Date(c.created_at);
                return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
            }).length;
            const vips = (data.clientes || []).filter((c: Cliente) => c.es_vip).length;

            setStats({ total, nuevosEsteMes: nuevos, vips });
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchClientes();
    };

    const handleExport = async () => {
        try {
            const response = await fetch('/api/clientes/export');
            if (!response.ok) throw new Error('Error al exportar');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `clientes_hotel_cardenal_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (err) {
            console.error('Error exporting:', err);
            alert('Error al exportar los clientes');
        }
    };

    const handleExpand = async (cliente: Cliente) => {
        if (expandedId === cliente.id) {
            setExpandedId(null);
            setEditData({});
            return;
        }

        try {
            const response = await fetch(`/api/clientes/${cliente.id}`);
            if (!response.ok) throw new Error('Error al cargar detalles');
            const data = await response.json();
            setEditData(data);
            setExpandedId(cliente.id);
            setNewNote('');
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleSave = async () => {
        if (!expandedId) return;

        setIsSaving(true);
        try {
            const response = await fetch(`/api/clientes/${expandedId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });

            if (!response.ok) throw new Error('Error al guardar');

            alert('Cliente actualizado correctamente');
            fetchClientes();
        } catch (err) {
            console.error('Error:', err);
            alert('Error al guardar los cambios');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const timestamp = new Date().toLocaleString('es-EC', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const formattedNote = `[${timestamp}] ${newNote.trim()}`;
        const currentNotes = editData.notas_internas || '';
        const updatedNotes = currentNotes ? `${currentNotes}\n---\n${formattedNote}` : formattedNote;

        setEditData(prev => ({ ...prev, notas_internas: updatedNotes }));
        setNewNote('');
    };

    const handleViewDetail = async (cliente: Cliente) => {
        try {
            const response = await fetch(`/api/clientes/${cliente.id}`);
            if (!response.ok) throw new Error('Error al cargar detalles');
            const data = await response.json();
            setDetailData(data);
            setShowDetail(true);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Está seguro de ELIMINAR PERMANENTEMENTE este cliente? Esta acción no se puede deshacer.')) return;

        try {
            const response = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar');
            setExpandedId(null);
            fetchClientes();
        } catch (err) {
            console.error('Error:', err);
            alert('Error al eliminar el cliente');
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('es-EC', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="min-h-screen bg-cardenal-cream font-sans">
            {/* Header */}
            <header className="bg-white shadow sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-cardenal-green font-serif flex items-center gap-2">
                                    <Users className="w-6 h-6" />
                                    Gestión de Clientes
                                </h1>
                                <p className="text-sm text-gray-500">Base de datos de huéspedes</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={fetchClientes} variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Actualizar
                            </Button>
                            <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
                                <Download className="w-4 h-4 mr-2" />
                                Exportar Excel
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-cardenal-gold">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Total Clientes</p>
                                <p className="text-3xl font-bold text-cardenal-green">{stats.total}</p>
                            </div>
                            <Users className="w-12 h-12 text-cardenal-gold/30" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Nuevos Este Mes</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.nuevosEsteMes}</p>
                            </div>
                            <Calendar className="w-12 h-12 text-blue-500/30" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">Clientes VIP</p>
                                <p className="text-3xl font-bold text-amber-600">{stats.vips}</p>
                            </div>
                            <Crown className="w-12 h-12 text-amber-500/30" />
                        </div>
                    </div>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre, email o teléfono..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit">Buscar</Button>
                    </div>
                </form>

                {/* Clients List */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-cardenal-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-500">Cargando clientes...</p>
                        </div>
                    ) : clientes.length === 0 ? (
                        <div className="p-8 text-center">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No hay clientes registrados</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {clientes.map((cliente) => (
                                <div key={cliente.id}>
                                    {/* Client Row */}
                                    <div className={`flex items-center justify-between p-4 hover:bg-cardenal-cream/30 transition-colors ${expandedId === cliente.id ? 'bg-cardenal-cream/50' : ''}`}>
                                        <div className="flex items-center gap-4 flex-1">
                                            {/* Expand Button */}
                                            <button
                                                onClick={() => handleExpand(cliente)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${expandedId === cliente.id ? 'bg-cardenal-gold text-white rotate-180' : 'bg-gray-100 text-gray-600 hover:bg-cardenal-gold/20'}`}
                                            >
                                                {expandedId === cliente.id ? <ChevronUp className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                            </button>

                                            {/* Avatar */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${cliente.es_vip ? 'bg-amber-500' : 'bg-cardenal-green'}`}>
                                                {cliente.nombre.charAt(0).toUpperCase()}
                                            </div>

                                            {/* Client Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 flex items-center gap-2 truncate">
                                                    {cliente.nombre}
                                                    {cliente.es_vip && <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                                                </p>
                                                <p className="text-xs text-gray-500">{cliente.motivo || 'Sin motivo especificado'}</p>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="hidden lg:block text-sm min-w-[180px]">
                                                <p className="flex items-center gap-1 text-gray-700">
                                                    <Mail className="w-3 h-3" /> {cliente.email}
                                                </p>
                                                {cliente.telefono && (
                                                    <p className="flex items-center gap-1 text-gray-500">
                                                        <Phone className="w-3 h-3" /> {cliente.telefono}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Last Reservation */}
                                            <div className="hidden md:block text-sm min-w-[120px]">
                                                {cliente.fecha_entrada ? (
                                                    <>
                                                        <p className="text-gray-700">{formatDate(cliente.fecha_entrada)}</p>
                                                        <p className="text-xs text-gray-500">{cliente.habitacion_preferida || 'Sin preferencia'}</p>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </div>

                                            {/* Quick Stats */}
                                            <div className="hidden md:flex items-center gap-6 text-sm">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-cardenal-green">{cliente.total_estadias || 1}</p>
                                                    <p className="text-xs text-gray-500">estadías</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-700">{formatDate(cliente.created_at)}</p>
                                                    <p className="text-xs text-gray-500">registro</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 ml-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetail(cliente)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <a
                                                href={`https://wa.me/${cliente.telefono?.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                            >
                                                <Phone className="w-4 h-4" />
                                            </a>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(cliente.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Expanded Edit Form */}
                                    {expandedId === cliente.id && (
                                        <div className="bg-gradient-to-b from-cardenal-cream/50 to-white p-6 border-t border-cardenal-gold/30">
                                            <div className="max-w-4xl mx-auto space-y-6">
                                                {/* Personal Data Section */}
                                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                                    <h3 className="text-lg font-bold text-cardenal-green mb-4 flex items-center gap-2">
                                                        <Users className="w-5 h-5" />
                                                        Datos Personales
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                                                <Cake className="w-3 h-3 inline mr-1" />
                                                                Fecha de Cumpleaños
                                                            </label>
                                                            <Input
                                                                type="date"
                                                                value={formatDateForInput(editData.fecha_nacimiento || '')}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                                                <MapPin className="w-3 h-3 inline mr-1" />
                                                                Ciudad de Residencia
                                                            </label>
                                                            <Input
                                                                value={editData.ciudad_residencia || ''}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, ciudad_residencia: e.target.value }))}
                                                                placeholder="Ej: Loja"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">País</label>
                                                            <Input
                                                                value={editData.pais || ''}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, pais: e.target.value }))}
                                                                placeholder="Ecuador"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                                                <Briefcase className="w-3 h-3 inline mr-1" />
                                                                Profesión
                                                            </label>
                                                            <Input
                                                                value={editData.profesion || ''}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, profesion: e.target.value }))}
                                                                placeholder="Ej: Médico, Abogado..."
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                                                <Building className="w-3 h-3 inline mr-1" />
                                                                Empresa
                                                            </label>
                                                            <Input
                                                                value={editData.empresa || ''}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, empresa: e.target.value }))}
                                                                placeholder="Nombre de la empresa"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">¿Cómo nos conoció?</label>
                                                            <select
                                                                value={editData.como_nos_conocio || ''}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, como_nos_conocio: e.target.value }))}
                                                                className="w-full px-3 py-2 border rounded-md text-sm"
                                                            >
                                                                <option value="">Seleccionar...</option>
                                                                <option value="Google">Google</option>
                                                                <option value="Facebook">Facebook</option>
                                                                <option value="Instagram">Instagram</option>
                                                                <option value="Recomendación">Recomendación</option>
                                                                <option value="Booking">Booking</option>
                                                                <option value="Publicidad">Publicidad</option>
                                                                <option value="Otro">Otro</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Social Media Section */}
                                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                                    <h3 className="text-lg font-bold text-cardenal-green mb-4 flex items-center gap-2">
                                                        <Instagram className="w-5 h-5" />
                                                        Redes Sociales
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                                                <Instagram className="w-3 h-3 inline mr-1" />
                                                                Instagram
                                                            </label>
                                                            <Input
                                                                value={editData.instagram || ''}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, instagram: e.target.value }))}
                                                                placeholder="@usuario"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                                                <Facebook className="w-3 h-3 inline mr-1" />
                                                                Facebook
                                                            </label>
                                                            <Input
                                                                value={editData.facebook || ''}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, facebook: e.target.value }))}
                                                                placeholder="facebook.com/usuario"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Preferences Section */}
                                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                                    <h3 className="text-lg font-bold text-cardenal-green mb-4 flex items-center gap-2">
                                                        <Star className="w-5 h-5" />
                                                        Preferencias
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">Preferencias de Habitación</label>
                                                            <Textarea
                                                                value={editData.preferencias_habitacion || ''}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, preferencias_habitacion: e.target.value }))}
                                                                placeholder="Ej: Piso alto, vista al jardín..."
                                                                rows={2}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-600 mb-1">Alergias Alimentarias</label>
                                                            <Textarea
                                                                value={editData.alergias_alimentarias || ''}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, alergias_alimentarias: e.target.value }))}
                                                                placeholder="Ej: Mariscos, gluten..."
                                                                rows={2}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Notes Section */}
                                                <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
                                                    <h3 className="text-lg font-bold text-cardenal-green mb-4 flex items-center gap-2">
                                                        <StickyNote className="w-5 h-5" />
                                                        Notas Internas
                                                    </h3>

                                                    {/* Existing Notes */}
                                                    {editData.notas_internas && (
                                                        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100 max-h-48 overflow-y-auto">
                                                            {editData.notas_internas.split('\n---\n').map((note, idx) => (
                                                                <div key={idx} className={`text-sm text-gray-700 ${idx > 0 ? 'mt-3 pt-3 border-t border-blue-200' : ''}`}>
                                                                    {note}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Add New Note */}
                                                    <div className="flex gap-2">
                                                        <Input
                                                            value={newNote}
                                                            onChange={(e) => setNewNote(e.target.value)}
                                                            placeholder="Escribir nueva nota..."
                                                            className="flex-1"
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                                        />
                                                        <Button onClick={handleAddNote} variant="outline" className="bg-blue-50 hover:bg-blue-100 text-blue-700">
                                                            <Plus className="w-4 h-4 mr-1" />
                                                            Agregar Nota
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Save Button */}
                                                <div className="flex justify-end gap-3">
                                                    <Button variant="outline" onClick={() => setExpandedId(null)}>
                                                        <X className="w-4 h-4 mr-2" />
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        onClick={handleSave}
                                                        disabled={isSaving}
                                                        className="bg-cardenal-green hover:bg-cardenal-green-dark text-white"
                                                    >
                                                        {isSaving ? (
                                                            <>
                                                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                                Guardando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4 mr-2" />
                                                                Guardar Cambios
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Detail Modal */}
            {showDetail && detailData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-cardenal-green text-white p-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold font-serif">{detailData.nombre}</h2>
                                <p className="text-cardenal-gold">{detailData.email}</p>
                            </div>
                            <button onClick={() => setShowDetail(false)} className="text-white/80 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded">
                                    <h3 className="font-bold text-cardenal-green mb-2">📞 Contacto Original</h3>
                                    <p>Email: {detailData.email}</p>
                                    <p>Teléfono: {detailData.telefono || '-'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <h3 className="font-bold text-cardenal-green mb-2">📍 Ubicación</h3>
                                    <p>Ciudad: {detailData.ciudad_residencia || '-'}</p>
                                    <p>País: {detailData.pais || 'Ecuador'}</p>
                                </div>
                            </div>

                            {/* Reservation Details from Form */}
                            <div className="bg-amber-50 p-4 rounded border border-amber-200">
                                <h3 className="font-bold text-cardenal-green mb-2">🏨 Datos de la Solicitud</h3>
                                <p className="mb-2"><strong>Motivo:</strong> {detailData.motivo}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                                    <div><strong>Entrada:</strong> {formatDate(detailData.fecha_entrada)}</div>
                                    <div><strong>Salida:</strong> {formatDate(detailData.fecha_salida)}</div>
                                    <div><strong>Adultos:</strong> {detailData.adultos}</div>
                                    <div><strong>Niños:</strong> {detailData.ninos}</div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-amber-200/50">
                                    <p><strong>Habitación:</strong> {detailData.habitacion_preferida || 'Sin preferencia'}</p>
                                    <p><strong>Comidas:</strong> {[
                                        detailData.desayuno ? 'Desayuno' : '',
                                        detailData.almuerzo ? 'Almuerzo' : '',
                                        detailData.cena ? 'Cena' : ''
                                    ].filter(Boolean).join(', ') || 'Ninguna'}</p>
                                </div>
                            </div>

                            {/* Billing & Requirements */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded">
                                    <h3 className="font-bold text-cardenal-green mb-2">💳 Facturación</h3>
                                    <p><strong>Requiere Factura:</strong> {detailData.desea_facturacion ? 'Sí' : 'No'}</p>
                                    {detailData.desea_facturacion && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <p>{detailData.razon_social}</p>
                                            <p>{detailData.identificacion}</p>
                                            <p>{detailData.direccion_facturacion}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <h3 className="font-bold text-cardenal-green mb-2">🐾 Otros Requerimientos</h3>
                                    <p><strong>Mascota:</strong> {detailData.trae_mascota ? 'Sí' : 'No'}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            {(detailData.comentarios || detailData.mensaje) && (
                                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                                    <h3 className="font-bold text-cardenal-green mb-2">💬 Mensaje del Cliente</h3>
                                    <p className="italic text-gray-700">"{detailData.comentarios || detailData.mensaje}"</p>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setShowDetail(false)}>Cerrar</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
