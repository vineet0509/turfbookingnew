<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubscriptionPlan;
use App\Models\TenantSubscription;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $tenant = $request->user()->ownedTenant;
        $plans = SubscriptionPlan::where('is_active', true)->orderBy('sort_order')->get();
        $subscription = $tenant ? $tenant->subscription()->with('plan')->first() : null;

        return Inertia::render('Owner/Billing', [
            'plans' => $plans,
            'currentSubscription' => $subscription,
            'tenant' => $tenant
        ]);
    }

    public function subscribe(Request $request)
    {
        $tenant = $request->user()->ownedTenant;
        if (!$tenant) abort(404);

        $validated = $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'razorpay_payment_id' => 'required|string',
            // simplified: in a real scenario you would verify razorpay signature here too
        ]);

        $plan = SubscriptionPlan::findOrFail($validated['plan_id']);
        $amount = $validated['billing_cycle'] === 'yearly' ? $plan->price_yearly : $plan->price_monthly;

        $startDate = Carbon::now();
        $endDate = $validated['billing_cycle'] === 'yearly' ? $startDate->copy()->addYear() : $startDate->copy()->addMonth();

        TenantSubscription::updateOrCreate(
            ['tenant_id' => $tenant->id],
            [
                'plan_id' => $plan->id,
                'billing_cycle' => $validated['billing_cycle'],
                'status' => 'active',
                'start_date' => $startDate,
                'end_date' => $endDate,
                'razorpay_subscription_id' => $validated['razorpay_payment_id'], // simulated
                'amount_paid' => $amount,
            ]
        );

        return redirect()->back()->with('success', 'Subscription activated successfully!');
    }
}
