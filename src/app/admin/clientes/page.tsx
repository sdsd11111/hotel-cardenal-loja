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
            const isNew = editingClient.id === 0;
            const url = isNew ? '/api/clientes' : `/api/clientes/${editingClient.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingClient)
            });
            if (res.ok) {
                alert(isNew ? 'Cliente creado correctamente' : 'Cambios guardados correctamente');
                fetchClientes();
                setExpandedClient(null);
                setEditingClient(null);
            }
        } catch (error) {
            console.error("Error saving cliente:", error);
            alert('Error al guardar datos');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateReservaStatus = async (id: number, nuevoEstado: string) => {
        setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));

        try {
            const res = await fetch('/api/reservas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, estado: nuevoEstado })
            });
            const data = await res.json();

            if (!res.ok) {
                alert(`Error del servidor: ${data.error || 'Error desconocido'}`);
                fetchReservas();
            }
        } catch (error) {
            console.error("Error updating reserva status:", error);
            alert(`Error de red al actualizar estado: ${error}`);
            fetchReservas();
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

    const renderDetailsForm = (client: Cliente) => {
        if (!client) return null;
        return (
            <div className="space-y-8 animate-fadeIn">
                {/* Datos Personales */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h4 className="font-bold text-cardenal-green flex items-center gap-2 text-sm border-b pb-2">
                        <User className="w-4 h-4" /> Datos Personales
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombres *</label>
                            <Input
                                value={client.nombre || ''}
                                onChange={e => setEditingClient({ ...client, nombre: e.target.value })}
                                className="text-sm h-10"
                                placeholder="Nombres"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Apellidos</label>
                            <Input
                                value={client.apellidos || ''}
                                onChange={e => setEditingClient({ ...client, apellidos: e.target.value })}
                                className="text-sm h-10"
                                placeholder="Apellidos"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email *</label>
                            <Input
                                type="email"
                                value={client.email || ''}
                                onChange={e => setEditingClient({ ...client, email: e.target.value })}
                                className="text-sm h-10"
                                placeholder="email@ejemplo.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teléfono</label>
                            <Input
                                value={client.telefono || ''}
                                onChange={e => setEditingClient({ ...client, telefono: e.target.value })}
                                className="text-sm h-10"
                                placeholder="099..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Motivo</label>
                            <Input
                                value={client.motivo || ''}
                                onChange={e => setEditingClient({ ...client, motivo: e.target.value })}
                                className="text-sm h-10"
                                placeholder="Ej: Reserva, Consulta"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-orange-500" /> Fecha entrada/evento
                            </label>
                            <Input
                                type="date"
                                value={client.fecha_entrada || ''}
                                onChange={e => setEditingClient({ ...client, fecha_entrada: e.target.value })}
                                className="text-sm h-10 border-orange-100"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Hora del Evento
                            </label>
                            <Input
                                type="text"
                                value={client.hora_evento || ''}
                                onChange={e => setEditingClient({ ...client, hora_evento: e.target.value })}
                                className="text-sm h-10 border-orange-200 bg-orange-50 font-bold"
                                placeholder="HH:MM"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                                <Users className="w-3 h-3" /> Personas / Huéspedes
                            </label>
                            <Input
                                type="number"
                                value={client.adultos || 1}
                                onChange={e => setEditingClient({ ...client, adultos: parseInt(e.target.value) || 1 })}
                                className="text-sm h-10 border-blue-100"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Habitación Preferida</label>
                            <Input
                                value={client.habitacion_preferida || ''}
                                onChange={e => setEditingClient({ ...client, habitacion_preferida: e.target.value })}
                                className="text-sm h-10"
                                placeholder="Ej: Suite Matrimonial"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comentarios / Mensaje del Cliente</label>
                        <Textarea
                            value={client.comentarios || client.mensaje || ''}
                            onChange={e => setEditingClient({ ...client, comentarios: e.target.value })}
                            className="text-sm min-h-[80px]"
                            placeholder="Notas que el cliente envió en el formulario..."
                        />
                    </div>
                </div>

                {/* Perfil Detallado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h4 className="font-bold text-cardenal-green flex items-center gap-2 text-sm border-b pb-2">
                            <MapPin className="w-4 h-4" /> Ubicación y Perfil
                        </h4>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ciudad de Residencia</label>
                            <Input
                                value={client.ciudad_residencia || ''}
                                onChange={e => setEditingClient({ ...client, ciudad_residencia: e.target.value })}
                                className="text-sm h-10"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">País</label>
                            <Input
                                value={client.pais || ''}
                                onChange={e => setEditingClient({ ...client, pais: e.target.value })}
                                className="text-sm h-10"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profesión / Empresa</label>
                            <div className="flex gap-2">
                                <Input
                                    value={client.profesion || ''}
                                    onChange={e => setEditingClient({ ...client, profesion: e.target.value })}
                                    className="text-sm h-10 flex-1"
                                    placeholder="Profesión"
                                />
                                <Input
                                    value={client.empresa || ''}
                                    onChange={e => setEditingClient({ ...client, empresa: e.target.value })}
                                    className="text-sm h-10 flex-1"
                                    placeholder="Empresa"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h4 className="font-bold text-cardenal-green flex items-center gap-2 text-sm border-b pb-2">
                            <Instagram className="w-4 h-4" /> Redes Sociales y CRM
                        </h4>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <Instagram className="w-3 h-3" /> Instagram
                            </label>
                            <Input
                                value={client.instagram || ''}
                                onChange={e => setEditingClient({ ...client, instagram: e.target.value })}
                                className="text-sm h-10"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                <Facebook className="w-3 h-3" /> Facebook
                            </label>
                            <Input
                                value={client.facebook || ''}
                                onChange={e => setEditingClient({ ...client, facebook: e.target.value })}
                                className="text-sm h-10"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">¿Cómo nos conoció?</label>
                            <select
                                value={client.como_nos_conocio || ''}
                                onChange={e => setEditingClient({ ...client, como_nos_conocio: e.target.value })}
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

                {/* Preferencias y Notas */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h4 className="font-bold text-cardenal-green flex items-center gap-2 text-sm border-b pb-2">
                        <Sparkles className="w-4 h-4" /> Preferencias y Alergias
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preferencias de Habitación</label>
                            <Textarea
                                value={client.preferencias_habitacion || ''}
                                onChange={e => setEditingClient({ ...client, preferencias_habitacion: e.target.value })}
                                className="text-sm min-h-[80px]"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alergias Alimentarias</label>
                            <Textarea
                                value={client.alergias_alimentarias || ''}
                                onChange={e => setEditingClient({ ...client, alergias_alimentarias: e.target.value })}
                                className="text-sm min-h-[80px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Notas Internas */}
                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm space-y-4">
                    <h4 className="font-bold text-blue-600 flex items-center gap-2 text-sm border-b pb-2">
                        <AlertCircle className="w-4 h-4" /> Notas Internas (Solo Admin)
                    </h4>
                    <div className="bg-blue-50/30 p-4 rounded-lg space-y-3 min-h-[100px] max-h-[200px] overflow-y-auto">
                        {client.notas_internas ? (
                            client.notas_internas.split('---').map((nota, i) => (
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
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    const btn = document.getElementById('addNoteBtn');
                                    if (btn) btn.click();
                                }
                            }}
                        />
                        <Button
                            id="addNoteBtn"
                            onClick={() => {
                                const noteInput = document.getElementById('newNote') as HTMLInputElement;
                                if (!noteInput || !noteInput.value.trim()) return;
                                const date = new Date().toLocaleString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
                                const newNote = `[${date}] ${noteInput.value}`;
                                const currentNotes = client.notas_internas || '';
                                setEditingClient({
                                    ...client,
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
                        onClick={() => { setExpandedClient(null); setEditingClient(null); }}
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
                        {isSaving ? 'Guardando...' : <><Save className="w-4 h-4 mr-2" /> {client.id === 0 ? 'Crear Cliente' : 'Guardar Cambios'}</>}
                    </Button>
                </div>
            </div>
        );
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
                        <Button
                            onClick={() => {
                                if (view === 'gestion') {
                                    window.open('/api/clientes/export', '_blank');
                                } else {
                                    window.open(`/api/reservas/export?desde=${filterDesde}&hasta=${filterHasta}&tipoFecha=${filterTipo}`, '_blank');
                                }
                            }}
                            className="bg-[#1D8348] hover:bg-[#196F3D] text-white gap-2 text-sm font-bold h-9"
                        >
                            <FileSpreadsheet className="w-4 h-4" /> Descargar Excel
                        </Button>
                        {view === 'gestion' && (
                            <Button
                                onClick={() => {
                                    setEditingClient({
                                        id: 0,
                                        nombre: '',
                                        apellidos: '',
                                        email: '',
                                        telefono: '',
                                        motivo: 'Registro Manual',
                                        fecha_entrada: '',
                                        fecha_salida: '',
                                        hora_evento: '',
                                        adultos: 1,
                                        ninos: 0,
                                        habitacion_preferida: '',
                                        comentarios: '',
                                        notas_internas: '',
                                        created_at: new Date().toISOString()
                                    } as any);
                                    setExpandedClient(0);
                                }}
                                className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white gap-2 text-sm font-bold h-9"
                            >
                                <Plus className="w-4 h-4" /> Nuevo Cliente
                            </Button>
                        )}
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
                            ) : (
                                <>
                                    {/* Manual Creation Entry at the top */}
                                    {expandedClient === 0 && editingClient && (
                                        <div className="bg-white rounded-xl border-2 border-cardenal-gold overflow-hidden shadow-lg animate-fadeIn mb-6">
                                            <div className="p-4 bg-cardenal-gold/5 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-cardenal-gold text-white rounded flex items-center justify-center">
                                                        <Plus className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 uppercase text-sm">Crear Nuevo Cliente</h3>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Formulario de Registro Manual</p>
                                                    </div>
                                                </div>
                                                <Button onClick={() => { setExpandedClient(null); setEditingClient(null); }} variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="p-8 space-y-8 bg-white">
                                                {renderDetailsForm(editingClient)}
                                            </div>
                                        </div>
                                    )}

                                    {clientes.length === 0 ? (
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
                                                                {cliente.motivo?.toLowerCase().includes('evento') && (
                                                                    <span className="bg-amber-100 text-amber-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Evento</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="hidden lg:grid grid-cols-4 gap-y-1 gap-x-4 flex-1 ml-8">
                                                            <div className="space-y-0.5">
                                                                <p className="text-[9px] font-bold text-gray-400 uppercase">Contacto</p>
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium truncate max-w-[150px]">
                                                                    <Mail className="w-3 h-3 text-gray-400" /> {cliente.email}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                                                    <Phone className="w-3 h-3 text-gray-400" /> {cliente.telefono}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-0.5">
                                                                <p className="text-[9px] font-bold text-gray-400 uppercase">Detalles del Evento</p>
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                                                                    <Calendar className="w-3 h-3 text-orange-500" /> {cliente.fecha_entrada || '---'}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                                                                    <Clock className="w-3 h-3 text-orange-500" /> {cliente.hora_evento || '---'}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-0.5">
                                                                <p className="text-[9px] font-bold text-gray-400 uppercase">Personas / Hab.</p>
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                                                                    <Users className="w-3 h-3 text-blue-500" /> {cliente.adultos} personas
                                                                </div>
                                                                <div className="text-[10px] text-gray-500 font-medium truncate">{cliente.habitacion_preferida || 'Sin preferencia'}</div>
                                                            </div>

                                                            <div className="space-y-0.5">
                                                                <p className="text-[9px] font-bold text-gray-400 uppercase">Comentarios</p>
                                                                <div className="text-[11px] text-gray-600 italic leading-tight line-clamp-2 max-w-[200px]">
                                                                    "{cliente.comentarios || cliente.mensaje || 'Sin comentarios'}"
                                                                </div>
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
                                                    <div className="border-t bg-gray-50/30 p-8">
                                                        {renderDetailsForm(editingClient)}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </>
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
