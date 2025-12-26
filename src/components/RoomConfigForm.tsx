
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save, X, Users, Coffee, Check, AlertCircle } from 'lucide-react';

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
            <div className="flex border-b border-gray-200">
                {configs.map(config => (
                    <button
                        key={config.id}
                        onClick={() => setSelectedId(config.id)}
                        className={`px-6 py-3 font-bold text-sm transition-colors relative ${selectedId === config.id
                            ? 'text-cardenal-green border-b-2 border-cardenal-gold'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Habitación {config.identifier}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: General Info & Amenities */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-cardenal-green border-b pb-2">Información General</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Título de Pantalla</label>
                                <Input
                                    value={editingConfig.display_title}
                                    onChange={e => setEditingConfig({ ...editingConfig, display_title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Tamaño (m²)</label>
                                <Input
                                    type="number"
                                    value={editingConfig.room_size}
                                    onChange={e => setEditingConfig({ ...editingConfig, room_size: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Descripción</label>
                            <Textarea
                                value={editingConfig.description}
                                onChange={e => setEditingConfig({ ...editingConfig, description: e.target.value })}
                                className="h-24"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={editingConfig.has_balcony}
                                onChange={e => setEditingConfig({ ...editingConfig, has_balcony: e.target.checked })}
                                id="has_balcony"
                            />
                            <label htmlFor="has_balcony" className="text-sm font-medium text-gray-700">Tiene Balcón</label>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="font-bold text-cardenal-green">Amenidades (Columna "Tipo de Habitación")</h3>
                            <Button variant="ghost" size="sm" onClick={addAmenity} className="text-cardenal-gold">
                                <Plus className="w-4 h-4 mr-1" /> Agregar
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {amenities.map((amenity, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        value={amenity}
                                        onChange={e => handleAmenityChange(idx, e.target.value)}
                                        className="text-sm h-8"
                                    />
                                    <button onClick={() => removeAmenity(idx)} className="text-red-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Price Options */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="font-bold text-cardenal-green">Opciones de Precio (Botón "AGREGAR")</h3>
                            <Button variant="outline" size="sm" onClick={addPriceOption}>
                                <Plus className="w-4 h-4 mr-1" /> Nueva Opción
                            </Button>
                        </div>

                        <div className="space-y-8">
                            {priceOptions.map((option, optIdx) => (
                                <div key={optIdx} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 space-y-4 relative group">
                                    <button
                                        onClick={() => removePriceOption(optIdx)}
                                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                <Users className="w-3 h-3" /> Personas
                                            </label>
                                            <Input
                                                type="number"
                                                value={option.personas}
                                                onChange={e => handlePriceOptionChange(optIdx, 'personas', parseInt(e.target.value))}
                                                className="h-8"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                Iconos
                                            </label>
                                            <Input
                                                type="number"
                                                value={option.personasIconos}
                                                onChange={e => handlePriceOptionChange(optIdx, 'personasIconos', parseInt(e.target.value))}
                                                className="h-8"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">Precio Base</label>
                                            <Input
                                                type="number"
                                                value={option.precioBase}
                                                onChange={e => handlePriceOptionChange(optIdx, 'precioBase', parseFloat(e.target.value))}
                                                className="h-8 font-bold"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">IVA/Imp.</label>
                                            <Input
                                                type="number"
                                                value={option.impuestos}
                                                onChange={e => handlePriceOptionChange(optIdx, 'impuestos', parseFloat(e.target.value))}
                                                className="h-8"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                            "Tus Opciones" (Checklist)
                                        </label>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            {option.incluye.map((item, incIdx) => (
                                                <div key={incIdx} className="flex gap-2">
                                                    <div className="p-1 text-green-500">
                                                        {incIdx === 0 ? <Coffee className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                                                    </div>
                                                    <Input
                                                        value={item}
                                                        onChange={e => handleIncludeChange(optIdx, incIdx, e.target.value)}
                                                        className="h-7 text-xs"
                                                    />
                                                    <button onClick={() => removeInclude(optIdx, incIdx)} className="text-gray-300 hover:text-red-400">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                            <Button variant="ghost" size="sm" onClick={() => addInclude(optIdx)} className="h-6 text-[10px] text-gray-500 self-start">
                                                <Plus className="w-3 h-3 mr-1" /> Agregar item
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
