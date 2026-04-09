import { AppShell } from '@/components/app-shell';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { Head, usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    action_url?: string;
    action_text?: string;
    created_at: string;
}

interface PaginatedData {
    data: Notification[];
    links: {
        first: string;
        last: string;
        prev?: string;
        next?: string;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export default function NotificationsIndex() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Notificaciones',
            href: '/notifications',
        },
      ];
    const page = usePage<{
        notifications?: PaginatedData;
        filter?: string;
    }>();
    const {
        notifications: initialNotifications,
        filter: initialFilter,
    } = page.props;

    const defaultNotifications: PaginatedData = {
        data: [],
        links: {
            first: '',
            last: '',
            prev: undefined,
            next: undefined,
        },
        meta: {
            current_page: 1,
            from: 0,
            last_page: 1,
            path: '',
            per_page: 15,
            to: 0,
            total: 0,
        },
    };

    const [notifications, setNotifications] = useState<PaginatedData>(
        initialNotifications ?? defaultNotifications
    );
    const [filter, setFilter] = useState<string>(initialFilter ?? 'all');
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async (newFilter?: string) => {
        setLoading(true);
        try {
            const selectedFilter = newFilter || filter;
            const response = await axios.get('/notifications', {
                params: {
                    filter: selectedFilter,
                    per_page: 15,
                },
                headers: {
                    Accept: 'application/json',
                },
            });
            setNotifications(response.data ?? defaultNotifications);
            setFilter(selectedFilter);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (value: string) => {
        fetchNotifications(value);
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await axios.put(`/notifications/${notificationId}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAsUnread = async (notificationId: number) => {
        try {
            await axios.put(`/notifications/${notificationId}/unread`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as unread:', error);
        }
    };

    const handleDelete = async (notificationId: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
            try {
                await axios.delete(`/notifications/${notificationId}`);
                fetchNotifications();
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    };

    const handleDeleteAll = async () => {
        if (
            confirm(
                '¿Estás seguro de que deseas eliminar todas las notificaciones?'
            )
        ) {
            try {
                await axios.delete('/notifications');
                fetchNotifications();
            } catch (error) {
                console.error('Error deleting all notifications:', error);
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.put('/notifications/mark-all-read');
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getNotificationColor = (type: string): string => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
            case 'info':
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;

        return date.toLocaleDateString('es-ES');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notificaciones" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    
                    <AppShell>
                        <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
                            <Heading title="Notificaciones" />

                            <div className="flex flex-col gap-4">
                                {/* Controls */}
                                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('notifications.create')}
                                            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            Crear notificación
                                        </Link>
                                        <Link
                                            href={route('notification-triggers.index')}
                                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                                        >
                                            Programar notificación
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label
                                            htmlFor="filter"
                                            className="text-sm font-medium"
                                        >
                                            Filtrar:
                                        </label>
                                        <Select
                                            value={filter}
                                            onValueChange={handleFilterChange}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Todas
                                                </SelectItem>
                                                <SelectItem value="unread">
                                                    Sin leer
                                                </SelectItem>
                                                <SelectItem value="read">
                                                    Leídas
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleMarkAllAsRead}
                                        >
                                            Marcar todo como leído
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDeleteAll}
                                        >
                                            Eliminar todo
                                        </Button>
                                    </div>
                                </div>

                                {/* Notifications Table */}
                                <div className="rounded-lg border">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <p className="text-sm text-gray-500">
                                                Cargando notificaciones...
                                            </p>
                                        </div>
                                    ) : !notifications?.data?.length ? (
                                        <div className="flex items-center justify-center py-8">
                                            <p className="text-sm text-gray-500">
                                                No hay notificaciones
                                            </p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Título</TableHead>
                                                    <TableHead>Mensaje</TableHead>
                                                    <TableHead>Tipo</TableHead>
                                                    <TableHead>Fecha</TableHead>
                                                    <TableHead className="text-right">
                                                        Acciones
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {notifications.data.map((notification) => (
                                                    <TableRow
                                                        key={notification.id}
                                                        className={
                                                            !notification.is_read
                                                                ? 'bg-blue-50 dark:bg-blue-950'
                                                                : ''
                                                        }
                                                    >
                                                        <TableCell className="font-semibold">
                                                            <div className="flex items-center gap-2">
                                                                {notification.title}
                                                                {!notification.is_read && (
                                                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="max-w-xs text-sm">
                                                            {notification.message}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span
                                                                className={`inline-block rounded px-2 py-1 text-xs font-semibold ${getNotificationColor(
                                                                    notification.type
                                                                )}`}
                                                            >
                                                                {notification.type}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-gray-500">
                                                            {formatDate(
                                                                notification.created_at
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                {!notification.is_read ? (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleMarkAsRead(
                                                                                notification.id
                                                                            )
                                                                        }
                                                                        className="text-gray-400 hover:text-blue-600"
                                                                        title="Marcar como leído"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleMarkAsUnread(
                                                                                notification.id
                                                                            )
                                                                        }
                                                                        className="text-gray-400 hover:text-blue-600"
                                                                        title="Marcar como no leído"
                                                                    >
                                                                        <EyeOff className="h-4 w-4" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            notification.id
                                                                        )
                                                                    }
                                                                    className="text-gray-400 hover:text-red-600"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>

                                {/* Pagination Info */}
                                {notifications.meta && (
                                    <div className="text-sm text-gray-500">
                                        Mostrando {notifications.meta.from} a{' '}
                                        {notifications.meta.to} de{' '}
                                        {notifications.meta.total} notificaciones
                                    </div>
                                )}

                                {/* Pagination Links */}
                                {notifications.meta && notifications.meta.last_page > 1 && (
                                    <div className="flex items-center justify-center gap-2">
                                        {notifications.links.prev && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const url = new URL(
                                                        notifications.links.prev!
                                                    );
                                                    const page = url.searchParams.get(
                                                        'page'
                                                    );
                                                    window.location.href = `/notifications?page=${page}&filter=${filter}`;
                                                }}
                                            >
                                                Anterior
                                            </Button>
                                        )}

                                        {Array.from(
                                            { length: notifications.meta.last_page },
                                            (_, i) => i + 1
                                        ).map((pageNum) => (
                                            <Button
                                                key={pageNum}
                                                variant={
                                                    pageNum ===
                                                        notifications.meta.current_page
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                onClick={() => {
                                                    window.location.href = `/notifications?page=${pageNum}&filter=${filter}`;
                                                }}
                                            >
                                                {pageNum}
                                            </Button>
                                        ))}

                                        {notifications.links.next && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const url = new URL(
                                                        notifications.links.next!
                                                    );
                                                    const page = url.searchParams.get(
                                                        'page'
                                                    );
                                                    window.location.href = `/notifications?page=${page}&filter=${filter}`;
                                                }}
                                            >
                                                Siguiente
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </AppShell>
                </div>
            </div>
        </AppLayout>
    );
}
