<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'success' => fn () => $request->session()->get('success'),
                 'toast' => fn () => $request->session()->get('toast'),
            ],
            'auth' => [
            'user' => $request->user()
                ? $request->user()->load(['medico', 'paciente', 'recepcionista'])
                : null,
            'can' => $request->user() ? [
                'viewUsuarios'        => $request->user()->can('viewAny', \App\Models\User::class),
                'viewPacientes'       => $request->user()->can('viewAny', \App\Models\Paciente::class),
                'viewMedicos'         => $request->user()->can('viewAny', \App\Models\Medico::class),
                'viewRecepcionistas'  => $request->user()->can('viewAny', \App\Models\Recepcionista::class),
                'viewEspecialidades'  => $request->user()->can('viewAny', \App\Models\Especialidade::class),
                'viewVagas'           => $request->user()->can('viewAny', \App\Models\Vaga::class),
                'viewMarcacoes'       => $request->user()->can('viewAny', \App\Models\Marcacao::class),
            ] : [],
        ],
        ]);
    }
}
