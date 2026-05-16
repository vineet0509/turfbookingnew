<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        $isSubdomain = app()->has('tenant');

        return Inertia::render('Auth/Register', [
            'isSubdomain' => $isSubdomain,
            'tenant' => $isSubdomain ? app('tenant') : null,
            'tenants' => $isSubdomain ? [] : \App\Models\Tenant::where('is_active', true)->get(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'string|in:owner,customer',
            'tenant_id' => 'nullable|exists:tenants,id',
        ]);

        $isSubdomain = app()->has('tenant');
        
        // If on subdomain, always a customer for that tenant
        // If on main site, use the role and tenant_id from request
        $role = $isSubdomain ? 'customer' : ($request->role ?? 'owner');
        $tenantId = $isSubdomain ? app('tenant')->id : $request->tenant_id;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $role,
            'tenant_id' => $tenantId,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
