<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;
use App\Models\Local;
use App\Models\User;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $sales = Sale::with('user')
            ->when($search, fn($q) =>
                $q->where('customer_name', 'like', "%{$search}%")
                ->orWhere('id', $search)
            )
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'filters' => ['search' => $search],
        ]);
    }


    public function create()
    {
        $locals = Local::all(['id', 'name']); // 👈 enviamos lista de locales al frontend
        $products = Product::all(['id', 'name', 'price', 'stock']);

        return Inertia::render('Sales/Create', [
            'locals' => $locals,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'local_id' => 'required|exists:locals,id', // 👈 nuevo campo obligatorio
            'customer_name' => 'nullable|string|max:255',
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $sale = Sale::create([
                'user_id' => auth()->id(),
                'local_id' => $validated['local_id'], // 👈 guardamos el local elegido
                'customer_name' => $validated['customer_name'] ?? null,
                'total' => $validated['total'],
                'status' => 'completed',
            ]);

            foreach ($validated['products'] as $p) {
                $product = Product::find($p['id']);
                $quantity = $p['quantity'];
                $subtotal = $product->price * $quantity;

                // ✅ Crear el ítem de venta
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

                // ✅ Descontar stock
                //$product->decrement('stock', $quantity);
                // Actualizar stock del producto
                $product->stock = max(0, $product->stock - $p['quantity']);
                $product->save();

                // ✅ Registrar movimiento de stock
                StockMovement::create([
                    'product_id' => $product->id,
                    'quantity' => -$quantity,
                    'type' => 'out',
                    'description' => "Venta #{$sale->id} (Local {$sale->local_id})",
                    'user_id' => auth()->id(),
                ]);
            }
        });

        return redirect()
                ->route('sales.create')
                    ->with('success', 'Venta registrada correctamente.');
    }

        

    public function show(Sale $sale)
    {
        $sale->load(['items.product', 'user', 'local']);
        return Inertia::render('Sales/Show', compact('sale'));
    }
    
    public function statistics(Request $request)
    {
        $userId = $request->input('user_id');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $sales = Sale::query()
            ->when($userId && $userId !== 'none', fn($q) => $q->where('user_id', $userId))
            ->when($startDate, fn($q) => $q->whereDate('sales.created_at', '>=', $startDate))
            ->when($endDate, fn($q) => $q->whereDate('sales.created_at', '<=', $endDate));

        // Ventas totales por local
        $salesByLocal = $sales->clone()
            ->selectRaw('locals.name as local, SUM(sales.total) as total')
            ->join('locals', 'locals.id', '=', 'sales.local_id')
            ->groupBy('locals.name')
            ->get();

        // Ventas totales
        $totalSales = $sales->clone()
            ->sum('sales.total');

        // Ventas totales
        $amountSales = $sales->clone()
            ->count('sales.id');

        // Ventas por día (últimos 30 días)
        $salesByDate = $sales->clone()
            ->selectRaw('DATE(sales.created_at) as date, SUM(total) as total')
            ->where('sales.created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Productos más vendidos
        $topProducts = $sales->clone()//\DB::table('sales')
            ->join('sale_items', 'sales.id', '=', 'sale_items.sale_id')
            ->join('products', 'products.id', '=', 'sale_items.product_id')
            ->selectRaw('products.name, SUM(sale_items.quantity) as total_sold')
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->take(5)
            ->get();

        //dd($topProducts);
        
        $users = User::select('id', 'name')->get();

        return Inertia::render('Dashboard', [
            'totalSales' => $totalSales,
            'amountSales' => $amountSales,
            'salesByLocal' => $salesByLocal,
            'salesByDate' => $salesByDate,
            'topProducts' => $topProducts,
            'users' => $users,
            'filters' => [
                'user_id' => $userId,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}
