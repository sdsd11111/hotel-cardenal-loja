'use client';

import React, { useState, useEffect } from 'react';
import {
    Download,
    Search,
    ChevronDown,
    Calendar,
    Users,
    Check,
    Clock,
    User,
    ArrowLeft,
    RotateCcw,
    FileSpreadsheet,
    Mail,
    Phone,
    Plus,
    Eye,
    Trash2,
    Crown,
    X,
    Save,
    MapPin,
    Briefcase,
    Instagram,
    Facebook,
    Sparkles,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Cliente {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    hora_evento: string;
    motivo: string;
    fecha_entrada: string;
    fecha_salida: string;
    adultos: number;
    ninos: number;
    habitacion_preferida: string;
    desayuno: number;
    almuerzo: number;
    cena: number;
    desea_facturacion: number;
    tipo_documento: string;
    identificacion: string;
    razon_social: string;
    direccion_facturacion: string;
    trae_mascota: number;
    comentarios: string;
    mensaje: string;
    fecha_nacimiento: string;
    ciudad_residencia: string;
    pais: string;
    profesion: string;
    empresa: string;
    como_nos_conocio: string;
    instagram: string;
    facebook: string;
    preferencias_habitacion: string;
    alergias_alimentarias: string;
    total_estadias: number;
    ultima_estadia: string;
    notas_internas: string;
    calificacion: number;
    es_vip: number;
    created_at: string;
}

interface Reserva {
    id: number;
    nombre_cliente: string;
    fecha_entrada: string;
    fecha_salida: string;
    habitacion_id: string;
    adultos: number;
    ninos: number;
    precio: number;
    comision: number;
    numero_reserva: string;
    estado: string;
    created_at: string;
}

export default function AdminClientesPage() {
    const [view, setView] = useState<'gestion' | 'reporte'>('gestion');
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingReservas, setLoadingReservas] = useState(false);
    const [search, setSearch] = useState('');
    const [expandedClient, setExpandedClient] = useState<number | null>(null);
    const [editingClient, setEditingClient] = useState<Cliente | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Filters for Report (Default to current month)
    const [filterDesde, setFilterDesde] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    });
    const [filterHasta, setFilterHasta] = useState(() => {
        const d = new Date();
        const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
    });
    const [filterTipo, setFilterTipo] = useState('entrada');

    const fetchClientes = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/clientes?search=${search}`, { cache: 'no-store' });
            const data = await res.json();
            setClientes(data.clientes || []);
        } catch (error) {
            console.error("Error fetching clientes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReservas = async () => {
        setLoadingReservas(true);
        try {
            const timestamp = new Date().getTime();
            const res = await fetch(`/api/reservas?desde=${filterDesde}&hasta=${filterHasta}&tipoFecha=${filterTipo}&_=${timestamp}`, { cache: 'no-store' });
            const data = await res.json();
            setReservas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching reservas:", error);
        } finally {
            setLoadingReservas(false);
        }
    };

    useEffect(() => {
        if (view === 'gestion') fetchClientes();
        if (view === 'reporte') fetchReservas();
    }, [search, view]);

    const handleExpand = (id: number) => {
        if (expandedClient === id) {
            setExpandedClient(null);
            setEditingClient(null);
        } else {
            setExpandedClient(id);
            setEditingClient(clientes.find(c => c.id === id) || null);
        }
    };

    const handleSave = async () => {
        if (!editingClient) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/clientes/${editingClient.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingClient)
            });
            if (res.ok) {
                alert('Cambios guardados correctamente');
                fetchClientes();
                setExpandedClient(null);
                setEditingClient(null);
            }
        } catch (error) {
            console.error("Error updating cliente:", error);
            alert('Error al guardar cambios');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateReservaStatus = async (id: number, nuevoEstado: string) => {
        // Actualización optimista
        setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));

        try {
            console.log(`Intentando actualizar reserva ${id} a ${nuevoEstado}`);
            const res = await fetch('/api/reservas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, estado: nuevoEstado })
            });
            const data = await res.json();
            console.log('Respuesta del servidor:', data);

            if (res.ok) {
                // Estado actualizado optimísticamente; no refrescamos la lista
            } else {
                alert(`Error del servidor: ${data.error || 'Error desconocido'}`);
                fetchReservas(); // Revertir si falló
            }
        } catch (error) {
            console.error("Error updating reserva status:", error);
            alert(`Error de red al actualizar estado: ${error}`);
            fetchReservas(); // Revertir si falló
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este cliente permanentemente?')) return;
        try {
            const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchClientes();
            }
        } catch (error) {
            console.error("Error deleting cliente:", error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-outfit">
            <div className="max-w-[1400px] mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="outline" size="sm" className="gap-2 text-gray-600 h-9">
                                <ArrowLeft className="w-4 h-4" /> Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-cardenal-green flex items-center gap-2">
                                <Users className="w-7 h-7" />
                                Gestión de Clientes
                            </h1>
                            <p className="text-xs text-gray-500 font-medium">Base de datos de huéspedes</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={view === 'gestion' ? fetchClientes : fetchReservas} className="gap-2 h-9">
                            <RotateCcw className="w-4 h-4" /> Actualizar
                        </Button>
                        <Button className="bg-[#1D8348] hover:bg-[#196F3D] text-white gap-2 text-sm font-bold h-9">
                            <FileSpreadsheet className="w-4 h-4" /> Exportar Excel
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border-l-[6px] border-cardenal-gold shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Clientes</p>
                            <h2 className="text-4xl font-bold text-cardenal-green mt-1">{clientes.length}</h2>
                        </div>
                        <Users className="w-12 h-12 text-gray-100" />
                    </div>
                    <div className="bg-white p-6 rounded-xl border-l-[6px] border-blue-500 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nuevos este mes</p>
                            <h2 className="text-4xl font-bold text-blue-600 mt-1">{clientes.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length}</h2>
                        </div>
                        <Calendar className="w-12 h-12 text-blue-50" />
                    </div>
                    <div className="bg-white p-6 rounded-xl border-l-[6px] border-orange-400 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clientes VIP</p>
                            <h2 className="text-4xl font-bold text-orange-400 mt-1">{clientes.filter(c => c.es_vip).length}</h2>
                        </div>
                        <Crown className="w-12 h-12 text-orange-50" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setView('gestion')}
                        className={cn(
                            "px-6 py-3 font-bold text-sm transition-all relative outline-none",
                            view === 'gestion' ? "text-cardenal-green" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Lista de Clientes
                        {view === 'gestion' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cardenal-gold" />}
                    </button>
                    <button
                        onClick={() => setView('reporte')}
                        className={cn(
                            "px-6 py-3 font-bold text-sm transition-all relative outline-none",
                            view === 'reporte' ? "text-cardenal-green" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Reporte de Reservas (TAB)
                        {view === 'reporte' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cardenal-gold" />}
                    </button>
                </div>

                {view === 'gestion' ? (
                    <div className="space-y-4">
                        <div className="bg-white p-2 rounded-lg border flex items-center gap-2 shadow-sm">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, email o teléfono..."
                                    className="w-full pl-10 pr-4 py-2 text-sm outline-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button onClick={fetchClientes} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 font-bold text-xs uppercase tracking-wider h-10">
                                Buscar
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-center py-20 bg-white rounded-xl border">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cardenal-gold mx-auto mb-4"></div>
                                    <p className="text-gray-500 text-sm">Cargando base de datos...</p>
                                </div>
                            ) : clientes.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-xl border text-gray-500">
                                    No se encontraron clientes
                                </div>
                            ) : (
                                clientes.map(cliente => (
                                    <div key={cliente.id} className="bg-white rounded-xl border overflow-hidden shadow-sm transition-all">
                                        <div className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                                            <div className="flex items-center gap-4 flex-1">
                                                <button
                                                    onClick={() => handleExpand(cliente.id)}
                                                    className={cn(
                                                        "p-1 border rounded transition-colors",
                                                        expandedClient === cliente.id ? "bg-cardenal-gold text-white border-cardenal-gold" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                                    )}
                                                >
                                                    {expandedClient === cliente.id ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                </button>
                                                <div className="w-10 h-10 bg-cardenal-green text-white rounded flex items-center justify-center font-bold text-lg">
                                                    {cliente.nombre.charAt(0)}
                                                </div>
                                                <div className="min-w-[150px]">
                                                    <h3 className="font-bold text-gray-800 uppercase text-sm">{cliente.nombre} {cliente.apellidos}</h3>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[10px] text-gray-400">{cliente.motivo || 'Cliente Registrado'}</p>
                                                        {cliente.motivo === 'Consulta para Eventos Corporativos' && (
                                                            <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Evento</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="hidden lg:grid grid-cols-2 gap-y-1 gap-x-8 flex-1 ml-8">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Mail className="w-3.5 h-3.5" /> {cliente.email}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-xs text-gray-400">{new Date(cliente.created_at).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                                                        <div className="text-xs font-bold text-gray-600">{cliente.habitacion_preferida}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Phone className="w-3.5 h-3.5" /> {cliente.telefono}
                                                    </div>
                                                    <div className="flex items-center gap-8">
                                                        <div className="flex items-center gap-1">
                                                            <span className="font-bold text-gray-800 text-sm">{cliente.total_estadias}</span>
                                                            <span className="text-[10px] text-gray-400">estadías</span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-400">{new Date(cliente.created_at).toLocaleDateString()} registro</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button onClick={() => handleExpand(cliente.id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <a href={`tel:${cliente.telefono}`} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                                <button onClick={() => handleDelete(cliente.id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Detailed Expansion */}
                                        {expandedClient === cliente.id && editingClient && (
                                            <div className="border-t bg-gray-50/30 p-8 space-y-8 animate-fadeIn">
                                                {/* Datos Personales */}
                                                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                                                    <h4 className="font-bold text-cardenal-green flex items-center gap-2 text-sm border-b pb-2">
                                                        <User className="w-4 h-4" /> Datos Personales
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" /> Fecha de Cumpleaños
                                                            </label>
                                                            <Input
                                                                type="date"
                                                                value={editingClient.fecha_nacimiento ? editingClient.fecha_nacimiento.split('T')[0] : ''}
                                                                onChange={e => setEditingClient({ ...editingClient, fecha_nacimiento: e.target.value })}
                                                                className="text-sm h-10"
                                                            />
                                                        </div>
                                                        {editingClient.motivo?.toLowerCase().includes('evento') && (
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" /> Hora del Evento
                                                                </label>
                                                                <Input
                                                                    type="text"
                                                                    value={editingClient.hora_evento || ''}
                                                                    onChange={e => setEditingClient({ ...editingClient, hora_evento: e.target.value })}
                                                                    className="text-sm h-10 border-orange-200 bg-orange-50 font-bold"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" /> Ciudad de Residencia
                                                            </label>
                                                            <Input
                                                                value={editingClient.ciudad_residencia || ''}
                                                                placeholder="Ej: Loja"
                                                                onChange={e => setEditingClient({ ...editingClient, ciudad_residencia: e.target.value })}
                                                                className="text-sm h-10"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">País</label>
                                                            <Input
                                                                value={editingClient.pais || ''}
                                                                onChange={e => setEditingClient({ ...editingClient, pais: e.target.value })}
                                                                className="text-sm h-10"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <Briefcase className="w-3 h-3" /> Profesión
                                                            </label>
                                                            <Input
                                                                value={editingClient.profesion || ''}
                                                                onChange={e => setEditingClient({ ...editingClient, profesion: e.target.value })}
                                                                className="text-sm h-10"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <Briefcase className="w-3 h-3" /> Empresa
                                                            </label>
                                                            <Input
                                                                value={editingClient.empresa || ''}
                                                                onChange={e => setEditingClient({ ...editingClient, empresa: e.target.value })}
                                                                className="text-sm h-10"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">¿Cómo nos conoció?</label>
                                                            <select
                                                                value={editingClient.como_nos_conocio || ''}
                                                                onChange={e => setEditingClient({ ...editingClient, como_nos_conocio: e.target.value })}
                                                                className="w-full border rounded-md h-10 px-3 text-sm outline-none focus:ring-1 focus:ring-cardenal-gold"
                                                            >
                                                                <option value="">Seleccionar...</option>
                                                                <option value="Redes Sociales">Redes Sociales</option>
                                                                <option value="Recomendación">Recomendación</option>
                                                                <option value="Booking">Booking / OTA</option>
                                                                <option value="Publicidad">Publicidad</option>
                                                                <option value="Pasante">Pasaba por el lugar</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Redes Sociales */}
                                                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                                                    <h4 className="font-bold text-cardenal-green flex items-center gap-2 text-sm border-b pb-2">
                                                        <Instagram className="w-4 h-4" /> Redes Sociales
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <Instagram className="w-3 h-3" /> Instagram
                                                            </label>
                                                            <Input
                                                                value={editingClient.instagram || ''}
                                                                onChange={e => setEditingClient({ ...editingClient, instagram: e.target.value })}
                                                                className="text-sm h-10"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                                <Facebook className="w-3 h-3" /> Facebook
                                                            </label>
                                                            <Input
                                                                value={editingClient.facebook || ''}
                                                                onChange={e => setEditingClient({ ...editingClient, facebook: e.target.value })}
                                                                className="text-sm h-10"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Preferencias */}
                                                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                                                    <h4 className="font-bold text-cardenal-green flex items-center gap-2 text-sm border-b pb-2">
                                                        <Sparkles className="w-4 h-4" /> Preferencias
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preferencias de Habitación</label>
                                                            <Textarea
                                                                value={editingClient.preferencias_habitacion || ''}
                                                                onChange={e => setEditingClient({ ...editingClient, preferencias_habitacion: e.target.value })}
                                                                className="text-sm min-h-[100px]"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alergias Alimentarias</label>
                                                            <Textarea
                                                                value={editingClient.alergias_alimentarias || ''}
                                                                onChange={e => setEditingClient({ ...editingClient, alergias_alimentarias: e.target.value })}
                                                                className="text-sm min-h-[100px]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Notas Internas */}
                                                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm space-y-4">
                                                    <h4 className="font-bold text-blue-600 flex items-center gap-2 text-sm border-b pb-2">
                                                        <AlertCircle className="w-4 h-4" /> Notas Internas
                                                    </h4>
                                                    <div className="bg-blue-50/30 p-4 rounded-lg space-y-3 min-h-[100px]">
                                                        {editingClient.notas_internas ? (
                                                            editingClient.notas_internas.split('---').map((nota, i) => (
                                                                <div key={i} className="text-xs text-gray-600 pb-2 border-b border-blue-50 last:border-0 italic">
                                                                    {nota.trim()}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-xs text-gray-400">Sin notas internas para este cliente.</p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            id="newNote"
                                                            placeholder="Escribir nueva nota..."
                                                            className="text-xs h-10 flex-1"
                                                            defaultValue=""
                                                        />
                                                        <Button
                                                            onClick={() => {
                                                                const noteInput = document.getElementById('newNote') as HTMLInputElement;
                                                                if (!noteInput.value.trim()) return;
                                                                const date = new Date().toLocaleString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
                                                                const newNote = `[${date}] ${noteInput.value}`;
                                                                const currentNotes = editingClient.notas_internas || '';
                                                                setEditingClient({
                                                                    ...editingClient,
                                                                    notas_internas: currentNotes ? `${currentNotes}\n---\n${newNote}` : newNote
                                                                });
                                                                noteInput.value = '';
                                                            }}
                                                            variant="outline"
                                                            className="h-10 text-blue-600 border-blue-200 px-4 font-bold text-xs"
                                                        >
                                                            <Plus className="w-3 h-3 mr-1" /> Agregar Nota
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex justify-end gap-3 pt-4 border-t">
                                                    <Button
                                                        onClick={() => setExpandedClient(null)}
                                                        variant="outline"
                                                        className="h-11 px-8 border-gray-300 font-bold"
                                                    >
                                                        <X className="w-4 h-4 mr-2" /> Cancelar
                                                    </Button>
                                                    <Button
                                                        onClick={handleSave}
                                                        disabled={isSaving}
                                                        className="h-11 px-10 bg-cardenal-green hover:bg-cardenal-green/90 text-white font-bold shadow-lg"
                                                    >
                                                        {isSaving ? 'Guardando...' : <><Save className="w-4 h-4 mr-2" /> Guardar Cambios</>}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    /* Reporte de Reservas (TAB) */
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex flex-wrap items-end gap-6 mb-8">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fecha de</label>
                                    <div className="relative">
                                        <select
                                            value={filterTipo}
                                            onChange={(e) => setFilterTipo(e.target.value)}
                                            className="appearance-none bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium outline-none w-40"
                                        >
                                            <option value="entrada">Check-in</option>
                                            <option value="reserva">Reserva</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <div className="space-y-1.5 flex-1 max-w-[200px]">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Desde</label>
                                    <input
                                        type="date"
                                        value={filterDesde}
                                        onChange={(e) => setFilterDesde(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5 flex-1 max-w-[200px]">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hasta</label>
                                    <input
                                        type="date"
                                        value={filterHasta}
                                        onChange={(e) => setFilterHasta(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm"
                                    />
                                </div>
                                <Button onClick={fetchReservas} className="bg-[#0071c2] hover:bg-[#005a9c] text-white font-bold h-10 px-8">Mostrar</Button>
                            </div>

                            <div className="border rounded-xl overflow-hidden bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="px-4 py-3 text-xs font-bold text-gray-600">Nombre del huésped</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-600">Check-in</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-600">Check-out</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-600">Habitaciones</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-600 text-center">Estado</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-600 text-right">Precio</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-600 text-right">Nro Reserva</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {loadingReservas ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm italic">Cargando reportes...</td>
                                            </tr>
                                        ) : reservas.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm italic">No hay datos en el rango seleccionado.</td>
                                            </tr>
                                        ) : (
                                            reservas.map(reserva => (
                                                <tr key={reserva.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <div className="text-sm font-bold text-[#0071c2] uppercase">{reserva.nombre_cliente}</div>
                                                        <div className="text-[10px] text-gray-400">{reserva.adultos} adultos, {reserva.ninos} niños</div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium">{new Date(reserva.fecha_entrada).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{new Date(reserva.fecha_salida).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                    <td className="px-4 py-4 text-sm font-bold text-gray-700">{reserva.habitacion_id}</td>
                                                    <td className="px-4 py-4">
                                                        <select
                                                            value={reserva.estado}
                                                            onChange={(e) => handleUpdateReservaStatus(reserva.id, e.target.value)}
                                                            className={cn(
                                                                "text-xs font-bold border rounded px-2 py-1 outline-none",
                                                                reserva.estado === 'OK' ? "text-green-600 border-green-200 bg-green-50" :
                                                                    reserva.estado === 'CANCELADA' ? "text-red-600 border-red-200 bg-red-50" :
                                                                        reserva.estado === 'PENDIENTE' ? "text-orange-600 border-orange-200 bg-orange-50 font-bold" :
                                                                            "text-gray-600 border-gray-200"
                                                            )}
                                                        >
                                                            <option value="PENDIENTE">PENDIENTE</option>
                                                            <option value="OK">OK</option>
                                                            <option value="CANCELADA">CANCELADA</option>
                                                            <option value="NO PRESENTADO">NO PRESENTADO</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-right font-bold text-gray-800">US${Number(reserva.precio).toFixed(2)}</td>
                                                    <td className="px-4 py-4 text-sm text-right text-[#0071c2] font-medium">{reserva.numero_reserva || '---'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8 p-6 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center gap-4">
                                <Clock className="w-8 h-8 text-blue-400" />
                                <div>
                                    <h4 className="text-sm font-bold text-blue-800 uppercase tracking-tighter">Sincronización de Pasarela TAB</h4>
                                    <p className="text-xs text-blue-600">Este reporte se actualiza automáticamente con cada pago confirmado vía Webhook. Los cambios manuales de estado se guardan al instante.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
