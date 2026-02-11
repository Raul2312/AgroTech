<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Empresa;

class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Empresa::create([
            'nombre' => 'Agro Norte',
            'marca' => 'AGN',
            'logo' => 'logo.png',
            'descripcion' => 'Empresa ganadera del norte',
            'tipo' => 'Ganadera'
        ]);
    }
}
