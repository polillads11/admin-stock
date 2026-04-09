<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationTriggerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\NotificationTrigger::create([
            'type' => 'sales_goal',
            'conditions' => ['sales_count' => 10, 'period' => 'month'],
            'title_template' => '¡Felicitaciones {user_name}!',
            'message_template' => 'Has alcanzado {sales_count} ventas este {period}. ¡Sigue así!',
            'target_type' => 'user',
            'target_id' => null, // Will be set to user who achieved the goal
            'is_active' => true,
        ]);

        \App\Models\NotificationTrigger::create([
            'type' => 'low_stock',
            'conditions' => ['threshold' => 5],
            'title_template' => 'Stock bajo: {product_name}',
            'message_template' => 'El producto {product_name} tiene solo {current_stock} unidades en {local_name}. Umbral: {threshold}.',
            'target_type' => 'role',
            'target_id' => 'admin', // Role name
            'is_active' => true,
        ]);

        \App\Models\NotificationTrigger::create([
            'type' => 'birthday',
            'conditions' => [],
            'title_template' => '¡Feliz cumpleaños {user_name}!',
            'message_template' => 'Hoy es el cumpleaños de {user_name}. ¡Felicitaciones!',
            'target_type' => 'all',
            'target_id' => null,
            'is_active' => true,
        ]);
    }
}
