<?php
// app/Http/Controllers/TicketController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str; // For generating ticket codes
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    /**
     * Display a listing of the tickets for a specific event.
     */
    public function index(Request $request, Event $event = null)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        if ($user->isAdmin) {
            // Admin: return all tickets with event and user info
            $tickets = Ticket::with('event', 'user')->get();
        } else {
            // Regular user: only their tickets
            $tickets = $user->tickets()->with('event')->get();
        }

        return response()->json($tickets);
    }

    /**
     * Register a user for a free event, or potentially create a ticket linked to an existing payment.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $validatedData = $request->validate([
            'event_id' => 'required|exists:events,id',
            'payment_id' => 'nullable|exists:payments,id', // Optional for paid events
        ]);

        // Load event with relationships in a single query
        $event = Event::with('tickets')->find($validatedData['event_id']);

        if (!$event) {
            return response()->json(['message' => 'Event not found.'], 404);
        }

        // If event is not free, a payment_id must be provided and valid
        if (!$event->isFree && !isset($validatedData['payment_id'])) {
            return response()->json(['message' => 'Payment ID is required for paid events.'], 400);
        }
        // Further check: if payment_id is provided, ensure it's for this user and event and is completed
        if (isset($validatedData['payment_id'])) {
            $payment = $user->payments()
                ->where('id', $validatedData['payment_id'])
                ->where('event_id', $event->id)
                ->where('status', 'completed')
                ->first();
            if (!$payment) {
                return response()->json(['message' => 'Invalid or incomplete payment for this event.'], 400);
            }
        }

        // Prevent duplicate tickets - use eager loaded relationship if available, otherwise query
        $hasTicket = $event->tickets->contains(function ($ticket) use ($user) {
            return $ticket->user_id === $user->id;
        });
        
        if (!$hasTicket) {
            // Double check with query in case relationship wasn't fully loaded
            $hasTicket = Ticket::where('user_id', $user->id)
                ->where('event_id', $event->id)
                ->exists();
        }
        
        if ($hasTicket) {
            return response()->json(['message' => 'You already have a ticket for this event.'], 409);
        }

        $ticketCode = Str::random(16); // Generate a unique ticket code

        $ticket = Ticket::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'ticketCode' => $ticketCode,
            'payment_id' => $validatedData['payment_id'] ?? null,
            'status' => 'active',
            'isRefunded' => false,
        ]);

        return response()->json($ticket, 201);
    }

    /**
     * Retrieve all tickets belonging to the currently authenticated user.
     */
    public function userTickets(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $tickets = $user->tickets()->with('event')->get();
        return response()->json($tickets);
    }

    /**
     * Retrieve a single ticket by its ID.
     */
    public function show(Ticket $ticket)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Authorize: user must own the ticket or be an admin
        if ($user->id !== $ticket->user_id && !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. You do not have access to this ticket.'], 403);
        }

        return response()->json($ticket->load('event', 'user'));
    }

    /**
     * Cancel a user's ticket for an event.
     */
    public function cancel(Ticket $ticket)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Authorize: user must own the ticket or be an admin
        if ($user->id !== $ticket->user_id && !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. You do not have permission to cancel this ticket.'], 403);
        }

        if ($ticket->status === 'cancelled') {
            return response()->json(['message' => 'Ticket is already cancelled.'], 409);
        }

        $ticket->status = 'cancelled';
        $ticket->save();

        // If the ticket was paid for and not yet refunded, you might want to initiate a refund here.
        // This would involve calling a method on the PaymentController or a PaymentService.
        // Example: if ($ticket->payment && !$ticket->isRefunded) { /* initiate refund logic */ }

        return response()->json($ticket);
    }
}
