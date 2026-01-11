<?php

namespace App\Policies;

use App\Models\Recepcionista;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RecepcionistaPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        // Apenas admin pode listar recepcionistas
        return $user->role === 'admin';
    }

    public function view(User $user, Recepcionista $recepcionista)
    {
        // Admin pode ver qualquer recepcionista
        if ($user->role === 'admin') {
            return true;
        }

        // Recepcionista só vê seu próprio perfil
        return $user->role === 'recepcionista' && $recepcionista->user_id === $user->id;
    }

    public function create(User $user)
    {
        // Apenas admin pode criar recepcionista
        return $user->role === 'admin' || $user->role === 'recepcionista';
    }

    public function update(User $user, Recepcionista $recepcionista)
    {
        // Admin pode atualizar qualquer recepcionista
        if ($user->role === 'admin') {
            return true;
        }

        // Recepcionista só atualiza seu próprio perfil
        return $user->role === 'recepcionista' && $recepcionista->user_id === $user->id;
    }

    public function delete(User $user, Recepcionista $recepcionista)
    {
        // Apenas admin pode deletar
        return $user->role === 'admin';
    }

    public function perfil(User $user, Recepcionista $recepcionista)
    {
        // Recepcionista só pode ver seu próprio perfil
        return $user->role === 'recepcionista' && $recepcionista->user_id === $user->id;
    }
}
