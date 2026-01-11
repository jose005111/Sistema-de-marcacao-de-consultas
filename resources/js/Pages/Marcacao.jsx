import { Head, useForm, usePage, Link } from "@inertiajs/react";
import {
    LiaEditSolid,
    LiaEyeSolid,
    LiaFilterSolid,
    LiaPlusCircleSolid,
    LiaTimesSolid,
    LiaTrashAltSolid,
} from "react-icons/lia";
import { useRoute } from "../../../vendor/tightenco/ziggy/src/js";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import Loader from "../components/loader";

export default function Marcacao({ marcacoes, especialidades, pacientes }) {
    const route = useRoute();
    const { flash } = usePage().props;
    const { auth } = usePage().props;
    const { component } = usePage();
    const [vagas, setVagas] = useState([]);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);
    const [filter, setFilter] = useState(false);
    const [destroier, setDestroier] = useState(false);
    const [horarios, setHorarios] = useState([]);
    const [item, setItem] = useState({});

    async function carregarHorarios(vagaId) {
        const res = await fetch(route('horarios.disponiveis', vagaId));
        setHorarios(await res.json());
    }


    async function carregarVagas(especialidadeId) {
        if (!especialidadeId) return;

        const response = await fetch(
            route("vagas.disponiveis", especialidadeId)
        );

        const data = await response.json();
        setVagas(data);
        console.log(data);
    }

    const { data, setData, post, put, get, delete: destroy, errors, processing, reset } = useForm({
        especialidade_id: "",
        paciente_id: auth.user.role === 'utente' ? auth.user.paciente.id : "",
        vaga_id: "",
        horario_id: "",
    });

    function submit(e) {
        e.preventDefault();
        post("/marcacoes", {
            onSuccess: () => {
                setOpen(false);
                toast.success("Marcação adicionada com sucesso!");
            },
            onError: (errors) => {
                // Inertia envia os erros do Laravel na propriedade errors
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error("Erro ao adicionar marcação!");
                }

                setOpen(false);
            },
        });
    }


    // Atualizar marcação
    function update(e) {
        e.preventDefault();
        put(route("marcacoes.update", item.id), {
            onSuccess: () => {
                setEdit(false);
                toast.success("Marcação actualizada com sucesso!");
            },
            onError: () => toast.error("Erro ao actualizar marcação!"),
        });
    }

    // Apagar marcação
    function destroing(e) {
        e.preventDefault();
        destroy(route("marcacoes.destroy", item.id), {
            onSuccess: () => {
                setDestroier(false);
                toast.success("Marcação eliminada!");
            },
            onError: () => toast.error("Erro ao eliminar marcação!"),
        });
    }

    return (
        <div className="p-6">
            <Head title={component} />
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => { setOpen(true); reset() }}
                    className="flex items-center text-green-400 bg-green-100 p-2 hover:bg-green-400 hover:text-white rounded-lg"
                >
                    <LiaPlusCircleSolid className="text-2xl me-1" /> Nova Marcação
                </button>

                <button
                    onClick={() => setFilter(true)}
                    className="flex items-center text-yellow-400 bg-yellow-100 p-2 hover:bg-yellow-400 hover:text-white rounded-lg"
                >
                    <LiaFilterSolid className="text-2xl me-1" /> Filtrar
                </button>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-2xl mt-4">
                <table className="min-w-full border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-winder">
                            <th>Paciente</th>
                            <th>Especialidade</th>
                            <th>Data</th>
                            <th>Horário</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {marcacoes?.data?.map((marcacao) => (
                            <tr
                                key={marcacao.id}
                                className={`${marcacao.id % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50`}
                            >
                                <td>{marcacao.paciente?.nome}</td>
                                <td>{marcacao.especialidade?.nome}</td>
                                <td>{new Date(marcacao.vaga?.data).toDateString()}</td>
                                <td>{marcacao.horario?.hora}</td>

                                <td className="flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => { setItem(marcacao); setShow(true); }}
                                        className="bg-cyan-400 rounded-full p-1 text-white hover:bg-cyan-500"
                                    >
                                        <LiaEyeSolid className="text-xl" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setItem(marcacao);
                                            setEdit(true);

                                            setData({
                                                paciente_id: marcacao.paciente_id,
                                                especialidade_id: marcacao.especialidade_id,
                                                vaga_id: marcacao.vaga_id,
                                            });

                                            carregarVagas(marcacao.especialidade_id);
                                        }}
                                        className="bg-yellow-400 rounded-full p-1 text-white"
                                    >
                                        <LiaEditSolid className="text-xl" />
                                    </button>

                                    <button
                                        onClick={() => { setItem(marcacao); setDestroier(true); }}
                                        className="bg-rose-400 rounded-full p-1 text-white hover:bg-rose-500"
                                    >
                                        <LiaTrashAltSolid className="text-xl" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!marcacoes?.data || marcacoes.data.length === 0) && (
                            <tr className="text-center">
                                <td colSpan={5}>Nenhuma marcação encontrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex items-center justify-end pt-3 px-4">
                    {marcacoes.links.map((link) =>
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-2 mx-1 ${link.active ? "bg-cyan-600 font-bold text-white border-2 border-cyan-600 rounded-lg " : "text-cyan-600 font-bold border-2 border-cyan-600 rounded-lg "
                                    }`}
                            />
                        ) : ("")
                    )}
                </div>
            </div>

            {/* Modal de criação */}
            <Transition show={open}>
                <Dialog onClose={() => setOpen(false)} className="relative z-10">
                    <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                        <DialogTitle className="font-bold mb-4 flex justify-between items-center border-b pb-2">
                            Nova Marcação
                            <button onClick={() => setOpen(false)}>
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        <form onSubmit={edit ? () => put(route("marcacoes.update", item.id)) : submit} className="space-y-4">
                            {auth.user.role !== 'utente' && (
                                <select value={data.paciente_id} onChange={e => setData("paciente_id", e.target.value)} className="input">
                                    <option value="">Paciente</option>
                                    {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                </select>
                            )}
                            <select value={data.especialidade_id} onChange={e => {
                                setData("especialidade_id", e.target.value);
                                carregarVagas(e.target.value);
                            }} className="input">
                                <option value="">Especialidade</option>
                                {especialidades.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                            </select>

                            {vagas.length > 0 && (
                                <select value={data.vaga_id} onChange={e => {
                                    setData("vaga_id", e.target.value);
                                    carregarHorarios(e.target.value);
                                }} className="input">
                                    <option value="">Dia disponível</option>
                                    {vagas.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {new Date(v.data).toLocaleDateString()} — {v.vagas_disponiveis} vagas
                                        </option>
                                    ))}
                                </select>
                            )}

                            {horarios.length > 0 && (
                                <select value={data.hora} onChange={e => setData("horario_id", e.target.value)} className="input">
                                    <option value="">Horário</option>
                                    {horarios.map(h => (
                                        <option key={h.id} value={h.id} disabled={!h.disponivel}>
                                            {h.hora} {h.disponivel ? "" : "(ocupado)"}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <button className="w-full min-h-[40px]  bg-green-500 hover:bg-green-600 rounded-lg text-white p-1" disabled={processing}>  {processing ? (
                                <span className="flex items-center justify-center">
                                    <Loader />
                                </span>
                            ) : "Salvar"}</button>
                        </form>
                    </DialogPanel>
                </Dialog>
            </Transition>
            {/* Modal de edição */}
            <Transition show={edit}>
                <Dialog onClose={() => setEdit(false)} className="relative z-10">
                    <div className="fixed inset-0 bg-black/40" />
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6">
                        <DialogTitle className="font-bold mb-4 flex justify-between border-b pb-2">
                            Editar Marcação
                            <button onClick={() => setEdit(false)}>
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                put(route('marcacoes.update', item.id), {
                                    onSuccess: () => {
                                        setEdit(false);
                                        toast.success('Marcação atualizada!');
                                    },
                                    onError: (errors) => {
                                        if (errors.message) toast.error(errors.message);
                                        else toast.error('Erro ao atualizar marcação');
                                    },
                                });
                            }}
                            className="flex flex-col space-y-4"
                        >
                            {/* Paciente */}
                            {auth.user.role !== 'utente' && (
                                <div>
                                    <label className="font-bold">Paciente</label>
                                    <select
                                        value={data.paciente_id}
                                        onChange={(e) => setData('paciente_id', e.target.value)}
                                        className="w-full border rounded p-2"
                                    >
                                        <option value="">-- Selecione --</option>
                                        {pacientes.map(p => (
                                            <option key={p.id} value={p.id}>{p.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Especialidade */}
                            <div>
                                <label className="font-bold">Especialidade</label>
                                <select
                                    value={data.especialidade_id}
                                    onChange={(e) => {
                                        setData('especialidade_id', e.target.value);
                                        carregarVagas(e.target.value);
                                    }}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">-- Selecione --</option>
                                    {especialidades.map(e => (
                                        <option key={e.id} value={e.id}>{e.nome}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Vagas */}
                            {vagas.length > 0 && (
                                <select value={data.vaga_id} onChange={e => {
                                    setData("vaga_id", e.target.value);
                                    carregarHorarios(e.target.value);
                                }} className="input">
                                    <option value="">Dia disponível</option>
                                    {vagas.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {new Date(v.data).toLocaleDateString()} — {v.vagas_disponiveis} vagas
                                        </option>
                                    ))}
                                </select>
                            )}

                            {horarios.length > 0 && (
                                <select value={data.hora} onChange={e => setData("horario_id", e.target.value)} className="input">
                                    <option value="">Horário</option>
                                    {horarios.map(h => (
                                        <option key={h.id} value={h.id} disabled={!h.disponivel}>
                                            {h.hora} {h.disponivel ? "" : "(ocupado)"}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <button
                                disabled={processing}
                                className="bg-green-500 hover:bg-green-600 text-white rounded p-2"
                            >
                                {processing ? <Loader /> : 'Atualizar'}
                            </button>
                        </form>
                    </DialogPanel>
                </Dialog>
            </Transition>

            {/* Modal Para Detalhes da Marcação */}
            <Transition show={show}>
                <Dialog onClose={() => setShow(false)} className="relative z-10">
                    {/* Fundo escuro */}
                    <Transition.Child
                        enter="transition-opacity ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                    </Transition.Child>

                    {/* Painel lateral */}
                    <Transition.Child
                        enter="transition ease-out duration-300 transform"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in duration-200 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold">
                                        Detalhes da Marcação
                                    </DialogTitle>
                                    <button onClick={() => setShow(false)} className="border rounded">
                                        <LiaTimesSolid className="text-2xl" />
                                    </button>
                                </div>

                                <div className="flex flex-col space-y-2 mt-4 px-3 rounded">
                                    <div className="flex justify-between items-center">
                                        <label className="font-bold">Paciente:</label>
                                        <span>{item.paciente?.nome}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="font-bold">Especialidade:</label>
                                        <span>{item.especialidade?.nome}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="font-bold">Data da Marcação:</label>
                                        <span>{item.vaga ? new Date(item.vaga.data).toLocaleDateString() : "-"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="font-bold">Hora:</label>
                                        <span>{item.horario?.hora}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="font-bold">Contacto:</label>
                                        <span>{item.paciente?.contacto || "-"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="font-bold">Morada:</label>
                                        <span>{item.paciente?.morada || "-"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label className="font-bold">Marcação Feita:</label>
                                        <span>{new Date(item.created_at).toLocaleDateString() || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </Dialog>
            </Transition>

            {/* Modal de pesquisa */}
            <Transition show={filter}>
                <Dialog onClose={() => setFilter(false)} className="relative z-10">
                    <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                        <DialogTitle className="font-bold mb-4 flex justify-between items-center border-b pb-2">
                            Pesquisar Marcação
                            <button onClick={() => setFilter(false)}>
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        {filter && (
                            <div className="p-4 bg-gray-100 rounded mt-4">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    get(route("marcacoes.index"), {
                                        especialidade_id: data.especialidade_id || "",
                                        paciente_id: data.paciente_id || "",
                                        data: data.data || "",
                                    });
                                }} className="flex flex-col space-y-2">
                                    <div>
                                        <label>Especialidade:</label>
                                        <select
                                            value={data.especialidade_id}
                                            onChange={(e) => setData("especialidade_id", e.target.value)}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value="">-- Todas --</option>
                                            {especialidades.map((esp) => (
                                                <option key={esp.id} value={esp.id}>{esp.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label>Paciente:</label>
                                        <select
                                            value={data.paciente_id}
                                            onChange={(e) => setData("paciente_id", e.target.value)}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value="">-- Todos --</option>
                                            {pacientes.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label>Data:</label>
                                        <input
                                            type="date"
                                            value={data.data || ""}
                                            onChange={(e) => setData("data", e.target.value)}
                                            className="border rounded p-2 w-full"
                                        />
                                    </div>

                                    <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white rounded p-2">
                                        Aplicar Filtro
                                    </button>
                                </form>

                            </div>
                        )}

                    </DialogPanel>
                </Dialog>
            </Transition>

            {/* Modal Para Deletar dos medicos */}
            <Dialog open={destroier} onClose={setDestroier} className="relative z-10 transition">
                {/* Fundo escuro */}
                <Transition.Child
                    enter="transition-opacity ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-0"
                    leave="transition-opacity ease-in duration-200"
                    leaveFrom="opacity-0"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                </Transition.Child>

                {/* Painel lateral */}
                <Transition.Child
                    enter="transition ease-out duration-300 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in duration-200 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                >

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <DialogPanel
                                transition
                                className="relative transform overflow-hidden rounded-lg bg-white text-left"
                            >
                                <div className="">
                                    <div className="flex items-center justify-between p-3  border-b">
                                        <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                            <span className=" bg-rose-500 rounded-full text-white p-1">
                                                <LiaTrashAltSolid className="text-2xl" />
                                            </span>
                                            <p>Cancelar Marcação</p>
                                        </DialogTitle>
                                        <button onClick={() => setDestroier(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                    </div>
                                    <div className="p-4 max-w-sm">
                                        <form onSubmit={destroing}>
                                            <p className="text-center my-2">Tem certeza que pretende cancelar está marcação?</p>
                                            <p className="text-center text-sm text-gray-600 my-4">É possivel que não seja possível reagendar!</p>
                                            <div className="flex justify-end mt-2 space-x-2">
                                                <button type="button" onClick={() => setDestroier(false)} className="w-full min-h-[40px]  bg-gray-500 hover:bg-gray-600 rounded-lg text-white p-1">Cancelar</button>
                                                <button className="w-full min-h-[40px]  bg-rose-500 hover:bg-rose-600 rounded-lg text-white p-1" disabled={processing}>{processing ? (
                                                    <span className="flex items-center justify-center">
                                                        <Loader />
                                                    </span>
                                                ) : "Confirmar"}</button>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>

                </Transition.Child>
            </Dialog>
        </div >
    );
}
