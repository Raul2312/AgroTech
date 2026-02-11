<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Ganado;

class GanadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
           for ($i = 1; $i <= 10; $i++) {

            Ganado::create([
                'numero_arete' => 'AR'.$i,
                'nombre' => 'Vaca '.$i,
                'raza' => 'Angus',
                'sexo' => 'Hembra',
                'fecha_nacimiento' => '2022-01-01',
                'peso' => rand(400, 600),
                'estado_salud' => 'Saludable',
                'id_rancho' => 1
            ]);

        }
    }
}
