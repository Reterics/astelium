<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    protected $settingsFile = 'settings.json';

    public function index()
    {
        return response()->json(json_decode(Storage::get($this->settingsFile), true) ?? []);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'string|max:255',
            'admin_email' => 'email',
            'theme' => 'string|in:light,dark',
        ]);

        Storage::put($this->settingsFile, json_encode($validated));

        return response()->json(['message' => 'Settings updated']);
    }
}
