<?php
// app/Http/Controllers/EventController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    /**
     * Retrieve a list of all events, optionally filtered and paginated.
     */
    public function index(Request $request)
    {
        $query = Event::query();

        if ($request->has('category')) {
            $request->validate(['category' => 'string|in:poetry,book_launch,workshop,lecture,general']);
            $query->where('category', $request->category);
        }
        if ($request->boolean('upcoming')) {
            $query->where('date', '>', now());
        }
        if ($request->boolean('isVirtual')) {
            $query->where('isVirtual', true);
        }
        if ($request->boolean('isFree')) {
            $query->where('isFree', true);
        }

        $limit = $request->input('limit', 10);
        $offset = $request->input('offset', 0);

        $events = $query->orderBy('date', 'asc')
                        ->offset($offset)
                        ->limit($limit)
                        ->get();

        return response()->json($events);
    }

    /**
     * Retrieve a list of events specifically categorized as "poetry".
     */
    public function poetryEvents(Request $request)
    {
        $limit = $request->input('limit', 3);
        $events = Event::where('category', 'poetry')
            ->orderBy('date', 'asc')
            ->limit($limit)
            ->get();
        return response()->json($events);
    }

    /**
     * Retrieve a single event by its ID.
     */
    public function show(Event $event)
    {
        return response()->json($event);
    }

    /**
     * Create a new event.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Authorization: only admins or specific event creators can create events
        // For simplicity, assuming any authenticated user can create for now,
        // but you might add a policy check here: $this->authorize('create', Event::class);

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'ticketPrice' => 'nullable|integer|min:0',
            'organizer' => 'nullable|string|max:255',
            'isVirtual' => 'boolean',
            'streamUrl' => 'nullable|url|required_if:isVirtual,true',
            'isFree' => 'boolean',
            'category' => ['nullable', 'string', Rule::in(['poetry', 'book_launch', 'workshop', 'lecture', 'general'])],
        ]);

        // Set created_by_id from authenticated user
        $validatedData['created_by_id'] = $user->id;

        // Ensure isFree aligns with ticketPrice if not explicitly set
        if (!isset($validatedData['isFree'])) {
            $validatedData['isFree'] = ($validatedData['ticketPrice'] ?? 0) === 0;
        }

        $event = Event::create($validatedData);

        return response()->json($event, 201);
    }

    /**
     * Update an existing event.
     */
    public function update(Request $request, Event $event)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Authorization check
        if ($user->id !== $event->created_by_id && !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. You did not create this event or are not an administrator.'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'date' => 'sometimes|required|date',
            'location' => 'sometimes|required|string|max:255',
            'ticketPrice' => 'sometimes|nullable|integer|min:0',
            'organizer' => 'sometimes|nullable|string|max:255',
            'isVirtual' => 'sometimes|boolean',
            'streamUrl' => 'nullable|url|required_if:isVirtual,true',
            'isFree' => 'sometimes|boolean',
            'category' => ['sometimes', 'nullable', 'string', Rule::in(['poetry', 'book_launch', 'workshop', 'lecture', 'general'])],
        ]);

        // Ensure isFree aligns with ticketPrice if both are updated
        if (isset($validatedData['isFree']) && isset($validatedData['ticketPrice'])) {
            if ($validatedData['isFree'] && $validatedData['ticketPrice'] > 0) {
                return response()->json(['message' => 'Free event cannot have a ticket price greater than 0.'], 400);
            }
            if (!$validatedData['isFree'] && ($validatedData['ticketPrice'] ?? 0) === 0) {
                 return response()->json(['message' => 'Non-free event must have a ticket price greater than 0.'], 400);
            }
        } elseif (isset($validatedData['isFree']) && !isset($validatedData['ticketPrice'])) {
            // If only isFree is updated, ensure it aligns with current ticketPrice
            if ($validatedData['isFree'] && $event->ticketPrice > 0) {
                return response()->json(['message' => 'Cannot set event as free if it has an existing ticket price.'], 400);
            }
        } elseif (!isset($validatedData['isFree']) && isset($validatedData['ticketPrice'])) {
            // If only ticketPrice is updated, ensure it aligns with current isFree
            if (($validatedData['ticketPrice'] ?? 0) > 0 && $event->isFree) {
                return response()->json(['message' => 'Cannot set ticket price if event is free.'], 400);
            }
        }

        $event->update($validatedData);

        return response()->json($event);
    }

    /**
     * Delete an event.
     */
    public function destroy(Event $event)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Authorization check
        if ($user->id !== $event->created_by_id && !$user->isAdmin) {
            return response()->json(['message' => 'Forbidden. You did not create this event or are not an administrator.'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully.']);
    }
    /**
     * Retrieve events created by the authenticated user.
     */
    public function userEvents(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $events = Event::where('created_by_id', $user->id)
                       ->orderBy('date', 'asc')
                       ->paginate($request->input('limit', 10));

        return response()->json($events);
    }
}
