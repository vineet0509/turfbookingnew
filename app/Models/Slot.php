<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Slot extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function turf()
    {
        return $this->belongsTo(TurfGround::class, 'turf_id');
    }
}
