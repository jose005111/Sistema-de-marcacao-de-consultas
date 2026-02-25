<?php

namespace App\Http\Controllers;

use App\Models\Especialidade;
use App\Models\Vaga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VagaController extends Controller
{
    /**
     * Lista as vagas
     */
public function index(Request $request)
{
    $this->authorize('viewAny', Vaga::class);

    $vagas = Vaga::query()
        ->with('especialidade')
        ->select(
            'especialidade_id',
            DB::raw('SUM(total_vagas) as total_vagas'),
            DB::raw('SUM(vagas_disponiveis) as vagas_disponiveis'),
            DB::raw('MIN(data) as data') 
        )
        // Filtra para não mostrar datas passadas por padrão
        ->whereDate('data', '>=', now()->toDateString())
        
        // Filtro por Data (se enviado pelo formulário)
        ->when($request->filled('data'), function ($q) use ($request) {
            $q->whereDate('data', $request->data);
        })

        // Filtro por Especialidade (se enviado pelo formulário)
        ->when($request->filled('especialidade_id'), function ($q) use ($request) {
            $q->where('especialidade_id', $request->especialidade_id);
        })

        ->groupBy('especialidade_id')
        // Ordena pela data mais próxima no topo
        ->orderBy(DB::raw('MIN(data)'), 'asc')
        ->paginate(10)
        ->appends($request->all());

    return Inertia::render('Vagas', [
        'vagas' => $vagas,
        'especialidades' => Especialidade::all(),
        // Passamos os filtros de volta para manter os campos preenchidos no modal
        'filters' => $request->only(['data', 'especialidade_id']),
    ]);
}

public function detalhes($especialidadeId)
{
    // Carregamos as vagas com o relacionamento da especialidade
    $vagas = Vaga::with('especialidade') 
        ->where('especialidade_id', $especialidadeId)
        ->whereDate('data', '>=', now()->toDateString())
        ->orderBy('data', 'asc')
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

    $request->validate([
        'especialidade_id' => 'required|exists:especialidades,id',
        'data' => [
            'required',
            'date',
            'after_or_equal:today',
            // Valida se já existe vaga para esta especialidade nesta data
            Rule::unique('vagas')->where(function ($query) use ($request) {
                return $query->where('especialidade_id', $request->especialidade_id)
                             ->where('data', $request->data);
            }),
        ],
        'total_vagas' => 'required|integer|min:1',
    ], [
        'data.unique' => 'Já existem vagas configuradas para esta especialidade nesta data.'
    ]);

    Vaga::create([
        'especialidade_id' => $request->especialidade_id,
        'data' => $request->data,
        'total_vagas' => $request->total_vagas,
        'vagas_disponiveis' => $request->total_vagas,
    ]);

    return redirect()->route('vagas.index')->with('success', 'Vaga criada!');
}
    /**
     * Formulário de edição
     */

public function update(Request $request, Vaga $vaga)
{
    $this->authorize('update', $vaga);
    $validator = Validator::make($request->all(), [
        'data' => [
            'required',
            'date',
            'after_or_equal:today',
            // Valida se já existe vaga para esta especialidade nesta data
            Rule::unique('vagas')->where(function ($query) use ($request) {
                return $query->where('especialidade_id', $request->especialidade_id)
                             ->where('data', $request->data);
            }),
        ],
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
