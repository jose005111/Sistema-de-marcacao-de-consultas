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
        Schema::create('marcacoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('especialidade_id')
                  ->constrained('especialidades')
                  ->onDelete('cascade');
            $table->foreignId('paciente_id')
                  ->constrained('pacientes')
                  ->onDelete('cascade');

            $table->date('data');
            $table->time('hora');

            // Médico é opcional (pode ser atribuído depois)
            $table->foreignId('medico_id')
                  ->nullable()
                  ->constrained('medicos')
                  ->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marcacoes');
    }
};
