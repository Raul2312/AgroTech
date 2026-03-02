<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rancho;

class RanchoController extends Controller
{
    public function index()
    {
        return Rancho::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = Rancho::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return Rancho::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = Rancho::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = Rancho::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}