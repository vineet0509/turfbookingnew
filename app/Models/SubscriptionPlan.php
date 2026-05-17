<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SubscriptionPlan extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'display_name',
        'price_monthly',
        'price_yearly',
        'max_turfs',
        'max_bookings_per_month',
        'features',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'features' => 'array',
        'price_monthly' => 'float',
        'price_yearly' => 'float',
        'is_active' => 'boolean',
    ];
}

