<?php
// app/Http/Controllers/AdminController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Book;
use App\Models\Poem;
use App\Models\Ticket;
use App\Models\Payment;
use App\Models\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth; // Added for Auth::user() check
use Illuminate\Support\Facades\Log; // For logging

class AdminController extends Controller
{
    // All methods in this controller should implicitly be protected by an 'isAdmin' middleware
    // or a policy that checks for admin role.

    /**
     * Show the admin dashboard.
     */
    public function dashboard()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Admin access required.');
        }

        // Get dashboard statistics
        $stats = [
            'total_users' => User::count(),
            'pending_books' => Book::where('approved', false)->count(),
            'pending_poems' => Poem::where('approved', false)->count(),
            'total_tickets' => Ticket::count(),
            'recent_payments' => Payment::latest()->take(5)->get(),
        ];

        return view('admin.dashboard', compact('stats'));
    }

    /**
     * Retrieve a list of all registered users.
     */
    public function getUsers()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }
        // Exclude sensitive data like password hash
        $users = \App\Models\User::all(['id', 'username', 'email', 'role', 'created_at']);
        return response()->json($users);
    }

    /**
     * Update a user's information.
     */
    public function updateUser(Request $request, User $user)
    {
        $currentUser = Auth::user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }

        $validatedData = $request->validate([
            'username' => ['sometimes', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'isAdmin' => ['sometimes', 'boolean'],
            'password' => ['sometimes', 'string', 'min:8', 'confirmed'], // 'confirmed' checks for password_confirmation
        ]);

        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($validatedData);

        return response()->json($user->only(['id', 'username', 'email', 'isAdmin']));
    }

    /**
     * Delete a user account.
     */
    public function deleteUser(User $user)
    {
        $currentUser = Auth::user();
        if (!$currentUser || $currentUser->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }

        if ($currentUser->id === $user->id) {
            return response()->json(['message' => 'Admins cannot delete their own account via this endpoint.'], 403);
        }

        $user->delete();
        return response()->json(null, 204);
    }

    /**
     * Retrieve a list of books that are awaiting administrative approval.
     */
    public function getPendingBooks()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }
        $books = Book::where('approved', false)->get();
        return response()->json($books);
    }

    /**
     * Retrieve a list of poems that are awaiting administrative approval.
     */
    public function getPendingPoems()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }
        $poems = Poem::where('approved', false)->get();
        return response()->json($poems);
    }

    /**
     * Approve a book.
     */
    public function approveBook(Book $book)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }
        $book->approved = true;
        $book->save();
        return response()->json($book);
    }

    /**
     * Delete a book.
     */
    public function deleteBook(Book $book)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }
        $book->delete();
        return response()->json(null, 204);
    }

    /**
     * Delete a poem.
     * Note: PoemController also has a destroy method, this is for admin to delete any poem.
     */
    public function deletePoem(Poem $poem)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }
        $poem->delete();
        return response()->json(null, 204);
    }

    /**
     * Update the status of a payment.
     */
    public function updatePaymentStatus(Request $request, Payment $payment)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }

        $validatedData = $request->validate([
            'status' => ['required', 'string', Rule::in(['pending', 'completed', 'refunded', 'failed'])],
            'paddlePaymentId' => ['nullable', 'string'],
            'paddleTransactionId' => ['nullable', 'string'],
            'refundReason' => ['nullable', 'string'],
        ]);

        $payment->update($validatedData);
        return response()->json($payment);
    }

    /**
     * Initiate a refund for a payment.
     */
    public function refundPayment(Request $request, Payment $payment)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }

        if ($payment->status === 'refunded') {
            return response()->json(['message' => 'Payment is already refunded.'], 409);
        }

        $request->validate([
            'refundReason' => 'nullable|string',
        ]);

        // --- Integration with Paddle (or other payment gateway) to actually process refund ---
        try {
            // Example: Call Paddle API to process refund
            // PaddleService::processRefund($payment->paddlePaymentId, $request->refundReason);

            $payment->status = 'refunded';
            $payment->refundReason = $request->refundReason ?? 'Admin initiated refund.';
            $payment->save();

            // Also update associated tickets to refunded status
            Ticket::where('payment_id', $payment->id)->update(['isRefunded' => true, 'status' => 'cancelled']);

            return response()->json($payment);
        } catch (\Exception $e) {
            Log::error("Refund processing error for payment ID {$payment->id}: " . $e->getMessage());
            return response()->json(['message' => 'Failed to process refund.'], 500);
        }
    }

    /**
     * Update the status of a ticket.
     */
    public function updateTicketStatus(Request $request, Ticket $ticket)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }

        $validatedData = $request->validate([
            'status' => ['required', 'string', Rule::in(['active', 'cancelled', 'used'])],
        ]);

        $ticket->update($validatedData);
        return response()->json($ticket);
    }

    /**
     * Retrieve all tickets associated with a specific event.
     */
    public function getTicketsForEvent(Event $event)
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Forbidden. Admin access required.'], 403);
        }
        $tickets = $event->tickets()->with('user:id,username')->get();
        return response()->json($tickets);
    }
}
