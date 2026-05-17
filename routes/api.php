<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\SubscriptionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public SaaS routes
Route::get('/tenants-active', function () {
    return response()->json([
        'tenants' => \App\Models\Tenant::where('is_active', true)->get(),
        'plans' => \App\Models\SubscriptionPlan::all(),
    ]);
});

// Auth Routes (Stateless / Sanctum)
Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login', [ApiAuthController::class, 'login']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout']);
    
    // User context
    Route::get('/user', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        if ($user->role === 'owner') {
            $user->load('ownedTenant');
        }
        return response()->json($user);
    });

    // Profile Management
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    // Tenant Owner Routes
    Route::prefix('owner')->group(function () {
        Route::get('/dashboard-data', [TenantController::class, 'dashboard']);
        Route::post('/setup', [TenantController::class, 'setup']);
        Route::post('/settings', [TenantController::class, 'updateSettings'])->name('owner.settings.update');
        Route::post('/turfs', [TenantController::class, 'storeTurf']);
        Route::post('/turfs/{turf}/slots', [TenantController::class, 'generateSlots']);
        Route::post('/bookings/manual', [TenantController::class, 'manualBooking']);
        Route::get('/billing', [SubscriptionController::class, 'index']);
        Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);
    });

    // Customer Routes
    Route::prefix('customer')->group(function () {
        Route::get('/dashboard-data', [CustomerController::class, 'dashboard']);
        Route::post('/bookings/{booking}/cancel', [CustomerController::class, 'cancelBooking']);
    });

    // Super Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard-data', [AdminController::class, 'dashboard']);
        Route::post('/tenants/{tenant}/status', [AdminController::class, 'updateTenantStatus']);
    });
});

// Tenant Subdomain API Routes
$domain = parse_url(env('APP_URL', 'http://localhost'), PHP_URL_HOST) ?? env('APP_URL', 'localhost');
Route::domain('{subdomain}.' . $domain)->middleware(['tenant'])->group(function () {
    Route::get('/details', function ($subdomain) {
        $tenant = app('tenant');
        return response()->json([
            'tenant' => $tenant,
            'turfs' => $tenant->turfs()->with('slots')->get(),
        ]);
    });
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/slot/{slot}/checkout', [BookingController::class, 'checkout'])->name('tenant.checkout');
        Route::post('/slot/{slot}/book', [BookingController::class, 'store'])->name('tenant.book');
        Route::get('/booking/{booking}/success', [BookingController::class, 'success'])->name('tenant.success');
    });
});
