<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    public function index()
    {
        return Producto::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = Producto::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return Producto::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = Producto::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = Producto::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}