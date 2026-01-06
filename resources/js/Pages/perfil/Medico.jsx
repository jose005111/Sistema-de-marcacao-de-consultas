import { Head, useForm, usePage } from "@inertiajs/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { LiaUserNurseSolid, LiaKeySolid, LiaTimesSolid } from "react-icons/lia";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRoute } from "../../../../vendor/tightenco/ziggy/src/js";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

export default function Medico({ especialidades, medico, usuario }) {
    const route = useRoute();
    const { flash } = usePage().props;

    const [openPerfil, setOpenPerfil] = useState(false);
    const [openCredenciais, setOpenCredenciais] = useState(false);

    const [pass1, setPass1] = useState(false);
    const [pass2, setPass2] = useState(false);
    const [pass3, setPass3] = useState(false);

    /* ================== PERFIL MÉDICO ================== */
    const {
        data,
        setData,
        put,
        post,
        processing,
        errors,
    } = useForm({
        ordem: medico?.ordem ?? "",
        nome: medico?.nome ?? "",
        bi: medico?.bi ?? "",
        sexo: medico?.sexo ?? "",
        nascimento: medico?.nascimento ?? "",
        contacto: medico?.contacto ?? "",
        morada: medico?.morada ?? "",
        especialidade_id: medico?.especialidade_id ?? "",
    });

    function submitPerfil(e) {
        e.preventDefault();

        if (medico) {
            put(route("medico.updated", medico.id), {
                onSuccess: () => {
                    toast.success("Perfil do médico atualizado com sucesso!");
                    setOpenPerfil(false);
                },
                onError: () => toast.error("Erro ao atualizar o perfil."),
            });
        } else {
            post("/perfil/medico", {
                onSuccess: () => {
                    toast.success("Perfil do médico criado com sucesso!");
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
            <Head title="Perfil do Médico" />

            {/* ================== CABEÇALHO ================== */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <div className="flex items-center gap-2">
                    <LiaUserNurseSolid className="text-cyan-500 text-4xl" />
                    <h2 className="text-lg font-semibold">Perfil do Médico</h2>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setOpenPerfil(true)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                    >
                        {medico ? "Editar Perfil" : "Criar Perfil"}
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
                    <Item label="Nome" value={medico?.nome} />
                    <Item label="Nº Ordem" value={medico?.ordem} />
                    <Item label="BI" value={medico?.bi} />
                    <Item label="Gênero" value={medico?.sexo} />
                    <Item
                        label="Nascimento"
                        value={medico?.nascimento
                            ? new Date(medico.nascimento).toLocaleDateString()
                            : null}
                    />
                    <Item label="Contacto" value={medico?.contacto} />
                    <Item label="Morada" value={medico?.morada} />
                    <Item label="Especialidade" value={medico?.especialidade?.nome} />
                </div>
            </div>

            {/* ================== MODAL PERFIL ================== */}
            <Modal
                open={openPerfil}
                close={() => setOpenPerfil(false)}
                title={medico ? "Editar Perfil" : "Criar Perfil"}
            >
                <form onSubmit={submitPerfil} className="space-y-3">
                    <Input value={data.ordem} onChange={e => setData("ordem", e.target.value)} placeholder="Nº Ordem" />
                    <Input value={data.nome} onChange={e => setData("nome", e.target.value)} placeholder="Nome" />
                    <Input value={data.bi} onChange={e => setData("bi", e.target.value)} placeholder="BI" />
                    <Select value={data.sexo} onChange={e => setData("sexo", e.target.value)}>
                        <option value="">Gênero</option>
                        <option>Masculino</option>
                        <option>Feminino</option>
                    </Select>
                    <Input type="date" value={data.nascimento} onChange={e => setData("nascimento", e.target.value)} />
                    <Input value={data.contacto} onChange={e => setData("contacto", e.target.value)} placeholder="Contacto" />
                    <Input value={data.morada} onChange={e => setData("morada", e.target.value)} placeholder="Morada" />

                    <Select value={data.especialidade_id} onChange={e => setData("especialidade_id", e.target.value)}>
                        <option value="">Especialidade</option>
                        {especialidades.map(e => (
                            <option key={e.id} value={e.id}>{e.nome}</option>
                        ))}
                    </Select>

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
                    <Input value={user.username} onChange={e => setUser("username", e.target.value)} placeholder="Username" />
                    <Input value={user.email} onChange={e => setUser("email", e.target.value)} placeholder="Email" />

                    <Password label="Senha atual" show={pass1} toggle={setPass1} onChange={e => setUser("password", e.target.value)} />
                    <Password label="Nova senha" show={pass2} toggle={setPass2} onChange={e => setUser("nova_password", e.target.value)} />
                    <Password label="Confirmar senha" show={pass3} toggle={setPass3} onChange={e => setUser("confirmar_password", e.target.value)} />

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
                        <button onClick={close}><LiaTimesSolid className="text-2xl" /></button>
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
    <div>
        <div className="relative">
            <span onClick={() => toggle(!show)} className="absolute right-2 top-2 cursor-pointer">
                {show ? <FiEyeOff /> : <FiEye />}
            </span>
            <input type={show ? "text" : "password"} {...props} className="w-full border p-2 rounded" placeholder={label} />
        </div>
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
