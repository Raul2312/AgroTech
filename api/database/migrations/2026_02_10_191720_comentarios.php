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
        Schema::create('comentarios', function (Blueprint $table) {
    $table->id('id_comentario');
    $table->unsignedBigInteger('id_producto');
    $table->unsignedBigInteger('id_usuario');
    $table->string('comentario', 500);
    $table->date('fecha');
    $table->integer('likes');

    $table->foreign('id_producto')->references('id_productos')->on('productos');
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
