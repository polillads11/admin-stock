<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Local;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /*public function __construct()
    {
        $this->middleware(['auth', 'permission:manage-products']);
    }*/

    public function index(Request $request)
    {
        $query = Product::query()
            ->with('category')
            ->when($request->search, fn($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%")
            )
            ->orderBy('id', 'desc');

        $products = $query->paginate(10)->withQueryString();

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
            'local_id' => 'nullable|exists:locals,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        Product::create($data);

        return redirect()->route('products.index')
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
            'local_id' => 'nullable|exists:locals,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
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
        $query = $request->input('q', '');
        $localId = $request->input('local_id');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $products = Product::where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                ->orWhere('sku', 'like', "%{$query}%");
            })
            ->where(function($q) use ($localId) {
                if ($localId) {
                    $q->where('local_id', $localId);
                }
            })
            ->take(10)
            ->get(['id', 'name', 'price', 'stock']);

        return response()->json($products);
    }

    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product->load('category', 'local'),
        ]);
    }
}
