<?php

namespace App\Providers;

use App\Models\Vaga;
use Inertia\Inertia;
use App\Models\Medico;

// Models
use App\Models\User;
use App\Models\Paciente;
use App\Policies\VagaPolicy;
use App\Models\Especialidade;
use App\Models\Recepcionista;
use App\Policies\MedicoPolicy;

// Policies
use App\Policies\UserPolicy;
use App\Policies\PacientePolicy;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Policies\EspecialidadePolicy;
use App\Policies\RecepcionistaPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AppServiceProvider extends ServiceProvider
{

     protected $policies = [
        Paciente::class => PacientePolicy::class,
        Medico::class => MedicoPolicy::class,
        User::class => UserPolicy::class,
        Recepcionista::class => RecepcionistaPolicy::class,
        Especialidade::class => EspecialidadePolicy::class,
        Vaga::class => VagaPolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'auth' => function(){
                return [
                    'user' => Auth::user(),
                ];
            },
            'flash' => function(){
                return [
                    'success' => session('success'),
                    'error' => session('error')
                ];
            },
        ]);

        
        $this->registerPolicies();

        Gate::define('admin', fn ($user) => $user->isAdmin());
        Gate::define('medico', fn ($user) => $user->isMedico());
        Gate::define('recepcionista', fn ($user) => $user->isRecepcionista());
        Gate::define('utente', fn ($user) => $user->isUtente());
    }
}
