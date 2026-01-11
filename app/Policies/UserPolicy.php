<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        // Apenas admin pode ver a lista de usuários
        return $user->role === 'admin';
    }
    
    public function create(User $user)
    {
        // Apenas admin pode criar outros usuários
        return $user->role === 'admin';
    }

    public function view(User $user, User $target)
    {
        // Admin pode ver qualquer usuário
        if ($user->role === 'admin') {
            return true;
        }

        // Usuário só vê seu próprio perfil
        return $user->id === $target->id;
    }

    public function update(User $user, User $target)
    {
        // Admin pode atualizar qualquer usuário
        if ($user->role === 'admin') {
            return true;
        }

        // Usuário só atualiza seu próprio perfil
        return $user->id === $target->id;
    }

    public function delete(User $user, User $target)
    {
        // Apenas admin pode deletar usuários
        return $user->role === 'admin';
    }
}
