<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Paciente::latest();
        
        $pacientes  = $query->paginate(10);
        return inertia('Paciente', ['pacientes' => $pacientes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
   public function perfil()
{
    // dd("aqui");
    // dd(Auth::user());
    return Inertia::render('perfil/Utente', [
        'paciente' => Paciente::where('user_id', Auth()->id())->first(),
        'usuario' => Auth::user()

    ]);
}

public function store(Request $request)
{
    $request->validate([
        'nome' => 'required|string',
        'nascimento' => 'required|date',
        'morada' => 'required|string',
        'contacto' => 'required|string',
    ]);

    Paciente::create([
        'nome' => $request->nome,
        'nascimento' => $request->nascimento,
        'morada' => $request->morada,
        'contacto' => $request->contacto,
        'user_id' => Auth()->id()
    ]);

    return back();
}

public function update(Request $request)
{
    $request->validate([
        'nome' => 'required|string',
        'nascimento' => 'required|date',
        'morada' => 'required|string',
        'contacto' => 'required|string',
    ]);

    $paciente = Paciente::where('user_id', Auth()->id())->firstOrFail();

    $paciente->update($request->all());

    return back();
}

    /**
     * Display the specified resource.
     */
    public function updateUser(Request $request,  string $id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paciente $paciente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paciente $paciente)
    {
        $paciente->delete();
        return redirect()->route("pacientes.index");
    }
}
