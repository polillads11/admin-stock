<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'user.view',
            'user.edit',
            'user.delete',
            'user.create',
            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',
            'products.view',
            'products.create',
            'products.edit',
            'products.delete',
            'categories.view',
            'categories.create',
            'categories.edit',
            'categories.delete',
            'sales.view',
            'sales.create',
            'sales.edit',
            'sales.delete',
            'stadistics.view',
            'local.view',
            'local.create',
            'local.edit',
            'local.delete',
            'offers.view',
            'offers.create',
            'offers.edit',
            'offers.delete',
            'cash.view',
            'cash.create',
            'cash.delete',
            'cash.edit',
            'permissions.view',
            'permissions.assign',
        ];

        foreach ($permissions as $key => $value) {
            Permission::create(['name' => $value]);
        }
    }
}
