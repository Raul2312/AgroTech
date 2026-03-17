<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    /**
     * Listar todos los productos
     */
    public function index()
    {
        $productos = Producto::with(['usuario', 'categoria'])->get();

        // 🔥 Agregar URL de imagen a cada producto
        $productos->transform(function ($producto) {
            $producto->imagen_url = $producto->imagen
                ? url('products/' . $producto->imagen)
                : "https://via.placeholder.com/250?text=Sin+Imagen";
            return $producto;
        });

        return response()->json($productos);
    }

    /**
     * Crear un producto nuevo
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'nullable|string',
                'precio' => 'required|numeric',
                'moneda' => 'required|string|max:10',
                'stock' => 'required|integer',
                'imagen' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'id_usuario' => 'required|integer',
                'id_categoria' => 'required|integer',
                'estado' => 'nullable|string'
            ]);

            // 🔥 GUARDAR IMAGEN EN public/products
            if ($request->hasFile('imagen')) {
                $file = $request->file('imagen');

                $filename = time() . "_" . $file->getClientOriginalName();

                $file->move(public_path('products'), $filename);

                $data['imagen'] = $filename;
            }

            $data['fecha_publicacion'] = now();

            $producto = Producto::create($data);

            // 🔥 agregar URL de imagen
            $producto->imagen_url = $producto->imagen
                ? url('products/' . $producto->imagen)
                : null;

            return response()->json([
                'message' => 'Producto creado correctamente',
                'producto' => $producto
            ], 201);

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
     * Mostrar un producto específico
     */
    public function show($id)
    {
        $producto = Producto::with(['usuario', 'categoria'])->find($id);

        if (!$producto) {
            return response()->json(['error' => 'Producto no encontrado'], 404);
        }

        $producto->imagen_url = $producto->imagen
            ? url('products/' . $producto->imagen)
            : null;

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
            $data = $request->validate([
                'nombre' => 'sometimes|string|max:255',
                'descripcion' => 'nullable|string',
                'precio' => 'sometimes|numeric',
                'moneda' => 'sometimes|string|max:10',
                'stock' => 'sometimes|integer',
                'imagen' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'id_categoria' => 'sometimes|integer',
                'estado' => 'nullable|string'
            ]);

            // 🔥 REEMPLAZAR IMAGEN
            if ($request->hasFile('imagen')) {

                // borrar anterior
                if ($producto->imagen && file_exists(public_path('products/' . $producto->imagen))) {
                    unlink(public_path('products/' . $producto->imagen));
                }

                $file = $request->file('imagen');
                $filename = time() . "_" . $file->getClientOriginalName();

                $file->move(public_path('products'), $filename);

                $data['imagen'] = $filename;
            }

            $producto->update($data);

            $producto->imagen_url = $producto->imagen
                ? url('products/' . $producto->imagen)
                : null;

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

        // 🔥 borrar imagen física
        if ($producto->imagen && file_exists(public_path('products/' . $producto->imagen))) {
            unlink(public_path('products/' . $producto->imagen));
        }

        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ]);
    }
}