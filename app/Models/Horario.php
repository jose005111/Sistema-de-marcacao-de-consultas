<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    protected $fillable = ['hora'];

    public function marcacoes()
    {
        return $this->hasMany(Marcacao::class);
    }
}

