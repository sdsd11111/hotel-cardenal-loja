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
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="w-[120px]">Imagen</TableHead>
                        <TableHead>Habitación</TableHead>
                        <TableHead>Capacidad</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-center">Disponibilidad</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {habitaciones.map((habitacion) => (
                        <TableRow key={habitacion.id} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell>
                                <div className="relative w-20 h-14">
                                    <Image
                                        src={habitacion.imagen ? (habitacion.imagen.startsWith('/api') ? `${habitacion.imagen}${habitacion.imagen.includes('?') ? '&' : '?'}v=${Date.now()}` : habitacion.imagen) : '/placeholder.jpg'}
                                        alt={habitacion.nombre}
                                        fill
                                        sizes="(max-width: 768px) 80px, 80px"
                                        className="object-cover rounded-md"
                                        unoptimized
                                    />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-bold text-cardenal-green font-serif">{habitacion.nombre}</div>
                                <div className="text-xs text-gray-400 truncate max-w-[200px]">{habitacion.descripcion}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {habitacion.max_adultos + habitacion.max_ninos}</span>
                                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {habitacion.camas}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="font-bold text-sm">{habitacion.precio_texto}</div>
                                <div className="text-[10px] text-gray-400">Val: ${Number(habitacion.precio_numerico).toFixed(2)}</div>
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${habitacion.disponible ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {habitacion.disponible ? 'Libre' : 'Ocupada'}
                                    </span>
                                    {habitacion.fecha_salida && (
                                        <span className="text-[8px] text-gray-400">Hasta: {new Date(habitacion.fecha_salida).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${habitacion.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {habitacion.activo ? 'Activo' : 'Oculto'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => onToggleStatus(habitacion.id, habitacion.activo)}
                                        title={habitacion.activo ? 'Ocultar' : 'Mostrar'}
                                    >
                                        {habitacion.activo ? <EyeOff className="h-4 w-4 text-amber-600" /> : <Eye className="h-4 w-4 text-cardenal-green" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => onEdit(habitacion)}
                                        title="Editar"
                                    >
                                        <Pencil className="h-4 w-4 text-gray-600" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                                        onClick={() => onDelete(habitacion.id)}
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
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
