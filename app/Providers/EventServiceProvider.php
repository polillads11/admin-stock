<?php

namespace App\Providers;

use App\Events\SaleCompleted;
use App\Events\StockUpdated;
use App\Listeners\CheckSalesGoal;
use App\Listeners\CheckLowStock;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        SaleCompleted::class => [
            CheckSalesGoal::class,
        ],
        StockUpdated::class => [
            CheckLowStock::class,
        ],
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
