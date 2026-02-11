<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Rancho;

class RanchoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Rancho::create([
            'nombre' => 'Rancho El Toro',
            'ubicacion' => 'Chihuahua',
            'latitud' => 28.63,
            'longitud' => -106.06,
            'superficie_hectarias' => 150,
            'id_usuario' => 1,
            'fecha_registro' => now(),
            'telefono' => '6361111111',
            'correo' => 'rancho@demo.com',
            'tipo_rancho' => 'Ganadero',
            'estatus' => 'activo'
        ]);
    }
}
