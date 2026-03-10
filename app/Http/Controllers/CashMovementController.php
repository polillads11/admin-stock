<?php

namespace App\Http\Controllers;

use App\Models\CashMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashMovementController extends Controller
{
    /*public function __construct()
    {
        $this->middleware(['auth', 'permission:view-cash']);
    }*/

    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $movements = CashMovement::with('user')
            ->when($search, fn($q) =>
                $q->where('source', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
            )
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('CashMovements/Index', [
            'movements' => $movements,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('CashMovements/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:ingreso,egreso',
            'amount' => 'required|numeric|min:0',
            'source' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();

        CashMovement::create($validated);

        return redirect()->route('cash-movements.index')->with('success', 'Movimiento de caja registrado.');
    }

    public function edit(CashMovement $cashMovement)
    {
        return Inertia::render('CashMovements/Edit', [
            'cashMovement' => $cashMovement,
        ]);
    }

    public function update(Request $request, CashMovement $cashMovement)
    {
        $validated = $request->validate([
            'type' => 'required|in:ingreso,egreso',
            'amount' => 'required|numeric|min:0',
            'source' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $cashMovement->update($validated);

        return redirect()->route('cash-movements.index')->with('success', 'Movimiento de caja actualizado.');
    }

    public function destroy(CashMovement $cashMovement)
    {
        $cashMovement->delete();

        return redirect()->route('cash-movements.index')->with('success', 'Movimiento de caja eliminado.');
    }
}