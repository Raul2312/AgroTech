<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Producto;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
Producto::create([
                'nombre' => 'Producto '.$i,
                'descripcion' => 'Descripcion del producto '.$i,
                'precio' => rand(1000, 5000),
                'moneda' => 'MXN',
                'stock' => rand(5, 20),
                'imagen' => 'producto'.$i.'.jpg',
                'id_usuario' => 1,
                'id_categoria' => 1, // 👈 DEBE ESTAR AQUÍ
                'fecha_publicacion' => now(),
                'estado' => 'activo'
            ]);

    }
    }
}
