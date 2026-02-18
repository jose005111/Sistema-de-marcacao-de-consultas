<?php

namespace App\Http\Controllers;

use App\Models\Especialidade;
use App\Models\Horario;
use App\Models\Marcacao;
use App\Models\Medico;
use App\Models\Paciente;
use App\Models\Vaga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use Barryvdh\DomPDF\Facade\Pdf;
// use Illuminate\Support\Facades\Validator;


class MarcacaoController extends Controller
{
     /**
     * Lista as marcações (com filtro e paginação)
     */
   public function index(Request $request)
{
    $this->authorize('viewAny', Marcacao::class);

    $user = Auth::user();

    $query = Marcacao::with(
        'medico',
        'especialidade',
        'paciente',
        'vaga',
        'horario'
    )->latest();

    /**
     * 🔒 Se for UTENTE, ver apenas as suas marcações
     */
    if ($user->role === 'utente') {
        $query->where('paciente_id', $user->paciente->id);
    }
    /**
     * 🔒 Se for MEDICO, ver apenas as suas marcações
     */
    if ($user->role === 'medico') {
        $query->where('medico_id', $user->medico->id)->where('estado', 'confirmada');
    }

    // 🔍 Filtros opcionais
    if ($request->filled('data')) {
        $query->whereHas('vaga', function ($q) use ($request) {
            $q->whereDate('data', $request->data);
        });
    }

    if ($request->filled('especialidade_id')) {
        $query->where('especialidade_id', $request->especialidade_id);
    }

    if ($request->filled('medico_id')) {
        $query->where('medico_id', $request->medico_id);
    }

    if ($request->filled('paciente_id') && $user->tipo !== 'utente') {
        $query->where('paciente_id', $request->paciente_id);
    }

    $marcacoes = $query->paginate(10)->appends($request->all());

    return Inertia::render('Marcacao', [
        'marcacoes' => $marcacoes,
        'especialidades' => Especialidade::with('medicos')->whereHas('medicos')->get(),
        'pacientes' => $user->tipo === 'utente'
            ? []
            : Paciente::all(),
        // 'vagas' => Vaga::all(),
    ]);
}
    /**
     * Mostra o formulário de criação
     */
    public function create()
    {
        $especialidades = Especialidade::all();
        $pacientes = Paciente::all();

        return Inertia::render('Marcacoes/Create', [
            'especialidades' => $especialidades,
            'pacientes' => $pacientes,
        ]);
    }

    /**
     * Armazena uma nova marcação
     */

public function store(Request $request)
{
       $this->authorize('create', Marcacao::class);
    // dd($request->all());
    $request->validate([
        'especialidade_id' => 'required|exists:especialidades,id',
        'paciente_id' => 'required|exists:pacientes,id',
        'medico_id' => 'required|exists:medicos,id',
        'vaga_id'     => 'required|exists:vagas,id',
        'horario_id'  => 'required|exists:horarios,id',
    ]);
    
    DB::transaction(function () use ($request) {

        $vaga = Vaga::findOrFail($request->vaga_id);

        // mesmo paciente + mesma especialidade + mesmo dia
        $existe = Marcacao::where('paciente_id', $request->paciente_id)
            ->where('especialidade_id', $vaga->especialidade_id)
            ->whereHas('vaga', function ($q) use ($vaga) {
                $q->whereDate('data', $vaga->data);
            })
            ->exists();

        if ($existe) {
        return back()->withErrors([
            'message' => 'O paciente já possui uma marcação para esta especialidade neste dia.'
        ]);
}


        // horário ocupado
        $ocupado = Marcacao::where('vaga_id', $vaga->id)
            ->where('horario_id', $request->horario_id)
            ->exists();

        if ($ocupado) {
            abort(422, 'Este horário já está ocupado.');
        }

        $marcacao = Marcacao::create([
            'paciente_id'      => $request->paciente_id,
            'medico_id'        => $request->medico_id,
            'vaga_id'          => $vaga->id,
            'horario_id'       => $request->horario_id,
            'especialidade_id' => $vaga->especialidade_id,
        ]);
         $marcacao->vaga->decrement('vagas_disponiveis');
    });

    return back()->with('success', 'Marcação efectuada com sucesso!');
}







    /**
     * Mostra o formulário de edição
     */
    public function edit($id)
    {
        $marcacao = Marcacao::with(['especialidade', 'paciente'])->findOrFail($id);
        $especialidades = Especialidade::all();
        $pacientes = Paciente::all();

        return Inertia::render('Marcacoes/Edit', [
            'marcacao' => $marcacao,
            'especialidades' => $especialidades,
            'pacientes' => $pacientes,
        ]);
    }

    /**
     * Atualiza uma marcação
     */

public function update(Request $request, $id)
{
    $request->validate([
        'medico_id' => 'required|exists:medicos,id',
        'paciente_id' => 'required|exists:pacientes,id',
        'vaga_id'     => 'required|exists:vagas,id',
        'horario_id'  => 'required|exists:horarios,id',
    ]);

    DB::transaction(function () use ($request, $id) {

        $marcacao = Marcacao::lockForUpdate()->findOrFail($id);
        
    $this->authorize('update', $marcacao);
        $novaVaga = Vaga::findOrFail($request->vaga_id);

        // horário ocupado
        $horarioOcupado = Marcacao::where('vaga_id', $novaVaga->id)
            ->where('horario_id', $request->horario_id)
            ->where('id', '!=', $marcacao->id)
            ->exists();

        if ($horarioOcupado) {
            abort(422, 'Este horário já está ocupado.');
        }

        // ✔ atualizar dados
        $marcacao->update([
            'paciente_id'      => $request->paciente_id,
            'medico_id'        => $request->medico_id,
            'vaga_id'          => $novaVaga->id,
            'horario_id'       => $request->horario_id,
            'especialidade_id' => $novaVaga->especialidade_id,
        ]);
    });

    return back()->with('success', 'Marcação atualizada com sucesso!');
}


    /**
     * Exclui uma marcação
     */
   public function destroy($id)
{
    

    DB::transaction(function () use ($id) {
        $marcacao = Marcacao::findOrFail($id);

    $this->authorize('delete', $marcacao);
        if ($marcacao->vaga) {
            $marcacao->vaga->increment('vagas_disponiveis');
        }

        $marcacao->delete();
    });

    return redirect()->route('marcacoes.index')
        ->with('success', 'Marcação removida e vaga liberada!');
}
    public function horariosDisponiveis($vagaId)
{
    $horarios = Horario::all();

    $ocupados = Marcacao::where('vaga_id', $vagaId)
        ->pluck('horario_id')
        ->toArray();

    return $horarios->map(function ($h) use ($ocupados) {
        return [
            'id' => $h->id,
            'hora' => $h->hora,
            'disponivel' => !in_array($h->id, $ocupados),
        ];
    });
}


public function imprimir(Marcacao $marcacao)
{
    $marcacao->load(['paciente', 'medico.especialidade']);

    $pdf = Pdf::loadView('pdf.marcacao', compact('marcacao'));

    return $pdf->stream('marcacao.pdf');
}
public function marcarRealizada(Marcacao $marcacao)
{
    $marcacao->estado = 'realizada';
    $marcacao->save();

    return redirect()->route('marcacoes.index')->with('success', 'Marcação marcada como realizada');
}


}
