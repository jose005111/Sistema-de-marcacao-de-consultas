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
        Schema::create('vagas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('especialidade_id')
                  ->constrained('especialidades')
                  ->onDelete('cascade');

            $table->date('data');

            $table->unsignedInteger('total_vagas');
            $table->unsignedInteger('vagas_disponiveis');

            $table->timestamps();

            // Garante apenas uma configuração por especialidade e dia
            $table->unique(['especialidade_id', 'data']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vagas');
    }
};
