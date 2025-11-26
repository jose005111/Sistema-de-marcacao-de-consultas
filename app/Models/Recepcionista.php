<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recepcionista extends Model
{
    protected $table = "recepcionistas";
    protected $fillable = [
        'nome',
        'nascimento',
        'contacto',
        'morada',
        'user_id',
    ];
}
