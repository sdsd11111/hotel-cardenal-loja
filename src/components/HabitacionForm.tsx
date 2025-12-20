'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Loader2, Image as ImageIcon, Upload, X, Plus, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB max for optimized images
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

// Helpers to format date for inputs
const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
};

const formatTimeForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '12:00';
    return date.toTimeString().slice(0, 5);
};

const habitacionSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres'),
    descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    precio_texto: z.string().min(1, 'El texto de precio es obligatorio'),
    precio_numerico: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'El precio debe ser un número válido',
    }),
    max_adultos: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
        message: 'Mínimo 1 adulto',
    }),
    max_ninos: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Mínimo 0 niños',
    }),
    camas: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
        message: 'Mínimo 1 cama',
    }),
    activo: z.any().transform(val => !!val),
    disponible: z.boolean(),
    fecha_entrada_date: z.string().optional().nullable(),
    fecha_entrada_time: z.string().optional().nullable(),
    fecha_salida_date: z.string().optional().nullable(),
    fecha_salida_time: z.string().optional().nullable(),
    imagen: z.any().optional(),
    imagen_url: z.string().optional(),
});

type HabitacionFormValues = z.infer<typeof habitacionSchema>;

interface HabitacionFormProps {
    habitacion?: any | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function HabitacionForm({ habitacion, onSuccess, onCancel }: HabitacionFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(habitacion?.imagen || '');
    const [imageError, setImageError] = useState('');
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [amenidades, setAmenidades] = useState<string[]>(
        habitacion?.amenidades ? (typeof habitacion.amenidades === 'string' ? JSON.parse(habitacion.amenidades) : habitacion.amenidades) : []
    );
    const [newAmenidad, setNewAmenidad] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors },
    } = useForm<HabitacionFormValues>({
        resolver: zodResolver(habitacionSchema),
        defaultValues: {
            nombre: habitacion?.nombre || '',
            slug: habitacion?.slug || '',
            descripcion: habitacion?.descripcion || '',
            precio_texto: habitacion?.precio_texto || 'Desde $26.78 USD / Noche',
            precio_numerico: habitacion?.precio_numerico?.toString() || '26.78',
            max_adultos: habitacion?.max_adultos?.toString() || '2',
            max_ninos: habitacion?.max_ninos?.toString() || '0',
            camas: habitacion?.camas?.toString() || '1',
            activo: habitacion?.activo !== undefined ? (habitacion.activo === 1 || habitacion.activo === true) : true,
            disponible: habitacion?.disponible !== undefined ? (habitacion.disponible === 1 || habitacion.disponible === true) : true,
            fecha_entrada_date: formatDateForInput(habitacion?.fecha_entrada),
            fecha_entrada_time: formatTimeForInput(habitacion?.fecha_entrada),
            fecha_salida_date: formatDateForInput(habitacion?.fecha_salida),
            fecha_salida_time: formatTimeForInput(habitacion?.fecha_salida),
            imagen_url: habitacion?.imagen || '',
        },
    });

    const activo = watch('activo');
    const disponible = watch('disponible');

    const addAmenidad = () => {
        if (newAmenidad.trim() && !amenidades.includes(newAmenidad.trim())) {
            setAmenidades([...amenidades, newAmenidad.trim()]);
            setNewAmenidad('');
        }
    };

    const removeAmenidad = (index: number) => {
        setAmenidades(amenidades.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            setImageError('Formato de imagen no soportado. Use JPG, PNG o WebP.');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setImageError('La imagen es demasiado grande (máx. 1MB). Por favor, comprima la imagen antes de subirla.');
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

    const onSubmit = async (data: HabitacionFormValues) => {
        console.log('Enviando formulario de habitación...', data);
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('nombre', data.nombre);
            formData.append('slug', data.slug);
            formData.append('descripcion', data.descripcion);
            formData.append('precio_texto', data.precio_texto);
            formData.append('precio_numerico', data.precio_numerico);
            formData.append('max_adultos', data.max_adultos);
            formData.append('max_ninos', data.max_ninos);
            formData.append('camas', data.camas);
            formData.append('activo', data.activo.toString());
            formData.append('disponible', data.disponible.toString());

            // Combine date and time
            const entrada = data.fecha_entrada_date && data.fecha_entrada_time
                ? `${data.fecha_entrada_date}T${data.fecha_entrada_time}`
                : (data.fecha_entrada_date || '');
            const salida = data.fecha_salida_date && data.fecha_salida_time
                ? `${data.fecha_salida_date}T${data.fecha_salida_time}`
                : (data.fecha_salida_date || '');

            formData.append('fecha_entrada', entrada);
            formData.append('fecha_salida', salida);
            formData.append('amenidades', JSON.stringify(amenidades));

            if (fileToUpload) {
                formData.append('imagen', fileToUpload);
            } else if (data.imagen_url) {
                formData.append('imagen_url', data.imagen_url);
            } else if (previewImage && !previewImage.startsWith('data:')) {
                formData.append('imagen_url', previewImage);
            }

            const url = habitacion?.id ? `/api/habitaciones/${habitacion.id}` : '/api/habitaciones';
            const method = habitacion?.id ? 'PUT' : 'POST';

            console.log(`Realizando petición ${method} a ${url}`);
            const response = await fetch(url, {
                method,
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Error al guardar la habitación');
            }

            console.log('Habitación guardada correctamente');
            onSuccess();
        } catch (error: any) {
            console.error('Submit error:', error);
            setError('nombre', { type: 'manual', message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {Object.keys(errors).length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    Por favor, corrige los errores en el formulario para poder guardar.
                    <ul className="list-disc ml-5 mt-1">
                        {Object.entries(errors).map(([key, err]) => (
                            <li key={key}>{key}: {err?.message as string}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre de la Habitación</label>
                        <Input {...register('nombre')} error={errors.nombre?.message} placeholder="Ej: Matrimonial Deluxe" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                        <Input {...register('slug')} error={errors.slug?.message} placeholder="ej-matrimonial-deluxe" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descripción</label>
                        <Textarea {...register('descripcion')} error={errors.descripcion?.message} rows={3} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Precio Texto</label>
                            <Input {...register('precio_texto')} error={errors.precio_texto?.message} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Precio Numérico</label>
                            <Input type="number" step="0.01" {...register('precio_numerico')} error={errors.precio_numerico?.message} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Max Adultos</label>
                            <Input type="number" {...register('max_adultos')} error={errors.max_adultos?.message} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Max Niños</label>
                            <Input type="number" {...register('max_ninos')} error={errors.max_ninos?.message} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Camas</label>
                            <Input type="number" {...register('camas')} error={errors.camas?.message} />
                        </div>
                    </div>

                    <div className="p-4 bg-cardenal-gold/5 border border-cardenal-gold/20 rounded-lg space-y-4">
                        <h4 className="text-sm font-bold text-cardenal-green uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Disponibilidad y Ocupación
                        </h4>

                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <label htmlFor="disponible-room" className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                                {disponible ? 'Disponible para nuevos huéspedes' : 'Habitación ocupada / No disponible'}
                            </label>
                            <Switch
                                id="disponible-room"
                                checked={disponible}
                                onCheckedChange={(checked: boolean) => setValue('disponible', checked)}
                                thumbClassName="bg-black"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-3 bg-white rounded border border-gray-100 flex flex-col space-y-2">
                                        <label className="block text-[10px] font-bold text-cardenal-green uppercase tracking-wider mb-1 px-1">Entrada</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                                                <Input type="date" {...register('fecha_entrada_date')} className="h-11 pl-10 bg-gray-50/50 border-gray-200 focus:border-cardenal-gold transition-all" />
                                            </div>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                                                <Input type="time" {...register('fecha_entrada_time')} className="h-11 pl-10 bg-gray-50/50 border-gray-200 focus:border-cardenal-gold transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white rounded border border-gray-100 flex flex-col space-y-2">
                                        <label className="block text-[10px] font-bold text-cardenal-green uppercase tracking-wider mb-1 px-1">Salida</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                                                <Input type="date" {...register('fecha_salida_date')} className="h-11 pl-10 bg-gray-50/50 border-gray-200 focus:border-cardenal-gold transition-all" />
                                            </div>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                                                <Input type="time" {...register('fecha_salida_time')} className="h-11 pl-10 bg-gray-50/50 border-gray-200 focus:border-cardenal-gold transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="activo-room"
                            checked={activo}
                            onCheckedChange={(checked: boolean) => setValue('activo', checked)}
                            thumbClassName="bg-black"
                        />
                        <label htmlFor="activo-room" className="text-sm font-medium">
                            {activo ? 'Visible en la página web' : 'Oculta de la página web'}
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Amenidades</label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={newAmenidad}
                                onChange={(e) => setNewAmenidad(e.target.value)}
                                placeholder="Ej: Jacuzzi, Balcón..."
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenidad())}
                            />
                            <Button type="button" onClick={addAmenidad} variant="outline" size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[50px] p-2 bg-gray-50 rounded-lg border">
                            {amenidades.map((am, i) => (
                                <span key={i} className="bg-cardenal-green text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    {am}
                                    <button type="button" onClick={() => removeAmenidad(i)}><X className="h-3 w-3" /></button>
                                </span>
                            ))}
                            {amenidades.length === 0 && <span className="text-gray-400 text-xs italic">No hay amenidades agregadas</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Imagen de la Habitación</label>
                        <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-48 bg-gray-50 relative group">
                            {previewImage ? (
                                <>
                                    <Image
                                        src={previewImage.startsWith('/api') ? `${previewImage}${previewImage.includes('?') ? '&' : '?'}v=${Date.now()}` : previewImage}
                                        alt="Preview"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        className="object-cover rounded-md"
                                        unoptimized
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setPreviewImage(''); setFileToUpload(null); setValue('imagen_url', ''); }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                    <p className="text-xs text-gray-500">Click para subir (o pega URL)</p>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                        </div>
                        {imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t font-serif">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
                <Button type="submit" className="bg-cardenal-green hover:bg-cardenal-green-dark text-white px-8" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    {habitacion?.id ? 'Guardar Cambios' : 'Crear Habitación'}
                </Button>
            </div>
        </form>
    );
}
