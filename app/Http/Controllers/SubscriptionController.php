<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class SubscriptionController extends Controller
{
    /**
     * Get available subscription plans.
     */
    public function getPlans()
    {
        $plans = [
            [
                'id' => 'basic_monthly',
                'name' => 'Basic Monthly',
                'type' => 'monthly',
                'amount' => 999, // $9.99 in cents
                'currency' => 'USD',
                'features' => [
                    'unlimited_poems',
                    'basic_analytics',
                    'community_access'
                ],
                'description' => 'Perfect for poets getting started'
            ],
            [
                'id' => 'basic_yearly',
                'name' => 'Basic Yearly',
                'type' => 'yearly',
                'amount' => 9999, // $99.99 in cents (2 months free)
                'currency' => 'USD',
                'features' => [
                    'unlimited_poems',
                    'basic_analytics',
                    'community_access'
                ],
                'description' => 'Save 17% with yearly billing'
            ],
            [
                'id' => 'premium_monthly',
                'name' => 'Premium Monthly',
                'type' => 'monthly',
                'amount' => 1999, // $19.99 in cents
                'currency' => 'USD',
                'features' => [
                    'unlimited_poems',
                    'advanced_analytics',
                    'priority_support',
                    'custom_themes',
                    'advanced_editing_tools',
                    'priority_featuring'
                ],
                'description' => 'For serious poets and writers'
            ],
            [
                'id' => 'premium_yearly',
                'name' => 'Premium Yearly',
                'type' => 'yearly',
                'amount' => 19999, // $199.99 in cents (2 months free)
                'currency' => 'USD',
                'features' => [
                    'unlimited_poems',
                    'advanced_analytics',
                    'priority_support',
                    'custom_themes',
                    'advanced_editing_tools',
                    'priority_featuring'
                ],
                'description' => 'Save 17% with yearly billing'
            ]
        ];

        return response()->json($plans);
    }

    /**
     * Get user's current subscription.
     */
    public function getCurrentSubscription()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $subscription = $user->activeSubscription()->with('user:id,username,email')->first();

        if (!$subscription) {
            return response()->json(['message' => 'No active subscription found.'], 404);
        }

        return response()->json($subscription);
    }

    /**
     * Get user's subscription history.
     */
    public function getSubscriptionHistory()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $subscriptions = $user->subscriptions()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($subscriptions);
    }

    /**
     * Create a new subscription checkout session.
     */
    public function createCheckout(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validatedData = $request->validate([
            'plan_id' => 'required|string',
            'success_url' => 'nullable|url',
            'cancel_url' => 'nullable|url',
        ]);

        // Parse plan ID to get plan details
        $planParts = explode('_', $validatedData['plan_id']);
        if (count($planParts) !== 2) {
            return response()->json(['message' => 'Invalid plan ID.'], 400);
        }

        [$planName, $planType] = $planParts;

        // Get plan details
        $plans = $this->getPlansData();
        $plan = collect($plans)->firstWhere('id', $validatedData['plan_id']);

        if (!$plan) {
            return response()->json(['message' => 'Invalid plan.'], 400);
        }

        // Check if user already has an active subscription
        $existingSubscription = $user->activeSubscription;
        if ($existingSubscription) {
            return response()->json([
                'message' => 'You already have an active subscription.',
                'subscription' => $existingSubscription
            ], 409);
        }

        // Create a pending subscription record
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_name' => $planName,
            'plan_type' => $planType,
            'amount' => $plan['amount'],
            'currency' => $plan['currency'],
            'status' => 'pending',
            'features' => $plan['features'],
        ]);

        // Return checkout data for frontend to use with Paddle
        return response()->json([
            'message' => 'Checkout session created.',
            'subscription' => $subscription,
            'checkout_data' => [
                'plan_id' => $validatedData['plan_id'],
                'amount' => $plan['amount'],
                'currency' => $plan['currency'],
                'plan_name' => $plan['name'],
                'features' => $plan['features'],
                'success_url' => $validatedData['success_url'] ?? config('app.url') . '/subscription/success',
                'cancel_url' => $validatedData['cancel_url'] ?? config('app.url') . '/subscription/cancel',
            ]
        ], 201);
    }

    /**
     * Cancel a subscription.
     */
    public function cancelSubscription(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $subscription = $user->activeSubscription;
        if (!$subscription) {
            return response()->json(['message' => 'No active subscription found.'], 404);
        }

        $validatedData = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        // Cancel the subscription
        $subscription->cancel($validatedData['reason'] ?? null);

        // TODO: Call Paddle API to cancel subscription on their end
        // This would typically involve making an API call to Paddle

        return response()->json([
            'message' => 'Subscription cancelled successfully.',
            'subscription' => $subscription->fresh()
        ]);
    }

    /**
     * Reactivate a cancelled subscription.
     */
    public function reactivateSubscription()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $subscription = $user->subscriptions()
            ->whereNotNull('cancelled_at')
            ->where('ends_at', '>', now())
            ->first();

        if (!$subscription) {
            return response()->json(['message' => 'No reactivatable subscription found.'], 404);
        }

        // Reactivate the subscription
        $subscription->reactivate();

        // TODO: Call Paddle API to reactivate subscription on their end

        return response()->json([
            'message' => 'Subscription reactivated successfully.',
            'subscription' => $subscription->fresh()
        ]);
    }

    /**
     * Update subscription payment method.
     */
    public function updatePaymentMethod(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $subscription = $user->activeSubscription;
        if (!$subscription) {
            return response()->json(['message' => 'No active subscription found.'], 404);
        }

        // TODO: Implement payment method update logic
        // This would typically involve calling Paddle's API to update payment method

        return response()->json([
            'message' => 'Payment method update initiated.',
            'subscription' => $subscription
        ]);
    }

    /**
     * Get subscription usage statistics.
     */
    public function getUsageStats()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $subscription = $user->activeSubscription;
        if (!$subscription) {
            return response()->json(['message' => 'No active subscription found.'], 404);
        }

        // Calculate usage based on subscription features
        $usage = [
            'poems_uploaded' => $user->poems()->count(),
            'books_uploaded' => $user->uploadedBooks()->count(),
            'events_created' => $user->createdEvents()->count(),
            'subscription_days_remaining' => $subscription->nextBillingDate() 
                ? $subscription->nextBillingDate()->diffInDays(now()) 
                : 0,
        ];

        return response()->json([
            'subscription' => $subscription,
            'usage' => $usage
        ]);
    }

    /**
     * Get plan data for internal use.
     */
    private function getPlansData()
    {
        return [
            [
                'id' => 'basic_monthly',
                'name' => 'Basic Monthly',
                'type' => 'monthly',
                'amount' => 999,
                'currency' => 'USD',
                'features' => [
                    'unlimited_poems',
                    'basic_analytics',
                    'community_access'
                ]
            ],
            [
                'id' => 'basic_yearly',
                'name' => 'Basic Yearly',
                'type' => 'yearly',
                'amount' => 9999,
                'currency' => 'USD',
                'features' => [
                    'unlimited_poems',
                    'basic_analytics',
                    'community_access'
                ]
            ],
            [
                'id' => 'premium_monthly',
                'name' => 'Premium Monthly',
                'type' => 'monthly',
                'amount' => 1999,
                'currency' => 'USD',
                'features' => [
                    'unlimited_poems',
                    'advanced_analytics',
                    'priority_support',
                    'custom_themes',
                    'advanced_editing_tools',
                    'priority_featuring'
                ]
            ],
            [
                'id' => 'premium_yearly',
                'name' => 'Premium Yearly',
                'type' => 'yearly',
                'amount' => 19999,
                'currency' => 'USD',
                'features' => [
                    'unlimited_poems',
                    'advanced_analytics',
                    'priority_support',
                    'custom_themes',
                    'advanced_editing_tools',
                    'priority_featuring'
                ]
            ]
        ];
    }
}
