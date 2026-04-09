<?php

namespace App\Jobs;

use App\Models\NotificationTrigger;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendBirthdayNotifications implements ShouldQueue
{
    use Queueable;

    protected $notificationService;

    public function __construct(NotificationService $notificationService = null)
    {
        $this->notificationService = $notificationService ?: app(NotificationService::class);
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $today = now()->format('m-d');

        // Get users with birthday today
        $usersWithBirthday = User::whereRaw("strftime('%m-%d', birthday) = ?", [$today])
            ->whereNotNull('birthday')
            ->get();

        // Get active birthday triggers
        $triggers = NotificationTrigger::where('type', 'birthday')
            ->where('is_active', true)
            ->get();

        foreach ($usersWithBirthday as $user) {
            foreach ($triggers as $trigger) {
                $title = $this->replacePlaceholders($trigger->title_template, [
                    'user_name' => $user->name,
                ]);
                $message = $this->replacePlaceholders($trigger->message_template, [
                    'user_name' => $user->name,
                ]);

                $this->sendNotification($trigger, $title, $message, $user);
            }
        }
    }

    private function replacePlaceholders($template, $data)
    {
        foreach ($data as $key => $value) {
            $template = str_replace("{{$key}}", $value, $template);
        }
        return $template;
    }

    private function sendNotification($trigger, $title, $message, $user)
    {
        switch ($trigger->target_type) {
            case 'user':
                $targetUser = User::find($trigger->target_id);
                if ($targetUser) {
                    $this->notificationService->sendToUser(
                        $targetUser,
                        $title,
                        $message,
                        'info'
                    );
                }
                break;
            case 'role':
                $this->notificationService->sendToRole(
                    $trigger->target_id,
                    $title,
                    $message,
                    'info'
                );
                break;
            case 'all':
                $this->notificationService->sendToAll(
                    $title,
                    $message,
                    'info'
                );
                break;
        }
    }
}
