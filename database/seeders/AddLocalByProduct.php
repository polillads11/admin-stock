<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Local;
use App\Models\ProductLocalStock;
use Illuminate\Database\Seeder;

class AddLocalByProduct extends Seeder
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
            If (!$product->localStocks()->exists()) {
                foreach ($locals as $local) {
                    ProductLocalStock::create([
                        'product_id' => $product->id,
                        'local_id' => $local->id,
                        'stock' => 20, // Set initial stock to 0
                    ]);
                }
            }
        }
    }
}