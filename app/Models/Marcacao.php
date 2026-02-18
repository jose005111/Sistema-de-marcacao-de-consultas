<?php

namespace App\Models;

use App\Models\Especialidade;
use App\Models\Horario;
use App\Models\Paciente;
use App\Models\Vaga;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Marcacao extends Model
{
    protected $fillable = [
        'especialidade_id',
        'paciente_id',
        'medico_id',
        'horario_id',
        'vaga_id',
    ];
    protected $table = 'marcacoes';
    public function vaga()
    {
        return $this->belongsTo(Vaga::class);
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function especialidade()
    {
        return $this->belongsTo(Especialidade::class);
    }
    public function horario()
    {
    return $this->belongsTo(Horario::class);
    }
    public function medico()
    {
    return $this->belongsTo(Medico::class);
    }

}
