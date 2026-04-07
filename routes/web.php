<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExampleNotificationController;
use App\Http\Controllers\LocalController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\CashMovementController;
use App\Http\Controllers\NotificationController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    //Route::get('dashboard', function () {
        //return Inertia::render('dashboard');
    //})->name('dashboard');
    Route::get('/dashboard', [SaleController::class, 'statistics'])->name('dashboard');

    //Products routes
    

    Route::get('/products/byLocal', [ProductController::class, 'byLocal'])->name('api.products.byLocal');

    Route::get('/products/search', [ProductController::class, 'search'])->name('api.products.search');

    Route::get('/products/byBarcode', [ProductController::class, 'byBarcode'])->name('api.products.byBarcode');

    Route::resource('products', ProductController::class)
                    ->only(["create", "store"])
                    ->middleware("permission:products.create");

    Route::resource('products', ProductController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:products.edit");

    Route::resource('products', ProductController::class)
                    ->only([ "destroy" ])
                    ->middleware("permission:products.delete");
        
    Route::resource('products', ProductController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:products.view|products.create|products.edit|products.delete");
    
    //Sales routes
    Route::get('sales/statistics', [SaleController::class, 'statistics'])->name('sales.statistics');

    Route::resource('sales', SaleController::class)
                    ->only(["create", "store"])
                    ->middleware("permission:sales.create");

    Route::resource('sales', SaleController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:sales.edit");

    Route::resource('sales', SaleController::class)
                    ->only([ "destroy" ])
                    ->middleware("permission:sales.delete");
        
    Route::resource('sales', SaleController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:sales.view|sales.create|sales.edit|sales.delete");       

    //Categories routes
    Route::resource('categories', CategoryController::class)
                    ->only(['create', 'store',])
                    ->middleware("permission:categories.create");

    Route::resource('categories', CategoryController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:categories.edit");

    Route::resource('categories', CategoryController::class)
                    ->only([ "destroy" ])
                    ->middleware("permission:categories.delete");
        
    Route::resource('categories', CategoryController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:categories.view|categories.create|categories.edit|categories.delete");

    //Stock Movements routes
    Route::get('stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');

    //Cash (Caja) movements routes
    Route::get('cash-movements', [CashMovementController::class, 'index'])
        ->name('cash-movements.index');
    Route::get('cash-movements/create', [CashMovementController::class, 'create'])
        ->name('cash-movements.create')
        ->middleware('permission:cash.create');
    Route::post('cash-movements', [CashMovementController::class, 'store'])
        ->name('cash-movements.store')
        ->middleware('permission:cash.create');
    Route::delete('cash-movements/{cashMovement}', [CashMovementController::class, 'destroy'])
        ->name('cash-movements.destroy')
        ->middleware('permission:cash.delete');
    Route::get('cash-movements/{cashMovement}/edit', [CashMovementController::class, 'edit'])
        ->name('cash-movements.edit')
        ->middleware('permission:cash.edit');
    Route::put('cash-movements/{cashMovement}', [CashMovementController::class, 'update'])
        ->name('cash-movements.update')
        ->middleware('permission:cash.edit');

    //Locals routes
    Route::resource('locals', \App\Http\Controllers\LocalController::class)
                    ->only(['create', 'store',])
                    ->middleware("permission:local.create");

    Route::resource('locals', LocalController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:local.edit");

    Route::resource('locals', LocalController::class)
                    ->only([ "destroy" ])
                    ->middleware("permission:local.delete");
        
    Route::resource('locals', LocalController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:local.view|local.create|local.edit|local.delete");

    //Permissions routes
    Route::resource('permissions',PermissionController::class)
                    ->only(["create", "store"])
                    ->middleware("permission:permissions.create");

    Route::resource('permissions', PermissionController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:permissions.assign");

    Route::resource('permissions', PermissionController::class)
                    ->only(["destroy"])
                    ->middleware("permission:permissions.delete");

    Route::resource('permissions', PermissionController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:permissions.view|permissions.create|permissions.assign|permissions.delete");
    

    //Users routes
    Route::resource('users', UserController::class)
                    ->only(["create", "store"])
                    ->middleware("permission:user.create");

    Route::resource('users', UserController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:user.edit");

    Route::resource('users', UserController::class)
                    ->only(["destroy"])
                    ->middleware("permission:user.delete");

    Route::resource('users', UserController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:user.view|user.create|user.edit|user.delete");

    //Roles routes
    Route::resource('roles', RoleController::class)
                    ->only(["create", "store"])
                    ->middleware("permission:roles.create");

    Route::resource('roles', RoleController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:roles.edit");

    Route::resource('roles', RoleController::class)
                    ->only(["destroy"])
                    ->middleware("permission:roles.delete");
        
    Route::resource('roles', RoleController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:roles.view|roles.create|roles.edit|roles.delete");

    //Offers routes
    Route::resource('offers', OfferController::class)
                    ->only(['create', 'store'])
                    ->middleware("permission:offers.create");

    Route::resource('offers', OfferController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:offers.edit");

    Route::resource('offers', OfferController::class)
                    ->only([ "destroy" ])
                    ->middleware("permission:offers.delete");
        
    Route::resource('offers', OfferController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:offers.view|offers.create|offers.edit|offers.delete");

    //Roles routes
    Route::resource('roles', RoleController::class)
                    ->only(["destroy"])
                    ->middleware("permission:roles.delete");

    Route::resource('roles', RoleController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:roles.view|roles.create|roles.edit|roles.delete");

    //manejo de stock de productos por local
    Route::get('products/{product}/stock', [\App\Http\Controllers\ProductStockController::class, 'edit'])
        ->name('products.stock');
    
    Route::put('products/{product}/stock', [\App\Http\Controllers\ProductStockController::class, 'update'])
        ->name('products.stock.edit')
        ->middleware("permission:products.edit");
    
    Route::put('products/{product}/stock', [\App\Http\Controllers\ProductStockController::class, 'update'])
        ->name('products.stock.update')
        ->middleware("permission:products.edit");

    //Notifications routes
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread', [NotificationController::class, 'unread'])->name('notifications.unread');
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::put('/notifications/{notification}/unread', [NotificationController::class, 'markAsUnread'])->name('notifications.markAsUnread');
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllRead');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::delete('/notifications', [NotificationController::class, 'destroyAll'])->name('notifications.destroyAll');

    // Example testing routes for notifications
    Route::get('/example/notify-user/{userId}', [ExampleNotificationController::class, 'notifyUser']);
    Route::get('/example/notify-maintenance', [ExampleNotificationController::class, 'notifyMaintenance']);
    Route::get('/example/notify-product', [ExampleNotificationController::class, 'notifyProductCreated']);
    Route::get('/example/notify-error', [ExampleNotificationController::class, 'notifyError']);
});

require __DIR__.'/settings.php';
