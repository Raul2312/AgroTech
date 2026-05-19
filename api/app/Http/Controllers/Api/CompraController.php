<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Compra;
use Illuminate\Support\Facades\Auth;

class CompraController extends Controller
{
    public function index(Request $request) {
        // Buscamos el ID por Auth (token) o lo agarramos de la URL (?id_usuario=X)
        $userId = Auth::id() ?: $request->query('id_usuario');

        // Retornamos las compras de ese usuario incluyendo la relación del producto
        return Compra::with('producto')
                ->where('id_comprador', $userId)
                ->latest()
                ->get();
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            
            // Mismo truco aquí por si el Auth::id() falla al guardar
            $data['id_comprador'] = Auth::id() ?: $request->input('id_comprador'); 
            
            $data['iva'] = $request->input('iva', 0);
            $data['total'] = (float)$request->input('total');
            $data['id_vendedor']=Producto::find( $data['id_producto'])->id_usuario;
            $registro = Compra::create($data);
            
            return response()->json($registro, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}