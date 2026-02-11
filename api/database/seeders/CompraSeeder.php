<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Compra;

class CompraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Compra::create([
            'id_transaccion' => 1,
            'id_producto' => 1,
            'id_comprador' => 2,
            'id_vendedor' => 1,
            'total' => 5000,
            'iva' => 800
        ]);
    }
}
