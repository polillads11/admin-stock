<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Golosinas', 'slug' => 'golosinas'],
            ['name' => 'Bebidas', 'slug' => 'bebidas'],
            ['name' => 'Lácteos', 'slug' => 'lacteos'],
            ['name' => 'Carnes', 'slug' => 'carnes'],
            ['name' => 'Frutas y Verduras', 'slug' => 'frutas-y-verduras'],
            ['name' => 'Panadería', 'slug' => 'panaderia'],
            ['name' => 'Snacks', 'slug' => 'snacks'],
            ['name' => 'Congelados', 'slug' => 'congelados'],
            ['name' => 'Productos de limpieza', 'slug' => 'productos-de-limpieza'],
            ['name' => 'Cuidado personal', 'slug' => 'cuidado-personal'],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}