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
       Schema::create('usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->string('nombre', 30);
            $table->string('apellido', 30);
            $table->date('fecha_nacimiento')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('telefono', 15)->nullable();
            $table->string('tipo', 30)->nullable();
            $table->date('fecha_registro')->nullable();
            $table->string('estado_cuenta', 20)->nullable();
            $table->string('reputacion', 20)->nullable();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            // Se agrega la relación en cascada apuntando a la tabla y columna correctas
            $table->foreignId('user_id')
                ->nullable()
                ->index()
                ->constrained('usuarios', 'id_usuario')
                ->onDelete('cascade'); 
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Ojo: Cambié 'users' por 'usuarios' para que coincida con el nombre de tu tabla
        Schema::dropIfExists('usuarios');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};