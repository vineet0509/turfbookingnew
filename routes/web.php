<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Web Routes (SaaS Platform)
Route::group([], function () {
    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'tenants' => \App\Models\Tenant::where('is_active', true)->get(),
            'plans' => \App\Models\SubscriptionPlan::all(),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });

    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->role === 'super_admin') return redirect()->route('admin.dashboard');
        if ($user->role === 'owner') return redirect()->route('owner.dashboard');
        return redirect()->route('customer.dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        
        // Tenant Owner Routes
        Route::prefix('owner')->name('owner.')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\TenantController::class, 'dashboard'])->name('dashboard');
            Route::get('/turfs', [\App\Http\Controllers\TenantController::class, 'dashboard'])->name('turfs');
            Route::get('/players', [\App\Http\Controllers\TenantController::class, 'dashboard'])->name('players');
            Route::get('/payments', [\App\Http\Controllers\TenantController::class, 'dashboard'])->name('payments');
            Route::get('/settings', [\App\Http\Controllers\TenantController::class, 'dashboard'])->name('settings');
            
            Route::post('/setup', [\App\Http\Controllers\TenantController::class, 'setup'])->name('setup');
            Route::post('/turfs', [\App\Http\Controllers\TenantController::class, 'storeTurf'])->name('turfs.store');
            Route::post('/turfs/{turf}/slots', [\App\Http\Controllers\TenantController::class, 'generateSlots'])->name('turfs.slots.generate');
            Route::post('/bookings/manual', [\App\Http\Controllers\TenantController::class, 'manualBooking'])->name('bookings.manual');
            Route::get('/billing', [\App\Http\Controllers\SubscriptionController::class, 'index'])->name('billing');
            Route::post('/subscribe', [\App\Http\Controllers\SubscriptionController::class, 'subscribe'])->name('subscribe');
        });

        // Customer Routes
        Route::prefix('customer')->name('customer.')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\CustomerController::class, 'dashboard'])->name('dashboard');
            Route::get('/passes', [\App\Http\Controllers\CustomerController::class, 'dashboard'])->name('passes');
            Route::get('/profile', [\App\Http\Controllers\CustomerController::class, 'dashboard'])->name('profile');
            Route::post('/bookings/{booking}/cancel', [\App\Http\Controllers\CustomerController::class, 'cancelBooking'])->name('bookings.cancel');
        });

        // Informational Routes
        Route::get('/about', function () { return Inertia::render('About'); })->name('about');
        Route::get('/contact', function () { return Inertia::render('Contact'); })->name('contact');
        Route::get('/privacy', function () { return Inertia::render('Privacy'); })->name('privacy');

        // Super Admin Routes
        Route::prefix('admin')->name('admin.')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');
            Route::get('/arenas', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('arenas');
            Route::get('/revenue', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('revenue');
            Route::get('/settings', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('settings');
            Route::post('/tenants/{tenant}/status', [\App\Http\Controllers\AdminController::class, 'updateTenantStatus'])->name('tenant.status');
        });
    });

    require __DIR__.'/auth.php';
});

// Tenant Subdomain Routes
Route::domain('{subdomain}.' . env('APP_URL', 'localhost'))->middleware(['tenant'])->group(function () {
    Route::get('/', function ($subdomain) {
        $tenant = app('tenant');
        return Inertia::render('Tenant/Home', [
            'tenant' => $tenant,
            'turfs' => $tenant->turfs()->with('slots')->get(),
        ]);
    })->name('tenant.home');
    
    // Additional tenant specific routes like bookings would go here
    Route::middleware('auth')->group(function () {
        Route::get('/slot/{slot}/checkout', [\App\Http\Controllers\BookingController::class, 'checkout'])->name('tenant.checkout');
        Route::post('/slot/{slot}/book', [\App\Http\Controllers\BookingController::class, 'store'])->name('tenant.book');
        Route::get('/booking/{booking}/success', [\App\Http\Controllers\BookingController::class, 'success'])->name('tenant.booking.success');
    });
});
