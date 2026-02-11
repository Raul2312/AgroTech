<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          User::create([
            'nombre' => 'Raul',
            'apellido' => 'Madrid',
            'fecha_nacimiento' => 2004,
            'email' => 'raulmadridflores202@gmail.com',
            'password' => Hash::make('12345678'),
            'telefono' => '6361353989',
            'tipo' => 'admin',
            'fecha_registro' => now(),
            'estado_cuenta' => 'activo',
            'reputacion' => '5'
        ]);
         User::create([
            'nombre' => 'Sebastian',
            'apellido' => 'Flores',
            'fecha_nacimiento' => 2004,
            'email' => 'sebastiannn231@gmail.com',
            'password' => Hash::make('12345678'),
            'telefono' => '6361034074',
            'tipo' => 'admin',
            'fecha_registro' => now(),
            'estado_cuenta' => 'activo',
            'reputacion' => '5'
        ]);
         User::create([
            'nombre' => 'Javier',
            'apellido' => 'Valverde',
            'fecha_nacimiento' => 2004,
            'email' => '22cg0095@itsncg.edu.mx',
            'password' => Hash::make('12345678'),
            'telefono' => '6361122978',
            'tipo' => 'admin',
            'fecha_registro' => now(),
            'estado_cuenta' => 'activo',
            'reputacion' => '5'
        ]);
    }
}
