'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard, Pencil, Trash2, Link as LinkIcon, Loader2, Upload, FileText, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

type Article = {
    id: string;
    slug: string;
    titulo: string;
    contenido: string;
    extracto: string;
    imagen_url: string;
    autor: string;
    categoria: string;
    tags: string;
    meta_description: string;
    palabra_clave: string;
    activo: boolean;
    fecha_publicacion: string;
    fecha_creacion: string;
};

export default function AdminBlogPage() {
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // States specific to the form
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewMode, setPreviewMode] = useState<'split' | 'edit' | 'preview'>('split');

    // Form States
    const initialFormState = {
        titulo: '',
        slug: '',
        contenido: '',
        extracto: '',
        imagen_url: '',
        autor: '',
        categoria: 'Hoteles',
        tags: '',
        meta_description: '',
        palabra_clave: '',
        activo: true,
        fecha_publicacion: new Date().toISOString().split('T')[0]
    };

    const [formData, setFormData] = useState(initialFormState);

    const fetchArticles = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/blog');
            const data = await res.json();
            if (data.success) {
                // Ensure 'activo' is treated as a boolean, handling "1", 1, "0", 0
                const normalizedArticles = data.data.map((a: any) => ({
                    ...a,
                    activo: a.activo === 1 || a.activo === '1' || a.activo === true
                }));
                setArticles(normalizedArticles);
            }
        } catch (e) {
            console.error('Error loading articles', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // SIEMPRE USAMOS POST para poder enviar Archivos (FormData)
            // Si es edición, el 'id' va en la URL y el backend PHP detectará que es un UPDATE
            const method = 'POST';
            const url = selectedArticle ? `/api/blog?id=${selectedArticle.id}` : '/api/blog';

            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                // @ts-ignore
                submitData.append(key, formData[key]);
            });

            if (imageFile) {
                submitData.append('imagen', imageFile);
            }

            const res = await fetch(url, {
                method,
                body: submitData
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setShowForm(false);
                setSelectedArticle(null);
                setFormData(initialFormState);
                setImageFile(null);
                fetchArticles();
            } else {
                alert('Error al guardar: ' + (result.error || 'Desconocido'));
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión');
        } finally {
            setIsSubmitting(false);
        }
    };
    //...


    const handleEdit = (article: Article) => {
        setSelectedArticle(article);
        setFormData({
            titulo: article.titulo,
            slug: article.slug,
            contenido: article.contenido,
            extracto: article.extracto || '',
            imagen_url: article.imagen_url || '',
            autor: article.autor || '',
            categoria: article.categoria || 'Hoteles',
            tags: article.tags || '',
            meta_description: article.meta_description || '',
            palabra_clave: article.palabra_clave || '',
            activo: article.activo,
            fecha_publicacion: article.fecha_publicacion ? article.fecha_publicacion.split(' ')[0] : new Date().toISOString().split('T')[0]
        });
        setImageFile(null); // Reset file input
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar definitivamente?')) return;
        await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
        fetchArticles();
    };

    const handleToggleStatus = async (article: Article) => {
        try {
            const newStatus = !article.activo;
            const res = await fetch(`/api/blog?id=${article.id}`, {
                method: 'PUT',
                body: JSON.stringify({ activo: newStatus }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                // Actualizar localmente para feedback inmediato
                setArticles(articles.map(a => a.id === article.id ? { ...a, activo: newStatus } : a));
            } else {
                alert('Error al cambiar estado');
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Volver
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold text-white pl-4 border-l border-gray-600">
                            Gestor de Blog
                        </h1>
                    </div>
                    <Button onClick={() => { setSelectedArticle(null); setFormData(initialFormState); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Artículo
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6">
                {isLoading ? <Loader2 className="animate-spin text-blue-500 mx-auto" /> : (
                    <div className="grid gap-4">
                        {articles.map(article => (
                            <div key={article.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between border border-gray-700 hover:border-blue-500/50 transition-colors">
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded bg-gray-700 overflow-hidden flex-shrink-0 relative">
                                        {article.imagen_url ? (
                                            <Image
                                                src={article.imagen_url}
                                                fill
                                                className="object-cover"
                                                alt=""
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500"><ImageIcon className="w-6 h-6" /></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{article.titulo}</h3>
                                        <div className="text-sm text-gray-400 flex gap-2">
                                            <span>{article.fecha_publicacion?.split(' ')[0]}</span>
                                            <span>•</span>
                                            <span>{article.categoria}</span>
                                            <span>•</span>
                                            <span className={article.activo ? "text-green-400" : "text-amber-400"}>{article.activo ? 'Publicado' : 'Borrador'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* Status Toggle */}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleToggleStatus(article)}
                                        className={article.activo ? "text-green-500 hover:text-green-400" : "text-gray-500 hover:text-gray-400"}
                                        title={article.activo ? "Desactivar" : "Activar"}
                                    >
                                        {article.activo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </Button>

                                    {/* View Link */}
                                    <Link href={`/blog/${article.slug}`} target="_blank">
                                        <Button size="icon" variant="ghost" className="text-blue-400 hover:text-white" title="Ver en la web">
                                            <LinkIcon className="w-4 h-4" />
                                        </Button>
                                    </Link>

                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(article)} title="Editar"><Pencil className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400" onClick={() => handleDelete(article.id)} title="Eliminar"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex overflow-hidden">
                        <div className="bg-gray-900 w-full h-full flex flex-col md:flex-row shadow-2xl">

                            {/* Sidebar / Main Form Fields */}
                            <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-800 overflow-y-auto p-6 space-y-6 bg-gray-900">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        {selectedArticle ? 'Editar' : 'Nuevo'}
                                    </h2>
                                    <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">Cerrar</Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Título</label>
                                        <input
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:border-blue-500 outline-none"
                                            value={formData.titulo}
                                            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                            placeholder="Mi Gran Artículo"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Slug (URL)</label>
                                        <input
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-gray-300 font-mono text-xs"
                                            value={formData.slug}
                                            placeholder="mi-articulo-ejemplo"
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Imagen Principal</label>
                                        <div className="space-y-4">
                                            {/* Preview Image */}
                                            {(formData.imagen_url || imageFile) && (
                                                <div className="relative w-full h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                                                    {imageFile ? (
                                                        <img
                                                            src={URL.createObjectURL(imageFile)}
                                                            className="w-full h-full object-cover"
                                                            alt="Preview"
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={formData.imagen_url}
                                                            alt="Preview"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-blue-400 hover:file:bg-gray-700 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase">Fecha</label>
                                            <input
                                                type="date"
                                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-xs"
                                                value={formData.fecha_publicacion}
                                                onChange={e => setFormData({ ...formData, fecha_publicacion: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase">Estado</label>
                                            <div className="flex items-center h-9">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.activo}
                                                        onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                                                        className="w-4 h-4 rounded text-blue-600 bg-gray-700 border-gray-600"
                                                    />
                                                    <span className="text-sm text-gray-300">Publicado</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Categoría</label>
                                        <select
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm"
                                            value={formData.categoria}
                                            onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                        >
                                            <option>Hoteles</option>
                                            <option>Turismo</option>
                                            <option>Gastronomía</option>
                                            <option>Eventos</option>
                                            <option>Noticias</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Autor</label>
                                        <input
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm"
                                            value={formData.autor}
                                            onChange={e => setFormData({ ...formData, autor: e.target.value })}
                                            placeholder="Ej: Juan Pérez"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Palabra Clave (SEO)</label>
                                        <input
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm"
                                            value={formData.palabra_clave}
                                            onChange={e => setFormData({ ...formData, palabra_clave: e.target.value })}
                                            placeholder="Ej: hotel en cuenca, turismo"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Meta Descripción (SEO)</label>
                                        <textarea
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm h-20"
                                            value={formData.meta_description}
                                            placeholder="Resumen para Google (150-160 caracteres)"
                                            onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Extracto</label>
                                        <textarea
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm h-20"
                                            value={formData.extracto}
                                            onChange={e => setFormData({ ...formData, extracto: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Split Editor Section */}
                            <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-950">
                                {/* Editor Toolbar */}
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900">
                                    <div className="flex space-x-1 bg-gray-800 rounded p-1">
                                        <button
                                            onClick={() => setPreviewMode('edit')}
                                            className={`px-3 py-1 text-xs rounded transition-colors ${previewMode === 'edit' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Escribir
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('split')}
                                            className={`px-3 py-1 text-xs rounded transition-colors ${previewMode === 'split' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Dividido
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('preview')}
                                            className={`px-3 py-1 text-xs rounded transition-colors ${previewMode === 'preview' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Vista Previa
                                        </button>
                                    </div>
                                    <Button size="sm" onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white border-0">
                                        {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                                        Guardar Todo
                                    </Button>
                                </div>

                                {/* Editor Areas */}
                                <div className="flex-1 flex overflow-hidden">
                                    {/* Write Area */}
                                    <div className={`h-full border-r border-gray-800 ${previewMode === 'preview' ? 'hidden' : ''} ${previewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                                        <textarea
                                            className="w-full h-full bg-gray-950 text-gray-300 font-mono text-sm p-6 outline-none resize-none leading-relaxed"
                                            value={formData.contenido}
                                            placeholder="# Escribe tu artículo aquí...&#10;&#10;Soporta **Markdown**."
                                            onChange={e => setFormData({ ...formData, contenido: e.target.value })}
                                            spellCheck={false}
                                        />
                                    </div>

                                    {/* Preview Area */}
                                    <div className={`h-full bg-white overflow-y-auto ${previewMode === 'edit' ? 'hidden' : ''} ${previewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                                        <div className="prose prose-sm max-w-none p-8">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeRaw]}
                                            >
                                                {formData.contenido || '*La vista previa aparecerá aquí...*'}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
