<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

$domain = parse_url(env('APP_URL', 'http://localhost'), PHP_URL_HOST) ?? env('APP_URL', 'localhost');

// Tenant Subdomain SPA Named Routes for Ziggy
Route::domain('{subdomain}.' . $domain)->group(function () {
    Route::get('/slot/{slot}/checkout', function () { return view('app'); })->name('tenant.checkout');
    Route::post('/slot/{slot}/book', function () { return view('app'); })->name('tenant.book');
    Route::get('/booking/{booking}/success', function () { return view('app'); })->name('tenant.success');
});

// Utility route to run migrations and seed subscription plans on production shared hosting
Route::get('/run-migrations-secret', function () {
    try {
        // Force drop and recreate personal_access_tokens table directly to ensure UUID compatibility
        \Illuminate\Support\Facades\Schema::dropIfExists('personal_access_tokens');
        \Illuminate\Support\Facades\Schema::create('personal_access_tokens', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->id();
            $table->string('tokenable_type');
            $table->uuid('tokenable_id'); // Make absolutely sure it is a UUID!
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            $table->index(['tokenable_type', 'tokenable_id']);
        });
        
        $directRecreateMessage = "Directly dropped and recreated 'personal_access_tokens' table with UUID support successfully!<br>";

        // Clear all Laravel caches (very important for Hostinger shared hosting)
        \Illuminate\Support\Facades\Artisan::call('route:clear');
        \Illuminate\Support\Facades\Artisan::call('config:clear');
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
        \Illuminate\Support\Facades\Artisan::call('view:clear');
        $cacheMessage = "All Laravel caches (routes, config, cache, views) cleared successfully!<br>";

        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = \Illuminate\Support\Facades\Artisan::output();
        
        \Illuminate\Support\Facades\Artisan::call('db:seed', [
            '--class' => 'Database\\Seeders\\SubscriptionPlanSeeder',
            '--force' => true
        ]);
        $seedOutput = \Illuminate\Support\Facades\Artisan::output();
        
        return '<h3>Deployment Direct Correction Success!</h3>' . 
               '<p>' . $directRecreateMessage . '</p>' .
               '<p>' . $cacheMessage . '</p>' .
               '<strong>Migration Output:</strong><pre>' . e($migrateOutput) . '</pre><br>' .
               '<strong>Seeding Output:</strong><pre>' . e($seedOutput) . '</pre>';
    } catch (\Exception $e) {
        return '<h3>Deployment Failed!</h3><pre>' . e($e->getMessage()) . '</pre>';
    }
});

// Main site routes mapped to React SPA
Route::get('/', function () { return view('app'); })->name('home');
Route::get('/login', function () { return view('app'); })->name('login');
Route::get('/register', function () { return view('app'); })->name('register');
Route::get('/forgot-password', function () { return view('app'); })->name('password.request');
Route::get('/reset-password/{token}', function () { return view('app'); })->name('password.reset');
Route::get('/verify-email', function () { return view('app'); })->name('verification.notice');
Route::get('/dashboard', function () { return view('app'); })->name('dashboard');

// Customer SPA Routes
Route::prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', function () { return view('app'); })->name('dashboard');
    Route::get('/passes', function () { return view('app'); })->name('passes');
    Route::get('/profile', function () { return view('app'); })->name('profile');
});

// Owner SPA Routes
Route::prefix('owner')->name('owner.')->group(function () {
    Route::get('/setup', function () { return view('app'); })->name('setup');
    Route::get('/dashboard', function () { return view('app'); })->name('dashboard');
    Route::get('/billing', function () { return view('app'); })->name('billing');
    Route::get('/turfs', function () { return view('app'); })->name('turfs');
    Route::get('/players', function () { return view('app'); })->name('players');
    Route::get('/payments', function () { return view('app'); })->name('payments');
    Route::get('/settings', function () { return view('app'); })->name('settings');
    Route::post('/bookings/manual', function () { return view('app'); })->name('bookings.manual');
    Route::post('/turfs', function () { return view('app'); })->name('turfs.store');
    Route::post('/subscribe', function () { return view('app'); })->name('subscribe');
});

// Admin SPA Routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () { return view('app'); })->name('dashboard');
    Route::get('/arenas', function () { return view('app'); })->name('arenas');
    Route::get('/revenue', function () { return view('app'); })->name('revenue');
    Route::get('/settings', function () { return view('app'); })->name('settings');
});

// Profile and Verification Auth Named Routes
Route::post('/logout', function () { return view('app'); })->name('logout');
Route::patch('/profile', function () { return view('app'); })->name('profile.update');
Route::put('/password', function () { return view('app'); })->name('password.update');
Route::delete('/profile', function () { return view('app'); })->name('profile.destroy');
Route::post('/verification-notification', function () { return view('app'); })->name('verification.send');
Route::post('/reset-password', function () { return view('app'); })->name('password.store');
Route::post('/forgot-password', function () { return view('app'); })->name('password.email');
Route::post('/confirm-password', function () { return view('app'); })->name('password.confirm');

// Catch-all route to serve the React SPA shell
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
