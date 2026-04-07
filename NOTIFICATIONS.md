# Módulo de Notificaciones

Este módulo proporciona un sistema completo de notificaciones en tiempo real para los usuarios del sistema.

## Características

- 📬 Notificaciones persistentes en la base de datos
- 🔔 Widget de notificaciones en el header
- 📋 Página completa de gestión de notificaciones
- 🎯 Filtrado por estado (todas, leídas, sin leer)
- ⚡ Polling automático cada 10 segundos
- 🎨 Soporte para tipos de notificaciones (info, success, warning, error)
- 🔗 Enlaces de acción en notificaciones

## Estructura del Módulo

```
app/
├── Models/
│   └── Notification.php          # Modelo de notificaciones
├── Http/
│   ├── Controllers/
│   │   └── NotificationController.php  # Controlador de notificaciones
│   └── Requests/
└── Services/
    └── NotificationService.php    # Servicio para enviar notificaciones

database/
└── migrations/
    └── 2026_04_07_000000_create_notifications_table.php

app/Policies/
└── NotificationPolicy.php        # Política de autorización

resources/js/
├── components/
│   └── NotificationBell.tsx       # Widget de notificaciones
└── pages/
    └── Notifications/
        └── Index.tsx              # Página de notificaciones
```

## Base de Datos

La tabla `notifications` contiene los siguientes campos:

```php
- id: ID único
- user_id: ID del usuario que recibe la notificación
- title: Título de la notificación
- message: Mensaje principal
- type: Tipo (info, success, warning, error)
- icon: Icono opcional
- action_url: URL de acción opcional
- action_text: Texto del botón de acción
- is_read: Si la notificación ha sido leída
- read_at: Fecha/hora cuando fue leída
- created_at: Fecha de creación
- updated_at: Última actualización
```

## Uso

### 1. Integrar el Widget en el Header

En tu componente `AppHeader.tsx`, importa y agrega el widget:

```tsx
import { NotificationBell } from '@/components/NotificationBell';

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            {/* Otros elementos del header */}
            <NotificationBell />
        </div>
    );
}
```

### 2. Enviar Notificaciones desde el Código

#### Enviar a un usuario específico

```php
use App\Services\NotificationService;

$notificationService = app(NotificationService::class);

$notificationService->sendToUser(
    user: $user,
    title: 'Bienvenido',
    message: 'Tu cuenta ha sido creada exitosamente',
    type: 'success',
    options: [
        'icon' => 'check-circle',
        'action_url' => '/dashboard',
        'action_text' => 'Ir al Dashboard'
    ]
);
```

#### Enviar a múltiples usuarios

```php
$notificationService->sendToUsers(
    userIds: [1, 2, 3],
    title: 'Actualización del sistema',
    message: 'El sistema fue actualizado con éxito',
    type: 'info'
);
```

#### Enviar a un rol específico

```php
$notificationService->sendToRole(
    roleName: 'admin',
    title: 'Reporte de ventas',
    message: 'Las ventas del día están disponibles',
    type: 'success',
    options: [
        'action_url' => '/sales',
        'action_text' => 'Ver ventas'
    ]
);
```

#### Enviar a todos los usuarios

```php
$notificationService->sendToAll(
    title: 'Mantenimiento programado',
    message: 'El sistema estará en mantenimiento mañana de 2am a 4am',
    type: 'warning'
);
```

### 3. Uso en Eventos

Puedes enviar notificaciones automáticamente cuando ocurren eventos:

```php
namespace App\Events;

use App\Models\Product;
use Illuminate\Broadcasting\Channel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProductCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(public Product $product)
    {
    }
}
```

En un listener:

```php
namespace App\Listeners;

use App\Events\ProductCreated;
use App\Services\NotificationService;

class SendProductCreatedNotification
{
    public function handle(ProductCreated $event): void
    {
        app(NotificationService::class)->sendToRole(
            roleName: 'admin',
            title: 'Nuevo producto creado',
            message: 'Se ha creado el producto: ' . $event->product->name,
            type: 'success',
            options: [
                'action_url' => '/products/' . $event->product->id,
                'action_text' => 'Ver producto'
            ]
        );
    }
}
```

### 4. API de Notificaciones

#### Obtener notificaciones sin leer

```http
GET /notifications/unread
```

Respuesta:
```json
{
    "data": [
        {
            "id": 1,
            "title": "Bienvenido",
            "message": "Tu cuenta ha sido creada",
            "type": "success",
            "is_read": false,
            "created_at": "2026-04-07T10:30:00Z"
        }
    ],
    "count": 1
}
```

#### Obtener todas las notificaciones

```http
GET /notifications?filter=all&per_page=15
```

Parámetros:
- `filter`: all, read, unread
- `per_page`: Notificaciones por página

#### Marcar como leída

```http
PUT /notifications/{id}/read
```

#### Marcar como no leída

```http
PUT /notifications/{id}/unread
```

#### Marcar todas como leídas

```http
PUT /notifications/mark-all-read
```

#### Eliminar notificación

```http
DELETE /notifications/{id}
```

#### Eliminar todas las notificaciones

```http
DELETE /notifications
```

## Tipos de Notificaciones

El campo `type` puede ser uno de estos valores:

- `info` - Información general (azul)
- `success` - Operación exitosa (verde)
- `warning` - Advertencia (amarillo)
- `error` - Error (rojo)

## Limpieza de Notificaciones Antiguas

Para limpiar automáticamente notificaciones leídas antiguas, ejecuta:

```php
$notificationService->cleanupOldNotifications(days: 30); // Eliminará notificaciones leídas más antiguas de 30 días
```

Puedes agregar esto a un job programado en tu `Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    $schedule->call(function () {
        app(\App\Services\NotificationService::class)->cleanupOldNotifications(30);
    })->daily();
}
```

## Métodos del Servicio

### NotificationService

- `sendToUser(User $user, string $title, string $message, string $type = 'info', array $options = []): Notification`
- `sendToUsers(array $userIds, string $title, string $message, string $type = 'info', array $options = []): void`
- `sendToRole(string $roleName, string $title, string $message, string $type = 'info', array $options = []): void`
- `sendToAll(string $title, string $message, string $type = 'info', array $options = []): void`
- `getUnreadCount(User $user): int`
- `getRecent(User $user, int $limit = 5): Collection`
- `cleanupOldNotifications(int $days = 30): int`

### Model Notification

- `markAsRead(): void` - Marca la notificación como leída
- `markAsUnread(): void` - Marca la notificación como no leída
- `user(): BelongsTo` - Relación con el usuario

## Rutas

- `GET /notifications` - Página de notificaciones
- `GET /notifications/unread` - Obtener notificaciones sin leer (API)
- `PUT /notifications/{id}/read` - Marcar como leída (API)
- `PUT /notifications/{id}/unread` - Marcar como no leída (API)
- `PUT /notifications/mark-all-read` - Marcar todas como leídas (API)
- `DELETE /notifications/{id}` - Eliminar notificación (API)
- `DELETE /notifications` - Eliminar todas las notificaciones (API)

## Ejecutar Migraciones

Para crear la tabla de notificaciones, ejecuta:

```bash
php artisan migrate
```

## Notas Importantes

1. Las notificaciones se almacenan en la base de datos (persistentes)
2. El widget actualiza automáticamente cada 10 segundos
3. Los usuarios solo ven sus propias notificaciones (protegido por política)
4. Compatible con Laravel Spatie Permission para enviar a roles específicos
5. Las notificaciones incluyen timestamps automáticos

## Próximas Mejoras Posibles

- [ ] Notificaciones en tiempo real con WebSockets (Laravel Echo)
- [ ] Email cuando se reciben notificaciones importantes
- [ ] Categorías de notificaciones
- [ ] Preferencias de notificación por usuario
- [ ] Notificaciones push (PWA)
- [ ] Historial de notificaciones eliminadas
- [ ] Buscar en notificaciones
