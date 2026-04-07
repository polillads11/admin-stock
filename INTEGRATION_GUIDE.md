# Guía de Integración del Módulo de Notificaciones

## Paso 1: Ejecutar la Migración

Primero, ejecuta la migración para crear la tabla de notificaciones:

```bash
php artisan migrate
```

## Paso 2: Actualizar el AppHeader

Abre el archivo `resources/js/components/app-header.tsx` e importa el componente NotificationBell:

```tsx
import { NotificationBell } from '@/components/NotificationBell';
```

Luego, agrégalo en la sección de controles del header. Busca donde están los otros botones de control y agrega:

```tsx
<div className="flex items-center gap-2">
    <NotificationBell />
    {/* Otros componentes */}
</div>
```

## Paso 3: Usar el Servicio de Notificaciones

### En un Controlador

```php
use App\Services\NotificationService;

class MyController extends Controller
{
    public function store(Request $request)
    {
        // Tu lógica aquí
        
        // Enviar notificación
        app(NotificationService::class)->sendToUser(
            user: auth()->user(),
            title: 'Éxito',
            message: 'La operación se completó exitosamente',
            type: 'success'
        );
    }
}
```

### En un Event Listener

```php
namespace App\Listeners;

use App\Events\YourEvent;
use App\Services\NotificationService;

class YourListener
{
    public function handle(YourEvent $event): void
    {
        app(NotificationService::class)->sendToRole(
            roleName: 'admin',
            title: 'Nueva actividad',
            message: 'Ha ocurrido algo importante',
            type: 'info'
        );
    }
}
```

## Paso 4: Agregar Rutas de Ejemplo (Opcional)

Si deseas probar el módulo, puedes agregar rutas de ejemplo en `routes/web.php`:

```php
Route::middleware(['auth', 'verified'])->group(function () {
    // ... tus rutas existentes ...

    // Rutas de ejemplo para testing
    Route::get('/example/notify-user/{userId}', [ExampleNotificationController::class, 'notifyUser']);
    Route::get('/example/notify-maintenance', [ExampleNotificationController::class, 'notifyMaintenance']);
    Route::get('/example/notify-product', [ExampleNotificationController::class, 'notifyProductCreated']);
    Route::get('/example/notify-error', [ExampleNotificationController::class, 'notifyError']);
});
```

## Paso 5: Probar el Módulo

1. **Crear una notificación**: Abre `http://localhost:8000/example/notify-user/1` (reemplaza 1 con tu ID de usuario)
2. **Ver notificaciones**: Haz clic en el icono de campana en el header, o ve a `http://localhost:8000/notifications`
3. **Gestionar**: Marca como leída, marca como no leída, o elimina notificaciones

## Archivos Creados

```
✅ app/Models/Notification.php                    - Modelo de notificaciones
✅ app/Http/Controllers/NotificationController.php - Controlador de notificaciones
✅ app/Http/Controllers/ExampleNotificationController.php - Controlador de ejemplos
✅ app/Services/NotificationService.php           - Servicio de notificaciones
✅ app/Policies/NotificationPolicy.php            - Política de autorización
✅ database/migrations/2026_04_07_000000_create_notifications_table.php - Migración
✅ resources/js/components/NotificationBell.tsx   - Widget de notificaciones
✅ resources/js/pages/Notifications/Index.tsx     - Página de notificaciones
✅ NOTIFICATIONS.md                               - Documentación completa
✅ INTEGRATION_GUIDE.md                           - Esta guía
```

## Características Principales

- 📬 Sistema de notificaciones persistente
- 🔔 Widget en tiempo real con polling cada 10 segundos
- 📋 Página completa de gestión
- 🎯 Filtrado por estado (todas, leídas, sin leer)
- ✅ Soporte para múltiples tipos (info, success, warning, error)
- 🔗 Enlaces de acción en notificaciones
- 🔐 Políticas de seguridad implementadas

## Configuración Avanzada

### Cambiar el intervalo de polling

En `NotificationBell.tsx`, cambia el intervalo en `useEffect`:

```tsx
// Actualmente cada 10 segundos (10000ms)
const interval = setInterval(fetchUnreadNotifications, 10000);
```

### Cambiar cantidad de notificaciones por página

En `NotificationController.php`, modifica el método `index`:

```php
public function index(Request $request)
{
    $perPage = $request->query('per_page', 15); // Cambia 15 por tu valor
    // ...
}
```

## Soporte

Si necesitas ayuda o quieres escalar aún más este módulo, considera:

1. Agregar notificaciones por email
2. Implementar WebSockets para tiempo real con Laravel Echo
3. Agregar preferencias de notificación por usuario
4. Implementar notificaciones push (PWA)
5. Agregar categorías de notificaciones

¡Disfruta del módulo de notificaciones! 🎉
