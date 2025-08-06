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
});

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
    
    Route::get('/chatrooms', function () {
        return view('chatrooms');
    });
    
    Route::get('/tickets', function () {
        return view('tickets');
    });
});

// Auth Routes
require __DIR__.'/auth.php';
