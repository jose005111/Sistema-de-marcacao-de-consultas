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
        if ($user->role === "admin") {
            return redirect("/dashboard");
        }

        // MÉDICO
        if ($user->role === "medico") {
            $medico = Medico::where("user_id", $user->id)->first();

            if ($medico) {
                return redirect("/dashboard");
            } else {
                return redirect()->route("medico.perfil"); // rota para completar perfil
            }
        }

        // RECEPCIONISTA
        if ($user->role === "recepcionista") {
            $recep = Recepcionista::where("user_id", $user->id)->first();

            if ($recep) {
                return redirect("/dashboard");
            } else {
                return redirect()->route("recepcionista.perfil");
            }
        }

        // UTENTE
        if ($user->role === "utente") {
            $utente = Paciente::where("user_id", $user->id)->first();

            if ($utente) {
                return redirect("/dashboard");
            } else {
                return redirect()->route("utente.perfil");
            }
        }

        return redirect()->route("/");
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
        if ($user->role === "admin") {
            return redirect()->route("admin.perfil");
        }

        // MÉDICO
        if ($user->role === "medico") {
            return redirect()->route("medico.perfil");
        }

        // RECEPCIONISTA
        if ($user->role === "recepcionista") {
            return redirect()->route("recepcionista.perfil");
        }

        // UTENTE
        if ($user->role === "utente") {
            return redirect()->route("utente.perfil");
          
        }
    }
    public function admin(){
        return Inertia::render('perfil/Admin', [
            'usuario' => Auth::user()
        ]);
    }

   public function adminUpdate(Request $request, string $id)
{
    $usuario = User::findOrFail($id);

    // 🔒 validar senha atual
    if (!Hash::check($request->password, $usuario->password)) {
        return back()->withErrors([
            'password' => 'A senha atual está incorreta.'
        ]);
    }

    // ✅ validação
    $validated = $request->validate([
        'username' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $usuario->id,
        'nova_password' => 'nullable|min:8',
        'confirmar_password' => 'same:nova_password',
    ], [
        'confirmar_password.same' => 'As senhas não coincidem.',
        'nova_password.min' => 'A nova senha deve ter pelo menos 8 caracteres.',
    ]);

    // 🔄 atualizar dados
    $usuario->username = $validated['username'];
    $usuario->email = $validated['email'];

    if (!empty($validated['nova_password'])) {
        $usuario->password = Hash::make($validated['nova_password']);
    }

    $usuario->save();

    // ✅ flash padronizado
    return back()->with('success', 'Credenciais atualizadas com sucesso.');
}

}