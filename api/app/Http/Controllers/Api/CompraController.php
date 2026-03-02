<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Compra;

class CompraController extends Controller
{
    public function index()
    {
        return Compra::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = Compra::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return Compra::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = Compra::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = Compra::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}