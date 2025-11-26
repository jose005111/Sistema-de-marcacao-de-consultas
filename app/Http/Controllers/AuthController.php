<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Medico;
use App\Models\Paciente;
use Illuminate\Http\Request;
use App\Models\Recepcionista;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
// use Mockery\Generator\StringManipulation\Pass\Pass;

class AuthController extends Controller
{
    public function login(Request $request){
        $credentials = $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        if (!Auth::attempt($credentials)) {
            return back()->withErrors([
                "credenciais" => "As credenciais fornecidas estão incorretas.",
            ]);
        }

        $request->session()->regenerate();
        $user = Auth::user();

        // ADMINISTRADOR
        if ($user->perfil === "Administrador") {
            return redirect("/dashboard");
        }

        // MÉDICO
        if ($user->perfil === "Medico") {
            $medico = Medico::where("user_id", $user->id)->first();

            if ($medico) {
                return redirect("/dashboard");
            } else {
                return redirect()->route("medico.perfil"); // rota para completar perfil
            }
        }

        // RECEPCIONISTA
        if ($user->perfil === "Recepcionista") {
            $recep = Recepcionista::where("user_id", $user->id)->first();

            if ($recep) {
                return redirect("/dashboard");
            } else {
                return redirect()->route("recep.perfil");
            }
        }

        // UTENTE
        if ($user->perfil === "Utente") {
            $utente = Paciente::where("user_id", $user->id)->first();

            if ($utente) {
                return redirect("/dashboard");
            } else {
                return redirect()->route("utente.perfil");
            }
        }

        return redirect()->route("login");
    }


    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect("/dashboard");
    }
    
    public function perfil(){

         $user = Auth::user();

        // ADMINISTRADOR
        if ($user->perfil === "Administrador") {
            return redirect()->route("admin.perfil");
        }

        // MÉDICO
        if ($user->perfil === "Medico") {
            return redirect()->route("medico.perfil");
        }

        // RECEPCIONISTA
        if ($user->perfil === "Recepcionista") {
            return redirect()->route("recepcionista.perfil");
        }

        // UTENTE
        if ($user->perfil === "Utente") {
            return redirect()->route("utente.perfil");
          
        }
    }
    public function admin(){
        return Inertia::render('perfil/Admin', [
            'usuario' => Auth::user()
        ]);
    }

    public function adminUpdate(Request $request, string $id){
        $usuario = User::findOrFail($id);

        if (!Hash::check($request->password, $usuario->password)) {
            return back()->withErrors(['password' => 'Senha atual incorreta']);
        }


        // VALIDAR CAMPOS
        $validated = $request->validate([
            'username' => 'required|max:255|string',
            'email' => 'required|email|unique:users,email,' . $usuario->id,
            'nova_password' => 'nullable|min:8',
            'confirmar_password' => 'same:nova_password'
        ], [
            'confirmar_password.same' => 'As senhas não coincidem.'
        ]);

        // ATUALIZA CAMPOS BÁSICOS
        $usuario->username = $request->username;
        $usuario->email = $request->email;

        // SE O USUÁRIO DIGITOU NOVA SENHA
        if (!empty($request->nova_password)) {
            $usuario->password = Hash::make($request->nova_password);
        }

        $usuario->save();

        return back();
    }
}