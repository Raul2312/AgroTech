<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comentario;

class ComentarioController extends Controller
{
    public function index()
    {
        return Comentario::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = Comentario::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return Comentario::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = Comentario::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = Comentario::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}