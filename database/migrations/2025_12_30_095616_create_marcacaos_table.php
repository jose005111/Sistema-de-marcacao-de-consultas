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
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('paciente_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('vaga_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->foreignId('horario_id')
        ->constrained('horarios');

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
