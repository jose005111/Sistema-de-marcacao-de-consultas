<?php

namespace App\Models;

use App\Models\Especialidade;
use Illuminate\Database\Eloquent\Model;

class Medico extends Model
{
    protected $table = "medicos";
    protected $fillable = [
        'ordem',
        'nome',
        'nascimento',
        'contacto',
        'especialidade_id',
        'morada',
        'contacto',
        'user_id',
    ];

    public function especialidade(){
        return $this->belongsTo(Especialidade::class, 'especialidade_id', 'id');
    }
}
