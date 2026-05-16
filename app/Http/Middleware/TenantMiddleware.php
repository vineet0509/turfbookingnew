<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Tenant;

class TenantMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Example: myturf.localhost => myturf
        $host = $request->getHost();
        $parts = explode('.', $host);
        
        // Check if we are on a subdomain (e.g. not localhost or www.localhost)
        if (count($parts) >= 2 && $parts[0] !== 'www' && $parts[0] !== 'localhost') {
            $subdomain = $parts[0];
            
            $tenant = Tenant::where('subdomain', $subdomain)->where('is_active', true)->first();
            
            if (!$tenant) {
                abort(404, 'Tenant not found');
            }
            
            // Bind the tenant to the service container so we can access it anywhere
            app()->instance('tenant', $tenant);
            $request->merge(['tenant' => $tenant]);
        }

        return $next($request);
    }
}
