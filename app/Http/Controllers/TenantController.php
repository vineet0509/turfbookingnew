<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tenant;
use App\Models\TurfGround;
use App\Models\Slot;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class TenantController extends Controller
{
    /**
     * Dashboard for the Turf Owner.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $tenant = $user->ownedTenant;

        if (!$tenant) {
            return Inertia::render('Owner/SetupTenant');
        }

        $tenant->load('turfs.slots');
        
        $bookings = \App\Models\Booking::where('tenant_id', $tenant->id)
            ->with(['customer', 'slot', 'turf'])
            ->latest()
            ->get();

        $customers = \App\Models\User::whereHas('bookings', function($q) use ($tenant) {
            $q->where('tenant_id', $tenant->id);
        })->distinct()->get();

        $payments = \App\Models\Payment::whereHas('booking', function($q) use ($tenant) {
            $q->where('tenant_id', $tenant->id);
        })
        ->with('booking.customer')
        ->latest()
        ->get();

        // Detect active tab from route name safely (fallback to empty string if null)
        $routeName = $request->route() ? ($request->route()->getName() ?? '') : '';
        $activeTab = 'dashboard';
        if (str_contains($routeName, 'turfs')) $activeTab = 'turfs';
        if (str_contains($routeName, 'players')) $activeTab = 'players';
        if (str_contains($routeName, 'payments')) $activeTab = 'payments';
        if (str_contains($routeName, 'settings')) $activeTab = 'settings';

        return Inertia::render('Owner/Dashboard', [
            'tenant' => $tenant,
            'bookings' => $bookings,
            'customers' => $customers,
            'payments' => $payments,
            'initialTab' => $activeTab,
        ]);
    }

    /**
     * Store the tenant (arena) details for a new owner.
     */
    public function setup(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subdomain' => 'required|string|alpha_dash|max:50|unique:tenants',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
        ]);

        $tenant = Tenant::create([
            'name' => $validated['name'],
            'subdomain' => $validated['subdomain'],
            'city' => $validated['city'],
            'phone' => $validated['phone'],
            'owner_id' => $request->user()->id,
            'status' => 'pending', // Requires admin approval
            'primary_color' => '#10B981',
            'secondary_color' => '#3B82F6',
        ]);

        return response()->json([
            'success' => true,
            'redirect' => '/owner/dashboard'
        ]);
    }

    /**
     * Create a new Turf Ground for the Tenant.
     */
    public function storeTurf(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'turf_type' => 'required|in:cricket,football,badminton,multi',
            'capacity' => 'integer',
            'price_per_hour' => 'numeric',
            'weekend_price_per_hour' => 'numeric',
            'pitch_type' => 'string|nullable',
        ]);

        $tenant = $request->user()->ownedTenant;

        if (!$tenant) {
            abort(403, 'No tenant found for user.');
        }

        $tenant->turfs()->create($validated);

        return redirect()->back()->with('success', 'Turf ground created successfully.');
    }

    /**
     * Generate available slots for a specific turf and date range.
     */
    public function generateSlots(Request $request, TurfGround $turf)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'slot_duration_minutes' => 'required|integer|min:30',
        ]);

        $tenant = $request->user()->ownedTenant;

        if (!$tenant || $turf->tenant_id !== $tenant->id) {
            abort(403, 'Unauthorized.');
        }

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $duration = $validated['slot_duration_minutes'];

        $slotsCreated = 0;

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $isWeekend = $date->isWeekend();
            $price = $isWeekend && $turf->weekend_price_per_hour > 0 
                        ? $turf->weekend_price_per_hour 
                        : $turf->price_per_hour;

            $currentTime = Carbon::parse($validated['start_time']);
            $endTime = Carbon::parse($validated['end_time']);

            while ($currentTime->copy()->addMinutes($duration)->lte($endTime)) {
                $slotStart = $currentTime->format('H:i:s');
                $slotEnd = $currentTime->copy()->addMinutes($duration)->format('H:i:s');

                // Check if slot already exists
                $exists = Slot::where('turf_id', $turf->id)
                    ->where('date', $date->format('Y-m-d'))
                    ->where('start_time', $slotStart)
                    ->exists();

                if (!$exists) {
                    Slot::create([
                        'tenant_id' => $tenant->id,
                        'turf_id' => $turf->id,
                        'date' => $date->format('Y-m-d'),
                        'start_time' => $slotStart,
                        'end_time' => $slotEnd,
                        'price' => $price,
                        'status' => 'available',
                    ]);
                    $slotsCreated++;
                }

                $currentTime->addMinutes($duration);
            }
        }

        return redirect()->back()->with('success', "$slotsCreated slots generated successfully.");
    }
    /**
     * Handle manual booking from the owner dashboard.
     */
    public function manualBooking(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'date' => 'required|date',
            'time' => 'required',
            'turf_id' => 'required|exists:turf_grounds,id',
        ]);

        $user = $request->user();
        $tenant = $user->ownedTenant;

        if (!$tenant) abort(403);

        // Find or create slot
        $slotTime = Carbon::parse($validated['time'])->format('H:i:s');
        $slot = Slot::where('turf_id', $validated['turf_id'])
            ->where('date', $validated['date'])
            ->where('start_time', $slotTime)
            ->first();

        if (!$slot) {
            $slot = Slot::create([
                'tenant_id' => $tenant->id,
                'turf_id' => $validated['turf_id'],
                'date' => $validated['date'],
                'start_time' => $slotTime,
                'end_time' => Carbon::parse($slotTime)->addHour()->format('H:i:s'),
                'price' => 0,
                'status' => 'booked',
            ]);
        } else {
            if ($slot->status === 'booked') {
                return redirect()->back()->withErrors(['error' => 'Slot already booked.']);
            }
            $slot->update(['status' => 'booked']);
        }

        \App\Models\Booking::create([
            'tenant_id' => $tenant->id,
            'turf_id' => $validated['turf_id'],
            'slot_id' => $slot->id,
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_phone'] . '@manual.turfbook.com', // Fallback email
            'total_amount' => $slot->price ?: 0,
            'status' => 'confirmed',
            'booking_ref' => 'MAN-' . strtoupper(Str::random(8)),
        ]);

        return redirect()->back()->with('success', 'Manual booking recorded.');
    }

    /**
     * Update the tenant settings configuration.
     */
    public function updateSettings(Request $request)
    {
        $tenant = $request->user()->ownedTenant;

        if (!$tenant) {
            abort(403, 'No tenant found for user.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:20',
            'monthly_pass_price' => 'numeric|min:0',
            'monthly_pass_bookings' => 'integer|min:0',
            'description' => 'nullable|string',
            'instagram_url' => 'nullable|string|max:255',
            'facebook_url' => 'nullable|string|max:255',
            'whatsapp_number' => 'nullable|string|max:20',
            'razorpay_key_id' => 'nullable|string|max:255',
            'razorpay_key_secret' => 'nullable|string|max:255',
        ]);

        $tenant->update($validated);

        return redirect()->back()->with('success', 'Arena configuration committed successfully.');
    }
}
