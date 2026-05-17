<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Free Trial Plan
        SubscriptionPlan::updateOrCreate(
            ['name' => 'free_trial'],
            [
                'display_name' => 'Free Trial',
                'price_monthly' => 0.00,
                'price_yearly' => 0.00,
                'max_turfs' => 1,
                'max_bookings_per_month' => 15,
                'features' => [
                    '1 Arena Ground',
                    '15 Bookings / mo',
                    'Digital Calendar',
                    'Standard Support (Email)'
                ],
                'is_active' => true,
                'sort_order' => 0,
            ]
        );

        // 2. Starter Plan
        SubscriptionPlan::updateOrCreate(
            ['name' => 'starter'],
            [
                'display_name' => 'Starter',
                'price_monthly' => 499.00,
                'price_yearly' => 4999.00,
                'max_turfs' => 1,
                'max_bookings_per_month' => 100,
                'features' => [
                    '1 Arena Ground',
                    '100 Bookings / mo',
                    'Digital Calendar',
                    'Email Alerts'
                ],
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        // 3. Pro Arena Plan
        SubscriptionPlan::updateOrCreate(
            ['name' => 'pro_arena'],
            [
                'display_name' => 'Pro Arena',
                'price_monthly' => 999.00,
                'price_yearly' => 9999.00,
                'max_turfs' => 3,
                'max_bookings_per_month' => -1, // Unlimited
                'features' => [
                    '3 Arena Grounds',
                    'Unlimited Bookings',
                    'Razorpay Integration',
                    'Analytics Dashboard'
                ],
                'is_active' => true,
                'sort_order' => 2,
            ]
        );

        // 4. Club Elite Plan
        SubscriptionPlan::updateOrCreate(
            ['name' => 'club_elite'],
            [
                'display_name' => 'Club Elite',
                'price_monthly' => 1999.00,
                'price_yearly' => 19999.00,
                'max_turfs' => 10,
                'max_bookings_per_month' => -1, // Unlimited
                'features' => [
                    '10+ Arena Grounds',
                    'Unlimited Everything',
                    'WhatsApp Automations',
                    'Dedicated Support'
                ],
                'is_active' => true,
                'sort_order' => 3,
            ]
        );
    }
}
