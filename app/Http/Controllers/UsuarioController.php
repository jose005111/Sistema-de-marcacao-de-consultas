<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index(Request $request)
{
    $this->authorize('viewAny', User::class);
    $query = User::with('medico', 'paciente', 'recepcionista')->latest();


    if ($request->filled('nome')) {
        $query->orWhere('nome', 'like', "%{$request->nome}%");
    }

    if ($request->filled('email')) {
        $query->Where('email', 'like', "%{$request->email}%");  
    }

    if ($request->filled('role')) {
        $query->Where('role', 'like', "%{$request->role}%");
    }

    $usuarios = $query->paginate(10);

    // dd(count($usuarios));
    return Inertia::render('Usuario', [
        'usuarios' => $usuarios
    ]);
}


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', User::class);
        // dd($request->all());
        $validated = $request->validate([
            'username' => 'required|max:255|string',
            'email' => 'required|email|unique:users,email',
            'role' => 'required',
            'password' => 'required|min:8'
        ]);
        $request['password'] = Hash::make($request->password);
         $user = User::create($validated);        
        // $user->assignRole($request->role);
        return redirect()->route('usuarios.index');
    }

  
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $usuario)
    {
        $this->authorize('update', $usuario);
        $validated = $request->validate([
            'username' => 'required|max:255|string',
            'email' => 'required|email|unique:users,email,' .$usuario->id,
            'role' => 'required',
            // 'password' => 'required|min:8'
        ]);
        
        $request['password'] = Hash::make($request->password);
        $usuario->update($validated);
        return redirect()->route('usuarios.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $usuario)
    {      
        $this->authorize('delete', $usuario);         
        $usuario->delete();
        return redirect()->route('usuarios.index');
    }
    
}
