<?php

namespace App\Http\Controllers;

use App\Models\Marcacao;
use App\Models\Especialidade;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MarcacaoController extends Controller
{
    /**
     * Lista as marcações (com filtro e paginação)
     */
    public function index(Request $request)
    {
        $query = Marcacao::with('especialidade', 'paciente')->latest();

        // 🔍 Filtros opcionais
        if ($request->filled('data')) {
            $query->whereDate('data', $request->data);
        }

        if ($request->filled('hora')) {
            $query->where('hora', 'like', "%{$request->hora}%");
        }

        if ($request->filled('especialidade_id')) {
            $query->where('especialidade_id', $request->especialidade_id);
        }
        if ($request->filled('paciente_id')) {
            $query->where('paciente_id', $request->paciente_id);
        }

        $marcacoes = $query->paginate(10)->appends($request->all());
        $especialidades = Especialidade::all();
        $pacientes = Paciente::all();

        return Inertia::render('Marcacao', [
            'marcacoes' => $marcacoes,
            'especialidades' => $especialidades,
            'pacientes' => $pacientes,
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
        $validator = Validator::make($request->all(), [
            'especialidade_id' => 'required|exists:especialidades,id',
            'paciente_id' => 'required|exists:pacientes,id',
            'data' => 'required|date|after_or_equal:today',
            'hora' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Marcacao::create([
            'especialidade_id' => $request->especialidade_id,
            'paciente_id' => $request->paciente_id,
            'data' => $request->data,
            'hora' => $request->hora,
        ]);

        return redirect()->route('marcacoes.index')
            ->with('success', 'Consulta marcada com sucesso!');
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
        $marcacao = Marcacao::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'data' => 'nullable|date|after_or_equal:today',
            'hora' => 'nullable|date_format:H:i',
            'paciente_id' => 'nullable|exists:pacientes,id',
            'especialidade_id' => 'nullable|exists:especialidades,id',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $marcacao->update($request->only(['data', 'hora', 'paciente_id', 'especialidade_id']));

        return redirect()->route('marcacoes.index')
            ->with('success', 'Marcação atualizada com sucesso!');
    }

    /**
     * Exclui uma marcação
     */
    public function destroy($id)
    {
        $marcacao = Marcacao::findOrFail($id);
        $marcacao->delete();

        return redirect()->route('marcacoes.index')
            ->with('success', 'Marcação removida com sucesso!');
    }
}
