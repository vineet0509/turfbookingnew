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
        $this->ensureUuidPersonalAccessTokensTable();
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
        if ($request->has('tenant_id') && $request->tenant_id === '') {
            $request->merge(['tenant_id' => null]);
        }

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

        $this->ensureUuidPersonalAccessTokensTable();
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

    /**
     * Self-healing helper to drop and recreate personal_access_tokens if it has an incorrect BIGINT column.
     * Direct information_schema queries ensure compatibility and lightning performance across all MySQL environments.
     */
    private function ensureUuidPersonalAccessTokensTable()
    {
        try {
            $isBigint = false;
            $dbName = env('DB_DATABASE', 'u778507850_turfbooking');
            
            $result = \Illuminate\Support\Facades\DB::select("
                SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = ? 
                AND TABLE_NAME = 'personal_access_tokens' 
                AND COLUMN_NAME = 'tokenable_id'
            ", [$dbName]);
            
            if (!empty($result) && in_array(strtolower($result[0]->DATA_TYPE), ['int', 'bigint', 'tinyint', 'mediumint', 'smallint'])) {
                $isBigint = true;
            }
            
            if ($isBigint) {
                \Illuminate\Support\Facades\Schema::dropIfExists('personal_access_tokens');
            }
        } catch (\Exception $e) {}

        if (!\Illuminate\Support\Facades\Schema::hasTable('personal_access_tokens')) {
            try {
                \Illuminate\Support\Facades\Schema::create('personal_access_tokens', function (\Illuminate\Database\Schema\Blueprint $table) {
                    $table->id();
                    $table->string('tokenable_type');
                    $table->uuid('tokenable_id'); // Correct CHAR(36) UUID format
                    $table->string('name');
                    $table->string('token', 64)->unique();
                    $table->text('abilities')->nullable();
                    $table->timestamp('last_used_at')->nullable();
                    $table->timestamp('expires_at')->nullable();
                    $table->timestamps();
                    
                    $table->index(['tokenable_type', 'tokenable_id']);
                });
            } catch (\Exception $e) {}
        }
    }
}
