<?php

namespace App\Policies;

use App\Models\Marcacao;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MarcacaoPolicy
{
    public function viewAny(User $user)
    {
        return $user->isAdmin() || $user->isRecepcionista() || $user->isUtente();
    }
    
    public function view(User $user, Marcacao $marcacao)
    {
        return $user->isAdmin()
            || $user->isRecepcionista()
            || ($user->isUtente() && $marcacao->user_id === $user->id);
    }

    public function create(User $user)
    {
        return $user->isAdmin() || $user->isRecepcionista()  || ($user->isUtente());
    }

    public function delete(User $user, Marcacao $marcacao)
    {
        return $user->isAdmin()  || ($user->isUtente() && $marcacao->user_id === $user->id);
    }
}

