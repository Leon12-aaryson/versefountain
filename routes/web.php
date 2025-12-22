<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PoemController;
use App\Http\Controllers\PoemCommentController;
use App\Http\Controllers\CommentReactionController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\ChatMessageController;
use App\Http\Controllers\AcademicResourceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PaddleWebhookController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/poetry', [PoemController::class, 'index'])->name('poetry.index');

Route::get('/poetry/create', function () {
    return view('poetry.create');
})->middleware('auth')->name('poetry.create');

Route::get('/poetry/{poem}', [App\Http\Controllers\PoemController::class, 'show'])->name('poetry.show');

Route::get('/poetry/{poem}/edit', function ($poem) {
    return view('poetry.edit', compact('poem'));
})->middleware('auth')->name('poetry.edit');

Route::get('/books', [BookController::class, 'index'])->name('books.index');

Route::get('/books/{book}', [App\Http\Controllers\BookController::class, 'showWeb'])->name('books.show');

Route::get('/academics', [AcademicResourceController::class, 'index'])->name('academics.index');

Route::get('/academics/{resource}', [App\Http\Controllers\AcademicResourceController::class, 'show'])->name('academics.show');
Route::get('/academics/{resource}/download', [App\Http\Controllers\AcademicResourceController::class, 'download'])->name('academics.download');

Route::get('/events', [EventController::class, 'index'])->name('events.index');

// API-style routes (returning JSON) - Public routes
Route::get('/api/user', function () {
    $user = Auth::user();
    if (!$user) {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    }

    return response()->json([
        'user_id' => $user->id,
        'username' => $user->username,
        'email' => $user->email,
        'role' => $user->role,
    ]);
})->middleware('auth')->name('api.user');

// Public API routes (no auth required)
Route::get('/api/config/frontend', [ConfigController::class, 'getFrontendConfig'])->name('api.config.frontend');
Route::get('/api/config/environment', [ConfigController::class, 'getEnvironmentConfig'])->name('api.config.environment');
Route::get('/api/poems', [PoemController::class, 'index'])->name('api.poems.index');
Route::get('/api/books', [BookController::class, 'index'])->name('api.books.index');
Route::get('/api/events', [EventController::class, 'index'])->name('api.events.index');
Route::get('/api/academic-resources', [AcademicResourceController::class, 'index'])->name('api.academic-resources.index');
Route::get('/api/chat/rooms', [ChatRoomController::class, 'index'])->name('api.chat.rooms.index');
Route::get('/api/events/poetry', [EventController::class, 'poetryEvents'])->name('api.events.poetry');
Route::get('/api/events/{event}', [EventController::class, 'show'])->name('api.events.show');
Route::get('/api/poets/featured', [UserController::class, 'featuredPoets'])->name('api.poets.featured');

// Authentication API Routes
Route::post('/api/register', [RegisteredUserController::class, 'store'])->middleware('guest')->name('api.register');
Route::post('/api/login', [AuthenticatedSessionController::class, 'store'])->middleware('guest')->name('api.login');
Route::post('/api/forgot-password', [PasswordResetLinkController::class, 'store'])->middleware('guest')->name('api.password.email');
Route::post('/api/reset-password', [NewPasswordController::class, 'store'])->middleware('guest')->name('api.password.store');
Route::get('/api/verify-email/{id}/{hash}', VerifyEmailController::class)->middleware(['auth', 'signed', 'throttle:6,1'])->name('api.verification.verify');
Route::post('/api/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->middleware(['auth', 'throttle:6,1'])->name('api.verification.send');
Route::post('/api/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('api.logout');

// Protected Routes (require authentication)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Password update route
    Route::put('/password', function () {
        return redirect()->route('profile.edit')->with('status', 'password-updated');
    })->name('password.update');

    // Chat functionality
    Route::get('/chat/rooms', function () {
        return view('chatrooms');
    })->name('chatrooms.index');
    Route::get('/chat/rooms/{chatroom}', [App\Http\Controllers\ChatRoomController::class, 'show'])->name('chatroom.show');
    Route::post('/chat/rooms/{chatroom}/join', [App\Http\Controllers\ChatRoomController::class, 'joinRoom']);
    Route::post('/chat/rooms/{chatroom}/leave', [App\Http\Controllers\ChatRoomController::class, 'leaveRoom']);
    Route::post('/chat/rooms/{chatroom}/messages', [App\Http\Controllers\ChatMessageController::class, 'store']);
    Route::get('/chat/rooms/{chatroom}/messages', [App\Http\Controllers\ChatMessageController::class, 'index']);

    Route::get('/tickets', function () {
        return view('tickets');
    })->name('tickets.index');

    // Admin Dashboard Route
    Route::get('/admin-dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // API-style routes (returning JSON) - Authenticated routes
    // Poems
    Route::get('/api/poems/user', [PoemController::class, 'userPoems'])->name('api.poems.user');
    Route::post('/api/poems', [PoemController::class, 'store'])->name('api.poems.store');
    Route::patch('/api/poems/{poem}', [PoemController::class, 'update'])->name('api.poems.update');
    Route::get('/api/poems/{poem}', [PoemController::class, 'show'])->name('api.poems.show');
    Route::delete('/api/poems/{poem}', [PoemController::class, 'destroy'])->name('api.poems.destroy');
    Route::post('/api/poems/{poem}/rate', [PoemController::class, 'rate'])->name('api.poems.rate');
    Route::post('/api/poems/{poem}/like', [PoemController::class, 'like'])->name('api.poems.like');
    Route::post('/api/poems/{poem}/unlike', [PoemController::class, 'unlike'])->name('api.poems.unlike');
    Route::get('/api/poems/{poem}/user-status', [PoemController::class, 'getUserStatus'])->name('api.poems.user-status');
    Route::get('/api/poems/{poem}/likes', [PoemController::class, 'getLikeCount'])->name('api.poems.likes');

    // Poem Comments
    Route::post('/api/poems/{poem}/comments', [PoemCommentController::class, 'store'])->name('api.poems.comments.store');
    Route::get('/api/poems/{poem}/comments', [PoemCommentController::class, 'index'])->name('api.poems.comments.index');
    Route::delete('/api/poems/comments/{comment}', [PoemCommentController::class, 'destroy'])->name('api.poems.comments.destroy');

    // Comment Reactions
    Route::get('/api/comments/reactions', [CommentReactionController::class, 'userReactions'])->name('api.comments.reactions');
    Route::get('/api/comments/{comment}/user-reaction', [CommentReactionController::class, 'getUserReaction'])->name('api.comments.user-reaction');
    Route::post('/api/comments/{comment}/reactions', [CommentReactionController::class, 'storeOrUpdate'])->name('api.comments.reactions.store');
    Route::delete('/api/comments/{comment}/reactions', [CommentReactionController::class, 'destroy'])->name('api.comments.reactions.destroy');

    // Books
    Route::post('/api/books', [BookController::class, 'store'])->name('api.books.store');
    Route::get('/api/books/{book}', [BookController::class, 'show'])->name('api.books.show');
    Route::patch('/api/books/{book}', [BookController::class, 'update'])->name('api.books.update');
    Route::delete('/api/books/{book}', [BookController::class, 'destroy'])->name('api.books.destroy');
    Route::post('/api/books/{book}/upload-cover', [BookController::class, 'uploadCover'])->name('api.books.upload-cover');

    // Events
    Route::post('/api/events', [EventController::class, 'store'])->name('api.events.store');
    Route::put('/api/events/{event}', [EventController::class, 'update'])->name('api.events.update');
    Route::post('/api/events/{event}/register', [EventController::class, 'registerForEvent'])->name('api.events.register');
    Route::post('/api/events/{event}/unregister', [EventController::class, 'unregisterFromEvent'])->name('api.events.unregister');
    Route::get('/api/events/user-registrations', [EventController::class, 'userRegistrations'])->name('api.events.user-registrations');
    Route::get('/api/events/{event}/registration-status', [EventController::class, 'getRegistrationStatus'])->name('api.events.registration-status');
    Route::get('/api/events/{event}/participants', [EventController::class, 'getParticipants'])->name('api.events.participants');
    Route::get('/api/events/{event}/user-registration', [EventController::class, 'getUserRegistration'])->name('api.events.user-registration');

    // Chat
    Route::get('/api/user/chat/rooms', [ChatRoomController::class, 'userChatRooms'])->name('api.user.chat.rooms');
    Route::get('/api/chat/rooms/{room}', [ChatRoomController::class, 'apiShow'])->name('api.chat.rooms.show');
    Route::post('/api/chat/rooms', [ChatRoomController::class, 'store'])->name('api.chat.rooms.store');
    Route::post('/api/chat/rooms/{room}/messages', [ChatMessageController::class, 'store'])->name('api.chat.rooms.messages.store');
    Route::get('/api/chat/rooms/{room}/messages', [ChatMessageController::class, 'index'])->name('api.chat.rooms.messages.index');
    Route::post('/api/chat/rooms/{room}/join', [ChatRoomController::class, 'joinRoom'])->name('api.chat.rooms.join');
    Route::post('/api/chat/rooms/{room}/leave', [ChatRoomController::class, 'leaveRoom'])->name('api.chat.rooms.leave');
    Route::get('/api/chat/rooms/{room}/membership', [ChatRoomController::class, 'getMembershipStatus'])->name('api.chat.rooms.membership');

    // Academic Resources
    Route::post('/api/academic-resources', [AcademicResourceController::class, 'store'])->name('api.academic-resources.store');
    Route::get('/api/academic-resources/{academicResource}', [AcademicResourceController::class, 'show'])->name('api.academic-resources.show');
    Route::patch('/api/academic-resources/{academicResource}', [AcademicResourceController::class, 'update'])->name('api.academic-resources.update');
    Route::delete('/api/academic-resources/{academicResource}', [AcademicResourceController::class, 'destroy'])->name('api.academic-resources.destroy');
    Route::post('/api/academic-resources/{academicResource}/upload-file', [AcademicResourceController::class, 'uploadFile'])->name('api.academic-resources.upload-file');

    // Poets & Following
    Route::post('/api/poets/{user}/follow', [UserController::class, 'followPoet'])->name('api.poets.follow');
    Route::post('/api/poets/{user}/unfollow', [UserController::class, 'unfollowPoet'])->name('api.poets.unfollow');
    Route::get('/api/user/followed-poets', [UserController::class, 'followedPoets'])->name('api.user.followed-poets');
    Route::get('/api/poets/{user}/following-status', [UserController::class, 'getFollowingStatus'])->name('api.poets.following-status');

    // Tickets & Payments
    Route::post('/api/tickets', [TicketController::class, 'store'])->name('api.tickets.store');
    Route::get('/api/tickets', [TicketController::class, 'index'])->name('api.tickets.index');
    Route::get('/api/tickets/user', [TicketController::class, 'userTickets'])->name('api.tickets.user');
    Route::get('/api/tickets/{ticket}', [TicketController::class, 'show'])->name('api.tickets.show');
    Route::post('/api/payments', [PaymentController::class, 'store'])->name('api.payments.store');
    Route::post('/api/tickets/{ticket}/cancel', [TicketController::class, 'cancel'])->name('api.tickets.cancel');

    // Subscriptions
    Route::get('/api/subscriptions/plans', [SubscriptionController::class, 'getPlans'])->name('api.subscriptions.plans');
    Route::get('/api/subscriptions/current', [SubscriptionController::class, 'getCurrentSubscription'])->name('api.subscriptions.current');
    Route::get('/api/subscriptions/history', [SubscriptionController::class, 'getSubscriptionHistory'])->name('api.subscriptions.history');
    Route::post('/api/subscriptions/checkout', [SubscriptionController::class, 'createCheckout'])->name('api.subscriptions.checkout');
    Route::post('/api/subscriptions/cancel', [SubscriptionController::class, 'cancelSubscription'])->name('api.subscriptions.cancel');
    Route::post('/api/subscriptions/reactivate', [SubscriptionController::class, 'reactivateSubscription'])->name('api.subscriptions.reactivate');
    Route::post('/api/subscriptions/update-payment-method', [SubscriptionController::class, 'updatePaymentMethod'])->name('api.subscriptions.update-payment-method');
    Route::get('/api/subscriptions/usage', [SubscriptionController::class, 'getUsageStats'])->name('api.subscriptions.usage');
});

// Admin Routes
Route::middleware(['auth'])->prefix('api/admin')->group(function () {
    Route::get('users', [AdminController::class, 'getUsers'])->name('api.admin.users');
    Route::patch('users/{user}', [AdminController::class, 'updateUser'])->name('api.admin.users.update');
    Route::delete('users/{user}', [AdminController::class, 'deleteUser'])->name('api.admin.users.delete');
    Route::get('pending/books', [AdminController::class, 'getPendingBooks'])->name('api.admin.pending.books');
    Route::get('pending/poems', [AdminController::class, 'getPendingPoems'])->name('api.admin.pending.poems');
    Route::patch('books/{book}/approve', [AdminController::class, 'approveBook'])->name('api.admin.books.approve');
    Route::delete('books/{book}', [AdminController::class, 'deleteBook'])->name('api.admin.books.delete');
    Route::post('poems/{poem}/approve', [PoemController::class, 'approve'])->name('api.admin.poems.approve');
    Route::delete('poems/{poem}', [AdminController::class, 'deletePoem'])->name('api.admin.poems.delete');
    Route::patch('payments/{payment}/status', [AdminController::class, 'updatePaymentStatus'])->name('api.admin.payments.status');
    Route::patch('payments/{payment}/refund', [AdminController::class, 'refundPayment'])->name('api.admin.payments.refund');
    Route::patch('tickets/{ticket}/status', [AdminController::class, 'updateTicketStatus'])->name('api.admin.tickets.status');
    Route::get('tickets/event/{event}', [AdminController::class, 'getTicketsForEvent'])->name('api.admin.tickets.event');
});

// Paddle Webhook (no auth required)
Route::post('/api/paddle/webhook', [PaddleWebhookController::class, 'handleWebhook'])->name('api.paddle.webhook');

// Auth Routes
require __DIR__ . '/auth.php';
