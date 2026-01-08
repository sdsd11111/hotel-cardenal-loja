
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
                    <div key={category} className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <div className="p-2 bg-cardenal-gold/10 rounded-lg">
                                <Settings className="w-5 h-5 text-cardenal-gold" />
                            </div>
                            <h3 className="font-bold text-cardenal-green uppercase tracking-wider">
                                {category === 'precios' ? 'Políticas de Precios' : 'Configuración General'}
                            </h3>
                        </div>

                        <div className="space-y-8">
                            {settings.filter(s => s.category === category).map(setting => (
                                <div key={setting.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-gray-700">{setting.display_name}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{setting.description}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-4">
                                            <Input
                                                type={setting.setting_key === 'child_age_threshold' ? 'number' : 'text'}
                                                value={setting.setting_value}
                                                onChange={e => handleChange(setting.setting_key, e.target.value)}
                                                className="max-w-[200px]"
                                            />
                                            {setting.setting_key === 'child_age_threshold' && (
                                                <span className="self-center text-sm font-medium text-gray-500">años</span>
                                            )}
                                        </div>
                                        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100 mt-2">
                                            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                            <p className="text-[11px] text-amber-800 italic">
                                                Ejemplo: Si coloca "8", los niños de 8 años o más se cobrarán como adultos.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end md:justify-start">
                                        <Button
                                            onClick={() => handleSave(setting)}
                                            disabled={isSaving}
                                            className="bg-cardenal-green hover:bg-cardenal-green/90 text-white"
                                        >
                                            <Save className="w-4 h-4 mr-2" /> Actualizar
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
