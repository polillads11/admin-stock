<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationTrigger extends Model
{
    protected $fillable = [
        'type',
        'conditions',
        'title_template',
        'message_template',
        'target_type',
        'target_id',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'conditions' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
