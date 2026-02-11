<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
 Schema::create('ganado', function (Blueprint $table) {
    $table->id('id_ganado');
    $table->string('numero_arete');
    $table->string('nombre');
    $table->string('raza');
    $table->string('sexo');
    $table->date('fecha_nacimiento');
    $table->decimal('peso', 8, 2);
    $table->string('estado_salud');

    $table->foreignId('id_rancho')
          ->constrained('rancho', 'id_rancho')
          ->onDelete('cascade');

    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
