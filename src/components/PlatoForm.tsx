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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <div className="p-3 bg-red-100/50 border border-red-200 text-red-600 text-sm rounded-lg">
          <p className="font-bold mb-1">No se puede guardar por los siguientes errores:</p>
          <ul className="list-disc pl-5">
            {Object.entries(errors).map(([key, error]: [string, any]) => (
              <li key={key}>
                <span className="capitalize">{key}:</span> {error?.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="titulo">
              Título *
            </label>
            <Input
              id="titulo"
              placeholder="Ej: Paella Valenciana"
              {...register('titulo')}
              error={errors.titulo?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="descripcion">
              Descripción *
            </label>
            <Textarea
              id="descripcion"
              placeholder="Describe el plato en detalle"
              rows={4}
              {...register('descripcion')}
              error={errors.descripcion?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="precio">
              Precio *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                className="pl-8"
                {...register('precio')}
                error={errors.precio?.message}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={activo}
              onCheckedChange={(checked: boolean) => setValue('activo', checked)}
              thumbClassName="bg-black"
            />
            <label htmlFor="activo" className="text-sm font-medium">
              {activo ? 'Activo' : 'Inactivo'}
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="imagen">
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

            <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-64 bg-gray-50 relative">
              {previewImage ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={previewImage.startsWith('/api') ? `${previewImage}${previewImage.includes('?') ? '&' : '?'}t=${Date.now()}` : previewImage}
                    alt="Vista previa"
                    fill
                    className="object-cover rounded-md"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 font-medium">Sube una imagen</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP hasta 1MB</p>
                </div>
              )}

              {imageError && (
                <p className="mt-2 text-sm text-red-500 text-center">{imageError}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-cardenal-green hover:bg-cardenal-gold text-white font-bold px-8"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {plato?.id ? 'Guardando...' : 'Creando...'}
            </>
          ) : plato?.id ? (
            'Guardar Cambios'
          ) : (
            'Crear Plato'
          )}
        </Button>
      </div>
    </form>
  );
}
