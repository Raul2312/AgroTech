<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    public function index()
    {
        return Categoria::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = Categoria::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return Categoria::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = Categoria::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = Categoria::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}