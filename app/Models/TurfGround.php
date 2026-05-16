<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TurfGround extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected $casts = [
        'images' => 'array',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function slots()
    {
        return $this->hasMany(Slot::class, 'turf_id');
    }
}
