<?php
// app/Http/Controllers/PaddleWebhookController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Ticket;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str; // For generating ticket codes
use Symfony\Component\HttpFoundation\Response; // For HTTP status codes

class PaddleWebhookController extends Controller
{
    /**
     * Handle incoming Paddle webhook notifications.
     */
    public function handleWebhook(Request $request)
    {
        // 1. Verify the webhook signature
        // This is crucial for security to ensure the request genuinely came from Paddle.
        // Paddle typically sends a `Paddle-Signature` header.
        // You'll need your Paddle webhook secret from your Paddle dashboard.
        $webhookSecret = config('services.paddle.webhook_secret'); // Store in config/services.php or .env

        if (!$webhookSecret) {
            Log::error('Paddle webhook secret not configured.');
            return response()->json(['message' => 'Webhook secret not configured.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            // Laravel's built-in webhook signature verification (if using Laravel Cashier Paddle)
            // Or a custom implementation using hash_hmac
            // Example (simplified, you'd use a more robust verification method):
            // $signature = $request->header('Paddle-Signature');
            // if (! $this->verifyPaddleSignature($request->getContent(), $signature, $webhookSecret)) {
            //     Log::warning('Invalid Paddle webhook signature.');
            //     return response()->json(['message' => 'Invalid signature.'], Response::HTTP_BAD_REQUEST);
            // }

            // For this example, we'll skip the actual signature verification
            // but in production, this is MANDATORY.
            Log::info('Paddle webhook received (signature verification skipped for example).');

        } catch (\Exception $e) {
            Log::error('Error verifying Paddle webhook signature: ' . $e->getMessage());
            return response()->json(['message' => 'Webhook signature verification failed.'], Response::HTTP_BAD_REQUEST);
        }


        $payload = $request->all();
        $eventType = $payload['event_type'] ?? null;
        $data = $payload['data'] ?? [];
        $paddlePaymentId = $data['id'] ?? null; // Paddle's payment ID

        if (!$eventType || !$paddlePaymentId) {
            Log::warning('Invalid Paddle webhook payload: missing event_type or data.id', ['payload' => $payload]);
            return response()->json(['message' => 'Invalid webhook payload.'], Response::HTTP_BAD_REQUEST);
        }

        Log::info("Processing Paddle webhook event: {$eventType} for payment ID: {$paddlePaymentId}");

        try {
            switch ($eventType) {
                case 'transaction.completed':
                    // A payment was successfully completed
                    $this->handleTransactionCompleted($data);
                    break;
                case 'transaction.refunded':
                    // A payment was refunded
                    $this->handleTransactionRefunded($data);
                    break;
                case 'subscription.created':
                    // A subscription was created
                    $this->handleSubscriptionCreated($data);
                    break;
                case 'subscription.updated':
                    // A subscription was updated
                    $this->handleSubscriptionUpdated($data);
                    break;
                case 'subscription.cancelled':
                    // A subscription was cancelled
                    $this->handleSubscriptionCancelled($data);
                    break;
                case 'subscription.paused':
                    // A subscription was paused
                    $this->handleSubscriptionPaused($data);
                    break;
                case 'subscription.resumed':
                    // A subscription was resumed
                    $this->handleSubscriptionResumed($data);
                    break;
                case 'subscription.payment_succeeded':
                    // A subscription payment succeeded
                    $this->handleSubscriptionPaymentSucceeded($data);
                    break;
                case 'subscription.payment_failed':
                    // A subscription payment failed
                    $this->handleSubscriptionPaymentFailed($data);
                    break;
                default:
                    Log::info("Unhandled Paddle webhook event type: {$eventType}");
                    break;
            }
        } catch (\Exception $e) {
            Log::error("Error processing Paddle webhook for event {$eventType}: " . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Error processing webhook.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Webhook processed successfully.'], Response::HTTP_OK);
    }

    /**
     * Handle a completed transaction webhook.
     */
    protected function handleTransactionCompleted(array $data)
    {
        $paddlePaymentId = $data['id'];
        $paddleTransactionId = $data['checkout_id'] ?? null; // Or use `invoice_id` depending on Paddle version/type
        $status = 'completed';
        $amount = (int)($data['details']['totals']['total'] ?? 0); // Amount in cents/smallest unit
        $currency = $data['details']['totals']['currency_code'] ?? 'USD';

        // Find the corresponding payment in your database using paddlePaymentId
        // Or create a new one if it's the first notification for this payment
        $payment = Payment::where('paddlePaymentId', $paddlePaymentId)->first();

        if (!$payment) {
            // If payment record doesn't exist, it means it wasn't initiated from your app
            // or there's a sync issue. You might need to create it or log an error.
            // For simplicity, we'll assume it exists and was created in PaymentController::store
            Log::warning("Paddle webhook: transaction.completed for unknown payment ID: {$paddlePaymentId}");
            return; // Or throw an exception
        }

        $payment->update([
            'status' => $status,
            'paddleTransactionId' => $paddleTransactionId,
            'amount' => $amount, // Update amount in case of discrepancies
            'currency' => $currency,
        ]);

        // Now, create the ticket for the user if it doesn't exist
        $ticket = Ticket::where('payment_id', $payment->id)->first();
        if (!$ticket) {
            $ticketCode = Str::random(16); // Generate a unique ticket code
            Ticket::create([
                'event_id' => $payment->event_id,
                'user_id' => $payment->user_id,
                'purchaseDate' => now(),
                'ticketCode' => $ticketCode,
                'status' => 'active',
                'payment_id' => $payment->id,
                'isRefunded' => false,
            ]);
            Log::info("Ticket created for payment ID: {$payment->id}");
        } else {
            // Update existing ticket status if necessary
            $ticket->update(['status' => 'active', 'isRefunded' => false]);
            Log::info("Existing ticket updated for payment ID: {$payment->id}");
        }

        Log::info("Payment ID {$payment->id} status updated to 'completed'.");
    }

    /**
     * Handle a refunded transaction webhook.
     */
    protected function handleTransactionRefunded(array $data)
    {
        $paddlePaymentId = $data['id'];
        $status = 'refunded';
        $refundReason = $data['payout_totals']['refund_reason'] ?? 'Refunded by Paddle webhook.';

        $payment = Payment::where('paddlePaymentId', $paddlePaymentId)->first();

        if (!$payment) {
            Log::warning("Paddle webhook: transaction.refunded for unknown payment ID: {$paddlePaymentId}");
            return;
        }

        $payment->update([
            'status' => $status,
            'refundReason' => $refundReason,
        ]);

        // Update associated tickets
        Ticket::where('payment_id', $payment->id)->update(['isRefunded' => true, 'status' => 'cancelled']);

        Log::info("Payment ID {$payment->id} status updated to 'refunded'.");
    }

    /**
     * Placeholder for Paddle signature verification.
     * In a real application, you would use Paddle's official SDK or a robust
     * implementation based on their documentation.
     *
     * @param string $payload The raw request body.
     * @param string $signature The value of the 'Paddle-Signature' header.
     * @param string $secret Your Paddle webhook secret key.
     * @return bool
     */
    protected function verifyPaddleSignature(string $payload, string $signature, string $secret): bool
    {
        // This is a simplified example. Refer to Paddle's official documentation
        // for the exact signature verification algorithm, which often involves
        // HMAC-SHA256 and specific string concatenation.
        // Example: https://developer.paddle.com/webhooks/overview#verifying-webhooks
        // return hash_hmac('sha256', $payload, $secret) === $signature;
        return true; // Placeholder: ALWAYS implement proper verification in production
    }

    /**
     * Handle subscription created webhook.
     */
    protected function handleSubscriptionCreated(array $data)
    {
        $paddleSubscriptionId = $data['id'];
        $paddleCustomerId = $data['customer_id'] ?? null;
        $status = 'active';
        $amount = (int)($data['items'][0]['price']['unit_amount'] ?? 0);
        $currency = $data['items'][0]['price']['currency_code'] ?? 'USD';
        $planName = $data['items'][0]['price']['product_id'] ?? 'basic';
        $planType = $data['billing_details']['billing_cycle']['interval'] ?? 'monthly';

        // Find the subscription in your database
        $subscription = Subscription::where('paddle_subscription_id', $paddleSubscriptionId)->first();

        if (!$subscription) {
            Log::warning("Paddle webhook: subscription.created for unknown subscription ID: {$paddleSubscriptionId}");
            return;
        }

        $subscription->update([
            'status' => $status,
            'paddle_customer_id' => $paddleCustomerId,
            'amount' => $amount,
            'currency' => $currency,
            'plan_name' => $planName,
            'plan_type' => $planType,
            'current_period_start' => $data['billing_details']['billing_cycle']['from'] ?? null,
            'current_period_end' => $data['billing_details']['billing_cycle']['to'] ?? null,
        ]);

        Log::info("Subscription ID {$subscription->id} status updated to 'active'.");
    }

    /**
     * Handle subscription updated webhook.
     */
    protected function handleSubscriptionUpdated(array $data)
    {
        $paddleSubscriptionId = $data['id'];
        
        $subscription = Subscription::where('paddle_subscription_id', $paddleSubscriptionId)->first();

        if (!$subscription) {
            Log::warning("Paddle webhook: subscription.updated for unknown subscription ID: {$paddleSubscriptionId}");
            return;
        }

        $subscription->updateFromPaddle($data);
        Log::info("Subscription ID {$subscription->id} updated from webhook.");
    }

    /**
     * Handle subscription cancelled webhook.
     */
    protected function handleSubscriptionCancelled(array $data)
    {
        $paddleSubscriptionId = $data['id'];
        
        $subscription = Subscription::where('paddle_subscription_id', $paddleSubscriptionId)->first();

        if (!$subscription) {
            Log::warning("Paddle webhook: subscription.cancelled for unknown subscription ID: {$paddleSubscriptionId}");
            return;
        }

        $subscription->cancel('Cancelled via Paddle webhook');
        Log::info("Subscription ID {$subscription->id} cancelled via webhook.");
    }

    /**
     * Handle subscription paused webhook.
     */
    protected function handleSubscriptionPaused(array $data)
    {
        $paddleSubscriptionId = $data['id'];
        
        $subscription = Subscription::where('paddle_subscription_id', $paddleSubscriptionId)->first();

        if (!$subscription) {
            Log::warning("Paddle webhook: subscription.paused for unknown subscription ID: {$paddleSubscriptionId}");
            return;
        }

        $subscription->update(['status' => 'paused']);
        Log::info("Subscription ID {$subscription->id} paused via webhook.");
    }

    /**
     * Handle subscription resumed webhook.
     */
    protected function handleSubscriptionResumed(array $data)
    {
        $paddleSubscriptionId = $data['id'];
        
        $subscription = Subscription::where('paddle_subscription_id', $paddleSubscriptionId)->first();

        if (!$subscription) {
            Log::warning("Paddle webhook: subscription.resumed for unknown subscription ID: {$paddleSubscriptionId}");
            return;
        }

        $subscription->update(['status' => 'active']);
        Log::info("Subscription ID {$subscription->id} resumed via webhook.");
    }

    /**
     * Handle subscription payment succeeded webhook.
     */
    protected function handleSubscriptionPaymentSucceeded(array $data)
    {
        $paddleSubscriptionId = $data['subscription_id'];
        
        $subscription = Subscription::where('paddle_subscription_id', $paddleSubscriptionId)->first();

        if (!$subscription) {
            Log::warning("Paddle webhook: subscription.payment_succeeded for unknown subscription ID: {$paddleSubscriptionId}");
            return;
        }

        $subscription->update([
            'status' => 'active',
            'current_period_start' => $data['billing_details']['billing_cycle']['from'] ?? null,
            'current_period_end' => $data['billing_details']['billing_cycle']['to'] ?? null,
        ]);

        Log::info("Subscription ID {$subscription->id} payment succeeded.");
    }

    /**
     * Handle subscription payment failed webhook.
     */
    protected function handleSubscriptionPaymentFailed(array $data)
    {
        $paddleSubscriptionId = $data['subscription_id'];
        
        $subscription = Subscription::where('paddle_subscription_id', $paddleSubscriptionId)->first();

        if (!$subscription) {
            Log::warning("Paddle webhook: subscription.payment_failed for unknown subscription ID: {$paddleSubscriptionId}");
            return;
        }

        $subscription->update(['status' => 'past_due']);
        Log::info("Subscription ID {$subscription->id} payment failed.");
    }
}
