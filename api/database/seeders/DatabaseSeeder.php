<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            EmpresaSeeder::class,
            CategoriaSeeder::class,
            TransaccionSeeder::class,
            RanchoSeeder::class,
            ProductoSeeder::class,
            AnuncioSeeder::class,
            LoteSeeder::class,
            GanadoSeeder::class,
            GaleriaSeeder::class,
            ComentarioSeeder::class,
            LikeSeeder::class,
            CompraSeeder::class,
        ]);

        
    }
}
