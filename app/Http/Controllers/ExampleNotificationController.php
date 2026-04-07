<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use App\Models\User;
use Illuminate\Http\Response;

/**
 * ExampleNotificationController
 * 
 * Este controlador es un ejemplo de cómo usar el servicio de notificaciones
 * en diferentes escenarios. Siéntete libre de adaptarlo a tus necesidades.
 */
class ExampleNotificationController extends Controller
{
    public function __construct(protected NotificationService $notificationService)
    {
    }

    /**
     * Ejemplo 1: Enviar una notificación a un usuario específico
     * 
     * Uso: GET /example/notify-user/{userId}
     */
    public function notifyUser($userId)
    {
        $user = User::findOrFail($userId);

        $this->notificationService->sendToUser(
            user: $user,
            title: 'Welcome!',
            message: 'Tu cuenta ha sido creada exitosamente en el sistema',
            type: 'success',
            options: [
                'icon' => 'check-circle',
                'action_url' => '/dashboard',
                'action_text' => 'Ir al Dashboard'
            ]
        );

        return response()->json([
            'message' => 'Notificación enviada a ' . $user->name,
        ]);
    }

    /**
     * Ejemplo 2: Enviar una notificación cuando se crea un producto
     * 
     * Esto debería estar en un event listener, pero se muestra aquí como ejemplo
     */
    public function notifyProductCreated()
    {
        $this->notificationService->sendToRole(
            roleName: 'admin',
            title: 'Nuevo Producto',
            message: 'Se ha registrado un nuevo producto en el sistema',
            type: 'success',
            options: [
                'action_url' => '/products',
                'action_text' => 'Ver productos'
            ]
        );

        return response()->json([
            'message' => 'Notificación de nuevo producto enviada a administradores',
        ]);
    }

    /**
     * Ejemplo 3: Enviar una notificación de error cuando hay un problema
     */
    public function notifyError()
    {
        $this->notificationService->sendToRole(
            roleName: 'admin',
            title: 'Error en el Sistema',
            message: 'Ha ocurrido un error en el proceso de inventario',
            type: 'error',
            options: [
                'action_url' => '/logs',
                'action_text' => 'Ver Logs'
            ]
        );

        return response()->json([
            'message' => 'Notificación de error enviada',
        ]);
    }

    /**
     * Ejemplo 4: Notificación de advertencia para todos los usuarios
     */
    public function notifyMaintenance()
    {
        $this->notificationService->sendToAll(
            title: 'Mantenimiento Programado',
            message: 'El sistema estará en mantenimiento mañana de 2am a 4am. Se recomienda no realizar operaciones críticas.',
            type: 'warning'
        );

        return response()->json([
            'message' => 'Notificación de mantenimiento enviada a todos los usuarios',
        ]);
    }

    /**
     * Ejemplo 5: Notificación de venta completada
     */
    public function notifySaleCompleted($saleId)
    {
        $this->notificationService->sendToRole(
            roleName: 'admin',
            title: 'Venta Completada',
            message: 'Se ha registrado una nueva venta exitosamente',
            type: 'success',
            options: [
                'action_url' => '/sales/' . $saleId,
                'action_text' => 'Ver Venta'
            ]
        );

        return response()->json([
            'message' => 'Notificación de venta enviada',
        ]);
    }

    /**
     * Ejemplo 6: Enviar notificación a múltiples usuarios
     */
    public function notifyMultipleUsers()
    {
        // Obtener IDs de usuarios específicos (ej: solo supervisores)
        $userIds = User::whereHas('roles', function ($query) {
            $query->where('name', 'supervisor');
        })->pluck('id')->toArray();

        $this->notificationService->sendToUsers(
            userIds: $userIds,
            title: 'Reporte Disponible',
            message: 'El reporte de ventas del mes está listo para revisión',
            type: 'info',
            options: [
                'action_url' => '/reports/sales',
                'action_text' => 'Ver Reporte'
            ]
        );

        return response()->json([
            'message' => 'Notificación enviada a ' . count($userIds) . ' supervisores',
        ]);
    }

    /**
     * Ejemplo 7: Obtener información de notificaciones
     */
    public function stats()
    {
        $user = auth()->user();

        return response()->json([
            'unread_count' => $this->notificationService->getUnreadCount($user),
            'recent_notifications' => $this->notificationService->getRecent($user, 5),
        ]);
    }

    /**
     * Ejemplo 8: Limpiar notificaciones antiguas
     */
    public function cleanup()
    {
        $deletedCount = $this->notificationService->cleanupOldNotifications(days: 30);

        return response()->json([
            'message' => 'Se eliminaron ' . $deletedCount . ' notificaciones antiguas',
        ]);
    }
}
