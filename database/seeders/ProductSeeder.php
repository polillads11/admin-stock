<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [

            [
                'sku' => '779089500001',
                'name' => 'Coca Cola Original 500ml',
                'description' => 'Gaseosa Coca Cola Original 500ml',
                'category_id' => 4,
                'price' => 2500,
            ],

            [
                'sku' => '779089500002',
                'name' => 'Coca Cola Sin Azúcar 473ml',
                'description' => 'Coca Cola Sin Azúcar 473ml',
                'category_id' => 4,
                'price' => 2300,
            ],

            [
                'sku' => '779089500003',
                'name' => 'Pepsi Black 500ml',
                'description' => 'Pepsi Black 500ml',
                'category_id' => 4,
                'price' => 2200,
            ],

            [
                'sku' => '779089500004',
                'name' => 'Sprite 500ml',
                'description' => 'Sprite 500ml',
                'category_id' => 4,
                'price' => 2200,
            ],

            [
                'sku' => '779089500005',
                'name' => 'Fanta Naranja 500ml',
                'description' => 'Fanta Naranja 500ml',
                'category_id' => 4,
                'price' => 2200,
            ],

            [
                'sku' => '779089500006',
                'name' => 'Manaos Cola 600ml',
                'description' => 'Manaos Cola 600ml',
                'category_id' => 4,
                'price' => 1800,
            ],

            [
                'sku' => '779089500007',
                'name' => 'Monster Energy 473ml',
                'description' => 'Monster Energy 473ml',
                'category_id' => 4,
                'price' => 3500,
            ],

            [
                'sku' => '779089500008',
                'name' => 'Red Bull 250ml',
                'description' => 'Red Bull 250ml',
                'category_id' => 4,
                'price' => 3200,
            ],

            [
                'sku' => '779089500009',
                'name' => 'Quilmes Clásica 710ml',
                'description' => 'Cerveza Quilmes Clásica 710ml',
                'category_id' => 5,
                'price' => 3000,
            ],

            [
                'sku' => '779089500010',
                'name' => 'Andes Rubia 710ml',
                'description' => 'Cerveza Andes Rubia 710ml',
                'category_id' => 5,
                'price' => 3600,
            ],

            [
                'sku' => '779089500011',
                'name' => 'Brahma 710ml',
                'description' => 'Cerveza Brahma 710ml',
                'category_id' => 5,
                'price' => 2900,
            ],

            [
                'sku' => '779089500012',
                'name' => 'Stella Artois 710ml',
                'description' => 'Cerveza Stella Artois 710ml',
                'category_id' => 5,
                'price' => 4200,
            ],

            [
                'sku' => '779089500013',
                'name' => 'Heineken 710ml',
                'description' => 'Cerveza Heineken 710ml',
                'category_id' => 5,
                'price' => 4300,
            ],

            [
                'sku' => '779089500014',
                'name' => 'Patagonia Amber Lager',
                'description' => 'Cerveza Patagonia Amber Lager',
                'category_id' => 5,
                'price' => 4500,
            ],

            [
                'sku' => '779089500015',
                'name' => 'Agua Villa del Sur 500ml',
                'description' => 'Agua Mineral Villa del Sur',
                'category_id' => 4,
                'price' => 1500,
            ],

            [
                'sku' => '779089500016',
                'name' => 'Levité Pomelo 500ml',
                'description' => 'Levité Pomelo 500ml',
                'category_id' => 4,
                'price' => 1900,
            ],

            [
                'sku' => '779089500017',
                'name' => 'Speed 473ml',
                'description' => 'Energizante Speed 473ml',
                'category_id' => 4,
                'price' => 2800,
            ],

            [
                'sku' => '779089500018',
                'name' => 'Rockstar Energy 473ml',
                'description' => 'Rockstar Energy 473ml',
                'category_id' => 4,
                'price' => 3400,
            ],

            [
                'sku' => '779089500019',
                'name' => '7up 500ml',
                'description' => '7up Lima Limón 500ml',
                'category_id' => 4,
                'price' => 2100,
            ],

            [
                'sku' => '779089500020',
                'name' => 'Paso de los Toros Pomelo',
                'description' => 'Paso de los Toros Pomelo 500ml',
                'category_id' => 4,
                'price' => 2300,
            ],

            [
                'sku' => '779089500021',
                'name' => 'Doritos Queso',
                'description' => 'Doritos sabor queso',
                'category_id' => 3,
                'price' => 2600,
            ],

            [
                'sku' => '779089500022',
                'name' => 'Lays Clásicas',
                'description' => 'Papas fritas Lays clásicas',
                'category_id' => 3,
                'price' => 2400,
            ],

            [
                'sku' => '779089500023',
                'name' => 'Palitos Salados',
                'description' => 'Snack palitos salados',
                'category_id' => 3,
                'price' => 1500,
            ],

            [
                'sku' => '779089500024',
                'name' => 'Papas Pringles Original',
                'description' => 'Pringles Original',
                'category_id' => 3,
                'price' => 4200,
            ],

            [
                'sku' => '779089500025',
                'name' => 'Alfajor Jorgito',
                'description' => 'Alfajor Jorgito chocolate',
                'category_id' => 2,
                'price' => 1200,
            ],

            [
                'sku' => '779089500026',
                'name' => 'Alfajor Guaymallén',
                'description' => 'Alfajor Guaymallén triple',
                'category_id' => 2,
                'price' => 900,
            ],

            [
                'sku' => '779089500027',
                'name' => 'Block Chocolate',
                'description' => 'Chocolate Block',
                'category_id' => 2,
                'price' => 1800,
            ],

            [
                'sku' => '779089500028',
                'name' => 'Bon o Bon',
                'description' => 'Bon o Bon chocolate',
                'category_id' => 2,
                'price' => 700,
            ],

            [
                'sku' => '779089500029',
                'name' => 'Mantecol',
                'description' => 'Mantecol clásico',
                'category_id' => 2,
                'price' => 2200,
            ],

            [
                'sku' => '779089500030',
                'name' => 'Galletitas Oreo',
                'description' => 'Galletitas Oreo clásicas',
                'category_id' => 2,
                'price' => 1900,
            ],

            [
                'sku' => '779089500031',
                'name' => 'Pepitos',
                'description' => 'Galletitas Pepitos',
                'category_id' => 2,
                'price' => 1800,
            ],

            [
                'sku' => '779089500032',
                'name' => 'Criollitas',
                'description' => 'Galletitas Criollitas',
                'category_id' => 2,
                'price' => 1600,
            ],

            [
                'sku' => '779089500033',
                'name' => 'Yerba Taragüí',
                'description' => 'Yerba Taragüí 1kg',
                'category_id' => 6,
                'price' => 4500,
            ],

            [
                'sku' => '779089500034',
                'name' => 'Yerba Playadito',
                'description' => 'Yerba Playadito 1kg',
                'category_id' => 6,
                'price' => 4700,
            ],

            [
                'sku' => '779089500035',
                'name' => 'Azúcar Ledesma',
                'description' => 'Azúcar Ledesma 1kg',
                'category_id' => 6,
                'price' => 1400,
            ],

            [
                'sku' => '779089500036',
                'name' => 'Arroz Gallo Oro',
                'description' => 'Arroz Gallo Oro',
                'category_id' => 6,
                'price' => 2300,
            ],

            [
                'sku' => '779089500037',
                'name' => 'Fideos Matarazzo',
                'description' => 'Fideos Matarazzo spaghetti',
                'category_id' => 6,
                'price' => 1700,
            ],

            [
                'sku' => '779089500038',
                'name' => 'Café Cabrales',
                'description' => 'Café Cabrales instantáneo',
                'category_id' => 6,
                'price' => 5200,
            ],

            [
                'sku' => '779089500039',
                'name' => 'Leche La Serenísima',
                'description' => 'Leche La Serenísima entera',
                'category_id' => 6,
                'price' => 2100,
            ],

            [
                'sku' => '779089500040',
                'name' => 'Pan Lactal Fargo',
                'description' => 'Pan lactal Fargo blanco',
                'category_id' => 6,
                'price' => 2500,
            ],
        ];

        foreach ($products as $product) {

            Product::create($product);
        }
    }
}

