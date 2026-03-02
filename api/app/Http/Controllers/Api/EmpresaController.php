<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Empresa;

class EmpresaController extends Controller
{
    public function index()
    {
        return Empresa::all();
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $registro = Empresa::create($data);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        return Empresa::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $registro = Empresa::findOrFail($id);
        $registro->update($request->all());
        return response()->json($registro, 200);
    }

    public function destroy($id)
    {
        $registro = Empresa::findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }
}