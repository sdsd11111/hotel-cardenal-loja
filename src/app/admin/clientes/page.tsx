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
    AlertCircle,
    Hotel,
    Loader2
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
    meta: string;
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
    const [activeCategory, setActiveCategory] = useState<'Hotel' | 'Restaurante' | 'Eventos'>('Hotel');

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
                <div className="bg-white p-8 rounded-3xl border-2 border-gray-300 shadow-xl space-y-6">
                    <h4 className="text-xl font-black text-cardenal-green flex items-center gap-3 border-b-2 border-gray-100 pb-4 uppercase tracking-tight">
                        <User className="w-7 h-7" /> Datos Personales
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-black uppercase tracking-widest">Nombres *</label>
                            <Input
                                value={client.nombre || ''}
                                onChange={e => setEditingClient({ ...client, nombre: e.target.value })}
                                className="h-12 border-2 border-gray-400 font-bold text-base"
                                placeholder="Nombres"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-black uppercase tracking-widest">Apellidos</label>
                            <Input
                                value={client.apellidos || ''}
                                onChange={e => setEditingClient({ ...client, apellidos: e.target.value })}
                                className="h-12 border-2 border-gray-400 font-bold text-base"
                                placeholder="Apellidos"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-black uppercase tracking-widest">Email *</label>
                            <Input
                                type="email"
                                value={client.email || ''}
                                onChange={e => setEditingClient({ ...client, email: e.target.value })}
                                className="h-12 border-2 border-gray-400 font-bold text-base"
                                placeholder="email@ejemplo.com"
                            />
                        </div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teléfono</label>
                        <Input
                            value={client.telefono || ''}
                            onChange={e => setEditingClient({ ...client, telefono: e.target.value })}
                            className="text-sm h-10"
                            placeholder="099..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sección Hotel: Hospedaje */}
                    <div className="bg-orange-50/30 p-6 rounded-3xl border-2 border-orange-200 space-y-4">
                        <h5 className="text-sm font-black text-orange-800 uppercase flex items-center gap-2 border-b border-orange-100 pb-2">
                            <Hotel className="w-4 h-4" /> Datos de Hospedaje (Habitaciones)
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-orange-900 uppercase tracking-widest">Entrada (Check-in)</label>
                                <Input
                                    type="date"
                                    value={client.fecha_entrada || ''}
                                    onChange={e => setEditingClient({ ...client, fecha_entrada: e.target.value })}
                                    className="h-12 border-2 border-orange-400 font-black bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-orange-900 uppercase tracking-widest">Salida (Check-out)</label>
                                <Input
                                    type="date"
                                    value={client.fecha_salida || ''}
                                    onChange={e => setEditingClient({ ...client, fecha_salida: e.target.value })}
                                    className="h-12 border-2 border-orange-400 font-black bg-white"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-orange-900 uppercase tracking-widest">Habitación Preferida</label>
                            <Input
                                value={client.habitacion_preferida || ''}
                                onChange={e => setEditingClient({ ...client, habitacion_preferida: e.target.value })}
                                className="h-12 border-2 border-gray-400 font-bold bg-white"
                                placeholder="Ej: Suite Matrimonial"
                            />
                        </div>
                    </div>

                    {/* Sección Eventos y Otros */}
                    <div className="bg-blue-50/30 p-6 rounded-3xl border-2 border-blue-200 space-y-4">
                        <h5 className="text-sm font-black text-blue-800 uppercase flex items-center gap-2 border-b border-blue-100 pb-2">
                            <Calendar className="w-4 h-4" /> Datos de Reserva / Evento
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-blue-900 uppercase tracking-widest">Motivo / Tipo</label>
                                <Input
                                    value={client.motivo || ''}
                                    onChange={e => setEditingClient({ ...client, motivo: e.target.value })}
                                    className="h-12 border-2 border-blue-400 font-bold bg-white"
                                    placeholder="Ej: Evento, Cena"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-blue-900 uppercase tracking-widest">Hora (Si aplica)</label>
                                <Input
                                    type="text"
                                    value={client.hora_evento || ''}
                                    onChange={e => setEditingClient({ ...client, hora_evento: e.target.value })}
                                    className="h-12 border-2 border-blue-400 font-black bg-white"
                                    placeholder="HH:MM"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Adultos
                                </label>
                                <Input
                                    type="number"
                                    value={client.adultos || 1}
                                    onChange={e => setEditingClient({ ...client, adultos: parseInt(e.target.value) || 1 })}
                                    className="h-12 border-2 border-gray-400 font-bold bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-1">
                                    <Users className="w-3 h-3" /> Niños
                                </label>
                                <Input
                                    type="number"
                                    value={client.ninos || 0}
                                    onChange={e => setEditingClient({ ...client, ninos: parseInt(e.target.value) || 0 })}
                                    className="h-12 border-2 border-gray-400 font-bold bg-white"
                                />
                            </div>
                        </div>
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
            </div >
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
                            <h1 className="text-3xl font-black text-cardenal-green flex items-center gap-3 font-serif">
                                <Users className="w-8 h-8" />
                                Gestión de Clientes
                            </h1>
                            <p className="text-sm text-black font-black uppercase tracking-widest mt-1">Base de datos de huéspedes</p>
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
                    <div className="bg-white p-7 rounded-2xl border-2 border-gray-300 border-l-[10px] border-l-cardenal-gold shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Total Clientes</p>
                            <h2 className="text-5xl font-black text-cardenal-green">{clientes.length}</h2>
                        </div>
                        <Users className="w-14 h-14 text-cardenal-gold/20" />
                    </div>
                    <div className="bg-white p-7 rounded-2xl border-2 border-gray-300 border-l-[10px] border-l-blue-600 shadow-md flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1">Nuevos este mes</p>
                            <h2 className="text-5xl font-black text-blue-700">{clientes.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length}</h2>
                        </div>
                        <Calendar className="w-14 h-14 text-blue-600/20" />
                    </div>
                </div>

                {/* View Switcher */}
                <div className="flex bg-gray-200 p-2 rounded-2xl mb-8 w-fit gap-2 border-2 border-gray-300 shadow-sm">
                    <button
                        onClick={() => setView('gestion')}
                        className={cn(
                            "px-8 py-3 rounded-xl text-base font-black transition-all",
                            view === 'gestion' ? "bg-white text-cardenal-green shadow-md scale-105" : "text-gray-700 hover:bg-gray-300 hover:text-black"
                        )}
                    >
                        Gestión de Clientes
                    </button>
                    <button
                        onClick={() => setView('reporte')}
                        className={cn(
                            "px-8 py-3 rounded-xl text-base font-black transition-all",
                            view === 'reporte' ? "bg-white text-cardenal-green shadow-md scale-105" : "text-gray-700 hover:bg-gray-300 hover:text-black"
                        )}
                    >
                        Reporte de Reservas
                    </button>
                </div>

                {/* Categories Tabs (Only for Gestion view) */}
                {view === 'gestion' && (
                    <div className="flex gap-4 mb-6">
                        {[
                            { id: 'Hotel', label: '🏨 Hotel', color: 'bg-orange-600' },
                            { id: 'Restaurante', label: '🍽️ Restaurante', color: 'bg-green-600' },
                            { id: 'Eventos', label: '🎉 Eventos', color: 'bg-blue-600' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveCategory(tab.id as any)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-black transition-all border-2",
                                    activeCategory === tab.id
                                        ? `${tab.color} text-white border-transparent shadow-lg scale-105`
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {view === 'gestion' ? (
                    <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-300 mb-8">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
                            <div className="relative w-full md:max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
                                <Input
                                    placeholder="Buscar por nombre, email o cédula..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-14 py-7 bg-gray-100 border-2 border-gray-400 rounded-2xl text-lg font-black text-black placeholder:text-gray-600 focus:border-cardenal-gold transition-all"
                                />
                            </div>
                            <div className="text-sm font-black text-black bg-cardenal-gold/10 px-4 py-2 rounded-full border-2 border-cardenal-gold/30">
                                Mostrando {
                                    clientes.filter(c => {
                                        const m = (c.motivo || '').toLowerCase();
                                        if (activeCategory === 'Restaurante') return m === 'consulta de restaurante';
                                        if (activeCategory === 'Eventos') return m.includes('evento') || m.includes('cotizacion');
                                        return !m.includes('restaurante') && !m.includes('evento') && !m.includes('cotizacion');
                                    }).length
                                } resultados
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border-2 border-gray-300 shadow-inner">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-200 border-b-2 border-gray-300">
                                    <tr>
                                        <th className="p-5 text-sm font-black text-black uppercase tracking-widest whitespace-nowrap">Cliente</th>
                                        <th className="p-5 text-sm font-black text-black uppercase tracking-widest whitespace-nowrap">Contacto</th>
                                        <th className="p-5 text-sm font-black text-black uppercase tracking-widest whitespace-nowrap">DNI / Razón Social</th>
                                        <th className="p-5 text-sm font-black text-black uppercase tracking-widest whitespace-nowrap">Estadísticas</th>
                                        <th className="p-5 text-sm font-black text-black uppercase tracking-widest whitespace-nowrap text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-gray-200">
                                    {/* Manual Creation Entry at the top */}
                                    {expandedClient === 0 && editingClient && (
                                        <tr>
                                            <td colSpan={5} className="p-0">
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
                                            </td>
                                        </tr>
                                    )}

                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="p-32 text-center bg-gray-50/50">
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="w-20 h-20 border-8 border-gray-200 border-t-cardenal-gold animate-spin rounded-full shadow-md"></div>
                                                    <p className="text-2xl font-black text-black uppercase tracking-widest animate-pulse">Cargando base de datos...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : clientes.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-32 text-center bg-gray-50/50">
                                                <div className="flex flex-col items-center gap-6 opacity-30">
                                                    <Search className="w-24 h-24 text-black" />
                                                    <p className="text-3xl font-black text-black uppercase tracking-widest">No se encontraron clientes.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        clientes
                                            .filter(c => {
                                                const m = (c.motivo || '').toLowerCase();
                                                if (activeCategory === 'Restaurante') return m === 'consulta de restaurante';
                                                if (activeCategory === 'Eventos') return m.includes('evento') || m.includes('cotizacion');
                                                return !m.includes('restaurante') && !m.includes('evento') && !m.includes('cotizacion');
                                            })
                                            .map(cliente => (
                                                <React.Fragment key={cliente.id}>
                                                    <tr className={cn(
                                                        "transition-all duration-300 border-l-4 group cursor-pointer",
                                                        expandedClient === cliente.id ? "bg-cardenal-gold/5 border-l-cardenal-gold" : "hover:bg-gray-50 border-l-transparent",
                                                        cliente.es_vip ? "bg-yellow-50/30" : ""
                                                    )}>
                                                        <td className="p-5" onClick={() => handleExpand(cliente.id)}>
                                                            <div className="flex items-center gap-4">
                                                                <div className={cn(
                                                                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-md border-2",
                                                                    cliente.es_vip ? "bg-cardenal-gold text-white border-yellow-600" : "bg-cardenal-green text-white border-green-800"
                                                                )}>
                                                                    {cliente.nombre[0]}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-black text-lg text-black leading-none">{cliente.nombre} {cliente.apellidos}</p>
                                                                        {cliente.es_vip === 1 && <Crown className="w-5 h-5 text-cardenal-gold fill-cardenal-gold" />}
                                                                    </div>
                                                                    <p className="text-xs font-black text-gray-700 mt-1 uppercase tracking-tight">ID: #{cliente.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-5" onClick={() => handleExpand(cliente.id)}>
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center gap-2 text-sm font-black text-black">
                                                                    <Mail className="w-4 h-4 text-cardenal-gold" /> {cliente.email || '—'}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm font-black text-black">
                                                                    <Phone className="w-4 h-4 text-green-700" /> {cliente.telefono || '—'}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-5" onClick={() => handleExpand(cliente.id)}>
                                                            <div className="space-y-1.5 uppercase">
                                                                <p className="text-sm font-black text-black">{cliente.identificacion || '—'}</p>
                                                                <p className="text-[10px] font-black text-gray-700 max-w-[200px] truncate">{cliente.razon_social || 'PERSONAL'}</p>
                                                            </div>
                                                        </td>
                                                        <td className="p-5" onClick={() => handleExpand(cliente.id)}>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="bg-cardenal-green/10 text-cardenal-green text-[10px] font-black px-2 py-0.5 rounded border border-cardenal-green/20">
                                                                        {cliente.total_estadias || 0} VISITAS
                                                                    </div>
                                                                    {cliente.ultima_estadia && (
                                                                        <div className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">
                                                                            ULT: {new Date(cliente.ultima_estadia).toLocaleDateString()}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {cliente.calificacion > 0 && (
                                                                    <div className="flex gap-0.5">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Sparkles key={i} className={cn("w-3 h-3", i < cliente.calificacion ? "text-cardenal-gold fill-cardenal-gold" : "text-gray-300")} />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-5 text-right">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleExpand(cliente.id)}
                                                                    className={cn("rounded-xl border-2 transition-all", expandedClient === cliente.id ? "bg-cardenal-gold text-white border-cardenal-gold" : "hover:bg-gray-100 border-gray-200 text-black")}
                                                                >
                                                                    {expandedClient === cliente.id ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => { if (confirm('¿Eliminar cliente?')) fetch(`/api/clientes/${cliente.id}`, { method: 'DELETE' }).then(() => fetchClientes()) }}
                                                                    className="hover:bg-red-50 text-red-600 rounded-xl border-2 border-transparent hover:border-red-200"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {expandedClient === cliente.id && (
                                                        <tr>
                                                            <td colSpan={5} className="p-0 bg-gray-100/50">
                                                                <div className="p-10 border-x-4 border-b-4 border-cardenal-gold rounded-b-3xl shadow-inner animate-in slide-in-from-top duration-300">
                                                                    {renderDetailsForm(editingClient || cliente)}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Reporte de Reservas (TAB) */
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-300">
                            <div className="flex flex-wrap items-end gap-6 mb-8 bg-gray-100 p-6 rounded-2xl border-2 border-gray-200">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-black uppercase tracking-widest block">Filtrar por</label>
                                    <div className="relative">
                                        <select
                                            value={filterTipo}
                                            onChange={(e) => setFilterTipo(e.target.value)}
                                            className="appearance-none bg-white border-2 border-gray-400 rounded-xl px-5 py-3 pr-12 text-base font-black outline-none w-48 text-black shadow-sm"
                                        >
                                            <option value="entrada">CHECK-IN</option>
                                            <option value="reserva">FECHA RESERVA</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                                    </div>
                                </div>
                                <div className="space-y-2 flex-1 max-w-[220px]">
                                    <label className="text-xs font-black text-black uppercase tracking-widest block">Desde</label>
                                    <input
                                        type="date"
                                        value={filterDesde}
                                        onChange={(e) => setFilterDesde(e.target.value)}
                                        className="w-full bg-white border-2 border-gray-400 rounded-xl px-5 py-3 text-base font-black text-black shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2 flex-1 max-w-[220px]">
                                    <label className="text-xs font-black text-black uppercase tracking-widest block">Hasta</label>
                                    <input
                                        type="date"
                                        value={filterHasta}
                                        onChange={(e) => setFilterHasta(e.target.value)}
                                        className="w-full bg-white border-2 border-gray-400 rounded-xl px-5 py-3 text-base font-black text-black shadow-sm"
                                    />
                                </div>
                                <Button onClick={fetchReservas} className="bg-cardenal-green hover:bg-cardenal-green/90 text-white font-black h-14 px-10 rounded-xl text-lg shadow-lg uppercase tracking-widest">
                                    Consultar Reporte
                                </Button>
                            </div>

                            <div className="border-2 border-gray-300 rounded-2xl overflow-hidden bg-white shadow-inner">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200 border-b-2 border-gray-300">
                                            <th className="px-5 py-4 text-xs font-black text-black uppercase tracking-widest whitespace-nowrap">Nombre Huésped</th>
                                            <th className="px-5 py-4 text-xs font-black text-black uppercase tracking-widest whitespace-nowrap">Check-In</th>
                                            <th className="px-5 py-4 text-xs font-black text-black uppercase tracking-widest whitespace-nowrap">Check-Out</th>
                                            <th className="px-5 py-4 text-xs font-black text-black uppercase tracking-widest whitespace-nowrap">Habitación</th>
                                            <th className="px-5 py-4 text-xs font-black text-black uppercase tracking-widest text-center">Estado de Pago</th>
                                            <th className="px-5 py-4 text-xs font-black text-black uppercase tracking-widest text-right">Precio Total</th>
                                            <th className="px-5 py-4 text-xs font-black text-black uppercase tracking-widest text-right"># Reserva</th>
                                            <th className="px-5 py-4 text-xs font-black text-black uppercase tracking-widest text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {loadingReservas ? (
                                            <tr>
                                                <td colSpan={8} className="px-5 py-24 text-center bg-gray-50/50">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <Loader2 className="w-12 h-12 animate-spin text-cardenal-gold stroke-[3px]" />
                                                        <p className="text-lg font-black text-black uppercase tracking-widest italic">Generando reporte...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : reservas.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-5 py-24 text-center bg-gray-50/50">
                                                    <div className="flex flex-col items-center gap-4 opacity-30">
                                                        <FileSpreadsheet className="w-16 h-16 text-black" />
                                                        <p className="text-xl font-black text-black uppercase tracking-widest">Sin datos en este rango.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            reservas
                                                .filter(r => r.estado !== 'CANCELADA')
                                                .map(reserva => (
                                                    <tr key={reserva.id} className="hover:bg-gray-50 transition-all divide-x divide-gray-200 group">
                                                        <td className="px-5 py-5">
                                                            <div className="text-lg font-black text-black uppercase leading-tight">{reserva.nombre_cliente}</div>
                                                            <div className="text-xs font-black text-gray-700 mt-1 uppercase tracking-tight">{reserva.adultos} ADULTOS, {reserva.ninos} NIÑOS</div>
                                                        </td>
                                                        <td className="px-5 py-5 text-sm font-black text-black uppercase">
                                                            {new Date(reserva.fecha_entrada.split('T')[0] + 'T12:00:00').toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-5 py-5 text-sm font-black text-red-600 uppercase">
                                                            {new Date(reserva.fecha_salida.split('T')[0] + 'T12:00:00').toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </td>
                                                        <td className="px-5 py-5 text-sm font-black text-gray-900 uppercase">
                                                            <span className="bg-gray-100 px-2 py-1 rounded border border-gray-300">
                                                                {(() => {
                                                                    try {
                                                                        const meta = JSON.parse(reserva.meta);
                                                                        return meta.habitacion_nombre || reserva.habitacion_id;
                                                                    } catch (e) {
                                                                        return reserva.habitacion_id;
                                                                    }
                                                                })()}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-5">
                                                            <select
                                                                value={reserva.estado}
                                                                onChange={(e) => handleUpdateReservaStatus(reserva.id, e.target.value)}
                                                                className={cn(
                                                                    "text-xs font-black border-2 rounded-xl px-3 py-2 outline-none w-full shadow-sm",
                                                                    reserva.estado === 'OK' ? "text-white border-green-800 bg-green-600" :
                                                                        reserva.estado === 'CANCELADA' ? "text-white border-red-800 bg-red-600" :
                                                                            reserva.estado === 'PENDIENTE' ? "text-white border-orange-800 bg-orange-600" :
                                                                                "text-black border-gray-400 bg-gray-200"
                                                                )}
                                                            >
                                                                <option value="PENDIENTE" className="bg-white text-black font-bold">🔴 PENDIENTE</option>
                                                                <option value="OK" className="bg-white text-black font-bold">🟢 PAGADO (OK)</option>
                                                                <option value="CANCELADA" className="bg-white text-black font-bold">⚪ CANCELADA</option>
                                                                <option value="NO PRESENTADO" className="bg-white text-black font-bold">❌ NO PRESENTADO</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-5 py-5 text-base text-right font-black text-black">
                                                            <span className="bg-yellow-100 px-2 py-1 rounded border border-yellow-300">
                                                                ${Number(reserva.precio).toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-5 text-sm text-right text-cardenal-green font-black tracking-tighter">
                                                            {reserva.numero_reserva || '---'}
                                                        </td>
                                                        <td className="px-5 py-5 text-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    if (confirm('¿Confirmas cancelar esta reserva? Se quitará de la lista.')) {
                                                                        handleUpdateReservaStatus(reserva.id, 'CANCELADA');
                                                                    }
                                                                }}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-8 w-8 p-0"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
