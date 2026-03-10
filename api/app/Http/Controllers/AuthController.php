<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function register(Request $request)
    {

        $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|min:6'
        ]);

        $user = User::create([
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $token = auth()->login($user);

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);

    }


    public function login(Request $request)
    {

        $credentials = $request->only('email','password');

        if (!$token = auth()->attempt($credentials)) {

            return response()->json([
                'error' => 'Credenciales incorrectas'
            ],401);

        }

        return response()->json([
            'token' => $token,
            'user' => auth()->user()
        ]);

    }

}