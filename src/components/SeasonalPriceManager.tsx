
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Trash2, Save, Plus, AlertCircle, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

// Reuse interface from RoomConfigForm
interface PriceOption {
    personas: number;
    personasIconos: number;
    precioBase: number;
    impuestos: number;
    incluye: string[];
}

interface SeasonalPrice {
    id?: number;
    room_config_id: number;
    start_date: string;
    end_date: string;
    price_options_json: PriceOption[] | string;
}

interface SeasonalPriceManagerProps {
    roomConfigId: number;
    initialSeasonalPrices?: SeasonalPrice[];
    basePriceOptions: PriceOption[]; // To copy from
    onUpdate: () => void;
}

export default function SeasonalPriceManager({ roomConfigId, initialSeasonalPrices, basePriceOptions, onUpdate }: SeasonalPriceManagerProps) {
    const [seasons, setSeasons] = useState<SeasonalPrice[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // New Season Form State
    const [isCreating, setIsCreating] = useState(false);
    const [newStartDate, setNewStartDate] = useState('');
    const [newEndDate, setNewEndDate] = useState('');
    const [checkError, setCheckError] = useState('');

    // Should start with base prices to make it easier
    const [newPriceOptions, setNewPriceOptions] = useState<PriceOption[]>([]);

    useEffect(() => {
        // Fetch seasons if not provided or just refresh
        fetchSeasons();
    }, [roomConfigId]);

    const fetchSeasons = async () => {
        try {
            const res = await fetch(`/api/admin/seasonal-prices?roomId=${roomConfigId}`);
            if (res.ok) {
                const data = await res.json();
                setSeasons(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Edit Mode State
    const [editId, setEditId] = useState<number | null>(null);

    const startCreating = () => {
        setIsCreating(true);
        setEditId(null);
        setNewPriceOptions(JSON.parse(JSON.stringify(basePriceOptions)));
        setNewStartDate('');
        setNewEndDate('');
    };

    const startEditing = (season: SeasonalPrice) => {
        setIsCreating(true);
        setEditId(season.id!);

        // Robust date conversion to YYYY-MM-DD format
        const formatDateForInput = (dateValue: string | Date): string => {
            try {
                const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } catch {
                return '';
            }
        };

        setNewStartDate(formatDateForInput(season.start_date));
        setNewEndDate(formatDateForInput(season.end_date));

        let existingOptions = [];
        try {
            existingOptions = typeof season.price_options_json === 'string'
                ? JSON.parse(season.price_options_json)
                : season.price_options_json;
        } catch { existingOptions = basePriceOptions; }

        setNewPriceOptions(existingOptions);
    };

    const cancelCreating = () => {
        setIsCreating(false);
        setEditId(null);
        setCheckError('');
    };

    const handleSaveNewSeason = async () => {
        if (!newStartDate || !newEndDate) {
            setCheckError('Selecciona fecha de inicio y fin');
            return;
        }
        if (new Date(newStartDate) > new Date(newEndDate)) {
            setCheckError('La fecha de inicio no puede ser después del fin');
            return;
        }

        // Check for overlapping dates (exclude current season if editing)
        const start = new Date(newStartDate);
        const end = new Date(newEndDate);

        const hasOverlap = seasons.some(season => {
            // Skip if we're editing this season
            if (editId && season.id === editId) return false;

            const seasonStart = new Date(season.start_date);
            const seasonEnd = new Date(season.end_date);

            // Check if dates overlap
            return (start <= seasonEnd && end >= seasonStart);
        });

        if (hasOverlap) {
            setCheckError('Las fechas se cruzan con otra temporada existente. Por favor elige fechas diferentes.');
            return;
        }

        setIsLoading(true);
        try {
            // Convert strings back to numbers for saving
            const cleanedOptions: PriceOption[] = newPriceOptions.map(opt => ({
                ...opt,
                precioBase: parseFloat(opt.precioBase.toString()) || 0,
                impuestos: 0, // Always 0 - no taxes in seasonal prices
                personas: opt.personas,
                personasIconos: opt.personasIconos,
                incluye: opt.incluye
            }));

            const payload = {
                room_config_id: roomConfigId,
                start_date: newStartDate,
                end_date: newEndDate,
                price_options_json: cleanedOptions
            };

            let res;
            if (editId) {
                // Update existing
                res = await fetch(`/api/admin/seasonal-prices/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create new
                res = await fetch('/api/admin/seasonal-prices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) throw new Error('Error al guardar');

            await fetchSeasons();
            setIsCreating(false);
            setEditId(null);
            onUpdate();
        } catch (error: any) {
            setCheckError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Seguro de eliminar esta temporada?')) return;
        try {
            await fetch(`/api/admin/seasonal-prices/${id}`, { method: 'DELETE' });
            fetchSeasons();
            onUpdate();
        } catch (e) {
            console.error(e);
        }
    };

    // Helper to render Price Options editor (simplified version)
    // We can reuse the logic from RoomConfigForm but it's bound to state there.
    // I'll implement a mini-editor here.

    const updatePriceOption = (idx: number, field: keyof PriceOption, value: any) => {
        const updated = [...newPriceOptions];
        updated[idx] = { ...updated[idx], [field]: value };
        setNewPriceOptions(updated);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-black text-cardenal-green flex items-center gap-2">
                    <Calendar className="w-6 h-6" /> Precios por Temporada
                </h3>
                {!isCreating && (
                    <Button onClick={startCreating} className="bg-cardenal-gold text-white font-bold">
                        <Plus className="w-4 h-4 mr-2" /> Nueva Temporada
                    </Button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl border-2 border-cardenal-gold/50 shadow-lg space-y-6 animate-fadeIn">
                    <h4 className="font-bold text-lg text-gray-800">{editId ? 'Editar Temporada' : 'Crear Nueva Temporada'}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Desde</label>
                            <Input
                                type="date"
                                value={newStartDate}
                                onChange={e => setNewStartDate(e.target.value)}
                                className="font-bold text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Hasta</label>
                            <Input
                                type="date"
                                value={newEndDate}
                                onChange={e => setNewEndDate(e.target.value)}
                                className="font-bold text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                            <Copy className="w-4 h-4" /> Personalizar Precios (Copiados del precio base)
                        </p>
                        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg border">
                            {newPriceOptions.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded shadow-sm border">
                                    <div className="w-16">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Pers.</label>
                                        <div className="font-bold text-lg text-gray-700">{opt.personas}</div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Precio</label>
                                        <Input
                                            type="number"
                                            value={opt.precioBase}
                                            onChange={(e) => updatePriceOption(idx, 'precioBase', e.target.value)}
                                            step="0.01"
                                            className="font-bold text-green-700 h-8"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-400">Total</div>
                                        <div className="font-black text-lg text-green-600">
                                            ${(parseFloat(opt.precioBase.toString()) || 0).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {checkError && (
                        <div className="text-red-500 bg-red-50 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                            <AlertCircle className="w-4 h-4" /> {checkError}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="ghost" onClick={cancelCreating}>Cancelar</Button>
                        <Button onClick={handleSaveNewSeason} disabled={isLoading} className="bg-cardenal-green text-white">
                            {isLoading ? 'Guardando...' : 'Guardar Temporada'}
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {seasons.map(season => {
                    // Check if Active Today
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const start = new Date(season.start_date); // Note: Might need timezone adjustment if string is YYYY-MM-DD
                    const end = new Date(season.end_date);
                    // Adjust parsing if needed, assumed YYYY-MM-DD string or ISO
                    // If coming from MySQL date, it's often ISO string
                    const isActive = today >= start && today <= end;

                    const prices = typeof season.price_options_json === 'string'
                        ? JSON.parse(season.price_options_json)
                        : season.price_options_json;

                    return (
                        <div key={season.id} className={cn(
                            "relative p-4 rounded-xl border-2 transition-all flex justify-between items-start gap-4",
                            isActive ? "bg-green-50 border-green-500 shadow-md" : "bg-white border-gray-200"
                        )}>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-gray-800 text-lg">
                                        {new Date(season.start_date).toLocaleDateString()} - {new Date(season.end_date).toLocaleDateString()}
                                    </span>
                                    {isActive && (
                                        <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Activo Ahora
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Precios modificados para {Array.isArray(prices) ? prices.length : 0} opciones.
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {Array.isArray(prices) && prices.map((p: any, i: number) => (
                                        <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded font-mono text-gray-700">
                                            P{p.personas}: ${p.precioBase}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => startEditing(season)} className="text-blue-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button onClick={() => handleDelete(season.id!)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
                {seasons.length === 0 && !isCreating && (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                        No hay precios de temporada configurados.
                    </div>
                )}
            </div>
        </div>
    );
}
