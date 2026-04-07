import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Bell, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    action_url?: string;
    action_text?: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const page = usePage();

    const fetchUnreadNotifications = async () => {
        try {
            const response = await axios.get('/notifications/unread');
            setNotifications(response.data.data || []);
            setUnreadCount(response.data.count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnreadNotifications();
        
        // Poll every 10 seconds
        const interval = setInterval(fetchUnreadNotifications, 10000);
        
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await axios.put(`/notifications/${notificationId}/read`);
            fetchUnreadNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDelete = async (notificationId: number) => {
        try {
            await axios.delete(`/notifications/${notificationId}`);
            fetchUnreadNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.put('/notifications/mark-all-read');
            fetchUnreadNotifications();
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

    return (
        <TooltipProvider>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Notificaciones</TooltipContent>
                </Tooltip>

                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                        <span>Notificaciones</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-sm text-gray-500">Cargando...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-sm text-gray-500">
                                No tienes notificaciones
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`border-b p-3 last:border-b-0 ${
                                        !notification.is_read
                                            ? 'bg-blue-50 dark:bg-blue-950'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm">
                                                {notification.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                {notification.message}
                                            </p>
                                            {notification.action_url && (
                                                <a
                                                    href={notification.action_url}
                                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2 inline-block"
                                                >
                                                    {notification.action_text ||
                                                        'Ver más'}
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {!notification.is_read && (
                                                <button
                                                    onClick={() =>
                                                        handleMarkAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleDelete(notification.id)
                                                }
                                                className="text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <DropdownMenuSeparator />
                    <div className="p-2 text-center">
                        <a
                            href="/notifications"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Ver todas las notificaciones
                        </a>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    );
}
