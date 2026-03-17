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
        Schema::create('productos', function (Blueprint $table) {
    $table->id('id_productos');
    $table->string('nombre', 250);
    $table->string('descripcion', 300);
    $table->decimal('precio', 10, 2);
    $table->string('moneda', 20);
    $table->integer('stock');
    $table->unsignedBigInteger('id_usuario');
    $table->date('fecha_publicacion');
    $table->string('imagen', 200);
    $table->unsignedBigInteger('id_categoria');
    $table->string('estado', 100);

    $table->foreign('id_usuario')->references('id_usuario')->on('usuarios');
    $table->foreign('id_categoria')->references('id')->on('categorias');
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
