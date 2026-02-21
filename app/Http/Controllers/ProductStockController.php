<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Local;
use App\Models\ProductLocalStock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductStockController extends Controller
{
    public function edit(Product $product)
    {
        $product->load('localStocks.local');

        return Inertia::render('Products/Stock', [
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        foreach ($request->stocks as $stockId => $value) {
            ProductLocalStock::where('id', $stockId)
                ->update(['stock' => $value]);
        }

        return redirect()->route('products.index')->with('success', 'Stock actualizado');
    }
}
