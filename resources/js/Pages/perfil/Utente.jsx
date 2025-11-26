import { Head, useForm } from "@inertiajs/react";
import { LiaUserInjuredSolid, LiaKeySolid } from "react-icons/lia";
import { useRoute } from "../../../../vendor/tightenco/ziggy/src/js";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Utente({ paciente, usuario }) {

    const route = useRoute();

    const [pass1, setPass1] = useState(false)
    const [pass2, setPass2] = useState(false)
    const [pass3, setPass3] = useState(false)

    const { data, setData, post, put, processing, errors } = useForm({
        nome: paciente?.nome || "",
        nascimento: paciente?.nascimento || "",
        morada: paciente?.morada || "",
        contacto: paciente?.contacto || "",
    });
    const { data: user, setData: setUser, put: userPut, processing: userProcessing, errors: userErrors, reset } = useForm({
        username: usuario?.username || "",
        email: usuario?.email || "",
        password: "",
        nova_password: "",
        confirmar_password: "",
    });
    function submited(e) {
        e.preventDefault();
        userPut(route("admin.update", usuario.id), {
            onSuccess: () => {
                toast.success("Perfil actualizado com sucesso!");
                reset();
            }
        });
    }


    function submit(e) {
        e.preventDefault();

        if (paciente) {
            // editar
            put(route("utente.update"), {
                onSuccess: () => {
                    toast.success("Perfil atualizado com sucesso!");
                    setOpen(false);
                },
                onError: () => toast.error("Erro ao atualizar o perfil!")
            });
        } else {
            // criar
            post(route("utente.store"), {
                onSuccess: () => {
                    toast.success("Perfil criado com sucesso!");
                    setOpen(false);
                },
                onError: () => toast.error("Erro ao criar o perfil!")
            });
        }
    }

    return (
        <div className="overflow-y-auto h-[calc(100vh-120px)] p-4">
            <div className="p-4 mb-8 border-b">
                <Head title="Perfil do Utente" />

                <div className="text-lg font-medium flex items-center gap-2 border-b pb-2 mb-4">
                    <LiaUserInjuredSolid className="text-cyan-400 text-4xl" />
                    {paciente ? "Editar Perfil do Utente" : "Completar Perfil do Utente"}
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Nome */}
                    <div>
                        <label className="font-semibold text-sm text-gray-600 my-2">Nome</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={data.nome}
                            onChange={(e) => setData("nome", e.target.value)}
                            pattern="[a-zA-ZÀ-ÿ\s]+"
                            required
                            maxLength={255}
                        />
                        {errors.nome && <span className="text-red-600 text-xs">{errors.nome}</span>}
                    </div>

                    {/* Data de nascimento */}
                    <div>
                        <label className="font-semibold text-sm text-gray-600 my-2">Data de nascimento</label>
                        <input
                            type="date"
                            className="w-full border rounded p-2"
                            value={data.nascimento}
                            onChange={(e) => setData("nascimento", e.target.value)}
                            min="1900-01-01"
                            max="2100-12-31"
                            required
                        />
                        {errors.nascimento && <span className="text-red-600 text-xs">{errors.nascimento}</span>}
                    </div>

                    {/* Contacto */}
                    <div>
                        <label className="font-semibold text-sm text-gray-600 my-2">Contacto</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={data.contacto}
                            onChange={(e) => setData("contacto", e.target.value)}
                            pattern="9\d{8}"
                            required
                        />
                        {errors.contacto && <span className="text-red-600 text-xs">{errors.contacto}</span>}
                    </div>

                    {/* Morada */}
                    <div>
                        <label className="font-semibold text-sm text-gray-600 my-2">Morada</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={data.morada}
                            onChange={(e) => setData("morada", e.target.value)}
                            required
                        />
                        {errors.morada && <span className="text-red-600 text-xs">{errors.morada}</span>}
                    </div>

                    {/* Botão */}
                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button
                            disabled={processing}
                            className="min-w-[150px] min-h[40]  bg-cyan-400 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg"
                        >
                            {processing ? (
                                <span className="flex justify-content"><Loader /></span>

                            ) : paciente ? "Atualizar" : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="p-4">
                <div className="text-lg font-medium flex items-center gap-2 border-b pb-2 mb-4">
                    <LiaKeySolid className="text-cyan-400 text-4xl" />
                    Editar Perfil de Usuário
                </div>

                <form onSubmit={submited} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label className="font-semibold text-sm text-gray-600 my-2">UserName</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            value={user.username}
                            onChange={(e) => setUser("username", e.target.value)}
                            required
                        />
                        {userErrors.username && <span className="text-red-600 text-xs">{userErrors.username}</span>}
                    </div>

                    <div>
                        <label className="font-semibold text-sm text-gray-600 my-2">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded p-2"
                            value={user.email}
                            onChange={(e) => setUser("email", e.target.value)}
                            required
                        />
                        {userErrors.email && <span className="text-red-600 text-xs">{userErrors.email}</span>}
                    </div>
                    {/* SENHA ATUAL */}
                    <div>
                        <label className="font-semibold text-sm text-gray-600 my-2">Senha</label>
                        <div className="relative">
                            <span
                                onClick={() => setPass1(!pass1)}
                                className="absolute inset-y-0 right-0 flex items-center text-gray-500 pe-1 cursor-pointer"

                            >
                                {pass1 ? (<FiEyeOff className="text-2xl" />) : (<FiEye className="text-2xl" />)}
                            </span>

                            <input
                                type={pass1 ? "text" : "password"}
                                onChange={(e) => setUser("password", e.target.value)}
                                required
                                autoComplete="new-password"

                            />
                        </div>
                        {userErrors.password && <span className="text-red-600 text-xs">{userErrors.password}</span>}
                    </div>

                    {/* NOVA SENHA */}
                    <div>
                        <label className="font-semibold text-sm text-gray-600 my-2">Nova Senha</label>
                        <div className="relative">
                            <span
                                onClick={() => setPass2(!pass2)}
                                className="absolute inset-y-0 right-0 flex items-center text-gray-500 pe-1 cursor-pointer"
                            >
                                {pass2 ? (<FiEyeOff className="text-2xl" />) : (<FiEye className="text-2xl" />)}
                            </span>

                            <input
                                type={pass2 ? "text" : "password"}
                                value={user.nova_password}
                                onChange={(e) => setUser("nova_password", e.target.value)}
                                autoComplete="new-password"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                inputMode="text"
                                name="nova_password"
                            />
                        </div>
                        {userErrors.nova_password && <span className="text-red-600 text-xs">{userErrors.nova_password}</span>}
                    </div>

                    {/* CONFIRMAR SENHA */}
                    <div>
                        <label className="font-semibold text-sm text-gray-600 my-2">Confirmar Senha</label>
                        <div className="relative">
                            <span
                                onClick={() => setPass3(!pass3)}
                                className="absolute inset-y-0 right-0 flex items-center text-gray-500 pe-1 cursor-pointer"
                            >
                                {pass3 ? (<FiEyeOff className="text-2xl" />) : (<FiEye className="text-2xl" />)}
                            </span>

                            <input
                                type={pass3 ? "text" : "password"}
                                value={user.confirmar_password}
                                onChange={(e) => setUser("confirmar_password", e.target.value)}
                                autoComplete="new-password"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                inputMode="text"
                                name="confirmar_password"
                            />
                        </div>
                        {userErrors.confirmar_password && (
                            <span className="text-red-600 text-xs">{userErrors.confirmar_password}</span>
                        )}
                    </div>

                    {/* Botão */}
                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button
                            disabled={userProcessing}
                            className="min-w-[150px] min-h-[40px] bg-cyan-400 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg"
                        >
                            {userProcessing ? (
                                <span className="flex justify-center"> <Loader /> </span>
                            ) : "Atualizar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
