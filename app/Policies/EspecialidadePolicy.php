<?php

namespace App\Policies;

use App\Models\Especialidade;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EspecialidadePolicy
{
    use HandlesAuthorization;

    /**
     * Apenas admins podem gerenciar especialidades
     */
    public function viewAny(User $user)
    {
        return $user->role === 'admin';
    }

    public function view(User $user, Especialidade $especialidade)
    {
        return $user->role === 'admin';
    }

    public function create(User $user)
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Especialidade $especialidade)
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Especialidade $especialidade)
    {
        return $user->role === 'admin';
    }
}
