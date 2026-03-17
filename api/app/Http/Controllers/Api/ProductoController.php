<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    /**
     * Listar todos los productos con usuario y categoría
     */
    public function index()
    {
        return response()->json(
            Producto::with(['usuario','categoria'])->get()
        );
    }

    /**
     * Crear un producto nuevo
     */
    public function store(Request $request)
    {
        try {
            // Convertir valores vacíos a null o enteros
            $request->merge([
                'id_usuario' => $request->id_usuario !== "" ? (int)$request->id_usuario : null,
                'id_categoria' => $request->id_categoria !== "" ? (int)$request->id_categoria : null,
                'precio' => $request->precio !== "" ? (float)$request->precio : null,
                'stock' => $request->stock !== "" ? (int)$request->stock : null,
            ]);

            $data = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'precio' => 'required|numeric',
                'moneda' => 'required|string|max:10',
                'stock' => 'required|integer',
                'imagen' => 'nullable|string',
                'id_usuario' => 'required|integer',
                'id_categoria' => 'required|integer',
                'estado' => 'nullable|string'
            ]);

            $data['fecha_publicacion'] = now();

            $producto = Producto::create($data);

            return response()->json([
                'message' => 'Producto creado correctamente',
                'producto' => $producto
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Devuelve errores de validación como JSON
            return response()->json([
                'error' => 'Error de validación',
                'messages' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Otros errores
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Mostrar un producto específico
     */
    public function show($id)
    {
        $producto = Producto::with(['usuario','categoria'])->find($id);

        if (!$producto) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        return response()->json($producto);
    }

    /**
     * Actualizar un producto
     */
    public function update(Request $request, $id)
    {
        $producto = Producto::find($id);

        if (!$producto) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        try {
            $request->merge([
                'id_categoria' => $request->id_categoria !== "" ? (int)$request->id_categoria : null,
                'precio' => $request->precio !== "" ? (float)$request->precio : null,
                'stock' => $request->stock !== "" ? (int)$request->stock : null,
            ]);

            $data = $request->validate([
                'nombre' => 'sometimes|string|max:255',
                'descripcion' => 'nullable|string',
                'precio' => 'sometimes|numeric',
                'moneda' => 'sometimes|string|max:10',
                'stock' => 'sometimes|integer',
                'imagen' => 'nullable|string',
                'id_categoria' => 'sometimes|integer',
                'estado' => 'nullable|string'
            ]);

            $producto->update($data);

            return response()->json([
                'message' => 'Producto actualizado correctamente',
                'producto' => $producto
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Error de validación',
                'messages' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Eliminar un producto
     */
    public function destroy($id)
    {
        $producto = Producto::find($id);

        if (!$producto) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ]);
    }
}