'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const platoSchema = z.object({
  titulo: z.string().min(1, 'El título es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  precio: z.union([z.string(), z.number()]),
  imagen: z.any().optional(),
  imagen_url: z.string().optional(),
  activo: z.boolean(),
});

type PlatoFormValues = z.infer<typeof platoSchema>;

interface PlatoFormProps {
  plato?: {
    id: string;
    titulo: string;
    descripcion: string;
    precio: number;
    imagen_url: string;
    activo: boolean;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PlatoForm({ plato, onSuccess, onCancel }: PlatoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(plato?.imagen_url || '');
  const [imageError, setImageError] = useState('');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<PlatoFormValues>({
    resolver: zodResolver(platoSchema) as any,
    defaultValues: {
      titulo: plato?.titulo || '',
      descripcion: plato?.descripcion || '',
      precio: plato?.precio.toString() || '0',
      activo: plato ? !!plato.activo : true,
      imagen_url: plato?.imagen_url || '',
    },
  });

  const activo = watch('activo');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Formato de imagen no soportado. Use JPG, PNG o WebP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError('La imagen es demasiado grande (máx. 1MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setFileToUpload(file);
      setImageError('');
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreviewImage('');
    setFileToUpload(null);
    setValue('imagen_url', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: PlatoFormValues) => {
    console.log('Enviando plato...', data);
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('titulo', data.titulo.trim());
      formData.append('descripcion', data.descripcion.trim());

      // Clean price before sending
      const cleanPrice = parseFloat(data.precio.toString().replace(/[^0-9.]/g, ''));
      formData.append('precio', isNaN(cleanPrice) ? '0' : cleanPrice.toString());

      formData.append('activo', data.activo.toString());

      if (fileToUpload) {
        formData.append('imagen', fileToUpload);
      } else if (data.imagen_url) {
        formData.append('imagen_url', data.imagen_url);
      }

      const url = plato?.id ? `/api/platos/${plato.id}` : '/api/platos';
      const method = plato?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Error al guardar el plato');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Submit error:', error);
      setError('titulo', { type: 'manual', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {Object.keys(errors).length > 0 && (
        <div className="p-6 bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl shadow-sm">
          <p className="font-black mb-3 uppercase tracking-widest text-sm flex items-center gap-2">
            <X className="w-5 h-5" />
            Corregir los siguientes errores:
          </p>
          <ul className="space-y-1">
            {Object.entries(errors).map(([key, error]: [string, any]) => (
              <li key={key} className="text-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                <span className="capitalize font-black">{key}:</span> {error?.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-black uppercase tracking-widest" htmlFor="titulo">
              Título *
            </label>
            <Input
              id="titulo"
              placeholder="Ej: Paella Valenciana"
              className="h-12 border-2 border-gray-400 font-bold rounded-xl focus:border-cardenal-green focus:ring-cardenal-green/20"
              {...register('titulo')}
            />
            {errors.titulo?.message && <p className="text-xs font-black text-red-600 uppercase tracking-tighter mt-1">{errors.titulo?.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-black uppercase tracking-widest" htmlFor="descripcion">
              Descripción *
            </label>
            <Textarea
              id="descripcion"
              placeholder="Describe el plato en detalle"
              rows={4}
              className="border-2 border-gray-400 font-bold rounded-xl focus:border-cardenal-green focus:ring-cardenal-green/20"
              {...register('descripcion')}
            />
            {errors.descripcion?.message && <p className="text-xs font-black text-red-600 uppercase tracking-tighter mt-1">{errors.descripcion?.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-black uppercase tracking-widest" htmlFor="precio">
              Precio *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-black">$</span>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                className="pl-10 h-12 border-2 border-gray-400 font-black text-lg rounded-xl focus:border-cardenal-green focus:ring-cardenal-green/20"
                {...register('precio')}
              />
            </div>
            {errors.precio?.message && <p className="text-xs font-black text-red-600 uppercase tracking-tighter mt-1">{errors.precio?.message}</p>}
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
            <div className="flex items-center space-x-4 cursor-pointer">
              <Switch
                id="activo"
                checked={activo}
                onCheckedChange={(checked: boolean) => setValue('activo', checked)}
                className="data-[state=checked]:bg-cardenal-green data-[state=unchecked]:bg-gray-300"
              />
              <label htmlFor="activo" className="text-sm font-black text-black uppercase tracking-widest">
                {activo ? 'PUBLICADO / ACTIVO' : 'BORRADOR / INACTIVO'}
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-black text-black uppercase tracking-widest" htmlFor="imagen">
              Imagen del plato *
            </label>

            <input
              type="file"
              id="imagen"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="border-4 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center h-80 bg-gray-100 relative group border-gray-300 transition-all hover:bg-gray-200">
              {previewImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={previewImage.startsWith('/api') ? `${previewImage}${previewImage.includes('?') ? '&' : '?'}t=${Date.now()}` : previewImage}
                    alt="Vista previa"
                    fill
                    className="object-cover rounded-2xl shadow-inner"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-4 -right-4 p-3 bg-red-600 text-white rounded-full shadow-xl hover:scale-110 transition-transform z-20 border-2 border-white"
                  >
                    <X className="h-5 w-5 stroke-[3px]" />
                  </button>
                </div>
              ) : (
                <div
                  className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-16 w-16 text-cardenal-gold mb-4 stroke-[2px]" />
                  <p className="text-lg font-black text-black uppercase tracking-widest">Sube una imagen</p>
                  <p className="text-xs font-black text-gray-500 mt-2 uppercase">PNG, JPG, WEBP • MÁX 1MB</p>
                </div>
              )}

              {imageError && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-100 border-2 border-red-300 p-2 rounded-xl">
                  <p className="text-xs font-black text-red-700 uppercase tracking-tighter text-center">{imageError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-10 border-t-2 border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="h-14 px-8 border-2 border-gray-300 font-black text-black uppercase tracking-widest rounded-xl hover:bg-gray-100"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-black px-12 h-14 shadow-xl rounded-xl uppercase tracking-widest min-w-[200px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin stroke-[3px]" />
              {plato?.id ? 'GUARDANDO...' : 'CREANDO...'}
            </>
          ) : plato?.id ? (
            'GUARDAR CAMBIOS'
          ) : (
            'CREAR PLATO'
          )}
        </Button>
      </div>
    </form>
  );
}
