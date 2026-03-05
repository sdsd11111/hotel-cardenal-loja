import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Switch } from './ui/switch';
import { Pencil, Trash2, Eye, EyeOff, Users, Bed } from 'lucide-react';
import Image from 'next/image';

type Habitacion = {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string;
    precio_texto: string;
    precio_numerico: number;
    imagen: string;
    activo: boolean;
    max_adultos: number;
    max_ninos: number;
    ninos_gratis: number;
    precio_nino_extra: number;
    camas: number;
    disponible: boolean;
    fecha_entrada: string | null;
    fecha_salida: string | null;
};

interface AdminHabitacionesListProps {
    habitaciones: Habitacion[];
    isLoading: boolean;
    onEdit: (habitacion: Habitacion) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export default function AdminHabitacionesList({
    habitaciones,
    isLoading,
    onEdit,
    onDelete,
    onToggleStatus,
}: AdminHabitacionesListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-md" />
                ))}
            </div>
        );
    }

    if (habitaciones.length === 0) {
        return (
            <div className="text-center py-12 bg-cardenal-sand/20 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-serif">No hay habitaciones registradas en la base de datos.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-gray-200 border-b-2 border-gray-300">
                    <TableRow>
                        <TableHead className="w-[140px] p-5 text-sm font-black text-black uppercase tracking-widest">Imagen</TableHead>
                        <TableHead className="p-5 text-sm font-black text-black uppercase tracking-widest">Habitación</TableHead>
                        <TableHead className="p-5 text-sm font-black text-black uppercase tracking-widest">Capacidad</TableHead>
                        <TableHead className="p-5 text-sm font-black text-black uppercase tracking-widest text-right">Precio</TableHead>
                        <TableHead className="p-5 text-sm font-black text-black uppercase tracking-widest text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {habitaciones.map((habitacion) => (
                        <TableRow key={habitacion.id} className="hover:bg-gray-100 transition-all divide-x divide-gray-100 border-b-2 border-gray-200">
                            <TableCell className="p-5">
                                <div className="relative w-24 h-16 shadow-md rounded-lg overflow-hidden border-2 border-gray-300">
                                    <Image
                                        src={habitacion.imagen ? (habitacion.imagen.startsWith('/api') ? `${habitacion.imagen}${habitacion.imagen.includes('?') ? '&' : '?'}v=${Date.now()}` : habitacion.imagen) : '/placeholder.jpg'}
                                        alt={habitacion.nombre}
                                        fill
                                        sizes="100px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            </TableCell>
                            <TableCell className="p-5">
                                <div className="font-black text-xl text-black font-serif leading-tight">{habitacion.nombre}</div>
                                <div className="text-xs font-black text-gray-700 mt-1 line-clamp-2 max-w-[250px] uppercase tracking-tighter">{habitacion.descripcion}</div>
                            </TableCell>
                            <TableCell className="p-5">
                                <div className="flex flex-col gap-1.5">
                                    <span className="flex items-center gap-2 text-sm font-black text-black"><Users className="w-4 h-4 text-cardenal-gold" /> {habitacion.max_adultos + habitacion.max_ninos} PERSONAS</span>
                                    <span className="flex items-center gap-2 text-sm font-black text-black"><Bed className="w-4 h-4 text-cardenal-gold" /> {habitacion.camas} CAMAS</span>
                                    <div className="mt-1 px-2 py-1 bg-blue-50 border border-blue-100 rounded text-[10px] font-black text-blue-800 uppercase leading-none">
                                        {habitacion.ninos_gratis} Gratis • Ext: ${Number(habitacion.precio_nino_extra).toFixed(2)}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="p-5 text-right">
                                <div className="font-black text-lg text-cardenal-green bg-green-50 px-2 py-1 rounded inline-block border border-green-100">{habitacion.precio_texto}</div>
                                <div className="text-xs font-black text-gray-800 mt-1 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 inline-block">VAL: ${Number(habitacion.precio_numerico).toFixed(2)}</div>
                            </TableCell>
                            <TableCell className="p-5">
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 border-2 transition-all hover:bg-amber-50"
                                        onClick={() => onToggleStatus(habitacion.id, habitacion.activo)}
                                        title={habitacion.activo ? 'Ocultar' : 'Mostrar'}
                                    >
                                        {habitacion.activo ? <EyeOff className="h-5 w-5 text-amber-600" /> : <Eye className="h-5 w-5 text-cardenal-green" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 border-2 transition-all hover:bg-gray-100"
                                        onClick={() => onEdit(habitacion)}
                                        title="Editar"
                                    >
                                        <Pencil className="h-5 w-5 text-black" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 border-2 transition-all text-red-600 hover:bg-red-50 border-red-200"
                                        onClick={() => onDelete(habitacion.id)}
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
