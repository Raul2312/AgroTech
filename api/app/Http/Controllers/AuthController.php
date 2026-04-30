<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;



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

 public function forgotPassword(Request $request)
{
    $request->validate(['email' => 'required|email']);
    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Este correo no está registrado'], 404);
    }

    // Generamos un código numérico de 6 dígitos
    $codigo = rand(100000, 999999);

    // Guardamos el código en la tabla (con Hash para seguridad)
    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => $request->email],
        [
            'token' => Hash::make($codigo),
            'created_at' => now()
        ]
    );

    // ENVIAR EL CORREO (Asegúrate de que la vista exista en resources/views/emails/recovery.blade.php)
    try {
        Mail::send('emails.recovery', ['codigo' => $codigo], function ($message) use ($user) {
            $message->to($user->email)
                    ->subject( 'Código de recuperación - AgroTech 🌱');
        });
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al enviar el correo',
            'error'=>$e->getMessage()
            ], 500);
    }

    return response()->json(['message' => 'Código enviado con éxito']);
}

public function resetPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'token' => 'required',
        'password' => 'required|min:6'
    ]);
    $record = DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->first();
    if (!$record) {
        return response()->json([
            'message' => 'Token inválido o expirado'
        ], 400);
    }
    if (!Hash::check($request->token, $record->token)) {
        return response()->json([
            'message' => 'Token inválido'
        ], 400);
    }
    $user = User::where('email', $request->email)->first();
    $user->password = Hash::make($request->password);
    $user->save();
    DB::table('password_reset_tokens')->where('email', $request->email)->delete();
    return response()->json([
        'message' => 'Contraseña actualizada correctamente'
    ]);
}

}