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

// La configuración de habitaciones ahora es dinámica. 
// Definimos los colores estáticos por ID o tipo para mantener la estética.
const ROOM_COLORS: Record<string, string> = {
    '301': 'border-pink-200 bg-pink-50',
    '302': 'border-blue-200 bg-blue-50',
    '303': 'border-green-200 bg-green-50',
};

interface Room {
    id: number;
    name: string;
    num: string;
    type: string;
    capacity: number;
    color: string;
}

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
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
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

    // Dynamic Rooms Fetch
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch('/api/habitaciones');
                if (res.ok) {
                    const data = await res.json();
                    const mappedRooms = data.map((r: any) => {
                        const nameLower = r.nombre.toLowerCase();
                        let type = 'Triple';
                        let identifier = '303';
                        let num = '303';

                        if (nameLower.includes('matrimonial') || nameLower.includes('301')) {
                            type = 'Matrimonial';
                            identifier = '301';
                            num = '301';
                        } else if (nameLower.includes('triple') || nameLower.includes('303')) {
                            type = 'Triple';
                            identifier = '303';
                            num = '303';
                        } else if (nameLower.includes('twin') || nameLower.includes('302') || nameLower.includes('doble')) {
                            type = 'Doble';
                            identifier = '302';
                            num = '302';
                        }

                        return {
                            id: r.id,
                            name: r.nombre,
                            num: num,
                            type: type,
                            capacity: r.max_adultos + (r.max_ninos || 0),
                            color: ROOM_COLORS[identifier] || 'border-gray-200 bg-gray-50'
                        };
                    }).sort((a: any, b: any) => {
                        const order: Record<string, number> = { '301': 1, '302': 2, '303': 3 };
                        const idA = a.num || '303';
                        const idB = b.num || '303';
                        return (order[idA] || 4) - (order[idB] || 4);
                    });

                    setRooms(mappedRooms);
                    if (mappedRooms.length > 0) setSelectedRoom(mappedRooms[0]);
                }
            } catch (err) {
                console.error('Error fetching rooms:', err);
            }
        };
        fetchRooms();
    }, []);

    const fetchReservas = useCallback(async () => {
        if (!selectedRoom) return;
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
    }, [currentDate, selectedRoom]);

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
        if (!date || !selectedRoom) return undefined;
        const dateStr = date.toISOString().split('T')[0];
        return reservas.find(r => {
            if (!selectedRoom) return false;
            if (Number(r.habitacion_id) !== selectedRoom.id) return false;
            if (r.estado === 'CANCELADA') return false;
            const checkIn = String(r.fecha_entrada).split('T')[0];
            const checkOut = String(r.fecha_salida).split('T')[0];
            return dateStr >= checkIn && dateStr < checkOut;
        });
    };

    const getCheckInForDate = (date: Date) => {
        if (!date || !selectedRoom) return undefined;
        const dateStr = date.toISOString().split('T')[0];
        return reservas.find(r => {
            if (!selectedRoom) return false;
            if (Number(r.habitacion_id) !== selectedRoom.id) return false;
            if (r.estado === 'CANCELADA') return false;
            return String(r.fecha_entrada).split('T')[0] === dateStr;
        });
    };

    const getCheckOutForDate = (date: Date) => {
        if (!date || !selectedRoom) return undefined;
        const dateStr = date.toISOString().split('T')[0];
        return reservas.find(r => {
            if (!selectedRoom) return false;
            if (Number(r.habitacion_id) !== selectedRoom.id) return false;
            if (r.estado === 'CANCELADA') return false;
            return String(r.fecha_salida).split('T')[0] === dateStr;
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
        if (!selectedRoom) {
            alert('Por favor, selecciona una habitación primero.');
            return;
        }

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

    const handleNewBooking = () => {
        if (!selectedRoom) {
            alert('Por favor, selecciona una habitación primero.');
            return;
        }
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        setEditingReserva(null);
        setFormData({
            nombre: '',
            email: '',
            whatsapp: '',
            entrada: dateStr,
            salida: new Date(today.getTime() + 86400000).toISOString().split('T')[0],
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
        if (!selectedRoom) return;

        // 1. Validar Capacidad
        if (formData.adultos + formData.ninos > selectedRoom.capacity) {
            alert(`Esta habitación solo permite un máximo de ${selectedRoom.capacity} personas.`);
            return;
        }

        // 2. Validar Solapamientos (Overlap)
        const hasOverlap = reservas.some(r => {
            if (!selectedRoom) return false;
            if (r.habitacion_id !== selectedRoom.id) return false;
            if (r.estado === 'CANCELADA') return false;
            if (editingReserva && r.id === editingReserva.id) return false;

            const rEntrada = r.fecha_entrada.split('T')[0];
            const rSalida = r.fecha_salida.split('T')[0];

            return (formData.entrada < rSalida && formData.salida > rEntrada);
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
        <div className="h-screen overflow-hidden bg-[#fafafa] flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-cardenal-green font-serif tracking-tight">Panel de Recepción</h1>
                        <p className="text-base text-black uppercase tracking-widest font-black mt-1">Gestión Interna de Habitaciones</p>
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
                <aside className="w-80 bg-white border-r-2 border-gray-300 overflow-y-auto p-6 flex flex-col gap-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black border-b-2 border-gray-200 pb-2 mb-2">Seleccionar Habitación</h3>
                    {rooms.length === 0 && (
                        <div className="flex items-center justify-center p-8 text-gray-400">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
                        </div>
                    )}
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className={cn(
                                "flex flex-col p-5 rounded-2xl border-4 transition-all duration-300 text-left relative overflow-hidden group shadow-sm",
                                selectedRoom?.id === room.id
                                    ? "border-cardenal-gold bg-cardenal-gold/10 shadow-lg"
                                    : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-md"
                            )}
                        >
                            {selectedRoom?.id === room.id && (
                                <div className="absolute top-3 right-3">
                                    <CheckCircle2 className="w-6 h-6 text-cardenal-gold" />
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-3">
                                <div className={cn("p-3 rounded-xl border-2 border-black/10", room.color)}>
                                    <Bed className="w-7 h-7 text-gray-900" />
                                </div>
                                <div>
                                    <span className="text-xs font-black text-black uppercase bg-gray-100 px-2 py-0.5 rounded border border-gray-300">{room.type}</span>
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight mt-1">{room.name}</h4>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2 text-sm font-black text-black bg-gray-100 px-3 py-1 rounded-lg border border-gray-300">
                                    <Users className="w-4 h-4" />
                                    <span>Cap: {room.capacity}</span>
                                </div>
                                <span className="text-lg font-black text-cardenal-gold tracking-tighter"># {room.num}</span>
                            </div>
                        </button>
                    ))}
                </aside>

                {/* Main Content: Calendar */}
                <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/50 p-4">
                    <div className="flex-none mb-4">
                        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200">
                            <div>
                                <h2 className="text-2xl font-black text-black capitalize font-serif">
                                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </h2>
                                <p className="text-sm text-gray-800 font-bold mt-0.5">Habitación: <span className="text-cardenal-gold font-black bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{selectedRoom?.name || '...'}</span></p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex bg-white p-1 rounded-xl border border-gray-300 shadow-sm">
                                    <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8 rounded-lg hover:bg-gray-100 text-black">
                                        <ChevronLeft className="w-5 h-5 stroke-[3px]" />
                                    </Button>
                                    <div className="w-[1px] bg-gray-200 mx-1" />
                                    <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8 rounded-lg hover:bg-gray-100 text-black">
                                        <ChevronRight className="w-5 h-5 stroke-[3px]" />
                                    </Button>
                                </div>
                                <Button className="bg-cardenal-green hover:bg-cardenal-green/90 text-white rounded-xl font-black text-sm py-2 px-4 shadow-md flex gap-2 transform active:scale-95 transition-all"
                                    onClick={handleNewBooking}
                                    disabled={!selectedRoom}>
                                    <Plus className="w-5 h-5 stroke-[3px]" />
                                    NUEVA RESERVA
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-300 overflow-hidden flex flex-col">
                        <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200 flex-none">
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                                <div key={day} className="py-3 text-center text-xs font-black uppercase tracking-widest text-black">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 flex-1">
                            {daysInMonth().map((date, idx) => {
                                if (!date) return <div key={`empty-${idx}`} className="bg-gray-50/20 border-r border-b border-gray-100" />;

                                const occupiedRes = getReservaForDate(date);
                                const isToday = date.toDateString() === new Date().toDateString();

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleDayClick(date)}
                                        className={cn(
                                            "relative border-r border-b border-gray-200 p-2 transition-colors group cursor-pointer h-full min-h-0 flex flex-col",
                                            !occupiedRes && "hover:bg-cardenal-gold/5",
                                            isToday && "bg-cardenal-green/5"
                                        )}
                                        style={{ height: 'calc(100% / 6)' }} // Force 6 rows to fill height equally
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn(
                                                "text-lg font-black flex items-center justify-center w-8 h-8 rounded-full",
                                                isToday ? "bg-cardenal-green text-white shadow-md" : "text-black bg-gray-100 border border-gray-300"
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
                                                    <div className="bg-red-600 text-white border-2 border-red-800 rounded-lg p-2 text-[10px] font-black flex items-center gap-1.5 shadow-md">
                                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                                        <span className="truncate uppercase">SALIDA: {res.nombre_cliente}</span>
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
                                                        "p-2.5 rounded-xl text-[11px] font-black leading-tight shadow-md border-2 border-l-[6px]",
                                                        res.estado === 'OK'
                                                            ? "bg-green-600 text-white border-green-800 border-l-green-900"
                                                            : "bg-orange-600 text-white border-orange-800 border-l-orange-900"
                                                    )}>
                                                        <div className="flex items-center gap-1 mb-1">
                                                            {isCheckInDay ? <Plus className="w-3 h-3 text-blue-500" /> : <Clock className="w-3 h-3" />}
                                                            <span className="truncate">{isCheckInDay ? 'ENTRADA: ' : ''}{res.nombre_cliente}</span>
                                                        </div>
                                                        {!isCheckInDay && (
                                                            <div className="flex items-center justify-between mt-1 text-white/90">
                                                                <span className="font-black bg-black/20 px-1.5 rounded">${res.precio}</span>
                                                                <span className="bg-white/30 px-1.5 rounded uppercase text-[9px] font-black">{res.estado}</span>
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
                </main>
            </div>

            {/* Manual Booking / Edit Modal */}
            {
                showBookingModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className={cn("p-8 flex items-center justify-between text-white", editingReserva ? "bg-cardenal-gold" : "bg-cardenal-green")}>
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-serif font-bold">{editingReserva ? 'Editar Estado' : 'Reserva Manual'}</h3>
                                    <p className="text-sm text-white/70">Habitación: <span className="font-bold">{selectedRoom?.name || '...'}</span></p>
                                    {editingReserva && (
                                        <Link href="/admin/clientes" target="_blank" className="mt-2 inline-flex items-center gap-1 text-xs font-black bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg w-fit transition-colors">
                                            <User className="w-3 h-3" /> Ir a Gestión del Cliente
                                        </Link>
                                    )}
                                </div>
                                <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveManualReserva} className="p-10 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-black mb-1 block">Nombre del Huésped</label>
                                        <Input required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="bg-white border-2 border-gray-400 rounded-xl py-7 text-lg font-black text-black focus:border-cardenal-green transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-black mb-1 block">Email</label>
                                        <Input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-white border-2 border-gray-400 rounded-xl py-7 text-lg font-black text-black"
                                            placeholder="ejemplo@email.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-black mb-1 block">WhatsApp / Teléfono</label>
                                        <Input
                                            value={formData.whatsapp || ''}
                                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                            className="bg-white border-2 border-gray-400 rounded-xl py-7 text-lg font-black text-black"
                                            placeholder="099..."
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-black mb-1 block">Precio Total ($)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.precio || ''}
                                            onChange={e => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                                            className="bg-white border-2 border-gray-400 rounded-xl py-7 text-lg font-black text-black"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-black mb-1 block">Estado de Pago</label>
                                        <select
                                            value={formData.estado}
                                            onChange={e => setFormData({ ...formData, estado: e.target.value })}
                                            className="w-full bg-white border-2 border-gray-400 rounded-xl p-4 font-black text-lg focus:outline-none ring-1 ring-gray-300 text-black shadow-sm"
                                        >
                                            <option value="PENDIENTE" className="font-bold">🔴 PENDIENTE</option>
                                            <option value="OK" className="font-bold">🟢 OK (PAGADO)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-black mb-1 block">Fecha Check-In</label>
                                        <Input type="date" required value={formData.entrada} onChange={e => setFormData({ ...formData, entrada: e.target.value })} className="bg-white border-2 border-gray-400 rounded-xl py-7 text-lg font-black text-black" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-black mb-1 block">Fecha Check-Out</label>
                                        <Input type="date" required value={formData.salida} onChange={e => setFormData({ ...formData, salida: e.target.value })} className="bg-white border-2 border-gray-400 rounded-xl py-7 text-lg font-black text-black" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-black mb-1 block">Adultos</label>
                                        <Input type="number" min="1" max={selectedRoom?.capacity || 4} value={formData.adultos || 1} onChange={e => setFormData({ ...formData, adultos: parseInt(e.target.value) || 1 })} className="bg-white border-2 border-gray-400 rounded-xl py-7 text-lg font-black text-black" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-black mb-1 block">Niños</label>
                                        <Input type="number" min="0" value={formData.ninos || 0} onChange={e => setFormData({ ...formData, ninos: parseInt(e.target.value) || 0 })} className="bg-white border-2 border-gray-400 rounded-xl py-7 text-lg font-black text-black" />
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
                )
            }
        </div >
    );
}
