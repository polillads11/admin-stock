import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import { route } from "ziggy-js";

interface NotificationTriggerConditions {
    sales_count?: number;
    period?: string;
    from_date?: string;
    to_date?: string;
    threshold?: number;
}

interface NotificationTriggerForm {
    type: string;
    conditions: NotificationTriggerConditions;
    title_template: string;
    message_template: string;
    target_type: string;
    target_id: number | null;
    is_active: boolean;
}

interface Props {}

export default function Create({}: Props) {
    const { data, setData, post, processing, errors } = useForm<NotificationTriggerForm>({
        type: '',
        conditions: {},
        title_template: '',
        message_template: '',
        target_type: '',
        target_id: null,
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('notification-triggers.store'));
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
        <>
            <Head title="Crear Trigger de Notificación" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <h1 className="text-3xl font-bold">Crear Trigger de Notificación</h1>
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
                                    <Select value={data.target_type} onValueChange={(value) => setData('target_type', value)}>
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
                                        value={data.target_id || ''}
                                        onChange={(e) => setData('target_id', parseInt(e.target.value) || null)}
                                        placeholder={data.target_type === 'user' ? 'ID del usuario' : 'Nombre del rol'}
                                    />
                                    {errors.target_id && <p className="text-red-500 text-sm">{errors.target_id}</p>}
                                </div>
                            )}

                            <div>
                                <Label htmlFor="conditions">Condiciones del Trigger</Label>
                                <p className="text-sm text-slate-500 mb-2">
                                    Elige los valores que activan este trigger. Los campos disponibles cambian según el tipo seleccionado.
                                </p>

                                {data.type === 'sales_goal' && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="sales_count">Cantidad de Ventas</Label>
                                            <Input
                                                id="sales_count"
                                                type="number"
                                                value={data.conditions.sales_count ?? ''}
                                                onChange={(e) => {
                                                    const salesCount = parseInt(e.target.value, 10);
                                                    setData({
                                                        conditions: {
                                                            ...data.conditions,
                                                            sales_count: Number.isNaN(salesCount) ? undefined : salesCount,
                                                        },
                                                    });
                                                }}
                                                placeholder="Número mínimo de ventas"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="period">Periodo</Label>
                                            <Select
                                                value={data.conditions.period || ''}
                                                onValueChange={(value) =>
                                                    setData({
                                                        conditions: {
                                                            ...data.conditions,
                                                            period: value,
                                                        },
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar periodo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="day">Hoy</SelectItem>
                                                    <SelectItem value="week">Esta semana</SelectItem>
                                                    <SelectItem value="month">Este mes</SelectItem>
                                                    <SelectItem value="year">Este año</SelectItem>
                                                    <SelectItem value="custom">Rango personalizado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {data.conditions.period === 'custom' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="from_date">Desde</Label>
                                                    <Input
                                                        id="from_date"
                                                        type="date"
                                                        value={data.conditions.from_date ?? ''}
                                                        onChange={(e) =>
                                                            setData({
                                                                conditions: {
                                                                    ...data.conditions,
                                                                    from_date: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="to_date">Hasta</Label>
                                                    <Input
                                                        id="to_date"
                                                        type="date"
                                                        value={data.conditions.to_date ?? ''}
                                                        onChange={(e) =>
                                                            setData({
                                                                conditions: {
                                                                    ...data.conditions,
                                                                    to_date: e.target.value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {data.type === 'low_stock' && (
                                    <div>
                                        <Label htmlFor="threshold">Límite de Stock</Label>
                                        <Input
                                            id="threshold"
                                            type="number"
                                            value={data.conditions.threshold ?? ''}
                                            onChange={(e) => {
                                                const threshold = parseInt(e.target.value, 10);
                                                setData({
                                                    conditions: {
                                                        ...data.conditions,
                                                        threshold: Number.isNaN(threshold) ? undefined : threshold,
                                                    },
                                                });
                                            }}
                                            placeholder="Cantidad mínima de stock"
                                        />
                                        <p className="text-sm text-slate-500 mt-2">
                                            Se enviará la notificación cuando el stock del producto esté por debajo de este valor.
                                        </p>
                                    </div>
                                )}

                                {data.type === 'birthday' && (
                                    <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                        Este trigger se activa automáticamente en el cumpleaños del usuario. No es necesario ingresar condiciones adicionales.
                                    </div>
                                )}

                                {!data.type && (
                                    <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                        Selecciona un tipo de trigger para ver los campos de condiciones.
                                    </div>
                                )}

                                {errors.conditions && <p className="text-red-500 text-sm">{errors.conditions}</p>}
                            </div>

                            <div>
                                <Label htmlFor="title_template">Título de la notificación</Label>
                                <Input
                                    id="title_template"
                                    value={data.title_template}
                                    onChange={(e) => setData('title_template', e.target.value)}
                                    placeholder="Ej. ¡Felicitaciones, {user_name}!"
                                />
                                <p className="text-sm text-slate-500 mt-1">
                                    Puedes usar variables como <span className="font-mono">{`{user_name}`}</span>, <span className="font-mono">{`{sales_count}`}</span> o <span className="font-mono">{`{period}`}</span> según el tipo de trigger.
                                </p>
                                {errors.title_template && <p className="text-red-500 text-sm">{errors.title_template}</p>}
                            </div>

                            <div>
                                <Label htmlFor="message_template">Texto de la notificación</Label>
                                <Textarea
                                    id="message_template"
                                    value={data.message_template}
                                    onChange={(e: { target: { value: string; }; }) => setData('message_template', e.target.value)}
                                    placeholder="Ej. Has alcanzado 10 ventas este mes."
                                    rows={3}
                                />
                                <p className="text-sm text-slate-500 mt-1">
                                    Escribe el mensaje que verá el usuario. Usa variables como <span className="font-mono">{`{user_name}`}</span> para personalizarlo.
                                </p>
                                {errors.message_template && <p className="text-red-500 text-sm">{errors.message_template}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active">Activo</Label>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creando...' : 'Crear Trigger'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}