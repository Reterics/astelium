<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Show the application dashboard.
     */
    public function index(Request $request)
    {

        $user = $request->user();
        $stats = [
            'projects' => 5,
            'tasks'    => 23,
        ];

        return Inertia::render('Dashboard', [
            'user'  => $user,
            'stats' => $stats,
        ]);
    }
}
