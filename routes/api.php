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
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

// Public Routes
Route::get('poems', [PoemController::class, 'index']);
Route::get('poems/{poem}', [PoemController::class, 'show']);
Route::get('poems/{poem}/like-count', [PoemController::class, 'getLikeCount']);
Route::get('poems/{poem}/comments', [PoemCommentController::class, 'index']);
Route::get('comments/{comment}/reactions', [CommentReactionController::class, 'index']);
Route::get('comments/{comment}/reaction-counts', [CommentReactionController::class, 'getReactionCounts']);
Route::get('books', [BookController::class, 'index']);
Route::get('books/{book}', [BookController::class, 'show']);
Route::post('upload/bookcover', [BookController::class, 'uploadCover']);
Route::get('events', [EventController::class, 'index']);
Route::get('events/poetry', [EventController::class, 'poetryEvents']);
Route::get('events/{event}', [EventController::class, 'show']);
Route::get('chat/rooms', [ChatRoomController::class, 'index']);
Route::get('chat/rooms/{room}', [ChatRoomController::class, 'show']);
Route::get('academic-resources', [AcademicResourceController::class, 'index']);
Route::get('academic-resources/{academicResource}', [AcademicResourceController::class, 'show']);
Route::get('poets/featured', [UserController::class, 'featuredPoets']);
Route::get('poets/{user}/followers', [UserController::class, 'getFollowers']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // Poems
    Route::get('poems/user', [PoemController::class, 'userPoems']);
    Route::post('poems', [PoemController::class, 'store']);
    Route::patch('poems/{poem}', [PoemController::class, 'update']);
    Route::delete('poems/{poem}', [PoemController::class, 'destroy']);
    Route::post('poems/{poem}/rate', [PoemController::class, 'rate']);
    Route::post('poems/{poem}/like', [PoemController::class, 'like']);
    Route::post('poems/{poem}/unlike', [PoemController::class, 'unlike']);
    Route::get('poems/{poem}/user-status', [PoemController::class, 'getUserStatus']);

    // Poem Comments
    Route::post('poems/{poem}/comments', [PoemCommentController::class, 'store']);
    Route::delete('poems/comments/{comment}', [PoemCommentController::class, 'destroy']);

    // Comment Reactions
    Route::get('comments/reactions', [CommentReactionController::class, 'userReactions']);
    Route::get('comments/{comment}/user-reaction', [CommentReactionController::class, 'getUserReaction']);
    Route::post('comments/{comment}/reactions', [CommentReactionController::class, 'storeOrUpdate']);
    Route::delete('comments/{comment}/reactions', [CommentReactionController::class, 'destroy']);

    // Books
    Route::post('books', [BookController::class, 'store']);

    // Events
    Route::post('events', [EventController::class, 'store']);
    Route::put('events/{event}', [EventController::class, 'update']);

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

    // Poets & Following
    Route::post('poets/{user}/follow', [UserController::class, 'followPoet']);
    Route::post('poets/{user}/unfollow', [UserController::class, 'unfollowPoet']);
    Route::get('user/followed-poets', [UserController::class, 'followedPoets']);
    Route::get('poets/{user}/following-status', [UserController::class, 'getFollowingStatus']);

    // Tickets & Payments
    Route::post('tickets', [TicketController::class, 'store']);
    Route::get('tickets/user', [TicketController::class, 'userTickets']);
    Route::get('tickets/{ticket}', [TicketController::class, 'show']);
    Route::post('payments', [PaymentController::class, 'store']);
    Route::post('tickets/{ticket}/cancel', [TicketController::class, 'cancel']);
});

// Admin Routes
Route::middleware(['auth:sanctum', 'can:accessAdminPanel'])->prefix('admin')->group(function () {
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
