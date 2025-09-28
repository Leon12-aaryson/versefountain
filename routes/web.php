<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;

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

Route::get('/poetry', function () {
    return view('poetry');
})->name('poetry.index');

Route::get('/poetry/create', function () {
    return view('poetry.create');
})->middleware('auth');

Route::get('/poetry/{poem}', function ($poem) {
    return view('poetry.show', compact('poem'));
})->name('poetry.show');

Route::get('/poetry/{poem}/edit', function ($poem) {
    return view('poetry.edit', compact('poem'));
})->middleware('auth')->name('poetry.edit');

Route::get('/books', function () {
    return view('books');
});

Route::get('/academics', function () {
    return view('academics');
});

Route::get('/events', function () {
    return view('events');
});

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
    });
    
    // Admin Dashboard Route
    Route::get('/admin-dashboard', [App\Http\Controllers\AdminController::class, 'dashboard'])->name('admin.dashboard');
});

// Auth Routes
require __DIR__.'/auth.php';
