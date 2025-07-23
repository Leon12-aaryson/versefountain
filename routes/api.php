<?php

use Illuminate\Support\Facades\Route;
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

// Authentication Routes
Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('guest')->name('register');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('guest')->name('login');
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->middleware('guest')->name('password.email');
Route::post('/reset-password', [NewPasswordController::class, 'store'])->middleware('guest')->name('password.store');
Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)->middleware(['auth', 'signed', 'throttle:6,1'])->name('verification.verify');
Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->middleware(['auth', 'throttle:6,1'])->name('verification.send');
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');

use Illuminate\Support\Facades\Auth;

Route::get('/user', function () {
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
})->middleware('auth:sanctum')->name('user');

// PUBLIC ROUTES (no auth required)
Route::get('/config/frontend', [ConfigController::class, 'getFrontendConfig']);
Route::get('/config/environment', [ConfigController::class, 'getEnvironmentConfig']);
Route::get('/poems', [PoemController::class, 'index']);
Route::get('/books', [BookController::class, 'index']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/academic-resources', [AcademicResourceController::class, 'index']);
Route::get('/chat/rooms', [ChatRoomController::class, 'index']);
Route::get('events/poetry', [EventController::class, 'poetryEvents']);
Route::get('events/{event}', [EventController::class, 'show']);
Route::get('poets/featured', [UserController::class, 'featuredPoets']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // Poems
    Route::get('poems/user', [PoemController::class, 'userPoems']);
    Route::post('poems', [PoemController::class, 'store']);
    Route::patch('poems/{poem}', [PoemController::class, 'update']);
    Route::get('poems/{poem}', [PoemController::class, 'show']);
    Route::delete('poems/{poem}', [PoemController::class, 'destroy']);
    Route::post('poems/{poem}/rate', [PoemController::class, 'rate']);
    Route::post('poems/{poem}/like', [PoemController::class, 'like']);
    Route::post('poems/{poem}/unlike', [PoemController::class, 'unlike']);
    Route::get('poems/{poem}/user-status', [PoemController::class, 'getUserStatus']);
    Route::get('poems/{poem}/likes', [PoemController::class, 'getLikeCount']);
    Route::get('poems/{poem}/status', [PoemController::class, 'getUserStatus']);

    // Poem Comments
    Route::post('poems/{poem}/comments', [PoemCommentController::class, 'store']);
    Route::get('poems/{poem}/comments', [PoemCommentController::class, 'index']);
    Route::delete('poems/comments/{comment}', [PoemCommentController::class, 'destroy']);

    // Comment Reactions
    Route::get('comments/reactions', [CommentReactionController::class, 'userReactions']);
    Route::get('comments/{comment}/user-reaction', [CommentReactionController::class, 'getUserReaction']);
    Route::post('comments/{comment}/reactions', [CommentReactionController::class, 'storeOrUpdate']);
    Route::delete('comments/{comment}/reactions', [CommentReactionController::class, 'destroy']);

    // Books
    Route::post('books', [BookController::class, 'store']);
    Route::get('books/{book}', [BookController::class, 'show']);
    Route::patch('books/{book}', [BookController::class, 'update']);
    Route::delete('books/{book}', [BookController::class, 'destroy']);
    Route::post('books/{book}/upload-cover', [BookController::class, 'uploadCover']);

    // Events
    Route::post('events', [EventController::class, 'store']);
    Route::put('events/{event}', [EventController::class, 'update']);
    Route::post('events', [EventController::class, 'store']);
    Route::post('events/{event}/register', [EventController::class, 'registerForEvent']);
    Route::post('events/{event}/unregister', [EventController::class, 'unregisterFromEvent']);
    Route::get('events/user-registrations', [EventController::class, 'userRegistrations']);
    Route::get('events/{event}/registration-status', [EventController::class, 'getRegistrationStatus']);
    Route::get('events/{event}/participants', [EventController::class, 'getParticipants']);
    Route::get('events/{event}/user-registration', [EventController::class, 'getUserRegistration']);

    // Chat
    Route::get('user/chat/rooms', [ChatRoomController::class, 'userChatRooms']);
    Route::post('chat/rooms', [ChatRoomController::class, 'store']);
    Route::post('chat/rooms/{room}/messages', [ChatMessageController::class, 'store']);
    Route::get('chat/rooms/{room}/messages', [ChatMessageController::class, 'index']);
    Route::post('chat/rooms/{room}/join', [ChatRoomController::class, 'joinRoom']);
    Route::post('chat/rooms/{room}/leave', [ChatRoomController::class, 'leaveRoom']);
    Route::get('chat/rooms/{room}/membership', [ChatRoomController::class, 'getMembershipStatus']);

    // Academic Resources
    Route::post('academic-resources', [AcademicResourceController::class, 'store']);
    Route::get('academic-resources/{academicResource}', [AcademicResourceController::class, 'show']);
    Route::patch('academic-resources/{academicResource}', [AcademicResourceController::class, 'update']);
    Route::delete('academic-resources/{academicResource}', [AcademicResourceController::class, 'destroy']);
    Route::post('academic-resources/{academicResource}/upload-file', [AcademicResourceController::class, 'uploadFile']);

    // Poets & Following
    Route::post('poets/{user}/follow', [UserController::class, 'followPoet']);
    Route::post('poets/{user}/unfollow', [UserController::class, 'unfollowPoet']);
    Route::get('user/followed-poets', [UserController::class, 'followedPoets']);
    Route::get('poets/{user}/following-status', [UserController::class, 'getFollowingStatus']);

    // Tickets & Payments
    Route::post('tickets', [TicketController::class, 'store']);
    Route::get('tickets', [TicketController::class, 'index']);
    Route::get('tickets/user', [TicketController::class, 'userTickets']);
    Route::get('tickets/{ticket}', [TicketController::class, 'show']);
    Route::post('payments', [PaymentController::class, 'store']);
    Route::post('tickets/{ticket}/cancel', [TicketController::class, 'cancel']);

    // Subscriptions
    Route::get('subscriptions/plans', [SubscriptionController::class, 'getPlans']);
    Route::get('subscriptions/current', [SubscriptionController::class, 'getCurrentSubscription']);
    Route::get('subscriptions/history', [SubscriptionController::class, 'getSubscriptionHistory']);
    Route::post('subscriptions/checkout', [SubscriptionController::class, 'createCheckout']);
    Route::post('subscriptions/cancel', [SubscriptionController::class, 'cancelSubscription']);
    Route::post('subscriptions/reactivate', [SubscriptionController::class, 'reactivateSubscription']);
    Route::post('subscriptions/update-payment-method', [SubscriptionController::class, 'updatePaymentMethod']);
    Route::get('subscriptions/usage', [SubscriptionController::class, 'getUsageStats']);
});

// Admin Routes
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('users', [AdminController::class, 'getUsers']);
    Route::patch('users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('users/{user}', [AdminController::class, 'deleteUser']);
    Route::get('pending/books', [AdminController::class, 'getPendingBooks']);
    Route::get('pending/poems', [AdminController::class, 'getPendingPoems']);
    Route::patch('books/{book}/approve', [AdminController::class, 'approveBook']);
    Route::delete('books/{book}', [AdminController::class, 'deleteBook']);
    Route::post('poems/{poem}/approve', [PoemController::class, 'approve']);
    Route::delete('poems/{poem}', [AdminController::class, 'deletePoem']);
    Route::patch('payments/{payment}/status', [AdminController::class, 'updatePaymentStatus']);
    Route::patch('payments/{payment}/refund', [AdminController::class, 'refundPayment']);
    Route::patch('tickets/{ticket}/status', [AdminController::class, 'updateTicketStatus']);
    Route::get('tickets/event/{event}', [AdminController::class, 'getTicketsForEvent']);
});

// Paddle Webhook
Route::post('paddle/webhook', [PaddleWebhookController::class, 'handleWebhook']);


