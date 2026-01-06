import { Head, useForm, usePage } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { LiaUserCheckSolid, LiaTimesSolid } from "react-icons/lia";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRoute } from "../../../../vendor/tightenco/ziggy/src/js";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

export default function Recepcionista({ recepcionista, usuario }) {
    const route = useRoute();
    const { flash } = usePage().props;

    const [openPerfil, setOpenPerfil] = useState(false);
    const [openCredenciais, setOpenCredenciais] = useState(false);

    const [pass1, setPass1] = useState(false);
    const [pass2, setPass2] = useState(false);
    const [pass3, setPass3] = useState(false);

    /* ================== PERFIL ================== */
    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
    } = useForm({
        nome: recepcionista?.nome ?? "",
        nascimento: recepcionista?.nascimento ?? "",
        morada: recepcionista?.morada ?? "",
        contacto: recepcionista?.contacto ?? "",
        bi: recepcionista?.bi ?? "",
        sexo: recepcionista?.sexo ?? "",
    });

    function submitPerfil(e) {
        e.preventDefault();

        if (recepcionista) {
            put(route("recepcionista.update"), {
                onSuccess: () => {
                    toast.success("Perfil atualizado com sucesso!");
                    setOpenPerfil(false);
                },
                onError: () => toast.error("Erro ao atualizar o perfil."),
            });
        } else {
            post(route("recepcionista.store"), {
                onSuccess: () => {
                    toast.success("Perfil criado com sucesso!");
                    setOpenPerfil(false);
                },
                onError: () => toast.error("Erro ao criar o perfil."),
            });
        }
    }

    /* ================== CREDENCIAIS ================== */
    const {
        data: user,
        setData: setUser,
        put: userPut,
        processing: userProcessing,
        errors: userErrors,
        reset,
    } = useForm({
        username: usuario?.username ?? "",
        email: usuario?.email ?? "",
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
        <div className="overflow-y-auto h-[calc(100vh-120px)] p-4">
            <Head title="Perfil do Recepcionista" />

            {/* ================== CABEÇALHO ================== */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <div className="flex items-center gap-2">
                    <LiaUserCheckSolid className="text-cyan-400 text-4xl" />
                    <h2 className="text-lg font-semibold">Perfil do Recepcionista</h2>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setOpenPerfil(true)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                    >
                        Editar Perfil
                    </button>

                    <button
                        onClick={() => setOpenCredenciais(true)}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
                    >
                        Credenciais
                    </button>
                </div>
            </div>

            {/* ================== VISUALIZAÇÃO ================== */}
            <div className="flex justify-center">
                <div className="flex flex-col space-y-2 mt-4 px-3 py-4 rounded border bg-white w-full max-w-md">
                    <Item label="Nome" value={recepcionista?.nome} />
                    <Item label="BI" value={recepcionista?.bi} />
                    <Item label="Gênero" value={recepcionista?.sexo} />
                    <Item
                        label="Nascimento"
                        value={
                            recepcionista?.nascimento
                                ? new Date(recepcionista.nascimento).toLocaleDateString()
                                : null
                        }
                    />
                    <Item label="Contacto" value={recepcionista?.contacto} />
                    <Item label="Morada" value={recepcionista?.morada} />
                </div>
            </div>

            {/* ================== MODAL PERFIL ================== */}
            <Modal
                open={openPerfil}
                close={() => setOpenPerfil(false)}
                title={recepcionista ? "Editar Perfil" : "Criar Perfil"}
            >
                <form onSubmit={submitPerfil} className="space-y-3">
                    <Input
                        placeholder="Nome"
                        value={data.nome}
                        onChange={e => setData("nome", e.target.value)}
                        required
                    />

                    <Input
                        placeholder="Nº do BI"
                        value={data.bi}
                        onChange={e => setData("bi", e.target.value)}
                        pattern="^\d{9}[A-Z]{2}\d{3}$"
                        required
                    />

                    <Select
                        value={data.sexo}
                        onChange={e => setData("sexo", e.target.value)}
                        required
                    >
                        <option value="">Gênero</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </Select>

                    <Input
                        type="date"
                        value={data.nascimento}
                        onChange={e => setData("nascimento", e.target.value)}
                        required
                    />

                    <Input
                        placeholder="Contacto"
                        value={data.contacto}
                        onChange={e => setData("contacto", e.target.value)}
                        pattern="9\d{8}"
                        required
                    />

                    <Input
                        placeholder="Morada"
                        value={data.morada}
                        onChange={e => setData("morada", e.target.value)}
                        required
                    />

                    <FooterButtons loading={processing} onCancel={() => setOpenPerfil(false)} />
                </form>
            </Modal>

            {/* ================== MODAL CREDENCIAIS ================== */}
            <Modal
                open={openCredenciais}
                close={() => setOpenCredenciais(false)}
                title="Credenciais de Acesso"
            >
                <form onSubmit={submitCredenciais} className="space-y-3">
                    <Input
                        placeholder="Username"
                        value={user.username}
                        onChange={e => setUser("username", e.target.value)}
                    />

                    <Input
                        placeholder="Email"
                        value={user.email}
                        onChange={e => setUser("email", e.target.value)}
                    />

                    <Password label="Senha atual" show={pass1} toggle={setPass1}
                        onChange={e => setUser("password", e.target.value)}
                    />
                    <Password label="Nova senha" show={pass2} toggle={setPass2}
                        onChange={e => setUser("nova_password", e.target.value)}
                    />
                    <Password label="Confirmar senha" show={pass3} toggle={setPass3}
                        onChange={e => setUser("confirmar_password", e.target.value)}
                    />

                    <FooterButtons loading={userProcessing} onCancel={() => setOpenCredenciais(false)} />
                </form>
            </Modal>
        </div>
    );
}

/* ================== COMPONENTES ================== */

const Item = ({ label, value }) => (
    <div className="flex justify-between">
        <label className="font-bold">{label}</label>
        <span>{value ?? "Não informado"}</span>
    </div>
);

const Modal = ({ open, close, title, children }) => (
    <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={close}>
            <div className="fixed inset-0 bg-black/40" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg p-6">
                    <div className="flex justify-between mb-4">
                        <Dialog.Title className="font-semibold text-lg">{title}</Dialog.Title>
                        <button onClick={close}>
                            <LiaTimesSolid className="text-2xl" />
                        </button>
                    </div>
                    {children}
                </Dialog.Panel>
            </div>
        </Dialog>
    </Transition>
);

const Input = (props) => (
    <input {...props} className="w-full border p-2 rounded" />
);

const Select = (props) => (
    <select {...props} className="w-full border p-2 rounded bg-white" />
);

const Password = ({ label, show, toggle, ...props }) => (
    <div className="relative">
        <span onClick={() => toggle(!show)} className="absolute right-2 top-2 cursor-pointer">
            {show ? <FiEyeOff /> : <FiEye />}
        </span>
        <input
            type={show ? "text" : "password"}
            {...props}
            className="w-full border p-2 rounded"
            placeholder={label}
        />
    </div>
);

const FooterButtons = ({ loading, onCancel }) => (
    <div className="flex justify-between">
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
        </button>
        <button disabled={loading} className="bg-cyan-500 text-white px-4 py-2 rounded">
            {loading ? <Loader /> : "Salvar"}
        </button>
    </div>
);
