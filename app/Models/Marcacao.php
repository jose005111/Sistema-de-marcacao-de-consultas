<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Marcacao extends Model
{
    use HasFactory;
    protected $table = "Marcacoes";
    protected $fillable = [
        'especialidade_id',
        'paciente_id',
        'data',
        'hora'
    ];

    public function especialidade()
    {
        return $this->belongsTo(Especialidade::class);
    }
    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }
}
