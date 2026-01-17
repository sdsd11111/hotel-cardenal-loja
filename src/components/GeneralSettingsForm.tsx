
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Settings, Info } from 'lucide-react';

interface Setting {
    id: number;
    setting_key: string;
    setting_value: string;
    display_name: string;
    description: string;
    category: string;
}

export default function GeneralSettingsForm({ onUpdate }: { onUpdate: () => void }) {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/settings');
            if (!response.ok) throw new Error('Error al cargar configuraciones');
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (key: string, value: string) => {
        setSettings(prev => prev.map(s => s.setting_key === key ? { ...s, setting_value: value } : s));
    };

    const handleSave = async (setting: Setting) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    setting_key: setting.setting_key,
                    setting_value: setting.setting_value
                }),
            });
            if (!response.ok) throw new Error('Error al guardar');
            alert('Configuración guardada correctamente');
            onUpdate();
            fetchSettings();
        } catch (error) {
            console.error(error);
            alert('Error al guardar la configuración');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cardenal-gold"></div>
            </div>
        );
    }

    // Group by category
    const categories = Array.from(new Set(settings.map(s => s.category)));

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 gap-8">
                {categories.map(category => (
                    <div key={category} className="bg-white p-8 rounded-3xl border-2 border-gray-300 shadow-xl space-y-8">
                        <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-5">
                            <div className="p-3 bg-cardenal-gold/20 rounded-xl">
                                <Settings className="w-7 h-7 text-cardenal-gold" />
                            </div>
                            <h3 className="text-xl font-black text-cardenal-green uppercase tracking-widest font-serif">
                                {category === 'precios' ? 'Políticas de Precios' : 'Configuración General'}
                            </h3>
                        </div>

                        <div className="space-y-8">
                            {settings.filter(s => s.category === category).map(setting => (
                                <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start p-6 bg-gray-50/50 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all">
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-black leading-tight">{setting.display_name}</h4>
                                        <p className="text-xs font-black text-gray-700 uppercase tracking-tight leading-relaxed">{setting.description}</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-4">
                                            <Input
                                                type={setting.setting_key === 'child_age_threshold' ? 'number' : 'text'}
                                                value={setting.setting_value}
                                                onChange={e => handleChange(setting.setting_key, e.target.value)}
                                                className="max-w-[200px] border-2 border-gray-400 font-black text-lg h-12 bg-white"
                                            />
                                            {setting.setting_key === 'child_age_threshold' && (
                                                <span className="self-center text-base font-black text-black">Años</span>
                                            )}
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-amber-100 rounded-xl border-2 border-amber-300 shadow-sm">
                                            <Info className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                                            <p className="text-xs text-amber-900 font-black uppercase tracking-tight leading-snug">
                                                Ejemplo: Si coloca "8", los niños de 8 años o más se cobrarán como adultos.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end md:justify-center">
                                        <Button
                                            onClick={() => handleSave(setting)}
                                            disabled={isSaving}
                                            className="bg-cardenal-green hover:bg-cardenal-green/90 text-white font-black h-12 px-6 shadow-md uppercase tracking-widest text-sm"
                                        >
                                            <Save className="w-5 h-5 mr-2 stroke-[3px]" /> Actualizar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
