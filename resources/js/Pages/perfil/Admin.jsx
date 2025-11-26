import { Head, useForm } from "@inertiajs/react";
import { LiaKeySolid } from "react-icons/lia";
import { useRoute } from "../../../../vendor/tightenco/ziggy/src/js";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Medico({ usuario }) {
    const route = useRoute();
    const [pass1, setPass1] = useState(false)
    const [pass2, setPass2] = useState(false)
    const [pass3, setPass3] = useState(false)

    const { data, setData, put, processing, errors, reset } = useForm({
        username: usuario?.username || "",
        email: usuario?.email || "",
        password: "",
        nova_password: "",
        confirmar_password: "",
    });

    function submit(e) {
        e.preventDefault();
        put(route("admin.update", usuario.id), {
            onSuccess: () => {
                toast.success("Perfil actualizado com sucesso!");
                reset();
            }
        });
    }

    return (
        <div className="p-4">
            <Head title="Perfil do Administrador" />
            <div className="text-lg font-medium flex items-center gap-2 border-b pb-2 mb-4">
                <LiaKeySolid className="text-cyan-400 text-4xl" />
                Editar Perfil do Administrador
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className="font-semibold text-sm text-gray-600 my-2">UserName</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                    />
                    {errors.username && <span className="text-red-600 text-xs">{errors.username}</span>}
                </div>

                <div>
                    <label className="font-semibold text-sm text-gray-600 my-2">Email</label>
                    <input
                        type="email"
                        className="w-full border rounded p-2"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    {errors.email && <span className="text-red-600 text-xs">{errors.email}</span>}
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
                            onChange={(e) => setData("password", e.target.value)}
                            required
                            autoComplete="new-password"

                        />
                    </div>
                    {errors.password && <span className="text-red-600 text-xs">{errors.password}</span>}
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
                            value={data.nova_password}
                            onChange={(e) => setData("nova_password", e.target.value)}
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            inputMode="text"
                            name="nova_password"
                        />
                    </div>
                    {errors.nova_password && <span className="text-red-600 text-xs">{errors.nova_password}</span>}
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
                            value={data.confirmar_password}
                            onChange={(e) => setData("confirmar_password", e.target.value)}
                            autoComplete="new-password"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            inputMode="text"
                            name="confirmar_password"
                        />
                    </div>
                    {errors.confirmar_password && (
                        <span className="text-red-600 text-xs">{errors.confirmar_password}</span>
                    )}
                </div>

                {/* Botão */}
                <div className="md:col-span-2 flex justify-end mt-4">
                    <button
                        disabled={processing}
                        className="min-w-[150px] min-h-[40px] bg-cyan-400 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg"
                    >
                        {processing ? (
                            <span className="flex justify-center"> <Loader /> </span>
                        ) : "Atualizar"}
                    </button>
                </div>

            </form>
        </div>
    );
}
