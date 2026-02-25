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

    // Garante que mes e ano venham como inteiros e com fallback para o atual
    $mesSelecionado = (int) $request->get('mes', now()->month);
    $anoSelecionado = (int) $request->get('ano', now()->year);
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

        // Melhoria na busca por Especialidades
        if ($filtro === 'especialidades' || !$filtro) {
            $data['distribuicaoEspecialidades'] = Marcacao::query()
                ->join('especialidades', 'marcacoes.especialidade_id', '=', 'especialidades.id')
                ->join('vagas', 'marcacoes.vaga_id', '=', 'vagas.id') // Join direto pela vaga da marcação
                ->whereMonth('vagas.data', $mesSelecionado)
                ->whereYear('vagas.data', $anoSelecionado)
                ->select('especialidades.nome as label', DB::raw('COUNT(marcacoes.id) as value'))
                ->groupBy('especialidades.nome')
                ->get()
                ->map(fn($item) => [
                    'id' => $item->label,
                    'label' => $item->label,
                    'value' => (int) $item->value,
                ]);
        }

        // Consultas por dia (Admin)
        if ($filtro === 'consultas' || !$filtro) {
            $data['consultasPorDia'] = Marcacao::join('vagas', 'vagas.id', '=', 'marcacoes.vaga_id')
                ->whereMonth('vagas.data', $mesSelecionado)
                ->whereYear('vagas.data', $anoSelecionado)
                ->select(DB::raw('DAY(vagas.data) as dia'), DB::raw('COUNT(marcacoes.id) as total'))
                ->groupBy(DB::raw('DAY(vagas.data)'))
                ->get()
                ->map(fn($item) => [
                    'dia' => (int) $item->dia,
                    'total' => (int) $item->total,
                ]);
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

          // Consultas por dia (Admin)
        if ($filtro === 'consultas' || !$filtro) {
            $data['consultasPorDia'] = Marcacao::join('vagas', 'vagas.id', '=', 'marcacoes.vaga_id')
                ->whereMonth('vagas.data', $mesSelecionado)
                ->whereYear('vagas.data', $anoSelecionado)
                ->where('marcacoes.medico_id', $medicoId)
                ->select(DB::raw('DAY(vagas.data) as dia'), DB::raw('COUNT(marcacoes.id) as total'))
                ->groupBy(DB::raw('DAY(vagas.data)'))
                ->get()
                ->map(fn($item) => [
                    'dia' => (int) $item->dia,
                    'total' => (int) $item->total,
                ]);
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

        // Melhoria na busca por Especialidades
        if ($filtro === 'especialidades' || !$filtro) {
            $data['distribuicaoEspecialidades'] = Marcacao::query()
                ->join('especialidades', 'marcacoes.especialidade_id', '=', 'especialidades.id')
                ->join('vagas', 'marcacoes.vaga_id', '=', 'vagas.id') // Join direto pela vaga da marcação
                ->whereMonth('vagas.data', $mesSelecionado)
                ->whereYear('vagas.data', $anoSelecionado)
                ->select('especialidades.nome as label', DB::raw('COUNT(marcacoes.id) as value'))
                ->groupBy('especialidades.nome')
                ->get()
                ->map(fn($item) => [
                    'id' => $item->label,
                    'label' => $item->label,
                    'value' => (int) $item->value,
                ]);
        }

        // Consultas por dia (Admin)
        if ($filtro === 'consultas' || !$filtro) {
            $data['consultasPorDia'] = Marcacao::join('vagas', 'vagas.id', '=', 'marcacoes.vaga_id')
                ->whereMonth('vagas.data', $mesSelecionado)
                ->whereYear('vagas.data', $anoSelecionado)
                ->select(DB::raw('DAY(vagas.data) as dia'), DB::raw('COUNT(marcacoes.id) as total'))
                ->groupBy(DB::raw('DAY(vagas.data)'))
                ->get()
                ->map(fn($item) => [
                    'dia' => (int) $item->dia,
                    'total' => (int) $item->total,
                ]);
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
