<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Local;
use App\Models\ProductLocalStock;
use Illuminate\Database\Seeder;

class UpdateStockByLocal extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $products = Product::all();
        $locals = Local::all();

        foreach ($products as $product) {
            foreach ($locals as $local) {
                ProductLocalStock::updateOrCreate([
                    'product_id' => $product->id,
                    'local_id' => $local->id,
                ], [
                    'stock' => 20, // Update stock to 20
                ]);
            }
        }
    }
}