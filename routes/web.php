<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/chatrooms', function () {
    return view('chatrooms');
});

Route::get('/events', function () {
    return view('events');
});

Route::get('/tickets', function () {
    return view('tickets');
});

// Auth Routes
require __DIR__.'/auth.php';
