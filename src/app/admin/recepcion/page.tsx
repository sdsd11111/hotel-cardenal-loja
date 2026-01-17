'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    User,
    Phone,
    Mail,
    MapPin,
    Info,
    CheckCircle2,
    Clock,
    X,
    Users,
    Bed,
    Save,
    Trash2,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Configuración de las 6 habitaciones reales sincronizadas con IDs de DB
const ROOMS_CONFIG = [
    { id: 4, name: 'Matrimonial 1', num: '301', type: 'matrimonial', capacity: 2, color: 'border-pink-200 bg-pink-50' },
    { id: 1, name: 'Matrimonial 2', num: '301', type: 'matrimonial', capacity: 2, color: 'border-pink-200 bg-pink-50' },
    { id: 3, name: 'Doble 1', num: '302', type: 'doble', capacity: 3, color: 'border-blue-200 bg-blue-50' },
    { id: 5, name: 'Doble 2', num: '302', type: 'doble', capacity: 3, color: 'border-blue-200 bg-blue-50' },
    { id: 2, name: 'Triple 1', num: '303', type: 'triple', capacity: 4, color: 'border-green-200 bg-green-50' },
    { id: 6, name: 'Triple 2', num: '303', type: 'triple', capacity: 4, color: 'border-green-200 bg-green-50' },
];

interface Reserva {
    id: number;
    nombre_cliente: string;
    email_cliente: string;
    whatsapp: string;
    fecha_entrada: string;
    fecha_salida: string;
    habitacion_id: number;
    adultos: number;
    ninos: number;
    estado: string;
    numero_reserva: string;
    precio: number;
    meta?: string;
}

export default function RecepcionPage() {
    const [selectedRoom, setSelectedRoom] = useState(ROOMS_CONFIG[0]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [editingReserva, setEditingReserva] = useState<Reserva | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [refreshCount, setRefreshCount] = useState(0);

    // Formulario de reserva manual
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        whatsapp: '',
        entrada: '',
        salida: '',
        adultos: 2,
        ninos: 0,
        pais: 'Ecuador',
        peticiones: '',
        precio: 0,
        estado: 'PENDIENTE'
    });

    const fetchReservas = useCallback(async () => {
        setLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const start = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const end = new Date(year, month + 2, 0).toISOString().split('T')[0];

            const res = await fetch(`/api/reservas?desde=${start}&hasta=${end}&tipoFecha=entrada&t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setReservas(data);
            }
        } catch (error) {
            console.error('Error fetching reservas:', error);
        } finally {
            setLoading(false);
        }
    }, [currentDate]);

    // Efecto para refresh manual o automático
    useEffect(() => {
        fetchReservas();
    }, [fetchReservas, refreshCount]);

    // Auto-refresh cada 30 segundos para ver reservas online nuevas
    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshCount(prev => prev + 1);
        }, 30000); // 30 segundos
        return () => clearInterval(interval);
    }, []);

    // Generar días del mes para el calendario
    const daysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getReservaForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return reservas.find(r => {
            if (r.habitacion_id !== selectedRoom.id) return false;
            if (r.estado === 'CANCELADA') return false;
            const checkIn = r.fecha_entrada.split('T')[0];
            const checkOut = r.fecha_salida.split('T')[0];
            return dateStr >= checkIn && dateStr < checkOut;
        });
    };

    const getCheckInForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return reservas.find(r => {
            if (r.habitacion_id !== selectedRoom.id) return false;
            if (r.estado === 'CANCELADA') return false;
            return r.fecha_entrada.split('T')[0] === dateStr;
        });
    };

    const getCheckOutForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return reservas.find(r => {
            if (r.habitacion_id !== selectedRoom.id) return false;
            if (r.estado === 'CANCELADA') return false;
            return r.fecha_salida.split('T')[0] === dateStr;
        });
    };

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    // Helper para formatear fechas a YYYY-MM-DD para inputs tipo date
    const formatDateForInput = (dateVal: string | Date) => {
        if (!dateVal) return '';
        if (dateVal instanceof Date) return dateVal.toISOString().split('T')[0];
        if (typeof dateVal === 'string') return dateVal.split('T')[0];
        return '';
    };

    const handleDayClick = (date: Date) => {
        const occupied = getReservaForDate(date);
        if (occupied) {
            setEditingReserva(occupied);
            setFormData({
                nombre: occupied.nombre_cliente,
                email: occupied.email_cliente,
                whatsapp: occupied.whatsapp,
                entrada: formatDateForInput(occupied.fecha_entrada),
                salida: formatDateForInput(occupied.fecha_salida),
                adultos: occupied.adultos,
                ninos: occupied.ninos,
                pais: 'Ecuador',
                peticiones: '',
                precio: occupied.precio || 0,
                estado: occupied.estado
            });
            setShowBookingModal(true);
            return;
        }

        const dateStr = date.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        setEditingReserva(null);
        setFormData({
            nombre: '',
            email: '',
            whatsapp: '',
            entrada: dateStr,
            salida: new Date(date.getTime() + 86400000).toISOString().split('T')[0],
            adultos: 2,
            ninos: 0,
            pais: 'Ecuador',
            peticiones: '',
            precio: 0,
            estado: 'OK'
        });
        setShowBookingModal(true);
    };

    const handleSaveManualReserva = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validar Capacidad
        if (formData.adultos + formData.ninos > selectedRoom.capacity) {
            alert(`Esta habitación solo permite un máximo de ${selectedRoom.capacity} personas.`);
            return;
        }

        // 2. Validar Solapamientos (Overlap)
        const hasOverlap = reservas.some(r => {
            if (r.habitacion_id !== selectedRoom.id) return false;
            if (r.estado === 'CANCELADA') return false;
            if (editingReserva && r.id === editingReserva.id) return false;

            return (formData.entrada < r.fecha_salida && formData.salida > r.fecha_entrada);
        });

        if (hasOverlap) {
            alert('¡Error! Ya existe una reserva en estas fechas para esta habitación.');
            return;
        }

        try {
            if (editingReserva) {
                // Modo Edición: Actualizamos estado, precio y fechas (reagendar)
                const res = await fetch('/api/payphone/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: "EDIT-" + editingReserva.id,
                        clientTransactionId: editingReserva.numero_reserva,
                        updateExisting: editingReserva.id,
                        reservationData: {
                            habitacion_id: selectedRoom.id,
                            habitacion_nombre: selectedRoom.name,
                            fecha_entrada: formData.entrada,
                            fecha_salida: formData.salida,
                            nombre_cliente: formData.nombre,
                            email_cliente: formData.email,
                            whatsapp: formData.whatsapp,
                            adultos: formData.adultos,
                            ninos: formData.ninos,
                            precio: formData.precio,
                            pais: formData.pais,
                            estado: formData.estado,
                            peticiones: formData.peticiones
                        }
                    })
                });

                const data = await res.json();

                if (res.ok) {
                    alert('Reserva actualizada correctamente (reagendada).');
                    setShowBookingModal(false);
                    fetchReservas();
                } else {
                    alert('Error al actualizar: ' + (data.message || 'Error desconocido'));
                }
            } else {
                // Modo Nueva Reserva
                const res = await fetch('/api/payphone/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: "SIMULACION",
                        clientTransactionId: "RECEP-" + Date.now(),
                        reservationData: {
                            habitacion_id: selectedRoom.id,
                            habitacion_nombre: selectedRoom.name,
                            fecha_entrada: formData.entrada,
                            fecha_salida: formData.salida,
                            nombre_cliente: formData.nombre,
                            email_cliente: formData.email,
                            whatsapp: formData.whatsapp,
                            adultos: formData.adultos,
                            ninos: formData.ninos,
                            precio: formData.precio,
                            pais: formData.pais,
                            estado: formData.estado,
                            peticiones: `[MANUAL] ${formData.peticiones}`
                        }
                    })
                });

                const data = await res.json();

                if (res.ok) {
                    alert('Reserva guardada correctamente.');
                    setShowBookingModal(false);
                    fetchReservas();
                } else {
                    alert('Error al guardar: ' + (data.message || 'Error desconocido'));
                }
            }
        } catch (error) {
            console.error('Error saving manual reservation:', error);
            alert('Error de conexión.');
        }
    };

    const handleCancelReserva = async () => {
        if (!editingReserva) return;
        if (!confirm('¿Estás seguro de cancelar esta reserva? Desaparecerá del calendario.')) return;

        try {
            const res = await fetch('/api/reservas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingReserva.id,
                    estado: 'CANCELADA'
                })
            });

            if (res.ok) {
                alert('Reserva cancelada con éxito.');
                setShowBookingModal(false);
                setEditingReserva(null);
                fetchReservas();
            }
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-cardenal-green font-serif">Panel de Recepción</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Gestión Interna de Habitaciones</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 bg-cardenal-green/5 px-3 py-1.5 rounded-full border border-cardenal-green/20">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-cardenal-green uppercase">Sincronizado</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-medium mt-1">Refresco auto: 30s</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar: Rooms */}
                <aside className="w-80 bg-white border-r overflow-y-auto p-6 flex flex-col gap-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Seleccionar Habitación</h3>
                    {ROOMS_CONFIG.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className={cn(
                                "flex flex-col p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group",
                                selectedRoom.id === room.id
                                    ? "border-cardenal-gold bg-cardenal-gold/5 shadow-md"
                                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                            )}
                        >
                            {selectedRoom.id === room.id && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircle2 className="w-4 h-4 text-cardenal-gold" />
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-2">
                                <div className={cn("p-2 rounded-xl", room.color)}>
                                    <Bed className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                    <span className="text-xs font-black text-gray-400 uppercase">{room.type}</span>
                                    <h4 className="font-bold text-gray-800 tracking-tight">{room.name}</h4>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                                    <Users className="w-3 h-3" />
                                    <span>Cap: {room.capacity}</span>
                                </div>
                                <span className="text-[10px] font-bold text-cardenal-gold"># {room.num}</span>
                            </div>
                        </button>
                    ))}
                </aside>

                {/* Main Content: Calendar */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">Habitación: <span className="text-cardenal-gold font-bold">{selectedRoom.name}</span></p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                                    <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="rounded-lg">
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={handleNextMonth} className="rounded-lg">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                                <Button className="bg-cardenal-green hover:bg-cardenal-green/90 text-white rounded-xl font-bold shadow-lg flex gap-2"
                                    onClick={() => handleDayClick(new Date())}>
                                    <Plus className="w-4 h-4" />
                                    Nueva Reserva
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                            <div className="grid grid-cols-7 bg-gray-50/50 border-b border-gray-100">
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                                    <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 auto-rows-[140px]">
                                {daysInMonth().map((date, idx) => {
                                    if (!date) return <div key={`empty-${idx}`} className="bg-gray-50/20 border-r border-b border-gray-100" />;

                                    const occupiedRes = getReservaForDate(date);
                                    const isToday = date.toDateString() === new Date().toDateString();

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => handleDayClick(date)}
                                            className={cn(
                                                "relative border-r border-b border-gray-100 p-3 transition-colors group cursor-pointer",
                                                !occupiedRes && "hover:bg-cardenal-gold/5",
                                                isToday && "bg-cardenal-green/5"
                                            )}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className={cn(
                                                    "text-sm font-bold flex items-center justify-center w-7 h-7 rounded-full",
                                                    isToday ? "bg-cardenal-green text-white" : "text-gray-400"
                                                )}>
                                                    {date.getDate()}
                                                </span>
                                            </div>

                                            <div className="mt-1.5 space-y-1">
                                                {/* Indicador de SALIDA (Mañana) */}
                                                {(() => {
                                                    const res = getCheckOutForDate(date);
                                                    if (!res) return null;
                                                    return (
                                                        <div className="bg-gray-100 text-gray-600 border border-gray-200 rounded-lg p-1.5 text-[9px] font-bold flex items-center gap-1 shadow-sm">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                            <span className="truncate">SALIDA: {res.nombre_cliente}</span>
                                                        </div>
                                                    );
                                                })()}

                                                {/* Indicador de OCUPADO (Noche / Estancia) */}
                                                {(() => {
                                                    const res = getReservaForDate(date);
                                                    if (!res) return null;
                                                    const isCheckInDay = res.fecha_entrada.split('T')[0] === date.toISOString().split('T')[0];

                                                    return (
                                                        <div className={cn(
                                                            "p-2 rounded-xl text-[10px] font-bold leading-tight shadow-sm border border-l-4",
                                                            res.estado === 'OK' ? "bg-green-50 text-green-700 border-green-200 border-l-green-500" : "bg-orange-50 text-orange-700 border-orange-200 border-l-orange-400"
                                                        )}>
                                                            <div className="flex items-center gap-1 mb-1">
                                                                {isCheckInDay ? <Plus className="w-3 h-3 text-blue-500" /> : <Clock className="w-3 h-3" />}
                                                                <span className="truncate">{isCheckInDay ? 'ENTRADA: ' : ''}{res.nombre_cliente}</span>
                                                            </div>
                                                            {!isCheckInDay && (
                                                                <div className="flex items-center justify-between opacity-80 mt-1">
                                                                    <span>${res.precio}</span>
                                                                    <span className="bg-white/50 px-1 rounded uppercase text-[8px]">{res.estado}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Manual Booking / Edit Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className={cn("p-8 flex items-center justify-between text-white", editingReserva ? "bg-cardenal-gold" : "bg-cardenal-green")}>
                            <div>
                                <h3 className="text-2xl font-serif font-bold">{editingReserva ? 'Editar Estado' : 'Reserva Manual'}</h3>
                                <p className="text-sm text-white/70">Habitación: <span className="font-bold">{selectedRoom.name}</span></p>
                            </div>
                            <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveManualReserva} className="p-10 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre del Huésped</label>
                                    <Input required value={formData.nombre} readOnly={!!editingReserva} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="bg-gray-50 border-gray-100 rounded-xl py-6 font-bold" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Precio Total ($)</label>
                                    <Input type="number" step="0.01" required value={formData.precio} readOnly={!!editingReserva} onChange={e => setFormData({ ...formData, precio: parseFloat(e.target.value) })} className="bg-gray-50 border-gray-100 rounded-xl py-6 font-bold" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={e => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full bg-gray-50 border-gray-100 rounded-xl p-3.5 font-bold text-sm focus:outline-none ring-1 ring-gray-200"
                                    >
                                        <option value="PENDIENTE">PENDIENTE (Falta cancelar)</option>
                                        <option value="OK">OK (Ya cancelado)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Check-In</label>
                                    <Input type="date" required value={formData.entrada} onChange={e => setFormData({ ...formData, entrada: e.target.value })} className="bg-gray-50 border-gray-100 rounded-xl py-6 font-bold" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Check-Out</label>
                                    <Input type="date" required value={formData.salida} onChange={e => setFormData({ ...formData, salida: e.target.value })} className="bg-gray-50 border-gray-100 rounded-xl py-6 font-bold" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Adultos</label>
                                    <Input type="number" min="1" max={selectedRoom.capacity} readOnly={!!editingReserva} value={formData.adultos} onChange={e => setFormData({ ...formData, adultos: parseInt(e.target.value) })} className="bg-gray-50 border-gray-100 rounded-xl py-6 font-bold" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Niños</label>
                                    <Input type="number" min="0" value={formData.ninos} readOnly={!!editingReserva} onChange={e => setFormData({ ...formData, ninos: parseInt(e.target.value) })} className="bg-gray-50 border-gray-100 rounded-xl py-6 font-bold" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                {editingReserva && (
                                    <Button type="button" onClick={handleCancelReserva} variant="destructive" className="flex-1 py-8 rounded-2xl font-black uppercase tracking-widest">
                                        <Trash2 className="w-5 h-5 mr-2" /> Eliminar
                                    </Button>
                                )}
                                <Button type="submit" className="flex-[2] bg-cardenal-green hover:bg-cardenal-green/90 text-white py-8 rounded-2xl font-black uppercase tracking-widest shadow-xl">
                                    <Save className="w-5 h-5 mr-2" /> {editingReserva ? 'Guardar Cambios' : 'Confirmar Reserva'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
