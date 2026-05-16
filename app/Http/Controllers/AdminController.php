<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tenant;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            abort(403, 'Unauthorized. Super Admin only.');
        }

        $tenants = Tenant::with('owner')->withCount('turfs')->latest()->get();
        
        $platformStats = [
            'tenants' => [
                'total' => $tenants->count(),
                'pending' => $tenants->where('status', 'pending')->count(),
            ],
            'users' => [
                'total' => \App\Models\User::count(),
            ],
            'bookings' => [
                'confirmed' => \App\Models\Booking::where('status', 'paid')->count(),
            ],
            'revenue' => [
                'total' => 0, // In a real app, sum up platform subscription payments
            ]
        ];

        // Detect active tab from route name
        $routeName = $request->route()->getName();
        $activeTab = 'overview';
        if (str_contains($routeName, 'arenas')) $activeTab = 'arenas';
        if (str_contains($routeName, 'revenue')) $activeTab = 'revenue';
        if (str_contains($routeName, 'settings')) $activeTab = 'settings';

        return Inertia::render('Admin/Dashboard', [
            'tenants' => $tenants,
            'platformStats' => $platformStats,
            'revenueData' => [],
            'initialTab' => $activeTab,
            'globalConfig' => [
                'razorpay_key_id' => env('RAZORPAY_KEY_ID'),
                'support_email' => 'support@vynkra.com',
            ]
        ]);
    }

    public function updateTenantStatus(Request $request, Tenant $tenant)
    {
        if ($request->user()->role !== 'super_admin') {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,suspended',
        ]);

        $tenant->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Tenant status updated.');
    }
}
