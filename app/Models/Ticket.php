<?php
// app/Models/Ticket.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',      // Updated to snake_case
        'user_id',       // Updated to snake_case
        'purchase_date', // Updated to snake_case
        'ticket_code',   // Updated to snake_case
        'status',
        'payment_id',    // Updated to snake_case
        'is_refunded',   // Updated to snake_case
    ];

    protected $casts = [
        'purchase_date' => 'datetime', // Updated to snake_case
        'is_refunded' => 'boolean',    // Updated to snake_case
    ];

    /**
     * Get the event associated with this ticket.
     */
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id'); // Updated to snake_case
    }

    /**
     * Get the user who purchased this ticket.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Updated to snake_case
    }

    /**
     * Get the payment associated with this ticket.
     */
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id'); // Updated to snake_case
    }
}
