<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\ProductLocalStock;
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
            'local_id' => 'required|exists:locals,id',
            'customer_name' => 'nullable|string|max:255',
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {

            $sale = Sale::create([
                'user_id' => auth()->id(),
                'local_id' => $validated['local_id'],
                'customer_name' => $validated['customer_name'] ?? null,
                'total' => $validated['total'],
                'status' => 'completed',
            ]);

            foreach ($validated['products'] as $p) {

                $product = Product::findOrFail($p['id']);
                $quantity = $p['quantity'];

                // 🔒 Obtener registro de stock por producto + local
                $productLocalStock = ProductLocalStock::where('product_id', $product->id)
                    ->where('local_id', $validated['local_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$productLocalStock) {
                    throw new \Exception("No existe stock para {$product->name} en este local.");
                }

                if ($productLocalStock->stock < $quantity) {
                    throw new \Exception("Stock insuficiente para {$product->name}.");
                }

                $subtotal = $product->price * $quantity;

                // ✅ Crear item de venta
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

                // ✅ Descontar stock
                $productLocalStock->stock -= $quantity;
                $productLocalStock->save();

                // ✅ Registrar movimiento
                StockMovement::create([
                    'product_local_stock_id' => $productLocalStock->id,
                    'quantity' => -$quantity,
                    'type' => 'sale',
                    'reference_type' => 'sale',
                    'reference_id' => $sale->id,
                    'note' => "Venta #{$sale->id}",
                    'created_by' => auth()->id(),
                ]);
            }
        });

        return redirect()->back()->with('success', 'Venta registrada correctamente.');
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
