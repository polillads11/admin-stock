<?php

namespace App\Listeners;

use App\Events\StockUpdated;
use App\Models\NotificationTrigger;
use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CheckLowStock implements ShouldQueue
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle the event.
     */
    public function handle(StockUpdated $event): void
    {
        $productLocalStock = $event->productLocalStock;
        $product = $productLocalStock->product;

        // Get active low stock triggers
        $triggers = NotificationTrigger::where('type', 'low_stock')
            ->where('is_active', true)
            ->get();

        foreach ($triggers as $trigger) {
            $conditions = $trigger->conditions;
            $threshold = $conditions['threshold'] ?? 5;

            if ($productLocalStock->stock <= $threshold) {
                // Send notification
                $title = $this->replacePlaceholders($trigger->title_template, [
                    'product_name' => $product->name,
                    'current_stock' => $productLocalStock->stock,
                    'threshold' => $threshold,
                    'local_name' => $productLocalStock->local->name,
                ]);
                $message = $this->replacePlaceholders($trigger->message_template, [
                    'product_name' => $product->name,
                    'current_stock' => $productLocalStock->stock,
                    'threshold' => $threshold,
                    'local_name' => $productLocalStock->local->name,
                ]);

                $this->sendNotification($trigger, $title, $message);
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

    private function sendNotification($trigger, $title, $message)
    {
        switch ($trigger->target_type) {
            case 'user':
                $user = \App\Models\User::find($trigger->target_id);
                if ($user) {
                    $this->notificationService->sendToUser(
                        $user,
                        $title,
                        $message,
                        'warning'
                    );
                }
                break;
            case 'role':
                $this->notificationService->sendToRole(
                    $trigger->target_id, // assuming target_id is role name
                    $title,
                    $message,
                    'warning'
                );
                break;
            case 'all':
                $this->notificationService->sendToAll(
                    $title,
                    $message,
                    'warning'
                );
                break;
        }
    }
}
