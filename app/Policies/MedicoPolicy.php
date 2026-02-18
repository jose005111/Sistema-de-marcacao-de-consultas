<?php

namespace App\Policies;

use App\Models\Medico;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MedicoPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        // Admin e recepcionista podem listar todos os médicos
        return in_array($user->role, ['recepcionista']);
    }

    public function view(User $user, Medico $medico)
    {
        // Admin e recepcionista veem todos, médico só o seu, utente não vê
        if (in_array($user->role, ['recepcionista'])) {
            return true;
        }

        if ($user->role === 'medico') {
            return $medico->user_id === $user->id;
        }

        return false;
    }

    public function create(User $user)
    {
        // Apenas admin pode criar médicos
        return $user->role === 'admin';
    }

    public function update(User $user, Medico $medico)
    {
        // Admin pode atualizar qualquer médico, médico pode atualizar o seu perfil
        return $user->role === 'admin' || ($user->role === 'medico' && $medico->user_id === $user->id);
    }

    public function delete(User $user, Medico $medico)
    {
        // Apenas admin pode deletar
        return $user->role === 'admin';
    }

    public function perfil(User $user, Medico $medico)
    {
        // Médico só vê seu próprio perfil
        return $user->role === 'medico' && $medico->user_id === $user->id;
    }
}
