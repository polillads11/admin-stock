<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductLocalStock extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'local_id',
        'stock',
    ];
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function local()
    {
        return $this->belongsTo(Local::class);
    }

    public function movements()
    {
        return $this->hasMany(StockMovement::class);
    }
}