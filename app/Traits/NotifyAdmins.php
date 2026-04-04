<?php

namespace App\Traits;

use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Support\Facades\Notification;

trait NotifyAdmins
{
    /**
     * Send a notification to all admin users.
     */
    public static function notifyAdmins(string $message, string $type = 'info')
    {
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new SystemNotification($message, $type));
    }
}
