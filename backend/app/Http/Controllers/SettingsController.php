<?php
namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Default settings to use when no settings are found for an account
     */
    protected function getDefaultSettings()
    {
        return [
            'site_name' => 'Astelium',
            'admin_email' => '',
            'theme' => 'light',
        ];
    }

    public function index(Request $request)
    {
        $accountId = $request->attributes->get('account_id');

        // Get settings for the current account from the database
        $setting = Setting::where('account_id', $accountId)->first();

        // If no settings found, use default settings
        $accountSettings = $setting ? $setting->setting : $this->getDefaultSettings();

        // Return settings as an element of an array
        return response()->json([$accountSettings]);
    }

    public function update(Request $request)
    {
        $accountId = $request->attributes->get('account_id');

        $validated = $request->validate([
            'site_name' => 'string|max:255',
            'admin_email' => 'email',
            'theme' => 'string|in:light,dark',
        ]);

        // Find or create settings for the current account
        $setting = Setting::firstOrNew(['account_id' => $accountId]);

        // Update the setting field with the validated data
        $setting->setting = $validated;

        // Save to the database
        $setting->save();

        return response()->json(['message' => 'Settings updated']);
    }
}
