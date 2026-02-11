<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Comentario;

class ComentarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         Comentario::create([
            'id_producto' => 1,
            'id_usuario' => 2,
            'comentario' => 'Excelente producto',
            'fecha' => now(),
            'likes' => 3
        ]);
    }
}
