<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (env('DOCKER', false)) {
            $dockerViteUrl = 'http://host.docker.internal:5173';
            $sqlViteUrl = 'mysql';

            putenv("VITE_DEV_SERVER_URL={$dockerViteUrl}");
            $_ENV['VITE_DEV_SERVER_URL'] = $dockerViteUrl;
            $_SERVER['VITE_DEV_SERVER_URL'] = $dockerViteUrl;

            putenv("DB_HOST={$sqlViteUrl}");
            $_ENV['DB_HOST'] = $sqlViteUrl;
            $_SERVER['DB_HOST'] = $sqlViteUrl;
        }
        DB::enableQueryLog();
    }
}
