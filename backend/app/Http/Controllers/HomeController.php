<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    /**
     * Render the SPA view
     *
     * @return \Illuminate\View\View
     */
    public function spa()
    {
        return view('spa');
    }

    /**
     * Home page
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return $this->spa();
    }

    /**
     * Appointments page
     *
     * @return \Illuminate\View\View
     */
    public function appointments()
    {
        return $this->spa();
    }
}
