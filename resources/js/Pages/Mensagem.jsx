import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import {
    LiaCommentDotsSolid,
    LiaUserSolid,
    LiaPaperPlaneSolid,
    LiaSearchSolid,
    LiaBellSolid
} from "react-icons/lia";
import { toast } from "react-toastify";
import Loader from "../components/loader";

// Adicionada a prop "isUtente"
export default function ChatInterface({ contatos, mensagens, contatoAtivo, isUtente }) {
    const { auth } = usePage().props;
    const currentUser = auth.user;
    const [pesquisa, setPesquisa] = useState("");
    const mensagensFimRef = useRef(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        destinatario_id: contatoAtivo?.id || '',
        conteudo: ''
    });

    useEffect(() => {
        if (contatoAtivo) setData('destinatario_id', contatoAtivo.id);
    }, [contatoAtivo]);

    const scrollToBottom = () => {
        mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensagens]);

    const enviarMensagem = (e) => {
        e.preventDefault();
        if (!data.conteudo.trim()) return;

        post('/mensagens', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset('conteudo');
                toast.success('SMS enviada com sucesso!');
            },
            onError: () => toast.error('Erro ao enviar a SMS.')
        });
    };

    const contatosFiltrados = contatos?.filter(c =>
        c.username.toLowerCase().includes(pesquisa.toLowerCase()) ||
        c.role.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto p-4 flex gap-4 h-[calc(100vh-100px)]">
            <Head title="Notificações e SMS" />

            {/* SE NÃO FOR UTENTE, MOSTRA A BARRA LATERAL NORMAL */}
            {!isUtente && (
                <div className="w-1/3 bg-white border rounded-lg shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b bg-cyan-50">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                            <LiaCommentDotsSolid className="text-2xl text-cyan-500" />
                            Mensagens
                        </h3>
                        <div className="relative">
                            <LiaSearchSolid className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                placeholder="Pesquisar utilizador..."
                                value={pesquisa}
                                onChange={(e) => setPesquisa(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-gray-50/50">
                        {contatosFiltrados?.map((contato) => {
                            const temMensagem = contato.unread_count > 0;
                            const isAtivo = contatoAtivo?.id === contato.id;

                            return (
                                <Link
                                    key={contato.id}
                                    href={`/mensagens?contato_id=${contato.id}`}
                                    preserveState
                                    preserveScroll
                                    className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isAtivo
                                        ? 'bg-cyan-100 border-l-4 border-cyan-500 shadow-sm'
                                        : temMensagem
                                            ? 'bg-rose-50 border-l-4 border-rose-500 hover:bg-rose-100'
                                            : 'hover:bg-gray-100 border-l-4 border-transparent bg-white border border-gray-100'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${temMensagem && !isAtivo ? 'bg-rose-200 text-rose-600' : 'bg-gray-200 text-gray-600'}`}>
                                        <LiaUserSolid className="text-xl" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <span className={`font-semibold text-sm ${temMensagem && !isAtivo ? 'text-rose-700' : 'text-gray-700'}`}>{contato.username}</span>
                                        <span className={`text-xs capitalize ${temMensagem && !isAtivo ? 'text-rose-500 font-medium' : 'text-gray-500'}`}>{contato.role}</span>
                                    </div>
                                    {temMensagem && !isAtivo && (
                                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                            {contato.unread_count}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ÁREA PRINCIPAL */}
            {/* Se for utente, ocupa a largura toda (flex-1 lida com isso perfeitamente, mas sem a sidebar fica full-width) */}
            <div className="flex-1 bg-white border rounded-lg shadow-sm flex flex-col overflow-hidden">
                {contatoAtivo ? (
                    <>
                        {/* CABEÇALHO DA CONVERSA / NOTIFICAÇÕES */}
                        <div className="p-4 border-b bg-cyan-500 flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                {isUtente ? <LiaBellSolid className="text-2xl text-white" /> : <LiaUserSolid className="text-2xl text-white" />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{contatoAtivo.username}</h3>
                                <p className="text-xs text-cyan-100 capitalize">{contatoAtivo.role}</p>
                            </div>
                        </div>

                        {/* LISTA DE SMS */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                            {mensagens?.length > 0 ? (
                                mensagens.map((msg) => {
                                    // Se for utente, 'isMe' é sempre falso para forçar o layout de recepção
                                    const isMe = !isUtente && msg.remetente_id === currentUser.id;

                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`p-4 shadow-sm ${isUtente
                                                    // Layout para o Utente (Ocupa a largura toda, estilo Notificação)
                                                    ? 'w-full rounded-lg bg-white border border-gray-200 text-gray-800'
                                                    // Layout para Recepcionista/Médico (Estilo Chat 75% da largura)
                                                    : `max-w-[75%] rounded-2xl ${isMe
                                                        ? 'bg-cyan-500 text-white rounded-tr-sm'
                                                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                                                    }`
                                                }`}>

                                                {/* Se for utente, mostra que a mensagem veio da Clínica */}
                                                {isUtente && (
                                                    <span className="flex items-center gap-2 text-xs font-bold text-cyan-600 mb-2 border-b border-gray-100 pb-2 uppercase tracking-wider">
                                                        <LiaBellSolid className="text-lg" />
                                                        {msg.remetente?.username || 'Clínica'}
                                                    </span>
                                                )}

                                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.conteudo}</p>

                                                <span className={`text-[10px] block mt-2 ${isMe ? 'text-cyan-100 text-right' : 'text-gray-400 text-left'}`}>
                                                    {new Date(msg.created_at).toLocaleString('pt-PT', {
                                                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                                    <LiaCommentDotsSolid className="text-5xl text-gray-300" />
                                    <p className="text-sm">
                                        {isUtente ? "Não tem notificações no momento." : `Nenhuma mensagem trocada com ${contatoAtivo.username}.`}
                                    </p>
                                </div>
                            )}
                            <div ref={mensagensFimRef} />
                        </div>

                        {/* FORMULÁRIO DE ENVIO - OCULTADO SE FOR UTENTE */}
                        {!isUtente && (
                            <div className="p-4 border-t bg-white shadow-sm z-10">
                                <form onSubmit={enviarMensagem} className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Escrever nova SMS</label>
                                    <textarea
                                        value={data.conteudo}
                                        onChange={(e) => setData('conteudo', e.target.value)}
                                        placeholder={`Escreva a mensagem para ${contatoAtivo.username}...`}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none bg-gray-50 text-sm"
                                        rows="3"
                                        disabled={processing}
                                    />
                                    {errors.conteudo && <span className="text-rose-500 text-xs font-medium">{errors.conteudo}</span>}

                                    <div className="flex justify-end mt-1">
                                        <button
                                            type="submit"
                                            disabled={processing || !data.conteudo.trim()}
                                            className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-white font-medium text-sm rounded-md hover:bg-cyan-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            {processing ? (
                                                <>A enviar... <Loader className="w-4 h-4 text-white ml-2" /></>
                                            ) : (
                                                <>Enviar <LiaPaperPlaneSolid className="text-lg" /></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </>
                ) : (
                    // MENSAGEM QUANDO NENHUM CONTATO ESTÁ SELECIONADO (Recepcionistas/Médicos)
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                        <div className="bg-white p-8 rounded-full shadow-sm mb-4">
                            <LiaCommentDotsSolid className="text-6xl text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700">Central de Mensagens</h2>
                        <p className="text-gray-500 mt-2 text-sm text-center max-w-sm">
                            Selecione um contato na barra lateral para enviar uma SMS ou ver o histórico.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}