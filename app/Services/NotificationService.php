<?php

namespace App\Services;

use App\Models\User;
use App\Models\Notification;

class NotificationService
{
    /**
     * Send a notification to a single user.
     *
     * @param User $user
     * @param string $title
     * @param string $message
     * @param string $type (info, success, warning, error)
     * @param array $options
     * @return Notification
     */
    public function sendToUser(
        User $user,
        string $title,
        string $message,
        string $type = 'info',
        array $options = []
    ): Notification {
        return Notification::create([
            'user_id' => $user->id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'icon' => $options['icon'] ?? null,
            'action_url' => $options['action_url'] ?? null,
            'action_text' => $options['action_text'] ?? null,
        ]);
    }

    /**
     * Send a notification to multiple users.
     *
     * @param array $userIds
     * @param string $title
     * @param string $message
     * @param string $type
     * @param array $options
     * @return void
     */
    public function sendToUsers(
        array $userIds,
        string $title,
        string $message,
        string $type = 'info',
        array $options = []
    ): void {
        $notifications = array_map(function ($userId) use ($title, $message, $type, $options) {
            return [
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'icon' => $options['icon'] ?? null,
                'action_url' => $options['action_url'] ?? null,
                'action_text' => $options['action_text'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $userIds);

        Notification::insert($notifications);
    }

    /**
     * Send a notification to a role.
     *
     * @param string $roleName
     * @param string $title
     * @param string $message
     * @param string $type
     * @param array $options
     * @return void
     */
    public function sendToRole(
        string $roleName,
        string $title,
        string $message,
        string $type = 'info',
        array $options = []
    ): void {
        $users = User::role($roleName)->pluck('id')->toArray();
        $this->sendToUsers($users, $title, $message, $type, $options);
    }

    /**
     * Send a notification to all users.
     *
     * @param string $title
     * @param string $message
     * @param string $type
     * @param array $options
     * @return void
     */
    public function sendToAll(
        string $title,
        string $message,
        string $type = 'info',
        array $options = []
    ): void {
        $userIds = User::pluck('id')->toArray();
        $this->sendToUsers($userIds, $title, $message, $type, $options);
    }

    /**
     * Get unread notification count for a user.
     *
     * @param User $user
     * @return int
     */
    public function getUnreadCount(User $user): int
    {
        return $user->notifications()->where('is_read', false)->count();
    }

    /**
     * Get recent notifications for a user.
     *
     * @param User $user
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRecent(User $user, int $limit = 5)
    {
        return $user->notifications()
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Clean up old read notifications (older than days parameter).
     *
     * @param int $days
     * @return int
     */
    public function cleanupOldNotifications(int $days = 30): int
    {
        $count = Notification::where('is_read', true)
            ->where('read_at', '<', now()->subDays($days))
            ->delete();

        return $count;
    }
}
