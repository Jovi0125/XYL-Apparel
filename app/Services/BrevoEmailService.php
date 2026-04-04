<?php

namespace App\Services;

/**
 * Service to handle Brevo (formerly Sendinblue) email integrations.
 * 
 * TODO: Fully implement after obtaining Brevo API keys.
 * This should handle:
 * - Sending verification emails
 * - Adding users to contact lists for marketing/newsletters
 * - Transactional emails (order confirmation, password reset)
 */
class BrevoEmailService
{
    /**
     * Send email verification link to user.
     * 
     * @param \App\Models\User $user
     * @return void
     */
    public function sendVerificationEmail($user)
    {
        // Placeholder for future Brevo integration
        // Example logic:
        /*
        $config = \SendinBlue\Client\Configuration::getDefaultConfiguration()->setApiKey('api-key', config('services.brevo.key'));
        $apiInstance = new \SendinBlue\Client\Api\TransactionalEmailsApi(new \GuzzleHttp\Client(), $config);
        $sendSmtpEmail = new \SendinBlue\Client\Model\SendSmtpEmail([
            'subject' => 'Verify your email for XYLO APPAREL',
            'sender' => ['name' => 'XYLO APPAREL', 'email' => 'noreply@xylo.com'],
            'to' => [['email' => $user->email, 'name' => $user->name]],
            'htmlContent' => 'Please verify your email clicking here: {{params.verifyUrl}}',
            'params' => ['verifyUrl' => route('verification.verify', ['id' => $user->id, 'hash' => sha1($user->email)])]
        ]);
        $apiInstance->sendTransacEmail($sendSmtpEmail);
        */
        
        \Log::info("Verification email requested for user: {$user->email}. Brevo integration is in standby.");
    }
}
