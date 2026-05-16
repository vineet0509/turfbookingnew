<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Slot;
use App\Models\Booking;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Razorpay\Api\Api;
use Exception;

class BookingController extends Controller
{
    /**
     * View checkout page for a specific slot.
     */
    public function checkout(Request $request, Slot $slot)
    {
        $tenant = app('tenant');

        if ($slot->tenant_id !== $tenant->id || $slot->status !== 'available') {
            abort(404, 'Slot not available.');
        }

        // Initialize Razorpay API using tenant keys or global keys
        $keyId = $tenant->razorpay_key_id ?: env('RAZORPAY_KEY_ID');
        $keySecret = $tenant->razorpay_key_secret ?: env('RAZORPAY_KEY_SECRET');

        if (!$keyId || !$keySecret) {
            abort(500, 'Payment gateway not configured.');
        }

        $api = new Api($keyId, $keySecret);

        // Create Razorpay Order
        $orderData = [
            'receipt'         => 'rcptid_' . Str::random(8),
            'amount'          => intval($slot->price * 100), // Amount in paise
            'currency'        => 'INR',
            'payment_capture' => 1 // auto capture
        ];

        try {
            $razorpayOrder = $api->order->create($orderData);
        } catch (Exception $e) {
            abort(500, 'Error creating Razorpay order: ' . $e->getMessage());
        }

        return Inertia::render('Tenant/Checkout', [
            'tenant' => $tenant,
            'slot' => $slot->load('turf'),
            'razorpayOrder' => $razorpayOrder->toArray(),
            'razorpayKeyId' => $keyId,
        ]);
    }

    /**
     * Process booking.
     */
    public function store(Request $request, Slot $slot)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:15',
            'customer_email' => 'required|email|max:255',
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $tenant = app('tenant');

        if ($slot->tenant_id !== $tenant->id || $slot->status !== 'available') {
            abort(400, 'Slot is no longer available.');
        }

        // Verify Razorpay Signature
        $keyId = $tenant->razorpay_key_id ?: env('RAZORPAY_KEY_ID');
        $keySecret = $tenant->razorpay_key_secret ?: env('RAZORPAY_KEY_SECRET');

        $api = new Api($keyId, $keySecret);
        
        try {
            $attributes = array(
                'razorpay_order_id' => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature' => $validated['razorpay_signature']
            );

            $api->utility->verifyPaymentSignature($attributes);
        } catch(Exception $e) {
            abort(400, 'Payment verification failed: ' . $e->getMessage());
        }

        // Generate booking ref
        $bookingRef = 'TRF' . strtoupper(Str::random(8));

        $booking = Booking::create([
            'tenant_id' => $tenant->id,
            'turf_id' => $slot->turf_id,
            'slot_id' => $slot->id,
            'customer_id' => $request->user()->id, // Assuming authenticated customer
            'booking_ref' => $bookingRef,
            'status' => 'confirmed',
            'total_amount' => $slot->price,
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'],
        ]);

        Payment::create([
            'booking_id' => $booking->id,
            'razorpay_order_id' => $validated['razorpay_order_id'],
            'razorpay_payment_id' => $validated['razorpay_payment_id'],
            'razorpay_signature' => $validated['razorpay_signature'],
            'amount' => $slot->price,
            'status' => 'success',
            'paid_at' => now(),
        ]);

        // Mark slot as booked
        $slot->update(['status' => 'booked']);

        return redirect()->route('tenant.booking.success', [
            'subdomain' => $tenant->subdomain,
            'booking' => $booking->id
        ]);
    }

    /**
     * Booking success page.
     */
    public function success(Request $request, Booking $booking)
    {
        $tenant = app('tenant');

        if ($booking->tenant_id !== $tenant->id) {
            abort(404);
        }

        return Inertia::render('Tenant/BookingSuccess', [
            'tenant' => $tenant,
            'booking' => $booking->load(['turf', 'slot', 'payment']),
        ]);
    }
}
