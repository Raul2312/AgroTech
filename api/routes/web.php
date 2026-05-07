<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PayPallController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/payment/{amount}', [PayPallController::class, 'index']);
