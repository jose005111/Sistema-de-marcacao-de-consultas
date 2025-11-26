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
        $totalMedicos = Medico::count();
        $totalUsuarios = User::count();
        $totalRecepcionistas = Recepcionista::count();
        $totalPacientes = Paciente::count();

        // 🔹 Filtros
        $mesSelecionado = $request->get('mes', Carbon::now()->format('m'));
        $anoSelecionado = $request->get('ano', Carbon::now()->format('Y'));

        // ==============================
        // 🔹 Gráfico 1: Distribuição por Especialidade (com filtro de mês e ano)
        // ==============================
        $distribuicaoEspecialidades = Marcacao::select(
                'especialidades.nome as label',
                DB::raw('COUNT(marcacoes.id) as value')
            )
            ->join('especialidades', 'marcacoes.especialidade_id', '=', 'especialidades.id')
            ->whereMonth('marcacoes.data', $mesSelecionado)
            ->whereYear('marcacoes.data', $anoSelecionado)
            ->groupBy('especialidades.nome')
            ->orderBy('especialidades.nome')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->label,
                    'label' => $item->label,
                    'value' => $item->value,
                ];
            });

        // ==============================
        // 🔹 Gráfico 2: Consultas por Dia do Mês
        // ==============================
        $consultasPorDia = Marcacao::select(
                DB::raw('DAY(data) as dia'),
                DB::raw('COUNT(id) as total')
            )
            ->whereMonth('data', $mesSelecionado)
            ->whereYear('data', $anoSelecionado)
            ->groupBy(DB::raw('DAY(data)'))
            ->orderBy(DB::raw('DAY(data)'))
            ->get()
            ->map(function ($item) {
                return [
                    'dia' => $item->dia,
                    'total' => $item->total
                ];
            });

        // 🔹 Renderiza a página
        return Inertia::render('Dashboard', [
            'totalMedicos' => $totalMedicos,
            'totalUsuarios' => $totalUsuarios,
            'totalRecepcionistas' => $totalRecepcionistas,
            'totalPacientes' => $totalPacientes,
            'distribuicaoEspecialidades' => $distribuicaoEspecialidades,
            'consultasPorDia' => $consultasPorDia,
            'mesSelecionado' => $mesSelecionado,
            'anoSelecionado' => $anoSelecionado,
        ]);
    }
}
