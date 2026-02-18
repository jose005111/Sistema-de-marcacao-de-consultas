<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EspecialidadeController;
use App\Http\Controllers\MarcacaoController;
use App\Http\Controllers\MedicoController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\RecepcionistaController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\VagaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// -------------------- PUBLIC --------------------
Route::get('/login', function () {
    return Inertia::render('Login');
})->name('home');
Route::get('/', function () {
    return Inertia::render('Login');
})->name('home');

Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout']);
Route::resource('register', RegisterController::class)->only(['index', 'store']);

// -------------------- AUTHENTICATED --------------------
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name("dashboard.index");
Route::get('/vagas/{especialidade}/detalhes', 
    [VagaController::class, 'detalhes']
)->name('vagas.detalhes');

    // Perfis
    Route::get('/perfil', [AuthController::class, 'perfil'])->name("perfil");

    Route::get('/perfil/administrador', [AuthController::class, 'admin'])->name('admin.perfil');
    Route::put('/perfil/administrador/{id}', [AuthController::class, 'adminUpdate'])->name('admin.update');

    Route::get('/perfil/medico', [MedicoController::class, 'perfil'])->name('medico.perfil');
    Route::post('/perfil/medico', [MedicoController::class, 'create'])->name('medico.create');
    Route::put('/perfil/medico/{id}', [MedicoController::class, 'updated'])->name('medico.updated');

    Route::get('/perfil/utente', [PacienteController::class, 'perfil'])->name('utente.perfil');
    Route::post('/perfil/utente', [PacienteController::class, 'store'])->name('utente.store');
    Route::put('/perfil/utente', [PacienteController::class, 'update'])->name('utente.update');

    Route::get('/perfil/recep', [RecepcionistaController::class, 'perfil'])->name('recepcionista.perfil');
    Route::post('/perfil/recep', [RecepcionistaController::class, 'store'])->name('recepcionista.store');
    Route::put('/perfil/recep', [RecepcionistaController::class, 'update'])->name('recepcionista.update');

    // Especialidades (apenas admin)
    Route::resource('especialidades', EspecialidadeController::class)
        ->middleware('can:viewAny,App\Models\Especialidade');

    // Médicos (apenas admin)
    Route::resource('medicos', MedicoController::class)
        ->middleware('can:viewAny,App\Models\Medico');

    // Médicos (apenas admin)
    Route::resource('recepcionistas', RecepcionistaController::class)
        ->middleware('can:viewAny,App\Models\Recepcionista');

    // Usuários (apenas admin)
    Route::resource('usuarios', UsuarioController::class)
        ->middleware('can:viewAny,App\Models\User');

    // Pacientes (admin ou recepcionista)
    Route::resource('pacientes', PacienteController::class)
        ->middleware('can:viewAny,App\Models\Paciente');

    // Vagas (apenas admin)
    Route::resource('vagas', VagaController::class)
        ->middleware('can:viewAny,App\Models\Vaga');

    // Marcações (admin, recepcionista ou paciente)
    Route::resource('marcacoes', MarcacaoController::class)
        ->middleware('can:viewAny,App\Models\Marcacao');

    // Rotas auxiliares
    Route::get('/horarios/disponiveis/{vaga}', [MarcacaoController::class, 'horariosDisponiveis'])
        ->name('horarios.disponiveis');

    Route::get('/vagas/disponiveis/{especialidade}', [VagaController::class, 'disponiveis'])
        ->name('vagas.disponiveis');

    Route::get('/medicos/por-especialidade/{especialidade}', [MedicoController::class, 'medicosPorEspecialidade'])->name('medicos.por-especialidade');
    

    Route::patch('/medicos/{medico}/estado', 
    [MedicoController::class, 'changeState']
)->name('medicos.changeState');

Route::get('/marcacoes/{marcacao}/imprimir', 
    [MarcacaoController::class, 'imprimir']
)->name('marcacoes.imprimir');


Route::patch('/marcacoes/{marcacao}/realizada', [MarcacaoController::class, 'marcarRealizada'])
    ->name('marcacoes.realizada');



});
