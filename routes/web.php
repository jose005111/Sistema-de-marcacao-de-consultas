<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\EspecialidadeController;
use App\Http\Controllers\MarcacaoController;
use App\Http\Controllers\RecepcionistaController;

Route::get('/', [DashboardController::class, 'index']);
Route::get('/dashboard', [DashboardController::class, 'index'])->name("dashboard.index");
Route::post('/login', [AuthController::class, 'login'])->name("login");
Route::get('/perfil', [AuthController::class, 'perfil'])->name("perfil");
Route::post('/logout', [AuthController::class, 'logout']);
Route::resource('pacientes', PacienteController::class);
Route::resource('especialidades', EspecialidadeController::class);
Route::resource('medicos', MedicoController::class);
Route::resource('recepcionistas', RecepcionistaController::class);
Route::resource('usuarios', UsuarioController::class);
Route::resource('register', RegisterController::class);
Route::resource('marcacoes', MarcacaoController::class);

Route::get('/perfil/administrador', [AuthController::class, 'admin'])->name('admin.perfil');
Route::put('/perfil/administrador/{id}', [AuthController::class, 'adminUpdate'])->name('admin.update');

Route::get('/perfil/medico', [MedicoController::class, 'perfil'])->name('medico.perfil');
Route::post('/perfil/medico', [MedicoController::class, 'create'])->name('medico.create');
Route::put('/perfil/medico/{id}', [MedicoController::class, 'updated'])->name('medico.updated');


Route::get('/perfil/utente', [PacienteController::class, 'perfil'])->name('utente.perfil');
// Route::get('/perfil/utente', [PacienteController::class, 'dashboard'])->name('utente.dashboard');
// Route::get('/perfil/utente/{id}', [PacienteController::class, 'updateUser'])->name('utente.user.update');
Route::post('/perfil/utente', [PacienteController::class, 'store'])->name('utente.store');
Route::put('/perfil/utente', [PacienteController::class, 'update'])->name('utente.update');

Route::get('/perfil/recep', [RecepcionistaController::class, 'perfil'])->name('recepcionista.perfil');
Route::post('/perfil/recep', [RecepcionistaController::class, 'store'])->name('recepcionista.store');
Route::put('/perfil/recep', [RecepcionistaController::class, 'update'])->name('recepcionista.update');


