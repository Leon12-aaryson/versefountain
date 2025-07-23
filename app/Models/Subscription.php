<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'paddle_subscription_id',
        'paddle_customer_id',
        'plan_name',
        'plan_type',
        'amount',
        'currency',
        'status',
        'trial_ends_at',
        'current_period_start',
        'current_period_end',
        'cancelled_at',
        'ends_at',
        'auto_renew',
        'features',
        'cancellation_reason',
    ];

    protected $casts = [
        'trial_ends_at' => 'datetime',
        'current_period_start' => 'datetime',
        'current_period_end' => 'datetime',
        'cancelled_at' => 'datetime',
        'ends_at' => 'datetime',
        'auto_renew' => 'boolean',
        'features' => 'array',
    ];

    /**
     * Get the user who owns the subscription.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the subscription is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && 
               ($this->ends_at === null || $this->ends_at->isFuture());
    }

    /**
     * Check if the subscription is on trial.
     */
    public function onTrial(): bool
    {
        return $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }

    /**
     * Check if the subscription is cancelled.
     */
    public function cancelled(): bool
    {
        return $this->cancelled_at !== null;
    }

    /**
     * Check if the subscription has a specific feature.
     */
    public function hasFeature(string $feature): bool
    {
        if (!$this->features) {
            return false;
        }

        return in_array($feature, $this->features);
    }

    /**
     * Get the next billing date.
     */
    public function nextBillingDate(): ?Carbon
    {
        if ($this->cancelled() || !$this->isActive()) {
            return null;
        }

        return $this->current_period_end;
    }

    /**
     * Cancel the subscription.
     */
    public function cancel(string $reason = null): void
    {
        $this->update([
            'cancelled_at' => now(),
            'ends_at' => $this->current_period_end,
            'cancellation_reason' => $reason,
        ]);
    }

    /**
     * Reactivate a cancelled subscription.
     */
    public function reactivate(): void
    {
        $this->update([
            'cancelled_at' => null,
            'ends_at' => null,
            'cancellation_reason' => null,
        ]);
    }

    /**
     * Update subscription status from Paddle webhook.
     */
    public function updateFromPaddle(array $data): void
    {
        $this->update([
            'status' => $data['status'] ?? $this->status,
            'current_period_start' => isset($data['current_period_start']) 
                ? Carbon::parse($data['current_period_start']) 
                : $this->current_period_start,
            'current_period_end' => isset($data['current_period_end']) 
                ? Carbon::parse($data['current_period_end']) 
                : $this->current_period_end,
            'trial_ends_at' => isset($data['trial_ends_at']) 
                ? Carbon::parse($data['trial_ends_at']) 
                : $this->trial_ends_at,
            'cancelled_at' => isset($data['cancelled_at']) 
                ? Carbon::parse($data['cancelled_at']) 
                : $this->cancelled_at,
            'ends_at' => isset($data['ends_at']) 
                ? Carbon::parse($data['ends_at']) 
                : $this->ends_at,
        ]);
    }

    /**
     * Scope to get active subscriptions.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where(function ($q) {
                        $q->whereNull('ends_at')
                          ->orWhere('ends_at', '>', now());
                    });
    }

    /**
     * Scope to get cancelled subscriptions.
     */
    public function scopeCancelled($query)
    {
        return $query->whereNotNull('cancelled_at');
    }

    /**
     * Scope to get subscriptions on trial.
     */
    public function scopeOnTrial($query)
    {
        return $query->whereNotNull('trial_ends_at')
                    ->where('trial_ends_at', '>', now());
    }
}
