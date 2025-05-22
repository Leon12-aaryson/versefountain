<?php
// app/Models/Payment.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',             // Updated to snake_case
        'event_id',            // Updated to snake_case
        'amount',
        'currency',
        'status',
        'paddle_payment_id',   // Updated to snake_case
        'paddle_transaction_id', // Updated to snake_case
        'refund_reason',       // Updated to snake_case
    ];

    protected $casts = [
        'created_at' => 'datetime', // Laravel's default
        'updated_at' => 'datetime', // Laravel's default
    ];

    // Laravel's `timestamps()` in migration adds `created_at` and `updated_at`.
    // If you want to use `createdAt` and `updatedAt` as per your schema,
    // you need to map them:
    // const CREATED_AT = 'createdAt';
    // const UPDATED_AT = 'updatedAt';

    /**
     * Get the user who made the payment.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the event for which the payment was made.
     */
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id'); // Updated to snake_case
    }

    /**
     * Get the tickets associated with this payment.
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'payment_id'); // Updated to snake_case
    }
}
