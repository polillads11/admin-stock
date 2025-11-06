<?php

namespace App\Http\Controllers;

use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'permission:view-stock']);
    }

    public function index(Request $request)
    {
        $movements = StockMovement::with(['product', 'user'])
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->when($request->product, fn($q) => $q->whereHas('product', fn($sub) =>
                $sub->where('name', 'like', "%{$request->product}%")
            ))
            ->orderBy('id', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'filters' => $request->only('type', 'product'),
        ]);
    }
}

