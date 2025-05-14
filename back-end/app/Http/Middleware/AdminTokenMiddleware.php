<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AdminTokenMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $adminToken = env('ADMIN_TOKEN');

        if ($request->header('Authorization') !== 'Bearer '.$adminToken) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
