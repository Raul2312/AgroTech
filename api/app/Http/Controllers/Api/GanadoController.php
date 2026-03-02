<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ganado;

class GanadoController extends Controller
{
    public function index()
    {
        return Ganado::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = Ganado::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return Ganado::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = Ganado::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = Ganado::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}