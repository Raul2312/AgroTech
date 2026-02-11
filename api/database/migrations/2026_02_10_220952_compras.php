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
        Schema::create('compras', function (Blueprint $table) {
    $table->id('id_compra');
    $table->unsignedBigInteger('id_transaccion');
    $table->unsignedBigInteger('id_producto');
    $table->unsignedBigInteger('id_comprador');
    $table->unsignedBigInteger('id_vendedor');
    $table->decimal('total', 10, 2);
    $table->decimal('iva', 10, 2);

    $table->foreign('id_transaccion')->references('id_transaccion')->on('transacciones');
    $table->foreign('id_producto')->references('id_productos')->on('productos');
    $table->foreign('id_comprador')->references('id_usuario')->on('usuarios');
    $table->foreign('id_vendedor')->references('id_usuario')->on('usuarios');
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
