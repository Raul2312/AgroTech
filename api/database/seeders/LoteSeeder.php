<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Lote;

class LoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Lote::create([
            'nombre' => 'Lote A',
            'id_rancho' => 1,
            'tipo_terreno' => 'Pastizal',
            'estado' => 'Disponible',
            'fecha_creacion' => now(),
            'capacidad_maxima' => 50,
            'cantidad_actual' => 20,
            'proposito' => 1,
            'descripcion' => 'Lote principal'
        ]);
    }
}
