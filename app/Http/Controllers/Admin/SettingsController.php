<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        $settings = SystemSetting::all()->groupBy('group');

        if ($request->expectsJson()) {
            return response()->json(compact('settings'));
        }

        return view('welcome');
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable', 'string', 'max:1000'],
        ]);

        foreach ($request->settings as $key => $value) {
            SystemSetting::where('key', $key)->update(['value' => $value]);
        }

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Settings updated successfully.']);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
