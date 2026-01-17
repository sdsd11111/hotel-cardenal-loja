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
                        <label htmlFor="titulo" className="text-sm font-black text-black uppercase tracking-widest">Título *</label>
                        <Input
                            id="titulo"
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            required
                            placeholder="Ej: ¡Oferta de Navidad!"
                            className="border-2 border-gray-400 font-bold h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="llamativo" className="text-sm font-black text-black uppercase tracking-widest">Texto Llamativo (Badge)</label>
                        <Input
                            id="llamativo"
                            value={formData.llamativo}
                            onChange={(e) => setFormData({ ...formData, llamativo: e.target.value })}
                            placeholder="Ej: -20% DESCUENTO"
                            className="border-2 border-gray-400 font-bold h-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-black text-black uppercase tracking-widest mb-1">Imagen del Anuncio</label>
                    <div className="border-4 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center h-48 bg-gray-100 relative group border-gray-300 transition-all hover:bg-gray-200">
                        {previewImage ? (
                            <>
                                <Image
                                    src={previewImage}
                                    alt="Preview"
                                    fill
                                    className="object-cover rounded-2xl"
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={handleClearImage}
                                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full shadow-lg z-10 hover:scale-110 transition-transform"
                                >
                                    <XIcon className="h-5 w-5 stroke-[3px]" />
                                </button>
                            </>
                        ) : (
                            <div className="text-center cursor-pointer p-4" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mx-auto h-12 w-12 text-cardenal-gold mb-3 stroke-[2px]" />
                                <p className="text-sm font-black text-gray-700 uppercase tracking-tighter">Click para subir imagen</p>
                                <p className="text-[10px] font-black text-gray-500 uppercase">Máx 1MB (JPG, PNG, WebP)</p>
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
                        <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <label htmlFor="imagen_url" className="text-[10px] font-black text-gray-500 uppercase mb-1 block">O usa una URL externa:</label>
                            <Input
                                id="imagen_url"
                                value={formData.imagen_url}
                                onChange={(e) => {
                                    setFormData({ ...formData, imagen_url: e.target.value });
                                    setPreviewImage(e.target.value);
                                }}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                className="h-10 text-xs border-gray-300 bg-white"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="descripcion" className="text-sm font-black text-black uppercase tracking-widest">Descripción</label>
                <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                    placeholder="Describe la oferta o el anuncio..."
                    className="border-2 border-gray-400 font-bold"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="boton_texto" className="text-sm font-black text-black uppercase tracking-widest">Texto del Botón</label>
                    <Input
                        id="boton_texto"
                        value={formData.boton_texto}
                        onChange={(e) => setFormData({ ...formData, boton_texto: e.target.value })}
                        placeholder="Ej: Reservar Ahora"
                        className="border-2 border-gray-400 font-bold h-12"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="boton_link" className="text-sm font-black text-black uppercase tracking-widest">Link del Botón</label>
                    <Input
                        id="boton_link"
                        value={formData.boton_link}
                        onChange={(e) => setFormData({ ...formData, boton_link: e.target.value })}
                        placeholder="Ej: /habitaciones"
                        className="border-2 border-gray-400 font-bold h-12"
                    />
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 flex items-center space-x-4">
                <input
                    type="checkbox"
                    id="activo"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="h-6 w-6 rounded-lg border-2 border-gray-400 text-cardenal-gold focus:ring-cardenal-gold"
                />
                <label htmlFor="activo" className="text-sm font-black text-black uppercase tracking-widest cursor-pointer">
                    Anuncio Activo (se mostrará en la web)
                </label>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="border-2 border-gray-300 font-black h-12 px-8 uppercase tracking-widest text-sm">
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-black min-w-[150px] h-12 px-8 shadow-lg uppercase tracking-widest text-sm">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
