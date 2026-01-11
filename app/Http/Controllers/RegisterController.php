<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
}
