<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Categoria;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Categoria::insert([
            ['nombre' => 'Bovino', 'descripcion' => 'Ganado bovino', 'estado' => 'activo'],
            ['nombre' => 'Herramientas', 'descripcion' => 'Equipo ganadero', 'estado' => 'activo'],
            ['nombre' => 'Servicios', 'descripcion' => 'Servicios rurales', 'estado' => 'activo'],
        ]);
    }
}
