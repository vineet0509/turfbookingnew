<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Booking extends Model
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

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function pass()
    {
        return $this->belongsTo(MonthlyPass::class, 'pass_id');
    }
}
