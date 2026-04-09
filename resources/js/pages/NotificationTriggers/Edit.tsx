import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface NotificationTrigger {
    id: number;
    type: string;
    conditions: Record<string, any>;
    title_template: string;
    message_template: string;
    target_type: string;
    target_id: number | null;
    is_active: boolean;
}

interface Props {
    trigger: NotificationTrigger;
}

export default function Edit({ trigger }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
            {
                title: 'Editar NotificacionesTriggers',
                href: '/notifications-triggers.edit',
            },
          ];
    const [conditionsJson, setConditionsJson] = useState(
        JSON.stringify(trigger.conditions || {}, null, 2),
    );

    const { data, setData, put, transform, processing, errors } = useForm<{
        type: string;
        conditions: Record<string, any>;
        title_template: string;
        message_template: string;
        target_type: string;
        target_id: number | null;
        is_active: boolean;
    }>({
        type: trigger.type || '',
        conditions: trigger.conditions || {},
        title_template: trigger.title_template || '',
        message_template: trigger.message_template || '',
        target_type: trigger.target_type || '',
        target_id: trigger.target_id,
        is_active: trigger.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const conditions = JSON.parse(conditionsJson);
            transform((formData) => ({ ...formData, conditions }));
            put(route('notification-triggers.update', trigger.id));
            transform((formData) => formData);
        } catch (error) {
            alert('JSON de condiciones inválido');
        }
    };

    const typeOptions = [
        { value: 'sales_goal', label: 'Meta de Ventas' },
        { value: 'low_stock', label: 'Stock Bajo' },
        { value: 'birthday', label: 'Cumpleaños' },
    ];

    const targetTypeOptions = [
        { value: 'user', label: 'Usuario específico' },
        { value: 'role', label: 'Rol' },
        { value: 'all', label: 'Todos los usuarios' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuración del Trigger</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="type">Tipo de Trigger</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {typeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="target_type">Destino</Label>
                                    <Select
                                        value={data.target_type}
                                        onValueChange={(value) => setData('target_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar destino" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {targetTypeOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.target_type && <p className="text-red-500 text-sm">{errors.target_type}</p>}
                                </div>
                            </div>

                            {(data.target_type === 'user' || data.target_type === 'role') && (
                                <div>
                                    <Label htmlFor="target_id">ID del Destino</Label>
                                    <Input
                                        id="target_id"
                                        type="number"
                                        value={data.target_id ?? ''}
                                        onChange={(e) => setData('target_id', parseInt(e.target.value) || null)}
                                        placeholder={data.target_type === 'user' ? 'ID del usuario' : 'Nombre del rol'}
                                    />
                                    {errors.target_id && <p className="text-red-500 text-sm">{errors.target_id}</p>}
                                </div>
                            )}

                            <div>
                                <Label htmlFor="conditions">Condiciones (JSON)</Label>
                                <Textarea
                                    id="conditions"
                                    value={conditionsJson}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setConditionsJson(e.target.value)
                                    }
                                    placeholder='{"sales_count": 10, "period": "month"}'
                                    rows={3}
                                />
                                {errors.conditions && <p className="text-red-500 text-sm">{errors.conditions}</p>}
                            </div>

                            <div>
                                <Label htmlFor="title_template">Plantilla del Título</Label>
                                <Input
                                    id="title_template"
                                    value={data.title_template}
                                    onChange={(e) => setData('title_template', e.target.value)}
                                    placeholder="¡Felicitaciones {user_name}!"
                                />
                                {errors.title_template && <p className="text-red-500 text-sm">{errors.title_template}</p>}
                            </div>

                            <div>
                                <Label htmlFor="message_template">Plantilla del Mensaje</Label>
                                <Textarea
                                    id="message_template"
                                    value={data.message_template}
                                    onChange={(e: { target: { value: string } }) => setData('message_template', e.target.value)}
                                    placeholder="Has alcanzado {sales_count} ventas este {period}."
                                    rows={3}
                                />
                                {errors.message_template && <p className="text-red-500 text-sm">{errors.message_template}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData({ is_active: !!checked })}
                                />
                                <Label htmlFor="is_active">Activo</Label>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Actualizando...' : 'Actualizar Trigger'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
