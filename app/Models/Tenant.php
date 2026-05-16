<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Tenant extends Model
{
    use HasUuids;

    protected $guarded = [];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function turfs()
    {
        return $this->hasMany(TurfGround::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function passes()
    {
        return $this->hasMany(MonthlyPass::class);
    }

    public function subscription()
    {
        return $this->hasOne(TenantSubscription::class);
    }
}
