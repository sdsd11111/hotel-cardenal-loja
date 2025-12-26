'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon, Upload, X as XIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface AnnouncementFormProps {
    announcement?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function AnnouncementForm({ announcement, onSuccess, onCancel }: AnnouncementFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(announcement?.imagen_url || '');
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [imageError, setImageError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        titulo: announcement?.titulo || '',
        descripcion: announcement?.descripcion || '',
        llamativo: announcement?.llamativo || '',
        imagen_url: announcement?.imagen_url || '',
        boton_texto: announcement?.boton_texto || '',
        boton_link: announcement?.boton_link || '',
        activo: announcement?.activo === 1 || announcement?.activo === true,
        posicion: announcement?.posicion || 'bottom-right',
        estilo: announcement?.estilo ? (typeof announcement.estilo === 'string' ? JSON.parse(announcement.estilo) : announcement.estilo) : {}
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            setImageError('Formato no soportado (JPG, PNG, WebP).');
            setPreviewImage('');
            setFileToUpload(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setImageError('Máximo 1MB.');
            setPreviewImage('');
            setFileToUpload(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
            setFileToUpload(file);
            setImageError('');
            setFormData(prev => ({ ...prev, imagen_url: '' }));
        };
        reader.readAsDataURL(file);
    };

    const handleClearImage = () => {
        setPreviewImage('');
        setFileToUpload(null);
        setImageError('');
        setFormData(prev => ({ ...prev, imagen_url: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const submitData = new FormData();
            submitData.append('titulo', formData.titulo);
            submitData.append('descripcion', formData.descripcion);
            submitData.append('llamativo', formData.llamativo);
            submitData.append('boton_texto', formData.boton_texto);
            submitData.append('boton_link', formData.boton_link);
            submitData.append('activo', formData.activo.toString());
            submitData.append('posicion', formData.posicion);
            submitData.append('estilo', JSON.stringify(formData.estilo));

            if (fileToUpload) {
                submitData.append('imagen', fileToUpload);
            } else if (formData.imagen_url) {
                submitData.append('imagen_url', formData.imagen_url);
            }

            const url = announcement ? `/api/anuncios/${announcement.id}` : '/api/anuncios';
            const method = announcement ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: submitData,
            });

            if (!response.ok) throw new Error('Error al guardar el anuncio');
            onSuccess();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="titulo" className="text-sm font-medium">Título *</label>
                        <Input
                            id="titulo"
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            required
                            placeholder="Ej: ¡Oferta de Navidad!"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="llamativo" className="text-sm font-medium">Texto Llamativo (Badge)</label>
                        <Input
                            id="llamativo"
                            value={formData.llamativo}
                            onChange={(e) => setFormData({ ...formData, llamativo: e.target.value })}
                            placeholder="Ej: -20% DESCUENTO"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1">Imagen del Anuncio</label>
                    <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-48 bg-gray-50 relative group">
                        {previewImage ? (
                            <>
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    fill
                                    className="object-cover rounded-md"
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={handleClearImage}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            </>
                        ) : (
                            <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-xs text-gray-500">Click para subir imagen</p>
                                <p className="text-[10px] text-gray-400">Máx 1MB (JPG, PNG, WebP)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                    {imageError && <p className="text-xs text-red-500 mt-1">{imageError}</p>}
                    {!fileToUpload && (
                        <div className="mt-2">
                            <label htmlFor="imagen_url" className="text-xs text-gray-500">O usa una URL externa:</label>
                            <Input
                                id="imagen_url"
                                value={formData.imagen_url}
                                onChange={(e) => {
                                    setFormData({ ...formData, imagen_url: e.target.value });
                                    setPreviewImage(e.target.value);
                                }}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="h-8 text-xs mt-1"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="descripcion" className="text-sm font-medium">Descripción</label>
                <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                    placeholder="Describe la oferta o el anuncio..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="boton_texto" className="text-sm font-medium">Texto del Botón</label>
                    <Input
                        id="boton_texto"
                        value={formData.boton_texto}
                        onChange={(e) => setFormData({ ...formData, boton_texto: e.target.value })}
                        placeholder="Ej: Reservar Ahora"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="boton_link" className="text-sm font-medium">Link del Botón</label>
                    <Input
                        id="boton_link"
                        value={formData.boton_link}
                        onChange={(e) => setFormData({ ...formData, boton_link: e.target.value })}
                        placeholder="Ej: /habitaciones"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-cardenal-gold focus:ring-cardenal-gold"
                />
                <label htmlFor="activo" className="text-sm font-medium">
                    Anuncio Activo (se mostrará en la web)
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white min-w-[120px]">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        announcement ? 'Actualizar Anuncio' : 'Crear Anuncio'
                    )}
                </Button>
            </div>
        </form>
    );
}
