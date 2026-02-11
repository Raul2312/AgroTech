<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Anuncio;

class AnuncioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Anuncio::create([
            'id_empresa' => 1,
            'fecha_inicio' => now(),
            'fecha_fin' => now()->addMonth(),
            'precio' => 3000,
            'id_usuario' => 1
        ]);
    }
}
