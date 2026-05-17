<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Auth\Events\Registered;

class ApiAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'errors' => [
                    'email' => ['Invalid login credentials.']
                ]
            ], 422);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Load relations if needed
        if ($user->role === 'owner') {
            $user->load('ownedTenant');
        }

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'redirect' => $user->role === 'super_admin' ? '/admin/dashboard' : ($user->role === 'owner' ? '/owner/dashboard' : '/customer/dashboard')
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'string|in:owner,customer',
            'tenant_id' => 'nullable|exists:tenants,id',
        ]);

        $isSubdomain = app()->has('tenant');
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'redirect' => '/dashboard'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
