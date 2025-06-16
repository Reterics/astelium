<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    /**
     * Render the SPA view for admin routes
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return view('spa');
    }
}
