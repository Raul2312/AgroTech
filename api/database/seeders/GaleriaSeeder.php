<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Galeria;

class GaleriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Galeria::create([
            'id_producto' => 1,
            'imagen' => 'galeria1.png'
        ]);
    }
}
