<?php

namespace App\Listeners;

use App\Events\SaleCompleted;
use App\Models\NotificationTrigger;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CheckSalesGoal implements ShouldQueue
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     */
    public function handle(SaleCompleted $event): void
    {
        $sale = $event->sale;
        $user = $sale->user;

        // Get active sales goal triggers
        $triggers = NotificationTrigger::where('type', 'sales_goal')
            ->where('is_active', true)
            ->get();

        foreach ($triggers as $trigger) {
            $conditions = $trigger->conditions;
            $salesCount = $conditions['sales_count'] ?? 0;
            $period = $conditions['period'] ?? 'month';

            // Calculate sales in the period
            $startDate = match ($period) {
                'day' => now()->startOfDay(),
                'week' => now()->startOfWeek(),
                'month' => now()->startOfMonth(),
                'year' => now()->startOfYear(),
                default => now()->startOfMonth(),
            };

            $userSalesCount = $user->sales()
                ->where('created_at', '>=', $startDate)
                ->count();

            if ($userSalesCount >= $salesCount) {
                // Send notification
                $title = $this->replacePlaceholders($trigger->title_template, [
                    'user_name' => $user->name,
                    'sales_count' => $userSalesCount,
                    'period' => $period,
                ]);
                $message = $this->replacePlaceholders($trigger->message_template, [
                    'user_name' => $user->name,
                    'sales_count' => $userSalesCount,
                    'period' => $period,
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
                $this->notificationService->sendToUser(
                    $user,
                    $title,
                    $message,
                    'success'
                );
                break;
            case 'role':
                $this->notificationService->sendToRole(
                    $trigger->target_id, // assuming target_id is role name or id
                    $title,
                    $message,
                    'success'
                );
                break;
            case 'all':
                $this->notificationService->sendToAll(
                    $title,
                    $message,
                    'success'
                );
                break;
        }
    }
}
