<?php

namespace App\Http\Controllers;

use App\Models\Especialidade;
use Illuminate\Http\Request;

class EspecialidadeController extends Controller
{

    public function index(Request $request)
    {
        // dd($request->all());
        $query = Especialidade::withCount('medicos')->latest();
        if($request->filled('nome')){
            $query->where('nome', 'like', "%" . $request->nome ."%");
        }
        $especialidades = $query->paginate(10)->appends($request->all());
        return inertia('Especialidade', ['especialidades' => $especialidades]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:50|unique:especialidades,nome'
        ]); 

        Especialidade::create($validated);
        return redirect()->route('especialidades.index');
    }

    public function update(Request $request, Especialidade $especialidade)
    {
         $validated = $request->validate([
            'nome' => 'required|string|max:50|unique:especialidades,nome,' . $especialidade->id
        ]);
        $especialidade->update($validated);
        return redirect()->route('especialidades.index');
    }

    public function destroy(Especialidade $especialidade)
    {
        if($especialidade->medicos()->count() > 0){
            return redirect()->back();
        }
        $especialidade->delete();
        return redirect()->route('especialidades.index');
    }
}
