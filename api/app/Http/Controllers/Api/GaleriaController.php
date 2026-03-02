<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Galeria;

class GaleriaController extends Controller
{
    public function index()
    {
        return Galeria::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = Galeria::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return Galeria::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = Galeria::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = Galeria::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}