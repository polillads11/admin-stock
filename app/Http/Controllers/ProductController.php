<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Local;
use App\Models\ProductLocalStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    /*public function __construct()
    {
        $this->middleware(['auth', 'permission:manage-products']);
    }*/

    public function index(Request $request)
    {
        $products = Product::with(['category'])
            ->withSum('localStocks as total_stock', 'stock')
            ->when($request->search, fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('sku', 'like', "%{$request->search}%")
            )
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        $categories = Category::all(['id', 'name']);
        $locals = Local::all(['id', 'name']);
        return Inertia::render('Products/Create', compact('categories', 'locals'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sku' => 'required|string|unique:products,sku',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'required|numeric|min:0',

            // nuevos
            //'local_id' => 'required|exists:locals,id',
            //'stock' => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($data) {
            $product = Product::create($data);

            // crear stock en 0 para cada local
            Local::all()->each(function ($local) use ($product) {
                ProductLocalStock::create([
                    'product_id' => $product->id,
                    'local_id' => $local->id,
                    'stock' => 0
                ]);
            });
        });

        /*$product = Product::create([
            'sku' => $data['sku'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'] ?? null,
            'price' => $data['price'],
        ]);

        ProductLocalStock::create([
            'product_id' => $product->id,
            'local_id' => $data['local_id'],
            'stock' => $data['stock'],
        ]);*/

        return redirect()->route('products.create')
            ->with('success', 'Producto creado correctamente.');
    }

    public function edit(Product $product)
    {
        $categories = Category::all(['id', 'name']);
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'locals' => Local::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'required|numeric|min:0'
        ]);

        $product->update($data);

        return redirect()->route('products.index')
            ->with('success', 'Producto actualizado correctamente.');
        
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Producto eliminado.');
    }

    // 🔍 API: búsqueda para autocompletar productos (por nombre o SKU)
    public function search(Request $request)
    {
        $query = $request->input('q');
        $localId = $request->input('local_id');

        if (strlen($query) < 2 || !$localId) {
            return response()->json([]);
        }

        $products = ProductLocalStock::with('product')
            ->where('local_id', $localId)
            ->whereHas('product', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                ->orWhere('sku', 'like', "%{$query}%");
            })
            ->get()
            ->map(fn ($pls) => [
                'id' => $pls->product->id,
                'name' => $pls->product->name,
                'price' => $pls->product->price,
                'stock' => $pls->stock,
            ]);

        return response()->json($products);
    }

    public function byLocal(Request $request)
    {
        $localId = $request->local_id;

        if (!$localId) {
            return response()->json([]);
        }

        $products = ProductLocalStock::with('product')
            ->where('local_id', $localId)
            ->orderBy(Product::select('name')
                ->whereColumn('products.id', 'product_local_stocks.product_id'))
            ->get()
            ->map(fn ($pls) => [
                'id' => $pls->product->id,
                'name' => $pls->product->name,
                'price' => $pls->product->price,
                'stock' => $pls->stock,
            ]);

        return response()->json($products);
    }

    public function show(Product $product)
        {
            $product->load([
            'category',
            'localStocks.local',
        ]);

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
