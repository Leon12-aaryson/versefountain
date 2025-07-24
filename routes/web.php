<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PoemController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

// Test route to debug
Route::get('/test', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Poetry Routes
Route::get('/poetry', [PoemController::class, 'index'])->name('poetry.index');
Route::get('/poetry/{poem}', [PoemController::class, 'show'])->name('poetry.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Poetry CRUD routes
    Route::get('/poetry/create', [PoemController::class, 'create'])->name('poetry.create');
    Route::post('/poetry', [PoemController::class, 'store'])->name('poetry.store');
    Route::get('/poetry/{poem}/edit', [PoemController::class, 'edit'])->name('poetry.edit');
    Route::put('/poetry/{poem}', [PoemController::class, 'update'])->name('poetry.update');
    Route::delete('/poetry/{poem}', [PoemController::class, 'destroy'])->name('poetry.destroy');
});

require __DIR__.'/auth.php';
