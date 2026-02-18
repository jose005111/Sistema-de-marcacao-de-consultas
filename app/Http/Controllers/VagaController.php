<?php

namespace App\Http\Controllers;

use App\Models\Vaga;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Especialidade;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VagaController extends Controller
{
    /**
     * Lista as vagas
     */
 public function index(Request $request)
{
    $this->authorize('viewAny', Vaga::class);

    $vagas = Vaga::select(
            'especialidade_id',
            DB::raw('SUM(total_vagas) as total_vagas'),
            DB::raw('SUM(vagas_disponiveis) as vagas_disponiveis'),
            DB::raw('MIN(data) as data') // opcional, se quiser mostrar uma data
        )
        ->with('especialidade')
        ->whereDate('data', '>=', now()->toDateString())
        ->when($request->filled('data'), fn ($q) =>
            $q->whereDate('data', $request->data)
        )
        ->groupBy('especialidade_id')
        ->paginate(10)
        ->appends($request->all());

    return Inertia::render('Vagas', [
        'vagas' => $vagas,
        'especialidades' => Especialidade::all(),
    ]);
}

public function detalhes($especialidadeId)
{
    $vagas = Vaga::where('especialidade_id', $especialidadeId)
        ->whereDate('data', '>=', now()->toDateString())
        ->select(
            'data',
            DB::raw('SUM(total_vagas) as total_vagas'),
            DB::raw('SUM(vagas_disponiveis) as vagas_disponiveis')
        )
        ->groupBy('data')
        ->orderBy('data')
        ->get();

    return response()->json($vagas);
}


public function disponiveis($especialidade)
{
    return Vaga::where('especialidade_id', $especialidade)
        ->whereDate('data', '>=', now())
        ->orderBy('data')
        ->get();
}

    /**
     * Formulário de criação
     */
    public function create()
    {
        return Inertia::render('Vagas/Create', [
            'especialidades' => Especialidade::all(),
        ]);
    }

    /**
     * Armazena vagas (em lote)
     */
    public function store(Request $request)
    {
        $this->authorize('create', Vaga::class);
        $validator = Validator::make($request->all(), [
            'data' => 'required|date|after_or_equal:today',
            'vagas' => 'required|array|min:1',
            'vagas.*.especialidade_id' => 'required|exists:especialidades,id',
            'vagas.*.total_vagas' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        foreach ($request->vagas as $item) {
            Vaga::updateOrCreate(
                [
                    'especialidade_id' => $item['especialidade_id'],
                    'data' => $request->data,
                ],
                [
                    'total_vagas' => $item['total_vagas'],
                    'vagas_disponiveis' => $item['total_vagas'],
                ]
            );
        }

        return redirect()->route('vagas.index')
            ->with('success', 'Vagas disponibilizadas com sucesso!');
    }

    /**
     * Formulário de edição
     */

public function update(Request $request, Vaga $vaga)
{
    $this->authorize('update', $vaga);
    $validator = Validator::make($request->all(), [
        'data' => 'required|date|after_or_equal:today',
        'total_vagas' => 'required|integer|min:1',
    ]);

    if ($validator->fails()) {
        return back()->withErrors($validator)->withInput();
    }

    DB::transaction(function () use ($request, $vaga) {

        // Quantas já foram usadas
        $vagasUsadas = $vaga->total_vagas - $vaga->vagas_disponiveis;

        // Não permitir reduzir abaixo do que já foi marcado
        if ($request->total_vagas < $vagasUsadas) {
            abort(422, 'O total de vagas não pode ser inferior às marcações existentes.');
        }

        // Recalcular disponíveis
        $novaDisponibilidade = $request->total_vagas - $vagasUsadas;

        $vaga->update([
            'data' => $request->data,
            'total_vagas' => $request->total_vagas,
            'vagas_disponiveis' => $novaDisponibilidade,
        ]);
    });

    return back()->with('success', 'Vaga atualizada com sucesso.');
}


    /**
     * Elimina uma vaga
     */


    public function destroy(Vaga $vaga)
{
    $this->authorize('delete', $vaga);
    if ($vaga->vagas_disponiveis < $vaga->total_vagas) {
        return back()->withErrors([
            'message' => 'Não é possível eliminar esta vaga porque já existem marcações associadas.'
        ]);
    }

    $vaga->delete();

    return back()->with('success', 'Vaga eliminada com sucesso.');
}

}
