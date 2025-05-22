<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PoemController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UploadController;

// Authentication
// Route::prefix('auth')->group(function () {
//     Route::post('register', [AuthController::class, 'register']);
//     Route::post('login', [AuthController::class, 'login']);
//     Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);
//     Route::middleware('auth:sanctum')->get('user', [AuthController::class, 'user']);
// });

// User profile & social
Route::get('users/{id}', [UserController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::post('users/{id}/follow', [UserController::class, 'follow']);
    Route::delete('users/{id}/follow', [UserController::class, 'unfollow']);
});
Route::get('users/{id}/poems', [UserController::class, 'poems']);
Route::get('users/{id}/followers', [UserController::class, 'followers']);
Route::get('users/{id}/following', [UserController::class, 'following']);

// Poems
Route::get('poems', [PoemController::class, 'index']);
Route::get('poems/{id}', [PoemController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('poems', [PoemController::class, 'store']);
    Route::put('poems/{id}', [PoemController::class, 'update']);
    Route::delete('poems/{id}', [PoemController::class, 'destroy']);
    Route::post('poems/{id}/like', [PoemController::class, 'like']);
    Route::delete('poems/{id}/like', [PoemController::class, 'unlike']);
    Route::post('poems/{id}/comments', [CommentController::class, 'storePoemComment']);
});
Route::get('poems/{id}/likes', [PoemController::class, 'likes']);
Route::get('poems/{id}/comments', [CommentController::class, 'poemComments']);

// Books
Route::get('books', [BookController::class, 'index']);
Route::get('books/{id}', [BookController::class, 'show']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('books', [BookController::class, 'store']);
    Route::put('books/{id}', [BookController::class, 'update']);
    Route::delete('books/{id}', [BookController::class, 'destroy']);
    Route::post('books/{id}/like', [BookController::class, 'like']);
    Route::delete('books/{id}/like', [BookController::class, 'unlike']);
    Route::post('books/{id}/comments', [CommentController::class, 'storeBookComment']);
});
Route::get('books/{id}/likes', [BookController::class, 'likes']);
Route::get('books/{id}/comments', [CommentController::class, 'bookComments']);

// Comments
Route::middleware('auth:sanctum')->group(function () {
    Route::put('comments/{id}', [CommentController::class, 'update']);
    Route::delete('comments/{id}', [CommentController::class, 'destroy']);
});

// Admin/Moderation
Route::middleware(['auth:sanctum', 'can:admin'])->prefix('admin')->group(function () {
    Route::get('poems/pending', [AdminController::class, 'pendingPoems']);
    Route::post('poems/{id}/approve', [AdminController::class, 'approvePoem']);
    Route::post('poems/{id}/reject', [AdminController::class, 'rejectPoem']);
    Route::get('users', [AdminController::class, 'users']);
    Route::delete('users/{id}', [AdminController::class, 'deleteUser']);
});

// Chat (RESTful example)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('chats', [ChatController::class, 'index']);
    Route::post('chats', [ChatController::class, 'store']);
    Route::get('chats/{id}/messages', [ChatController::class, 'messages']);
    Route::post('chats/{id}/messages', [ChatController::class, 'sendMessage']);
});

// Uploads
Route::middleware('auth:sanctum')->group(function () {
    Route::post('upload/book-cover', [UploadController::class, 'bookCover']);
    Route::post('upload/avatar', [UploadController::class, 'avatar']);
});
