<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Mensagem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MensagemController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // ---------------------------------------------------------
        // LÓGICA EXCLUSIVA PARA O UTENTE
        // ---------------------------------------------------------
        if ($user->role === 'utente') {
            // Marca todas as mensagens recebidas como lidas
            Mensagem::where('destinatario_id', $user->id)
                ->whereNull('lida_em')
                ->update(['lida_em' => now()]);

            // Busca as mensagens recebidas
            $mensagens = Mensagem::where('destinatario_id', $user->id)
                ->orderBy('created_at', 'asc')
                ->get()
                ->map(function ($msg) {
                    $msgArray = $msg->toArray();
                    // Oculta quem enviou, substituindo por "Clínica"
                    $msgArray['remetente'] = [
                        'id' => 0,
                        'username' => 'Clínica / Notificação',
                        'role' => 'sistema'
                    ];
                    return $msgArray;
                });

            return Inertia::render('Mensagem', [
                'contatos' => [], // Utente não tem lista de contatos
                'mensagens' => $mensagens,
                'contatoAtivo' => [
                    'id' => 'sistema',
                    'username' => 'Caixa de Notificações',
                    'role' => 'Alertas do Sistema'
                ],
                'isUtente' => true // Flag para o React esconder o formulário
            ]);
        }

        // ---------------------------------------------------------
        // LÓGICA PARA RECEPCIONISTAS E MÉDICOS (Mantém-se igual)
        // ---------------------------------------------------------
        $contatoId = $request->query('contato_id');

        $contatos = User::where('id', '!=', $user->id)
            ->withCount(['mensagensEnviadas as unread_count' => function ($query) use ($user) {
                $query->where('destinatario_id', $user->id)->whereNull('lida_em');
            }])
            ->orderByDesc('unread_count')
            ->orderBy('username', 'asc')
            ->get(['id', 'username', 'role']);

        $mensagens = [];
        $contatoAtivo = null;

        if ($contatoId) {
            $contatoAtivo = User::select('id', 'username', 'role')->find($contatoId);

            Mensagem::where('remetente_id', $contatoId)
                    ->where('destinatario_id', $user->id)
                    ->whereNull('lida_em')
                    ->update(['lida_em' => now()]);

            $mensagens = Mensagem::where(function ($query) use ($user, $contatoId) {
                $query->where('remetente_id', $user->id)
                      ->where('destinatario_id', $contatoId);
            })->orWhere(function ($query) use ($user, $contatoId) {
                $query->where('remetente_id', $contatoId)
                      ->where('destinatario_id', $user->id);
            })->with(['remetente:id,username,role', 'destinatario:id,username,role'])
              ->orderBy('created_at', 'asc')
              ->get();
        }

        return Inertia::render('Mensagem', [
            'contatos' => $contatos,
            'mensagens' => $mensagens,
            'contatoAtivo' => $contatoAtivo,
            'isUtente' => false // Flag para o React mostrar o formulário
        ]);
    }

    public function store(Request $request)
    {
        // Segurança: Utentes não podem enviar mensagens via API/Backend
        if ($request->user()->role === 'utente') {
            abort(403, 'Acesso negado. Utentes não podem enviar mensagens.');
        }

        $validated = $request->validate([
            'destinatario_id' => 'required|exists:users,id',
            'conteudo' => 'required|string|max:1000',
        ]);

        Mensagem::create([
            'remetente_id' => $request->user()->id,
            'destinatario_id' => $validated['destinatario_id'],
            'conteudo' => $validated['conteudo'],
        ]);

        return redirect()->back();
    }
}
