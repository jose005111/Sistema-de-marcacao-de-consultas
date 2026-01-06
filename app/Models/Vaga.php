<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vaga extends Model
{
    protected $fillable = [
        'especialidade_id',
        'data',
        'total_vagas',
        'vagas_disponiveis',
    ];

    public function especialidade()
    {
        return $this->belongsTo(Especialidade::class);
    }

    public function marcacoes()
    {
        return $this->hasMany(Marcacao::class);
    }
}

