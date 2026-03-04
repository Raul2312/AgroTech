<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = User::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = User::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = User::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }

    public function register(Request $request)
{
    $request->validate([
        'nombre' => 'required',
        'apellido' => 'required',
        'email' => 'required|email|unique:usuarios,email',
        'password' => 'required|min:6'
    ]);

    $user = User::create($request->all());

    return response()->json([
        'message' => 'Usuario registrado correctamente',
        'usuario' => $user
    ], 201);
}

public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Credenciales incorrectas'
        ], 401);
    }

    $payload = [
        'iss' => "trazabilidad-ganado",
        'sub' => $user->id_usuario,
        'tipo' => $user->tipo,
        'iat' => time(),
        'exp' => time() + 60 * 60
    ];

    $token = JWT::encode($payload, env('JWT_SECRET'), 'HS256');

    return response()->json([
        'token' => $token,
        'usuario' => $user
    ]);
}
}