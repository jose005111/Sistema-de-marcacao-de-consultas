<?php

namespace App\Http\Controllers;

use App\Models\Especialidade;
use App\Models\Medico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MedicoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index(Request $request)
{
    $query = Medico::with('especialidade');

    if ($request->filled('ordem')) {
        $query->where('ordem', 'like', $request->ordem);
    }

    if ($request->filled('nome')) {
        $query->orWhere('nome', 'like', "%{$request->nome}%");
    }

    if ($request->filled('morada')) {
        $query->Where('morada', 'like', "%{$request->morada}%");  
    }

    if ($request->filled('contacto')) {
        $query->Where('contacto', 'like', "%{$request->contacto}%");
    }

    $medicos = $query->latest()->paginate(10);
    $especialidades = Especialidade::all();

    return inertia('Medico', [
        'medicos' => $medicos,
        'especialidades' => $especialidades
    ]);
}
public function perfil()
{
    $especialidades = Especialidade::all();
    return Inertia::render('perfil/Medico', [
        'especialidades' => $especialidades,
        'medico' => Medico::where('user_id', Auth()->user()->id)->with('especialidade')->first(),
        'usuario' => Auth::user()
    ]);
}

    public function store(Request $request)
    {
        $request['user_id'] = Auth::user()->id;
        $validated = $request->validate([
            'nome' => 'required|max:255|string',
            'ordem' => 'required|unique:medicos,ordem',
            'nascimento' => 'required',
            'contacto' => 'required',
            'morada' => 'required|max:255',
            'contacto' => 'required',
            'especialidade_id' => 'required|exists:especialidades,id',
            'user_id' => 'required'
        ]);
        Medico::create($validated);
        return redirect()->route('medicos.index');
    }

    public function create(Request $request)
    {
        $request['user_id'] = Auth::user()->id;
        $validated = $request->validate([
            'nome' => 'required|max:255|string',
            'ordem' => 'required|unique:medicos,ordem',
            'nascimento' => 'required',
            'contacto' => 'required',
            'morada' => 'required|max:255',
            'contacto' => 'required',
            'especialidade_id' => 'required|exists:especialidades,id',
            'user_id' => 'required'
        ]);
        Medico::create($validated);
        return redirect()->back();
    }

  
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Medico $medico)
    {
        $validated = $request->validate([
            'nome' => 'required|max:255|string',
            'ordem' => 'required|unique:medicos,ordem,'.$medico->id,
            'nascimento' => 'required',
            'contacto' => 'required',
            'morada' => 'required|max:255',
            'contacto' => 'required',
            'especialidade_id' => 'required|exists:especialidades,id',
            'user_id' => 'required' 
        ]);
        $medico->update($validated);
        return redirect()->route('medicos.index');
    }

    public function updated(Request $request, string $id)
    {
        $medico = Medico::find($id)->first();
        $request['user_id'] = Auth::user()->id;
        // dd($request->all());
        $validated = $request->validate([
            'nome' => 'required|max:255|string',
            'ordem' => 'required|unique:medicos,ordem,'.$medico->id,
            'nascimento' => 'required',
            'contacto' => 'required',
            'morada' => 'required|max:255',
            'contacto' => 'required',
            'especialidade_id' => 'required|exists:especialidades,id',
            'user_id' => 'required' 
        ]);
        $medico->update($validated);
        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Medico $medico)
    {
               
        $medico->delete();
        return redirect()->route('medicos.index');
    }
}
