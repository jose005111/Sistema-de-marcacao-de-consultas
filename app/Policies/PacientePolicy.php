<?php

namespace App\Policies;

use App\Models\Paciente;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PacientePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        // Admin e recepcionista podem listar todos os pacientes
        return in_array($user->role, ['admin', 'recepcionista']);
    }

    public function view(User $user, Paciente $paciente)
    {
        // Admin e recepcionista podem ver qualquer paciente
        if (in_array($user->role, ['admin', 'recepcionista'])) {
            return true;
        }

        // O paciente só vê seu próprio registro
        return $user->role === 'utente' && $paciente->user_id === $user->id;
    }

    public function create(User $user)
    {
        // Apenas admin ou recepcionista podem criar pacientes
        return in_array($user->role, ['admin', 'recepcionista']);
    }

    public function update(User $user, Paciente $paciente)
    {
        // Admin e recepcionista podem atualizar qualquer paciente
        if (in_array($user->role, ['admin', 'recepcionista'])) {
            return true;
        }

        // Paciente só pode atualizar seu próprio perfil
        return $user->role === 'utente' && $paciente->user_id === $user->id;
    }

    public function delete(User $user, Paciente $paciente)
    {
        // Apenas admin ou recepcionista podem deletar
        return in_array($user->role, ['admin', 'recepcionista']);
    }

    public function perfil(User $user, Paciente $paciente)
    {
        // O paciente só pode ver seu próprio perfil
        return $user->role === 'utente' && $paciente->user_id === $user->id;
    }
}
