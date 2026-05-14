<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Compra;
use Illuminate\Support\Facades\Auth;

class CompraController extends Controller
{
    public function index() {
        // Filtra automáticamente por el usuario logueado (ID 10)
        return Compra::where('id_comprador', Auth::id())->latest()->get();
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            
            // Forzamos el ID del comprador desde la sesión activa
            $data['id_comprador'] = Auth::id(); 
            
            // Aseguramos valores numéricos para evitar errores de base de datos
            $data['iva'] = $request->input('iva', 0);
            $data['total'] = (float)$request->input('total');
            
            $registro = Compra::create($data);
            
            return response()->json($registro, 201);
        } catch (\Exception $e) {
            // Esto devolverá el error exacto en caso de fallo 500
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}