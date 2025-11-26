<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    //
    protected $table = "pacientes";
    protected $fillable = [
        'nome',
        'nascimento',
        'morada',
        'contacto',
        'user_id',
    ];
}
