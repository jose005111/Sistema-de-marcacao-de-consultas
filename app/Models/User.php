<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
class User extends Authenticatable
{
    use HasFactory, Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'role',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

      public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isMedico()
    {
        return $this->role === 'medico';
    }

    public function isRecepcionista()
    {
        return $this->role === 'recepcionista';
    }

    public function isUtente()
    {
        return $this->role === 'utente';
    }

public function medico()
{
    return $this->hasOne(Medico::class);
}

public function paciente()
{
    return $this->hasOne(Paciente::class);
}

public function recepcionista()
{
    return $this->hasOne(Recepcionista::class);
}


public function perfilModel()
{
    return match ($this->role) {
        'medico' => $this->medico,
        'utente' => $this->paciente,
        'recepcionista' => $this->recepcionista,
        default => null,
    };
}

public function perfilCompleto(): bool
{
    $perfil = $this->perfilModel();

    if (!$perfil) {
        return false;
    }

    return !empty($perfil->nome)
        && !empty($perfil->morada)
        && !empty($perfil->contacto);
}

protected $appends = ['perfil'];

public function getPerfilAttribute()
{
    $perfil = $this->perfilModel();

    return [
        'completo' => $this->perfilCompleto(),
        'dados' => $perfil,
    ];
}



}
