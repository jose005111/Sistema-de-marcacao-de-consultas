<?php

namespace App\Models;

use App\Models\Medico;
use Illuminate\Database\Eloquent\Model;

class Especialidade extends Model
{
    protected $table = "especialidades";
    protected $fillable = ['nome'];

    public function medicos(){
        return $this->hasMany(Medico::class, 'especialidade_id', 'id' );
    }
}
