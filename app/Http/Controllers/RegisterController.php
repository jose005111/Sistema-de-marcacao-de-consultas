<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Recepcionista;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd("chegiu");
        return inertia('Pacientes');
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
    public function store(Request $request)
    {   
        $pass = $request->password;
        $request['password'] = Hash::make($request->password);
        $user = User::create($request->all());        
        // $user->assignRole($request->perfil);
        $request['password'] = $pass;
        $credentials = $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->route("utente.perfil");
        }
         return back()->withErrors([
            "credenciais" => "As credenciais fornecidas estão incorretas.",
        ]);
        // return redirect()->route('register.index');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recepcionista $recepcionista)
    {
        $recepcionista->update($request->all());
        return redirect()->route('recepcionistas.index');
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
