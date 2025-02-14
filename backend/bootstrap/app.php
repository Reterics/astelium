<?php

use Illuminate\Foundation\Application;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        health: '/up',
    )

    ->withMiddleware(function ($middleware) {

    })
    ->withExceptions(function ($exceptions) {
        $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e, Illuminate\Http\Request $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
        });
    })->create();
