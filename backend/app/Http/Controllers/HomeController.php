<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Index');
    }

    public function appointments(): \Inertia\Response
    {
        return Inertia::render('Appointments');
    }
}
