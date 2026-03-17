<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EmpresaController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\TransaccionController;
use App\Http\Controllers\Api\RanchoController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\AnuncioController;
use App\Http\Controllers\Api\LoteController;
use App\Http\Controllers\Api\GanadoController;
use App\Http\Controllers\Api\GaleriaController;
use App\Http\Controllers\Api\ComentarioController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\CompraController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::apiResource('productos', ProductoController::class);
Route::apiResource('categorias', CategoriaController::class);
Route::apiResource('usuarios', UserController::class);


Route::middleware(['jwt.auth'])->group(function () {

     Route::apiResource('ranchos', RanchoController::class);
    Route::apiResource('ganados', GanadoController::class);
    
    Route::apiResource('empresas', EmpresaController::class);
    Route::apiResource('lotes', LoteController::class);
    Route::apiResource('anuncios', AnuncioController::class);
    Route::apiResource('galerias', GaleriaController::class);
    Route::apiResource('comentarios', ComentarioController::class);
    Route::apiResource('likes', LikeController::class);
    Route::apiResource('transacciones', TransaccionController::class);
    Route::apiResource('compras', CompraController::class);

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

});
    