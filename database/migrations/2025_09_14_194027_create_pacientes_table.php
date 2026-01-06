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
        Schema::create('pacientes', function (Blueprint $table) {
            $table->id();
            $table->string("nome");
            $table->date("nascimento");
            $table->string("morada");
            $table->string("contacto");  
            $table->string("bi")->unique();  
            $table->string("sexo");  
            $table->foreignId("user_id")->constrained()->onDelete("cascade");          
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pacientes');
    }
};
