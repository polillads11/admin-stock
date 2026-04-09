import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { route } from "ziggy-js";
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
    triggers: NotificationTrigger[];
}

export default function Index({ triggers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'NotificacionesTriggers',
            href: '/notifications-triggers',
        },
      ];

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'sales_goal': return 'Meta de Ventas';
            case 'low_stock': return 'Stock Bajo';
            case 'birthday': return 'Cumpleaños';
            default: return type;
        }
    };

    const getTargetLabel = (trigger: NotificationTrigger) => {
        switch (trigger.target_type) {
            case 'user': return `Usuario ${trigger.target_id}`;
            case 'role': return `Rol: ${trigger.target_id}`;
            case 'all': return 'Todos';
            default: return trigger.target_type;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
                    <div className="p-6">
            <Head title="Triggers de Notificación" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Triggers de Notificación</h1>
                    <Link href={route('notification-triggers.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Trigger
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4">
                    {triggers.map((trigger) => (
                        <Card key={trigger.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {getTypeLabel(trigger.type)}
                                            <Badge variant={trigger.is_active ? 'default' : 'secondary'}>
                                                {trigger.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Destino: {getTargetLabel(trigger)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={route('notification-triggers.edit', trigger.id)}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('¿Eliminar este trigger?')) {
                                                    // Handle delete
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p><strong>Título:</strong> {trigger.title_template}</p>
                                    <p><strong>Mensaje:</strong> {trigger.message_template}</p>
                                    <p><strong>Condiciones:</strong> {JSON.stringify(trigger.conditions)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            </div>
        </AppLayout>
    );
}