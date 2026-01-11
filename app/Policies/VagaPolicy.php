<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vaga;
use Illuminate\Auth\Access\HandlesAuthorization;

class VagaPolicy
{
    use HandlesAuthorization;

    /**
     * Apenas admin pode criar vagas
     */
    public function create(User $user)
    {
        return $user->role === 'admin';
    }

    /**
     * Apenas admin pode atualizar vagas
     */
    public function update(User $user, Vaga $vaga)
    {
        return $user->role === 'admin';
    }

    /**
     * Apenas admin pode deletar vagas
     */
    public function delete(User $user, Vaga $vaga)
    {
        return $user->role === 'admin';
    }

    /**
     * Qualquer usuário pode visualizar (index ou disponíveis)
     */
    public function viewAny(User $user)
    {
        return  $user->role === 'admin';;
    }

    public function view(User $user, Vaga $vaga)
    {
        return true;
    }
}
