<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'discount',
        'start_date',
        'end_date',
        'active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'active' => 'boolean',
    ];

    /**
     * Scope to retrieve currently active offers.
     */
    public function scopeActive($query)
    {
        $today = now()->toDateString();
        return $query->where('active', true)
                     ->when($today, function ($q) use ($today) {
                         $q->where(function($q2) use ($today) {
                             $q2->whereNull('start_date')->orWhere('start_date', '<=', $today);
                         })
                         ->where(function($q3) use ($today) {
                             $q3->whereNull('end_date')->orWhere('end_date', '>=', $today);
                         });
                     });
    }

    /**
     * Products associated with the offer (for product-specific discounts or combos).
     */
    public function products()
    {
        return $this->belongsToMany(Product::class)
                    ->withPivot('quantity')
                    ->withTimestamps();
    }
}
