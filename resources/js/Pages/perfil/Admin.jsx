import { Head, useForm } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { LiaKeySolid, LiaTimesSolid } from "react-icons/lia";
import { useRoute } from "../../../../vendor/tightenco/ziggy/src/js";
import { toast } from "react-toastify";
import Loader from "@/components/loader";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Administrador({ usuario }) {
    const route = useRoute();

    const [open, setOpen] = useState(false);
    const [pass1, setPass1] = useState(false);
    const [pass2, setPass2] = useState(false);
    const [pass3, setPass3] = useState(false);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        reset
    } = useForm({
        username: usuario?.username ?? "",
        email: usuario?.email ?? "",
        password: "",
        nova_password: "",
        confirmar_password: "",
    });

    function submit(e) {
        e.preventDefault();

        put(route("admin.update", usuario.id), {
            onSuccess: () => {
                toast.success("Credenciais atualizadas com sucesso!");
                reset("password", "nova_password", "confirmar_password");
                setOpen(false);
            },
            onError: (errors) => {
                toast.error(
                    errors?.password ||
                    errors?.email ||
                    errors?.nova_password ||
                    errors?.confirmar_password ||
                    "Erro ao atualizar as credenciais."
                );
            }
        });
    }

    return (
        <div className="p-4">
            <Head title="Administrador" />

            {/* BOTÃO */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
            >
                <LiaKeySolid className="text-xl" />
                Credenciais
            </button>

            {/* MODAL */}
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <div className="fixed inset-0 bg-black/40" />

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <Dialog.Title className="font-semibold text-lg">
                                    Credenciais do Administrador
                                </Dialog.Title>
                                <button onClick={() => setOpen(false)}>
                                    <LiaTimesSolid className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="space-y-3">

                                {/* USERNAME */}
                                <input
                                    className="w-full border p-2 rounded"
                                    value={data.username}
                                    onChange={e => setData("username", e.target.value)}
                                    placeholder="Username"
                                    required
                                />
                                {errors.username && <p className="text-red-600 text-xs">{errors.username}</p>}

                                {/* EMAIL */}
                                <input
                                    className="w-full border p-2 rounded"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData("email", e.target.value)}
                                    placeholder="Email"
                                    required
                                />
                                {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}

                                {/* SENHA ATUAL */}
                                <div className="relative">
                                    <span
                                        onClick={() => setPass1(!pass1)}
                                        className="absolute inset-y-0 right-0 flex items-center pe-2 cursor-pointer"
                                    >
                                        {pass1 ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                    <input
                                        type={pass1 ? "text" : "password"}
                                        className="w-full border p-2 rounded"
                                        placeholder="Senha atual"
                                        onChange={e => setData("password", e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}

                                {/* NOVA SENHA */}
                                <div className="relative">
                                    <span
                                        onClick={() => setPass2(!pass2)}
                                        className="absolute inset-y-0 right-0 flex items-center pe-2 cursor-pointer"
                                    >
                                        {pass2 ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                    <input
                                        type={pass2 ? "text" : "password"}
                                        className="w-full border p-2 rounded"
                                        placeholder="Nova senha"
                                        value={data.nova_password}
                                        onChange={e => setData("nova_password", e.target.value)}
                                    />
                                </div>
                                {errors.nova_password && <p className="text-red-600 text-xs">{errors.nova_password}</p>}

                                {/* CONFIRMAR SENHA */}
                                <div className="relative">
                                    <span
                                        onClick={() => setPass3(!pass3)}
                                        className="absolute inset-y-0 right-0 flex items-center pe-2 cursor-pointer"
                                    >
                                        {pass3 ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                    <input
                                        type={pass3 ? "text" : "password"}
                                        className="w-full border p-2 rounded"
                                        placeholder="Confirmar nova senha"
                                        value={data.confirmar_password}
                                        onChange={e => setData("confirmar_password", e.target.value)}
                                    />
                                </div>
                                {errors.confirmar_password && <p className="text-red-600 text-xs">{errors.confirmar_password}</p>}

                                {/* BOTÕES */}
                                <div className="flex justify-between pt-3">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        disabled={processing}
                                        className="bg-cyan-500 text-white px-4 py-2 rounded min-w-[120px]"
                                    >
                                        {processing ? <Loader /> : "Atualizar"}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
