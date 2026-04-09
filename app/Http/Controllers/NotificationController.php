<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class NotificationController extends Controller
{
    /**
     * Get all unread notifications for the authenticated user.
     */
    public function unread()
    {
        $notifications = auth()->user()
            ->notifications()
            ->where('is_read', false)
            ->latest()
            ->get();

        return response()->json([
            'data' => $notifications,
            'count' => $notifications->count(),
        ]);
    }

    /**
     * Get all notifications for the authenticated user with pagination.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        $filter = $request->query('filter', 'all'); // all, read, unread

        $query = auth()->user()->notifications();

        if ($filter === 'read') {
            $query->where('is_read', true);
        } elseif ($filter === 'unread') {
            $query->where('is_read', false);
        }

        $notifications = $query->latest()->paginate($perPage);

        if ($request->wantsJson()) {
            return response()->json($notifications);
        }

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'filter' => $filter,
        ]);
    }

    /**
     * Show notification creation form.
     */
    public function create()
    {
        return Inertia::render('Notifications/Create', [
            'users' => User::select('id', 'name')->orderBy('name')->get(),
            'roles' => Role::pluck('name')->toArray(),
        ]);
    }

    /**
     * Store a new notification.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'target_type' => 'required|in:user,role,all',
            'target_user_id' => 'nullable|exists:users,id',
            'target_role' => 'nullable|string',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,success,warning,error',
            'action_url' => 'nullable|url',
            'action_text' => 'nullable|string|max:100',
        ]);

        if ($data['target_type'] === 'user' && empty($data['target_user_id'])) {
            return back()->withErrors(['target_user_id' => 'Selecciona un vendedor.'])->withInput();
        }

        if ($data['target_type'] === 'role' && empty($data['target_role'])) {
            return back()->withErrors(['target_role' => 'Selecciona un rol.'])->withInput();
        }

        if ($data['target_type'] === 'user') {
            $user = User::findOrFail($data['target_user_id']);
            app(NotificationService::class)->sendToUser(
                $user,
                $data['title'],
                $data['message'],
                $data['type'],
                [
                    'action_url' => $data['action_url'] ?? null,
                    'action_text' => $data['action_text'] ?? null,
                ]
            );
        } elseif ($data['target_type'] === 'role') {
            app(NotificationService::class)->sendToRole(
                $data['target_role'],
                $data['title'],
                $data['message'],
                $data['type'],
                [
                    'action_url' => $data['action_url'] ?? null,
                    'action_text' => $data['action_text'] ?? null,
                ]
            );
        } else {
            app(NotificationService::class)->sendToAll(
                $data['title'],
                $data['message'],
                $data['type'],
                [
                    'action_url' => $data['action_url'] ?? null,
                    'action_text' => $data['action_text'] ?? null,
                ]
            );
        }

        return redirect()->route('notifications.index')->with('success', 'Notificación enviada correctamente.');
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Notification $notification)
    {
        $this->authorize('view', $notification);
        
        $notification->markAsRead();

        return response()->json([
            'message' => 'Notificación marcada como leída',
            'notification' => $notification,
        ]);
    }

    /**
     * Mark a specific notification as unread.
     */
    public function markAsUnread(Notification $notification)
    {
        $this->authorize('view', $notification);
        
        $notification->markAsUnread();

        return response()->json([
            'message' => 'Notificación marcada como no leída',
            'notification' => $notification,
        ]);
    }

    /**
     * Mark all notifications as read for the authenticated user.
     */
    public function markAllAsRead()
    {
        auth()->user()
            ->notifications()
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'message' => 'Todas las notificaciones marcadas como leídas',
        ]);
    }

    /**
     * Delete a specific notification.
     */
    public function destroy(Notification $notification)
    {
        $this->authorize('delete', $notification);
        
        $notification->delete();

        return response()->json([
            'message' => 'Notificación eliminada',
        ]);
    }

    /**
     * Delete all notifications for the authenticated user.
     */
    public function destroyAll()
    {
        auth()->user()->notifications()->delete();

        return response()->json([
            'message' => 'Todas las notificaciones han sido eliminadas',
        ]);
    }
}
