<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Anuncio;

class AnuncioController extends Controller
{
    public function index()
    {
        return Anuncio::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = Anuncio::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return Anuncio::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = Anuncio::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = Anuncio::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}