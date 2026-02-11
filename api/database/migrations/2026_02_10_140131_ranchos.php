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
        Schema::create('rancho', function (Blueprint $table) {
    $table->id('id_rancho');
    $table->string('nombre', 30);
    $table->string('ubicacion', 30);
    $table->decimal('latitud', 10, 6);
    $table->decimal('longitud', 10, 6);
    $table->decimal('superficie_hectarias', 10, 2);
    $table->unsignedBigInteger('id_usuario');
    $table->date('fecha_registro');
    $table->string('telefono', 15);
    $table->string('correo');
    $table->string('tipo_rancho', 30);
    $table->string('estatus', 30);

    $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
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
