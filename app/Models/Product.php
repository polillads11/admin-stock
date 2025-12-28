<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku', 'name', 'description', 'category_id', 'price', 'stock', 'local_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function locals()
    {
        return $this->belongsToMany(Local::class, 'product_local_stocks')
                ->withPivot('stock')
                ->withTimestamps();
    }


    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
}
