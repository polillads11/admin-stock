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
use App\Http\Controllers\LocalController;
use App\Http\Controllers\PermissionController;

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
    // API para autocompletar
    //Route::get('api/products/search', [ProductController::class, 'search']);
    Route::get('/products/search', [ProductController::class, 'search'])->name('api.products.search');

    Route::resource('products', ProductController::class)
                    ->only(["create", "store"])
                    ->middleware("permission:products.create");

    Route::resource('products', ProductController::class)
                    ->only(["edit", "update"])
                    ->middleware("permission:products.edit");

    Route::resource('products', ProductController::class)
                    ->only([ "distroy" ])
                    ->middleware("permission:products.delete");
        
    Route::resource('products', ProductController::class)
                    ->only(["index", "show"])
                    ->middleware("permission:products.view|products.create|products.edit|products.delete");
    
    //Sales routes
    Route::get('sales/statistics', [SaleController::class, 'statistics'])->name('sales.statistics');

    Route::resource('sales', SaleController::class)->only(['index', 'create', 'store', 'show']);    

    //Categories routes
    Route::resource('categories', CategoryController::class)->only(['index', 'create', 'edit', 'store', 'update', 'destroy']);

    //Stock Movements routes
    Route::get('stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');

    //Locals routes
    Route::resource('locals', \App\Http\Controllers\LocalController::class);

    //Permissions routes
    Route::resource('permissions',PermissionController::class)
                    ->only(["index", "show", "edit", "update"]);
    

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
});

require __DIR__.'/settings.php';
