<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

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
