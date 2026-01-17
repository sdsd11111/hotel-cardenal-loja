import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Switch } from './ui/switch';
import { Pencil, Trash2, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Plato = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  activo: boolean;
  created_at: string;
};

interface AdminPlatosListProps {
  platos: Plato[];
  isLoading: boolean;
  onEdit: (plato: Plato) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
}

export default function AdminPlatosList({
  platos,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}: AdminPlatosListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (platos.length === 0) {
    return (
      <div className="text-center py-24 bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-300">
        <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4 stroke-[1px]" />
        <p className="text-xl font-black text-gray-500 uppercase tracking-widest">No hay platos registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-gray-300 shadow-xl overflow-hidden">
      <Table className="border-collapse">
        <TableHeader className="bg-gray-200 border-b-2 border-gray-300">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px] px-8 py-4 text-xs font-black text-black uppercase tracking-widest">Imagen</TableHead>
            <TableHead className="px-8 py-4 text-xs font-black text-black uppercase tracking-widest">Nombre</TableHead>
            <TableHead className="px-8 py-4 text-xs font-black text-black uppercase tracking-widest">Descripción</TableHead>
            <TableHead className="px-8 py-4 text-right text-xs font-black text-black uppercase tracking-widest">Precio</TableHead>
            <TableHead className="px-8 py-4 text-right text-xs font-black text-black uppercase tracking-widest">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {platos.map((plato) => (
            <TableRow key={plato.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
              <TableCell className="px-8 py-6">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                  <Image
                    src={`${plato.imagen_url}?t=${Date.now()}` || '/placeholder.jpg'}
                    alt={plato.titulo}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </TableCell>
              <TableCell className="px-8 py-6 font-black text-black text-lg uppercase tracking-tight">{plato.titulo}</TableCell>
              <TableCell className="px-8 py-6 max-w-xs text-sm font-bold text-gray-700 leading-relaxed">
                {plato.descripcion}
              </TableCell>
              <TableCell className="px-8 py-6 text-right">
                <span className="text-xl font-black text-cardenal-green">
                  ${Number(plato.precio).toFixed(2)}
                </span>
              </TableCell>
              <TableCell className="px-8 py-6">
                <div className="flex justify-end gap-3 items-center">
                  <div className="flex items-center gap-3 mr-4">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border-2",
                      plato.activo ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"
                    )}>
                      {plato.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onToggleStatus(plato.id, plato.activo)}
                      title={plato.activo ? 'Desactivar' : 'Activar'}
                      className={cn(
                        "h-10 w-10 border-2",
                        plato.activo ? 'hover:bg-cardenal-gold/20 border-cardenal-gold/50 text-cardenal-gold' : 'hover:bg-cardenal-green/20 border-cardenal-green/50 text-cardenal-green'
                      )}
                    >
                      {plato.activo ? <EyeOff className="h-5 w-5 stroke-[2.5px]" /> : <Eye className="h-5 w-5 stroke-[2.5px]" />}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(plato)}
                    title="Editar"
                    className="h-10 w-10 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <Pencil className="h-5 w-5 stroke-[2.5px]" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(plato.id)}
                    title="Eliminar"
                    className="h-10 w-10 border-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5 stroke-[2.5px]" />
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
