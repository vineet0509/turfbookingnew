<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Pass;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::where('customer_id', $user->id)
            ->with(['tenant', 'turf', 'slot'])
            ->latest()
            ->get();

        // In a real app, you would have a Pass model
        // For now, we'll return an empty array or dummy data if the model doesn't exist
        $passes = [];
        if (class_exists('App\Models\Pass')) {
            $passes = Pass::where('customer_id', $user->id)->with('tenant')->get();
        }

        // Detect active tab from route name
        $routeName = $request->route()->getName();
        $activeTab = 'bookings';
        if (str_contains($routeName, 'passes')) $activeTab = 'passes';
        if (str_contains($routeName, 'profile')) $activeTab = 'profile';

        return Inertia::render('Customer/Dashboard', [
            'bookings' => $bookings,
            'passes' => $passes,
            'user' => $user,
            'initialTab' => $activeTab,
        ]);
    }

    public function cancelBooking(Request $request, Booking $booking)
    {
        if ($booking->customer_id !== $request->user()->id) {
            abort(403);
        }

        // Logic for cancellation (e.g. status change, refund trigger)
        $booking->update(['status' => 'cancelled']);

        return redirect()->back()->with('success', 'Booking cancelled successfully.');
    }
}
