<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Medico;
use App\Models\Paciente;
use App\Models\Recepcionista;
use App\Models\Marcacao;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
   public function index(Request $request)
{
    $user = auth()->user();
    $role = $user->role;

    $mesSelecionado = $request->get('mes', now()->format('m'));
    $anoSelecionado = $request->get('ano', now()->format('Y'));
    $filtro = $request->get('filtro', null);

    $data = [
        'mesSelecionado' => $mesSelecionado,
        'anoSelecionado' => $anoSelecionado,
        'role' => $role,
    ];

    if ($role === 'admin') {
        $data += [
            'totalMedicos' => Medico::count(),
            'totalUsuarios' => User::count(),
            'totalRecepcionistas' => Recepcionista::count(),
            'totalPacientes' => Paciente::count(),
        ];

       $filtro = $request->get('filtro', null);

        // Apenas atualiza especialidades se filtro for 'especialidades' ou nenhum filtro
        if ($filtro === 'especialidades' || !$filtro) {
           
            $distribuicaoEspecialidades = Marcacao::select( 'especialidades.nome as label', DB::raw('COUNT(marcacoes.id) as value') ) ->join('especialidades', 'marcacoes.especialidade_id', '=', 'especialidades.id') ->join('vagas', 'vagas.especialidade_id', '=', 'especialidades.id') ->whereMonth('vagas.data', $mesSelecionado) ->whereYear('vagas.data', $anoSelecionado) ->groupBy('especialidades.nome') ->orderBy('especialidades.nome') ->get() ->map(function ($item) { return [ 'id' => $item->label, 'label' => $item->label, 'value' => $item->value, ]; }); 


            $data['distribuicaoEspecialidades'] = $distribuicaoEspecialidades;
        }

        // Apenas atualiza consultas por dia se filtro for 'consultas' ou nenhum filtro
        if ($filtro === 'consultas' || !$filtro) {
             $consultasPorDia = Marcacao::join('vagas', 'vagas.id', '=', 'marcacoes.vaga_id') 
             ->select( DB::raw('DAY(vagas.data) as dia'), DB::raw('COUNT(marcacoes.id) as total') ) 
             ->whereMonth('vagas.data', $mesSelecionado) ->whereYear('vagas.data', $anoSelecionado)
             ->groupBy(DB::raw('DAY(vagas.data)')) ->orderBy(DB::raw('DAY(vagas.data)')) 
             ->get() ->map(function ($item) { 
                return [ 'dia' => (int) $item->dia, 'total' => (int) $item->total, ]; 
            });

            $data['consultasPorDia'] = $consultasPorDia;
        }

    }

    elseif ($role === 'medico') {
        $medicoId = $user->medico->id;

        $data += [
            'consultasMes' => Marcacao::where('medico_id', $medicoId)
                ->whereMonth('created_at', $mesSelecionado)
                ->whereYear('created_at', $anoSelecionado)
                ->count(),
            'consultasRealizadas' => Marcacao::where('medico_id', $medicoId)
                ->where('estado', 'realizada')
                ->count(),
            'consultasPendentes' => Marcacao::where('medico_id', $medicoId)
                ->where('estado', 'confirmada')
                ->count(),
        ];

        if ($filtro === 'consultas' || !$filtro) {
            $data['consultasPorDia'] = Marcacao::join('vagas', 'vagas.id', '=', 'marcacoes.vaga_id') 
             ->select( DB::raw('DAY(vagas.data) as dia'), DB::raw('COUNT(marcacoes.id) as total') ) 
                ->where('marcacoes.medico_id', $medicoId)
             ->whereMonth('vagas.data', $mesSelecionado) ->whereYear('vagas.data', $anoSelecionado)
             ->groupBy(DB::raw('DAY(vagas.data)')) ->orderBy(DB::raw('DAY(vagas.data)')) 
             ->get() ->map(function ($item) { 
                return [ 'dia' => (int) $item->dia, 'total' => (int) $item->total, ]; 
            });
        }
    }

    elseif ($role === 'recepcionista') {
        $data += [
            'marcacoesHoje' => Marcacao::whereDate('created_at', today())->count(),
            'pendentes' => Marcacao::where('estado', 'confirmada')->count(),
            'marcacoesRecentes' => Marcacao::with(['paciente', 'medico'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(fn($m) => [
                    'id' => $m->id,
                    'paciente_nome' => $m->paciente->nome,
                    'medico_nome' => $m->medico->nome,
                    'created_at' => $m->created_at,
                    'estado' => $m->estado,
                ]),
        ];

        if ($filtro === 'especialidades' || !$filtro) {
            $data['distribuicaoEspecialidades'] = Marcacao::select(
                'especialidade_id as especialidade',
                DB::raw('count(*) as total')
            )
            ->groupBy('especialidade')
            ->get()
            ->map(fn($m) => ['id' => $m->especialidade, 'value' => $m->total]);
        }

         if ($filtro === 'consultas' || !$filtro) {
             $consultasPorDia = Marcacao::join('vagas', 'vagas.id', '=', 'marcacoes.vaga_id') 
             ->select( DB::raw('DAY(vagas.data) as dia'), DB::raw('COUNT(marcacoes.id) as total') ) 
             ->whereMonth('vagas.data', $mesSelecionado) ->whereYear('vagas.data', $anoSelecionado)
             ->groupBy(DB::raw('DAY(vagas.data)')) ->orderBy(DB::raw('DAY(vagas.data)')) 
             ->get() ->map(function ($item) { 
                return [ 'dia' => (int) $item->dia, 'total' => (int) $item->total, ]; 
            });

            $data['consultasPorDia'] = $consultasPorDia;
        }
    }

   elseif ($role === 'utente') {

    $pacienteId = $user->paciente->id;

    $data += [
       
        'totalConsultas' => Marcacao::where('paciente_id', $pacienteId)->count(),

        'consultasRealizadas' => Marcacao::where('paciente_id', $pacienteId)
            ->where('estado', 'realizada')
            ->count(),

        'consultasConfirmadas' => Marcacao::where('paciente_id', $pacienteId)
            ->where('estado', 'confirmada')
            ->count(),
    ];
}


    return Inertia::render('Dashboard/Index', $data);
}


}
