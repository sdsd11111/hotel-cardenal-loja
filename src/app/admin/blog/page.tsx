'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, LayoutDashboard, Pencil, Trash2, Link as LinkIcon, Loader2, Upload, FileText, Eye, EyeOff, Image as ImageIcon, ChevronLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
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
        categoria: 'Nuestro Hotel',
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
            const method = selectedArticle ? 'PUT' : 'POST';
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
            categoria: article.categoria || 'Nuestro Hotel',
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
        <div className="min-h-screen bg-cardenal-cream text-text-main font-sans">
            <header className="bg-white border-b-2 border-gray-200 shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/admin">
                            <Button variant="outline" size="sm" className="border-2 border-gray-300 font-black text-black hover:bg-gray-100">
                                <LayoutDashboard className="mr-2 h-5 w-5 stroke-[2px]" />
                                VOLVER
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-black text-cardenal-green uppercase tracking-tighter pl-6 border-l-4 border-cardenal-gold">
                            Gestor de Blog
                        </h1>
                    </div>
                    <Button onClick={() => { setSelectedArticle(null); setFormData(initialFormState); setShowForm(true); }} className="bg-cardenal-green hover:bg-cardenal-green/90 text-white font-black px-8 h-12 rounded-xl shadow-lg uppercase tracking-widest">
                        <Plus className="mr-2 h-5 w-5 stroke-[3px]" />
                        Crear Artículo
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6">
                {isLoading ? <Loader2 className="animate-spin text-blue-500 mx-auto" /> : (
                    <div className="grid gap-4">
                        {articles.map(article => (
                            <div key={article.id} className="bg-white p-6 rounded-3xl flex items-center justify-between border-2 border-gray-200 hover:border-cardenal-green shadow-sm transition-all duration-300 group">
                                <div className="flex gap-6 items-center">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-200 overflow-hidden flex-shrink-0 relative border-2 border-gray-100 shadow-inner">
                                        {article.imagen_url ? (
                                            <Image
                                                src={article.imagen_url}
                                                fill
                                                className="object-cover"
                                                alt=""
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-black uppercase tracking-tight group-hover:text-cardenal-green transition-colors">{article.titulo}</h3>
                                        <div className="text-sm font-bold text-gray-700 flex flex-wrap gap-3 mt-2 uppercase tracking-tighter">
                                            <span className="bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">{article.fecha_publicacion?.split(' ')[0]}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="bg-cardenal-cream/50 px-2 py-1 rounded-lg border border-cardenal-sand">{article.categoria}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className={cn(
                                                "px-2 py-1 rounded-lg border font-black",
                                                article.activo ? "bg-green-100 text-green-800 border-green-300" : "bg-orange-100 text-orange-800 border-orange-300"
                                            )}>
                                                {article.activo ? 'PUBLICADO' : 'BORRADOR'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    {/* Status Toggle */}
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleToggleStatus(article)}
                                        className={cn(
                                            "h-12 w-12 border-2",
                                            article.activo
                                                ? "border-green-300 text-green-600 bg-green-50 hover:bg-green-100"
                                                : "border-gray-300 text-gray-500 bg-gray-50 hover:bg-gray-100"
                                        )}
                                        title={article.activo ? "Desactivar" : "Activar"}
                                    >
                                        {article.activo ? <Eye className="w-6 h-6 stroke-[2.5px]" /> : <EyeOff className="w-6 h-6 stroke-[2.5px]" />}
                                    </Button>

                                    {/* View Link */}
                                    <Link href={`/blog/${article.slug}`} target="_blank">
                                        <Button size="icon" variant="outline" className="h-12 w-12 border-2 border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100" title="Ver en la web">
                                            <LinkIcon className="w-6 h-6 stroke-[2.5px]" />
                                        </Button>
                                    </Link>

                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleEdit(article)}
                                        className="h-12 w-12 border-2 border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100"
                                        title="Editar"
                                    >
                                        <Pencil className="w-6 h-6 stroke-[2.5px]" />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => handleDelete(article.id)}
                                        className="h-12 w-12 border-2 border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-6 h-6 stroke-[2.5px]" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex overflow-hidden">
                        <div className="bg-white w-full h-full flex flex-col md:flex-row shadow-2xl">

                            {/* Sidebar / Main Form Fields */}
                            <div className="w-full md:w-1/3 lg:w-1/4 border-r-2 border-gray-200 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-black text-cardenal-green flex items-center gap-3 uppercase tracking-tighter">
                                        <FileText className="w-7 h-7" />
                                        {selectedArticle ? 'Editar' : 'Nuevo'}
                                    </h2>
                                    <Button variant="outline" size="sm" onClick={() => setShowForm(false)} className="border-2 border-gray-300 font-black text-black">CERRAR</Button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Título</label>
                                        <input
                                            className="w-full bg-white border-2 border-gray-400 rounded-xl p-3 text-black font-bold focus:border-cardenal-green outline-none h-12"
                                            value={formData.titulo}
                                            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                            placeholder="Mi Gran Artículo"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Slug (URL)</label>
                                        <input
                                            className="w-full bg-gray-100 border-2 border-gray-300 rounded-xl p-3 text-gray-700 font-mono text-sm h-12"
                                            value={formData.slug}
                                            placeholder="mi-articulo-ejemplo"
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Imagen Principal</label>
                                        <div className="space-y-4">
                                            {/* Preview Image */}
                                            {(formData.imagen_url || imageFile) && (
                                                <div className="relative w-full h-40 bg-gray-200 rounded-2xl overflow-hidden border-2 border-gray-300 shadow-inner">
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
                                                className="w-full text-xs font-black text-gray-700 file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-2 file:border-gray-300 file:text-xs file:font-black file:bg-white file:text-cardenal-green hover:file:bg-gray-50 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-black uppercase tracking-widest">Fecha</label>
                                            <input
                                                type="date"
                                                className="w-full bg-white border-2 border-gray-400 rounded-xl p-3 text-black font-bold text-xs h-12"
                                                value={formData.fecha_publicacion}
                                                onChange={e => setFormData({ ...formData, fecha_publicacion: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-black uppercase tracking-widest">Estado</label>
                                            <div className="flex items-center h-12 bg-white px-3 rounded-xl border-2 border-gray-400">
                                                <div className="flex items-center space-x-3 cursor-pointer">
                                                    <Switch
                                                        id="activo-blog"
                                                        checked={formData.activo}
                                                        onCheckedChange={checked => setFormData({ ...formData, activo: checked })}
                                                        className="data-[state=checked]:bg-cardenal-green data-[state=unchecked]:bg-gray-300"
                                                    />
                                                    <span className="text-xs font-black text-black uppercase">Publicado</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Categoría</label>
                                        <select
                                            className="w-full bg-white border-2 border-gray-400 rounded-xl p-3 text-black font-bold h-12 outline-none appearance-none"
                                            value={formData.categoria}
                                            onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                        >
                                            <option value="Nuestro Hotel">Nuestro Hotel</option>
                                            <option value="Qué comer en Loja">Qué comer en Loja</option>
                                            <option value="Eventos en Loja">Eventos en Loja</option>
                                            <option value="Tours de Loja">Tours de Loja</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Tags</label>
                                        <input
                                            className="w-full bg-white border-2 border-gray-400 rounded-xl p-3 text-black font-bold h-12"
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="Ej: turismo, comida, centro histórico"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Autor</label>
                                        <input
                                            className="w-full bg-white border-2 border-gray-400 rounded-xl p-3 text-black font-bold h-12"
                                            value={formData.autor}
                                            onChange={e => setFormData({ ...formData, autor: e.target.value })}
                                            placeholder="Ej: Juan Pérez"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Palabra Clave (SEO)</label>
                                        <input
                                            className="w-full bg-white border-2 border-gray-400 rounded-xl p-3 text-black font-bold h-12"
                                            value={formData.palabra_clave}
                                            onChange={e => setFormData({ ...formData, palabra_clave: e.target.value })}
                                            placeholder="Ej: hotel en loja, turismo"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Meta Descripción (SEO)</label>
                                        <textarea
                                            className="w-full bg-white border-2 border-gray-400 rounded-xl p-3 text-black font-bold h-24"
                                            value={formData.meta_description}
                                            placeholder="Resumen para Google"
                                            onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-black uppercase tracking-widest">Extracto</label>
                                        <textarea
                                            className="w-full bg-white border-2 border-gray-400 rounded-xl p-3 text-black font-bold h-24"
                                            value={formData.extracto}
                                            onChange={e => setFormData({ ...formData, extracto: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Split Editor Section */}
                            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
                                {/* Editor Toolbar */}
                                <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-200 bg-gray-50">
                                    <div className="flex space-x-2 bg-gray-200 rounded-xl p-1.5 border-2 border-gray-300">
                                        <button
                                            onClick={() => setPreviewMode('edit')}
                                            className={cn(
                                                "px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all",
                                                previewMode === 'edit' ? 'bg-cardenal-green text-white shadow-md' : 'text-gray-600 hover:text-black hover:bg-gray-300'
                                            )}
                                        >
                                            Escribir
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('split')}
                                            className={cn(
                                                "px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all",
                                                previewMode === 'split' ? 'bg-cardenal-green text-white shadow-md' : 'text-gray-600 hover:text-black hover:bg-gray-300'
                                            )}
                                        >
                                            Dividido
                                        </button>
                                        <button
                                            onClick={() => setPreviewMode('preview')}
                                            className={cn(
                                                "px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all",
                                                previewMode === 'preview' ? 'bg-cardenal-green text-white shadow-md' : 'text-gray-600 hover:text-black hover:bg-gray-300'
                                            )}
                                        >
                                            Vista Previa
                                        </button>
                                    </div>
                                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white font-black px-10 h-14 rounded-xl shadow-xl uppercase tracking-[0.2em] transition-transform hover:scale-105">
                                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-6 h-6 mr-3 stroke-[3px]" />}
                                        GUARDAR TODO
                                    </Button>
                                </div>

                                {/* Editor Areas */}
                                <div className="flex-1 flex overflow-hidden">
                                    {/* Write Area */}
                                    <div className={`h-full border-r-2 border-gray-200 ${previewMode === 'preview' ? 'hidden' : ''} ${previewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                                        <textarea
                                            className="w-full h-full bg-gray-50 text-black font-mono text-base p-10 outline-none resize-none leading-relaxed border-none focus:bg-white transition-colors"
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
