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
        Schema::create('lote', function (Blueprint $table) {
    $table->id('id_lote');
    $table->string('nombre', 20);
    $table->unsignedBigInteger('id_rancho');
    $table->string('tipo_terreno', 20);
    $table->string('estado', 20);
    $table->date('fecha_creacion');
    $table->integer('capacidad_maxima');
    $table->integer('cantidad_actual');
    $table->integer('proposito');
    $table->string('descripcion', 500);

    $table->foreign('id_rancho')->references('id_rancho')->on('rancho');
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
