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
                Schema::create('empresas', function (Blueprint $table) {
                $table->id('id_empresa');
                $table->string('nombre', 30);
                $table->string('marca', 30);
                $table->string('logo', 30);
                $table->string('descripcion', 100);
                $table->string('tipo', 30);
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
