import { Head, useForm, usePage } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { LiaUserInjuredSolid, LiaKeySolid, LiaTimesSolid } from "react-icons/lia";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRoute } from "../../../../vendor/tightenco/ziggy/src/js";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

export default function Utente({ paciente, usuario }) {
    const route = useRoute();
    const { flash } = usePage().props;
    const [flashMsg, setFlashMsg] = useState(
        flash?.message || flash?.success || null
    );



    const [openPerfil, setOpenPerfil] = useState(false);
    const [openCredenciais, setOpenCredenciais] = useState(false);

    const [pass1, setPass1] = useState(false);
    const [pass2, setPass2] = useState(false);
    const [pass3, setPass3] = useState(false);

    /* ================== FORM PERFIL UTENTE ================== */
    const {
        data,
        setData,
        put,
        post,
        processing,
        errors,
    } = useForm({
        nome: paciente?.nome || "",
        bi: paciente?.bi || "",
        sexo: paciente?.sexo || "",
        nascimento: paciente?.nascimento || "",
        contacto: paciente?.contacto || "",
        morada: paciente?.morada || "",
    });

    function submitPerfil(e) {
        e.preventDefault();
        if (paciente) {
            // editar
            put(route("utente.update"), {
                onSuccess: () => {
                    toast.success("Perfil atualizado com sucesso!");
                    setOpenPerfil(false);
                },
                onError: () => {
                    toast.error("Erro ao atualizar o perfil!");
                    setOpenPerfil(false);
                }
            });
        } else {
            // criar
            post(route("utente.store"), {
                onSuccess: () => {
                    toast.success("Perfil criado com sucesso!");
                    setOpenPerfil(false);
                },
                onError: () => {
                    toast.error("Erro ao criar o perfil!");
                    setOpenPerfil(false);
                }
            });
        }
    }

    /* ================== FORM CREDENCIAIS ================== */
    const {
        data: user,
        setData: setUser,
        put: userPut,
        processing: userProcessing,
        errors: userErrors,
        reset,
    } = useForm({
        username: usuario?.username || "",
        email: usuario?.email || "",
        password: "",
        nova_password: "",
        confirmar_password: "",
    });

    function submitCredenciais(e) {
        e.preventDefault();

        userPut(route("admin.update", usuario.id), {
            onSuccess: () => {
                toast.success("Credenciais atualizadas com sucesso!");
                reset("password", "nova_password", "confirmar_password");
                setOpenCredenciais(false);
            },

            onError: (errors) => {
                if (errors.password) {
                    toast.error(errors.password);
                } else if (errors.email) {
                    toast.error(errors.email);
                } else if (errors.nova_password) {
                    toast.error(errors.nova_password);
                } else if (errors.confirmar_password) {
                    toast.error(errors.confirmar_password);
                } else {
                    toast.error("Erro ao atualizar as credenciais.");
                }
            }
        });
    }


    return (
        <div className="overflow-y-auto h-[calc(100vh-120px)] p-4">
            <Head title="Perfil do Utente" />

            {/* ================== CABEÇALHO ================== */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <div className="flex items-center gap-2">
                    <LiaUserInjuredSolid className="text-cyan-500 text-4xl" />
                    <h2 className="text-lg font-semibold">Perfil do Utente</h2>
                </div>
                {/* ================== BOTÕES ================== */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setOpenPerfil(true)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                    >
                        {paciente ? "Editar Perfil" : "Criar Perfil"}
                    </button>

                    <button
                        onClick={() => setOpenCredenciais(true)}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                    >
                        Credenciais
                    </button>
                </div>
            </div>

            {/* ================== VISUALIZAÇÃO DOS DADOS ================== */}
            <div className="flex justify-center">
                <div className="flex flex-col space-y-2 mt-4 px-3 py-4 rounded border bg-white w-full max-w-md">
                    <div className="flex justify-between">
                        <label className="font-bold">Nome</label>
                        <span>{paciente?.nome ?? "Não informado"}</span>
                    </div>

                    <div className="flex justify-between">
                        <label className="font-bold">BI</label>
                        <span>{paciente?.bi ?? "Não informado"}</span>
                    </div>

                    <div className="flex justify-between">
                        <label className="font-bold">Gênero</label>
                        <span>{paciente?.sexo ?? "Não informado"}</span>
                    </div>

                    <div className="flex justify-between">
                        <label className="font-bold">Data de Nascimento</label>
                        <span> {paciente?.nascimento
                            ? new Date(paciente.nascimento).toLocaleDateString()
                            : "Não informado"}</span>
                    </div>

                    <div className="flex justify-between">
                        <label className="font-bold">Contacto</label>
                        <span>{paciente?.contacto ?? "Não informado"}</span>
                    </div>

                    <div className="flex justify-between">
                        <label className="font-bold">Morada</label>
                        <span>{paciente?.morada ?? "Não informado"}</span>
                    </div>
                </div>
            </div>

            {/* ================== MODAL PERFIL ================== */}
            <Transition appear show={openPerfil} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpenPerfil}>
                    <div className="fixed inset-0 bg-black/40" />

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <Dialog.Title className="font-semibold text-lg">
                                    {paciente ? "Editar Perfil" : "Criar Perfil"}
                                </Dialog.Title>
                                <button onClick={() => setOpenPerfil(false)}>
                                    <LiaTimesSolid className="text-2xl" />
                                </button>
                            </div>

                            <form onSubmit={submitPerfil} className="space-y-3">
                                <input className="w-full border p-2 rounded"
                                    value={data.nome}
                                    onChange={e => setData("nome", e.target.value)}
                                    required
                                    placeholder="Nome"
                                />
                                {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}

                                <input className="w-full border p-2 rounded"
                                    value={data.bi}
                                    onChange={e => setData("bi", e.target.value)}
                                    pattern="^\d{9}[A-Za-z]{2}\d{3}$"
                                    required
                                    placeholder="BI"
                                />

                                <select
                                    className="w-full border p-2 rounded"
                                    value={data.sexo}
                                    required
                                    onChange={e => setData("sexo", e.target.value)}
                                >
                                    <option value="">Selecione o gênero</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                </select>

                                <input type="date" className="w-full border p-2 rounded"
                                    value={data.nascimento}
                                    required
                                    onChange={e => setData("nascimento", e.target.value)}
                                />

                                <input className="w-full border p-2 rounded"
                                    value={data.contacto}
                                    onChange={e => setData("contacto", e.target.value)}
                                    placeholder="Contacto" required pattern="9\d{8}"
                                />

                                <input className="w-full border p-2 rounded"
                                    value={data.morada}
                                    required
                                    onChange={e => setData("morada", e.target.value)}
                                    placeholder="Morada"
                                />

                                <div className="flex justify-between">
                                    <button type="button" onClick={() => setOpenPerfil(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                        Cancelar
                                    </button>
                                    <button
                                        disabled={processing}
                                        className="bg-cyan-500 text-white px-4 py-2 rounded"
                                    >
                                        {processing ? <Loader /> : "Salvar"}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>

            {/* ================== MODAL CREDENCIAIS ================== */}
            <Transition appear show={openCredenciais} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpenCredenciais}>
                    <div className="fixed inset-0 bg-black/40" />

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <Dialog.Title className="font-semibold text-lg mb-4">
                                    Credenciais de Acesso
                                </Dialog.Title>
                                <button onClick={() => setOpenCredenciais(false)}>
                                    <LiaTimesSolid className="text-2xl" />
                                </button>
                            </div>
                            <form onSubmit={submitCredenciais} className="space-y-3">
                                <input className="w-full border p-2 rounded"
                                    value={user.username}
                                    onChange={e => setUser("username", e.target.value)}
                                    placeholder="Username"
                                />

                                <input className="w-full border p-2 rounded"
                                    value={user.email}
                                    onChange={e => setUser("email", e.target.value)}
                                    placeholder="Email"
                                />

                                <div>
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
                                            placeholder="Senha atual"

                                        />
                                    </div>
                                    {userErrors.password && <span className="text-red-600 text-xs">{userErrors.password}</span>}
                                </div>

                                {/* NOVA SENHA */}
                                <div>
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
                                            placeholder="Nova senha"
                                            name="nova_password"
                                        />
                                    </div>
                                    {userErrors.nova_password && <span className="text-red-600 text-xs">{userErrors.nova_password}</span>}
                                </div>

                                {/* CONFIRMAR SENHA */}
                                <div>
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
                                            placeholder="Confirmar nova senha"
                                            name="confirmar_password"
                                        />
                                    </div>
                                    {userErrors.confirmar_password && (
                                        <span className="text-red-600 text-xs">{userErrors.confirmar_password}</span>
                                    )}
                                </div>


                                <div className="flex justify-between">
                                    <button type="button" onClick={() => setOpenCredenciais(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                        Cancelar
                                    </button>
                                    <button
                                        disabled={userProcessing}
                                        className="bg-cyan-500 text-white px-4 py-2 rounded"
                                    >
                                        {userProcessing ? <Loader /> : "Atualizar"}
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
