<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Recepcionista;

class RecepcionistaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recepcionistas = Recepcionista::latest()->paginate(10);
        return inertia('Recepcionista', ['recepcionistas' => $recepcionistas]);
    }

    /**
     * Show the form for creating a new resource.
     */
   public function perfil()
{
    return Inertia::render('perfil/Recepcionista', [
        'recepcionista' => Recepcionista::where('user_id', Auth()->id())->first()
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

    Recepcionista::create([
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

    $recepcionista = Recepcionista::where('user_id', Auth()->id())->firstOrFail();

    $recepcionista->update($request->all());

    return back();
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recepcionista $recepcionista)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recepcionista $recepcionista)
    {
        $recepcionista->delete();
        return redirect()->route('recepcionistas.index');
    }
}
