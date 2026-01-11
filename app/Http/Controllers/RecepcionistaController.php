<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Recepcionista;
use Illuminate\Support\Facades\Auth;

class RecepcionistaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth'); // garante que só usuários logados acessem
    }
    /**
     * Display a listing of the resource.
     */
   public function index(Request $request)
{
    $this->authorize('viewAny', Recepcionista::class);
    $query = Recepcionista::query(); // inicia a query

    // Filtra pelo nome
    if ($request->filled('nome')) {
        $query->where('nome', 'like', "%{$request->nome}%");
    }

    // Filtra pela morada
    if ($request->filled('morada')) {
        $query->where('morada', 'like', "%{$request->morada}%");
    }

    // Filtra pelo contacto
    if ($request->filled('contacto')) {
        $query->where('contacto', 'like', "%{$request->contacto}%");
    }

    // Filtra pela data de nascimento
    if ($request->filled('nascimento')) {
        $query->where('nascimento', $request->nascimento); // exato, sem porcentagem
    }

    // Ordena do mais recente para o mais antigo e pagina
    $recepcionistas = $query->latest()->paginate(10)->withQueryString();

    return inertia('Recepcionista', [
        'recepcionistas' => $recepcionistas,
        'filters' => $request->only(['nome', 'morada', 'contacto', 'nascimento'])
    ]);
    }

    /**
     * Show the form for creating a new resource.
     */
   public function perfil()
{
    return Inertia::render('perfil/Recepcionista', [
        'recepcionista' => Recepcionista::where('user_id', Auth()->id())->first(),        
        'usuario' => Auth::user()
    ]);
}

public function store(Request $request)
{
    $this->authorize('create', Recepcionista::class);
    $request->validate([
        'nome' => 'required|string',
        'nascimento' => 'required|date',
        'morada' => 'required|string',
        'contacto' => 'required|string',
        'bi' => 'required|string',
        'sexo' => 'required|string',
    ]);

    Recepcionista::create([
        'nome' => $request->nome,
        'nascimento' => $request->nascimento,
        'morada' => $request->morada,
        'contacto' => $request->contacto,
        'bi' => $request->bi,
        'sexo' => $request->sexo,
        'user_id' => Auth()->id()
    ]);

    return back();
}

public function update(Request $request)
{
    $this->authorize('update', Recepcionista::class);
    $request->validate([
        'nome' => 'required|string',
        'nascimento' => 'required|date',
        'morada' => 'required|string',
        'contacto' => 'required|string',
        'bi' => 'required|string',
        'sexo' => 'required|string',
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
        $this->authorize('delete', $recepcionista);
        $recepcionista->delete();
        return redirect()->route('recepcionistas.index');
    }
}
