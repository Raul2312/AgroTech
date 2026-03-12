<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{

    public function index()
    {
        // para que React pueda mostrar usuario y categoria
        return Producto::with(['usuario','categoria'])->get();
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric',
            'moneda' => 'required|string|max:10',
            'stock' => 'required|integer',
            'imagen' => 'nullable|string',

            // ahora sí recibimos estos
            'id_usuario' => 'required|integer',
            'id_categoria' => 'required|integer',

            'estado' => 'nullable|string'
        ]);

        // valores automáticos
        $data['fecha_publicacion'] = now();

        $producto = Producto::create($data);

        return response()->json($producto, 201);
    }

    public function show($id)
    {
        return Producto::with(['usuario','categoria'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {

        $producto = Producto::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'numeric',
            'moneda' => 'string|max:10',
            'stock' => 'integer',
            'imagen' => 'nullable|string',
            'id_categoria' => 'integer',
            'estado' => 'nullable|string'
        ]);

        $producto->update($data);

        return response()->json($producto, 200);
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ]);
    }
}