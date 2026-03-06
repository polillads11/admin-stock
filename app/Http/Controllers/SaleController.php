<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\ProductLocalStock;
use App\Models\Offer;
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

        // todas las ofertas activas con sus productos
        $offers = Offer::active()->with('products')->get();

        return Inertia::render('Sales/Create', [
            'locals' => $locals,
            'products' => $products,
            'offers' => $offers,
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
        ]);

        $appliedNames = [];
        DB::transaction(function () use ($validated, &$appliedNames) {
            $offers = Offer::active()->with('products')->get();

            // construir mapa de cantidades de los productos en la venta
            $saleQuantities = collect($validated['products'])->mapWithKeys(function($p){
                return [$p['id'] => $p['quantity']];
            });

            // determinar qué ofertas son aplicables (tienen todos sus productos presentes con cantidad suficiente)
            $applicableOffers = $offers->filter(function($offer) use ($saleQuantities) {
                return $offer->products->every(function($prod) use ($saleQuantities) {
                    $required = $prod->pivot->quantity ?? 1;
                    return isset($saleQuantities[$prod->id]) && $saleQuantities[$prod->id] >= $required;
                });
            });

            // para cada venta, el precio unitario será base menos el mayor descuento entre las ofertas aplicables que incluyan ese producto
            $total = 0;
            $preparedItems = [];

            foreach ($validated['products'] as $p) {
                $product = Product::findOrFail($p['id']);
                $quantity = $p['quantity'];

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

                $bestDiscount = 0;
                foreach ($applicableOffers as $app) {
                    if ($app->products->contains('id', $product->id)) {
                        $bestDiscount = max($bestDiscount, $app->discount);
                    }
                }

                $pricePerUnit = round($product->price * (1 - $bestDiscount / 100), 2);
                $subtotal = $pricePerUnit * $quantity;
                $total += $subtotal;

                $preparedItems[] = compact('product', 'quantity', 'subtotal', 'pricePerUnit', 'productLocalStock');
            }

            $discountAmount = 0;
            if ($applicableOffers->count()) {
                $originalTotal = array_sum(array_map(fn($it) => $it['product']->price * $it['quantity'], $preparedItems));
                $discountAmount = round($originalTotal - $total, 2);
            }
            $finalTotal = $total;

            // guardar ID de una oferta representativa (la de mayor descuento) si hay
            $offerId = null;
            if ($applicableOffers->count()) {
                $offerId = $applicableOffers->sortByDesc('discount')->first()->id;
                // record names for flash
                $appliedNames = $applicableOffers->pluck('name')->toArray();
            }

            $sale = Sale::create([
                'user_id' => auth()->id(),
                'local_id' => $validated['local_id'],
                'customer_name' => $validated['customer_name'] ?? null,
                'total' => $finalTotal,
                'status' => 'completed',
                'offer_id' => $offerId,
                'discount' => $discountAmount,
            ]);

            foreach ($preparedItems as $item) {
                /** @var Product $product */
                $product = $item['product'];
                $quantity = $item['quantity'];
                $subtotal = $item['subtotal'];
                $pricePerUnit = $item['pricePerUnit'];
                $stockRecord = $item['productLocalStock'];

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $pricePerUnit,
                    'subtotal' => $subtotal,
                ]);

                $stockRecord->stock -= $quantity;
                $stockRecord->save();

                StockMovement::create([
                    'product_local_stock_id' => $stockRecord->id,
                    'quantity' => -$quantity,
                    'type' => 'sale',
                    'reference_type' => 'sale',
                    'reference_id' => $sale->id,
                    'note' => "Venta #{$sale->id}",
                    'created_by' => auth()->id(),
                ]);
            }
        });

        $message = 'Venta registrada correctamente.';
        if (!empty($appliedNames)) {
            $message .= ' Ofertas aplicadas: ' . implode(', ', $appliedNames) . '.';
        }
        return redirect()->back()->with('success', $message);
    }       

    public function show(Sale $sale)
    {
        $sale->load(['items.product', 'user', 'local', 'offer']);

        // determine applied offers again for display
        $offers = Offer::active()->with('products')->get();
        $quantities = $sale->items->pluck('quantity', 'product_id');
        $appliedOffers = $offers->filter(function($off) use ($quantities) {
            return $off->products->every(function($prod) use ($quantities) {
                $req = $prod->pivot->quantity ?? 1;
                return isset($quantities[$prod->id]) && $quantities[$prod->id] >= $req;
            });
        })->pluck('name');

        return Inertia::render('Sales/Show', compact('sale', 'appliedOffers'));
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
