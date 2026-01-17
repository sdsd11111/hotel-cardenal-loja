
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, X, Users, Coffee, Check, AlertCircle, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceOption {
    personas: number;
    personasIconos: number;
    precioBase: number;
    impuestos: number;
    incluye: string[];
}

interface RoomConfig {
    id: number;
    identifier: string;
    display_title: string;
    room_size: number;
    description: string;
    has_balcony: boolean;
    price_options_json: string | PriceOption[];
    amenities_json: string | string[];
    images_json: string | string[];
}

export default function RoomConfigForm({ configs, onUpdate }: { configs: RoomConfig[], onUpdate: () => void }) {
    const [selectedId, setSelectedId] = useState<number | null>(configs[0]?.id || null);
    const [editingConfig, setEditingConfig] = useState<RoomConfig | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const config = configs.find(c => c.id === selectedId);
        if (config) {
            setEditingConfig({
                ...config,
                price_options_json: typeof config.price_options_json === 'string' ? JSON.parse(config.price_options_json) : config.price_options_json,
                amenities_json: typeof config.amenities_json === 'string' ? JSON.parse(config.amenities_json) : config.amenities_json,
                images_json: typeof config.images_json === 'string' ? JSON.parse(config.images_json) : config.images_json,
            });
        }
    }, [selectedId, configs]);

    if (!editingConfig) return null;

    const priceOptions = editingConfig.price_options_json as PriceOption[];
    const amenities = editingConfig.amenities_json as string[];

    const handlePriceOptionChange = (idx: number, field: keyof PriceOption, value: any) => {
        const newOptions = [...priceOptions];
        newOptions[idx] = { ...newOptions[idx], [field]: value };
        setEditingConfig({ ...editingConfig, price_options_json: newOptions });
    };

    const handleIncludeChange = (optIdx: number, incIdx: number, value: string) => {
        const newOptions = [...priceOptions];
        newOptions[optIdx].incluye[incIdx] = value;
        setEditingConfig({ ...editingConfig, price_options_json: newOptions });
    };

    const addInclude = (optIdx: number) => {
        const newOptions = [...priceOptions];
        newOptions[optIdx].incluye.push('');
        setEditingConfig({ ...editingConfig, price_options_json: newOptions });
    };

    const removeInclude = (optIdx: number, incIdx: number) => {
        const newOptions = [...priceOptions];
        newOptions[optIdx].incluye.splice(incIdx, 1);
        setEditingConfig({ ...editingConfig, price_options_json: newOptions });
    };

    const addPriceOption = () => {
        const newOptions = [...priceOptions, {
            personas: 1,
            personasIconos: 1,
            precioBase: 0,
            impuestos: 0,
            incluye: ['Desayuno incluido', 'Cancelación gratis']
        }];
        setEditingConfig({ ...editingConfig, price_options_json: newOptions });
    };

    const removePriceOption = (idx: number) => {
        const newOptions = priceOptions.filter((_, i) => i !== idx);
        setEditingConfig({ ...editingConfig, price_options_json: newOptions });
    };

    const handleAmenityChange = (idx: number, value: string) => {
        const newAmenities = [...amenities];
        newAmenities[idx] = value;
        setEditingConfig({ ...editingConfig, amenities_json: newAmenities });
    };

    const addAmenity = () => {
        setEditingConfig({ ...editingConfig, amenities_json: [...amenities, ''] });
    };

    const removeAmenity = (idx: number) => {
        setEditingConfig({ ...editingConfig, amenities_json: amenities.filter((_, i) => i !== idx) });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/room-configs/${editingConfig.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingConfig),
            });
            if (!response.ok) throw new Error('Error al guardar');
            alert('Configuración guardada correctamente');
            onUpdate();
        } catch (error) {
            console.error(error);
            alert('Error al guardar la configuración');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Tabs for different room types */}
            <div className="flex bg-gray-200 p-2 rounded-2xl border-2 border-gray-300 shadow-sm gap-2">
                {configs.map(config => (
                    <button
                        key={config.id}
                        onClick={() => setSelectedId(config.id)}
                        className={cn(
                            "px-8 py-3 rounded-xl text-base font-black transition-all",
                            selectedId === config.id
                                ? "bg-white text-cardenal-green shadow-md scale-105"
                                : "text-gray-700 hover:bg-gray-300 hover:text-black"
                        )}
                    >
                        Habitación {config.identifier}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: General Info & Amenities */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border-2 border-gray-300 shadow-xl space-y-6">
                        <h3 className="text-xl font-black text-cardenal-green border-b-2 border-gray-200 pb-3 flex items-center gap-2">
                            <Settings2 className="w-6 h-6" /> Información General
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-black uppercase tracking-widest">Título de Pantalla</label>
                                <Input
                                    value={editingConfig.display_title}
                                    onChange={e => setEditingConfig({ ...editingConfig, display_title: e.target.value })}
                                    className="border-2 border-gray-400 font-black h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-black uppercase tracking-widest">Tamaño (m²)</label>
                                <Input
                                    type="number"
                                    value={editingConfig.room_size}
                                    onChange={e => setEditingConfig({ ...editingConfig, room_size: parseInt(e.target.value) })}
                                    className="border-2 border-gray-400 font-black h-12"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-black uppercase tracking-widest">Descripción</label>
                            <Textarea
                                value={editingConfig.description}
                                onChange={e => setEditingConfig({ ...editingConfig, description: e.target.value })}
                                className="h-32 border-2 border-gray-400 font-black text-base"
                            />
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl border-2 border-gray-200">
                            <input
                                type="checkbox"
                                checked={editingConfig.has_balcony}
                                onChange={e => setEditingConfig({ ...editingConfig, has_balcony: e.target.checked })}
                                id="has_balcony"
                                className="w-6 h-6 text-cardenal-gold border-2 border-gray-400 rounded focus:ring-cardenal-gold"
                            />
                            <label htmlFor="has_balcony" className="text-sm font-black text-black uppercase tracking-widest cursor-pointer">Tiene Balcón</label>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border-2 border-gray-300 shadow-xl space-y-6">
                        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-3">
                            <h3 className="text-xl font-black text-cardenal-green flex items-center gap-2">
                                <Plus className="w-6 h-6" /> Amenidades
                            </h3>
                            <Button variant="outline" size="sm" onClick={addAmenity} className="text-cardenal-gold font-black border-2 border-cardenal-gold/50 shadow-sm">
                                <Plus className="w-4 h-4 mr-1 stroke-[3px]" /> Agregar
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {amenities.map((amenity, idx) => (
                                <div key={idx} className="flex gap-3 bg-gray-50 p-2 rounded-xl border-2 border-gray-200">
                                    <Input
                                        value={amenity}
                                        onChange={e => handleAmenityChange(idx, e.target.value)}
                                        className="text-base font-black h-10 border-gray-300"
                                    />
                                    <button onClick={() => removeAmenity(idx)} className="text-red-500 hover:text-red-700 p-2">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Price Options */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border-2 border-gray-300 shadow-xl space-y-8">
                        <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4">
                            <h3 className="text-xl font-black text-cardenal-green flex items-center gap-2">
                                <Coffee className="w-6 h-6" /> Opciones de Precio
                            </h3>
                            <Button onClick={addPriceOption} className="bg-cardenal-gold text-white font-black shadow-lg">
                                <Plus className="w-4 h-4 mr-2 stroke-[3px]" /> Nueva Opción
                            </Button>
                        </div>

                        <div className="space-y-8">
                            {priceOptions.map((option, optIdx) => (
                                <div key={optIdx} className="p-6 border-2 border-gray-200 rounded-2xl bg-gray-100/50 space-y-6 relative group transition-all hover:border-cardenal-gold/50 shadow-sm">
                                    <button
                                        onClick={() => removePriceOption(optIdx)}
                                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-1">
                                                <Users className="w-4 h-4 text-cardenal-gold" /> Personas
                                            </label>
                                            <Input
                                                type="number"
                                                value={option.personas}
                                                onChange={e => handlePriceOptionChange(optIdx, 'personas', parseInt(e.target.value))}
                                                className="h-10 border-2 border-gray-300 font-black text-lg bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-black uppercase tracking-widest">
                                                Iconos
                                            </label>
                                            <Input
                                                type="number"
                                                value={option.personasIconos}
                                                onChange={e => handlePriceOptionChange(optIdx, 'personasIconos', parseInt(e.target.value))}
                                                className="h-10 border-2 border-gray-300 font-black text-lg bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-black uppercase tracking-widest">Precio Base</label>
                                            <Input
                                                type="number"
                                                value={option.precioBase}
                                                onChange={e => handlePriceOptionChange(optIdx, 'precioBase', parseFloat(e.target.value))}
                                                className="h-10 border-2 border-cardenal-green/50 font-black text-lg bg-green-50 text-cardenal-green"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-black uppercase tracking-widest">IVA/Imp.</label>
                                            <Input
                                                type="number"
                                                value={option.impuestos}
                                                onChange={e => handlePriceOptionChange(optIdx, 'impuestos', parseFloat(e.target.value))}
                                                className="h-10 border-2 border-gray-300 font-black text-lg bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-black uppercase tracking-widest flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-600" /> "Tus Opciones" (Checklist)
                                        </label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {option.incluye.map((item, incIdx) => (
                                                <div key={incIdx} className="flex gap-3 bg-white p-2 rounded-xl border-2 border-gray-200">
                                                    <div className="p-1.5 bg-green-100 text-green-700 rounded-lg">
                                                        {incIdx === 0 ? <Coffee className="w-4 h-4" /> : <Check className="w-4 h-4 stroke-[3px]" />}
                                                    </div>
                                                    <Input
                                                        value={item}
                                                        onChange={e => handleIncludeChange(optIdx, incIdx, e.target.value)}
                                                        className="h-10 text-sm font-black border-none bg-transparent"
                                                    />
                                                    <button onClick={() => removeInclude(optIdx, incIdx)} className="text-red-400 hover:text-red-600 p-2">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                            <Button variant="ghost" size="sm" onClick={() => addInclude(optIdx)} className="h-10 text-xs font-black text-cardenal-gold border-2 border-dashed border-cardenal-gold/30 hover:bg-cardenal-gold/5 flex items-center gap-2">
                                                <Plus className="w-4 h-4 stroke-[3px]" /> AGREGAR ITEM A LA LISTA
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 -mx-4">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-cardenal-gold hover:bg-cardenal-gold/90 text-white px-8 h-12 text-lg font-bold shadow-lg"
                >
                    {isSaving ? 'Guardando...' : (
                        <><Save className="w-5 h-5 mr-2" /> Guardar Cambios</>
                    )}
                </Button>
            </div>
        </div>
    );
}
