<?php
// app/Http/Controllers/PaymentController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    /**
     * Initiate a payment for an event.
     * This typically involves communicating with a payment gateway (e.g., Paddle)
     * to create a checkout or subscription.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validatedData = $request->validate([
            'event_id' => 'required|exists:events,id',
            'amount' => 'required|integer|min:0',
            'currency' => ['nullable', 'string', Rule::in(['USD', 'EUR', 'GBP'])], // Example currencies
            'successUrl' => 'nullable|url',
            'cancelUrl' => 'nullable|url',
        ]);

        $event = Event::find($validatedData['event_id']);
        if (!$event) {
            return response()->json(['message' => 'Event not found.'], 404);
        }

        // Ensure the amount matches the event's ticket price, unless it's a flexible payment
        if ($validatedData['amount'] !== $event->ticketPrice) {
            return response()->json(['message' => 'Payment amount does not match event ticket price.'], 400);
        }

        // Create a pending payment record in your DB
        $payment = Payment::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'amount' => $validatedData['amount'],
            'currency' => $validatedData['currency'] ?? 'USD',
            'status' => 'pending', // Initial status
        ]);

        // --- Integration with Paddle (or other payment gateway) would go here ---
        // This is a placeholder. You would use a Paddle SDK or make an HTTP request.
        try {
            // Example: Call Paddle API to create a checkout link
            // $paddleResponse = PaddleService::createCheckout($payment->id, $validatedData);
            // $checkoutUrl = $paddleResponse['checkout_url'];
            // $paddlePaymentId = $paddleResponse['paddle_payment_id'];

            $checkoutUrl = 'https://example.com/paddle/checkout/' . $payment->id; // Mock URL
            $paddlePaymentId = 'pp_mock_' . $payment->id; // Mock Paddle ID

            $payment->paddlePaymentId = $paddlePaymentId;
            $payment->save();

            return response()->json([
                'message' => 'Payment initiated successfully.',
                'payment' => $payment,
                'checkoutUrl' => $checkoutUrl,
            ], 201);

        } catch (\Exception $e) {
            Log::error("Paddle integration error: " . $e->getMessage());
            $payment->status = 'failed';
            $payment->save();
            return response()->json(['message' => 'Failed to initiate payment. Please try again later.'], 500);
        }
    }
}
