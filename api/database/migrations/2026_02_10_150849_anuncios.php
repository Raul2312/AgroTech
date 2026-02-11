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
        Schema::create('anuncios', function (Blueprint $table) {
    $table->id('id_anuncios');
    $table->unsignedBigInteger('id_empresa');
    $table->date('fecha_inicio');
    $table->date('fecha_fin');
    $table->decimal('precio', 10, 2);
    $table->unsignedBigInteger('id_usuario');

    $table->foreign('id_empresa')->references('id_empresa')->on('empresas');
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
