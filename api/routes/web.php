<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PayPallController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/payment/{amount}', [PayPallController::class, 'index']);
Route::post('/paypal/create-order', [PayPallController::class, 'createOrder']);
Route::post('/paypal/capture-order', [PayPallController::class, 'captureOrder']);
