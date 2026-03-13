import { Head, useForm, usePage, Link, router } from "@inertiajs/react";
import {
    LiaCheckCircle,
    LiaEditSolid,
    LiaEyeSolid,
    LiaFilterSolid,
    LiaPlusCircleSolid,
    LiaPrintSolid,
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
    const { auth } = usePage().props;
    const { component } = usePage();
    const [vagas, setVagas] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);
    const [filter, setFilter] = useState(false);
    const [destroier, setDestroier] = useState(false);
    const [horarios, setHorarios] = useState([]);
    const [item, setItem] = useState({});
    const [loadingFetch, setLoadingFetch] = useState({ vagas: false, medicos: false, horarios: false });

    async function carregarHorarios(vagaId) {
        if (!vagaId) return;
        setLoadingFetch(prev => ({ ...prev, horarios: true }));
        try {
            const res = await fetch(route('horarios.disponiveis', vagaId));
            const data = await res.json();
            setHorarios(data);

            if (data.length === 0) {
                toast.info("Não há horários disponíveis para esta data.");
            }
        } catch (error) {
            toast.error("Erro ao buscar horários.");
        } finally {
            setLoadingFetch(prev => ({ ...prev, horarios: false }));
        }
    }

    async function carregarVagas(especialidadeId) {
        if (!especialidadeId) return;
        setLoadingFetch(prev => ({ ...prev, vagas: true }));
        try {
            const response = await fetch(route("vagas.disponiveis", especialidadeId));
            const data = await response.json();
            setVagas(data);

            if (data.length === 0) {
                toast.info("Não há vagas disponíveis para esta especialidade.");
            }
        } catch (error) {
            toast.error("Erro ao buscar vagas.");
        } finally {
            setLoadingFetch(prev => ({ ...prev, vagas: false }));
        }
    }

    async function carregarMedicos(especialidadeId) {
        if (!especialidadeId) return;
        setLoadingFetch(prev => ({ ...prev, medicos: true }));
        try {
            const response = await fetch(route("medicos.por-especialidade", especialidadeId));
            const data = await response.json();
            setMedicos(data);

            if (data.length === 0) {
                toast.info("Nenhum médico registado ou disponível para esta especialidade.");
            }
        } catch (error) {
            toast.error("Erro ao buscar médicos.");
        } finally {
            setLoadingFetch(prev => ({ ...prev, medicos: false }));
        }
    }

    // AQUI: Adicionado medico_id e data (para a pesquisa) ao estado inicial
    const { data, setData, post, put, get, delete: destroy, errors, processing, reset } = useForm({
        especialidade_id: "",
        medico_id: "",
        paciente_id: auth.user.role === 'utente' ? auth.user.paciente?.id : "",
        vaga_id: "",
        horario_id: "",
        data: "",
    });

    function submit(e) {
        e.preventDefault();

        post("/marcacoes", {
            onSuccess: () => {
                toast.success("Marcação adicionada com sucesso!");
            },
            onError: (errors) => {
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error("Erro ao adicionar marcação!");
                }
            },
            onFinish: () => {
                setOpen(false);
                setMedicos([]);
                setVagas([]);
                setHorarios([]);
                reset(); // Limpa o formulário após salvar
            },
        });
    }

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
                {
                    auth.user.role === 'utente' ? (
                        <button
                            onClick={() => { setOpen(true); reset(); }}
                            className="flex items-center text-green-400 bg-green-100 p-2 hover:bg-green-400 hover:text-white rounded-lg"
                        >
                            <LiaPlusCircleSolid className="text-2xl me-1" /> Nova Marcação
                        </button>
                    )
                        : ""
                }

                <button
                    onClick={() => setFilter(true)}
                    className="flex items-center text-yellow-400 bg-yellow-100 p-2 hover:bg-yellow-400 hover:text-white rounded-lg"
                >
                    <LiaFilterSolid className="text-2xl me-1" /> Pesquisar
                </button>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-2xl mt-4">
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Especialidade</th>
                            <th>Data</th>
                            <th>Horário</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcacoes?.data?.map((marcacao) => (
                            <tr key={marcacao.id}>
                                <td>{marcacao.paciente?.nome}</td>
                                <td>{marcacao.especialidade?.nome}</td>
                                <td>{new Date(marcacao.vaga?.data).toDateString()}</td>
                                <td>{marcacao.horario?.hora}</td>

                                <td className="flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => { setItem(marcacao); setShow(true); }}
                                        className="bg-cyan-400 rounded-full p-1 text-white hover:bg-cyan-500"
                                        title="Detalhes"
                                    >
                                        <LiaEyeSolid className="text-xl" />
                                    </button>

                                    {auth.user.role === 'utente' && (
                                        <button
                                            onClick={async () => {
                                                setItem(marcacao);
                                                setData({
                                                    paciente_id: marcacao.paciente_id,
                                                    especialidade_id: marcacao.especialidade_id,
                                                    vaga_id: marcacao.vaga_id,
                                                    medico_id: marcacao.medico_id,
                                                    horario_id: marcacao.horario_id,
                                                });
                                                await carregarVagas(marcacao.especialidade_id);
                                                await carregarMedicos(marcacao.especialidade_id);
                                                await carregarHorarios(marcacao.vaga_id);
                                                setEdit(true);
                                            }}
                                            className="bg-yellow-400 rounded-full p-1 text-white"
                                            title="Editar"
                                        >
                                            <LiaEditSolid className="text-xl" />
                                        </button>
                                    )}

                                    {auth.user.role === 'utente' && (
                                        <button
                                            onClick={() => { setItem(marcacao); setDestroier(true); }}
                                            className="bg-rose-400 rounded-full p-1 text-white hover:bg-rose-500"
                                            title="Cancelar"
                                        >
                                            <LiaTrashAltSolid className="text-xl" />
                                        </button>
                                    )}

                                    {auth.user.role === 'utente' && (
                                        <a
                                            href={route("marcacoes.imprimir", marcacao.id)}
                                            target="_blank"
                                            className="bg-blue-400 rounded-full p-1 text-white hover:bg-blue-500"
                                            title="Imprimir"
                                        >
                                            <LiaPrintSolid className="text-xl" />
                                        </a>
                                    )}

                                    {auth.user.role === 'medico' && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await router.patch(route("marcacoes.realizada", marcacao.id), {}, {
                                                        preserveScroll: true,
                                                        onSuccess: () => {
                                                            toast.success("Marcação realizada com sucesso!");
                                                        },
                                                        onError: () => {
                                                            toast.error("Erro ao atualizar a marcação!");
                                                        },
                                                    });
                                                } catch (error) {
                                                    toast.error("Erro na requisição!");
                                                }
                                            }}
                                            className="bg-green-400 rounded-full p-1 text-white hover:bg-green-500"
                                            title="Realizada"
                                        >
                                            <LiaCheckCircle className="text-xl" />
                                        </button>
                                    )}
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

                {marcacoes?.data?.length > 10 && (
                    <div className="flex items-center justify-end pt-3 px-4">
                        {marcacoes.links.map((link) =>
                            link.url ? (
                                <Link
                                    key={link.label}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-2 mx-1 rounded-lg border-2 font-sm ${link.active ? "bg-cyan-600 text-white border-cyan-600 " : "text-cyan-600 border-cyan-600 "}`}
                                />
                            ) : ("")
                        )}
                    </div>
                )}
            </div>

            {/* Modal de criação */}
            <Transition show={open}>
                <Dialog onClose={() => setOpen(false)} className="relative z-10">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                        <DialogTitle className="font-bold mb-4 flex justify-between items-center border-b pb-2">
                            Nova Marcação
                            <button onClick={() => setOpen(false)}>
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        <form onSubmit={submit} className="space-y-4">
                            {/* 1. Especialidade */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                    Especialidade
                                </label>
                                <select
                                    value={data.especialidade_id}
                                    onChange={e => {
                                        // AQUI: Usar objeto completo para evitar sobrescrita do React Batching
                                        const valor = e.target.value;
                                        setData({
                                            ...data,
                                            especialidade_id: valor,
                                            vaga_id: "",
                                            medico_id: "",
                                            horario_id: ""
                                        });

                                        carregarVagas(valor);
                                        carregarMedicos(valor);
                                    }}
                                    className="input w-full border rounded-lg p-2.5 mt-1"
                                >
                                    <option value="">Selecione a Especialidade</option>
                                    {especialidades.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                                </select>
                                {errors.especialidade_id && <span className="text-rose-500 text-xs font-medium">{errors.especialidade_id}</span>}
                            </div>

                            {/* 2. Data disponível (Vaga) */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                    Data da Consulta
                                    {loadingFetch.vagas && <Loader className="w-3 h-3 text-cyan-500" />}
                                </label>
                                <select
                                    value={data.vaga_id}
                                    onChange={e => {
                                        const valor = e.target.value;
                                        setData({
                                            ...data,
                                            vaga_id: valor,
                                            horario_id: ""
                                        });
                                        carregarHorarios(valor);
                                    }}
                                    className="input w-full border rounded-lg p-2.5 mt-1 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                                    disabled={vagas.length === 0 || loadingFetch.vagas}
                                >
                                    <option value="">
                                        {loadingFetch.vagas
                                            ? "A procurar datas..."
                                            : vagas.length === 0 && !data.especialidade_id
                                                ? "Selecione primeiro a especialidade"
                                                : vagas.length === 0 && data.especialidade_id
                                                    ? "Sem datas para esta especialidade"
                                                    : "Selecione o Dia disponível"}
                                    </option>
                                    {vagas.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {new Date(v.data).toLocaleDateString()} — {v.vagas_disponiveis} vagas
                                        </option>
                                    ))}
                                </select>
                                {errors.vaga_id && <span className="text-rose-500 text-xs font-medium">{errors.vaga_id}</span>}
                            </div>

                            {/* 3. Médico */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                    Médico
                                    {loadingFetch.medicos && <Loader className="w-3 h-3 text-cyan-500" />}
                                </label>
                                <select
                                    value={data.medico_id}
                                    onChange={e => setData("medico_id", e.target.value)}
                                    className="input w-full border rounded-lg p-2.5 mt-1 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                                    disabled={medicos.length === 0 || loadingFetch.medicos}
                                >
                                    <option value="">
                                        {loadingFetch.medicos
                                            ? "A procurar médicos..."
                                            : medicos.length === 0 && !data.especialidade_id
                                                ? "Selecione primeiro a especialidade"
                                                : medicos.length === 0 && data.especialidade_id
                                                    ? "Nenhum médico disponível"
                                                    : "Selecione o Médico"}
                                    </option>
                                    {medicos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                                </select>
                                {errors.medico_id && <span className="text-rose-500 text-xs font-medium">{errors.medico_id}</span>}
                            </div>

                            {/* 4. Horário */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">
                                    Horário
                                    {loadingFetch.horarios && <Loader className="w-3 h-3 text-cyan-500" />}
                                </label>
                                <select
                                    value={data.horario_id}
                                    onChange={e => setData("horario_id", parseInt(e.target.value))}
                                    className="input w-full border rounded-lg p-2.5 mt-1 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                                    disabled={horarios.length === 0 || loadingFetch.horarios}
                                >
                                    <option value="">
                                        {loadingFetch.horarios
                                            ? "A procurar horários..."
                                            : horarios.length === 0 && !data.vaga_id
                                                ? "Selecione primeiro a data"
                                                : horarios.length === 0 && data.vaga_id
                                                    ? "Sem horários disponíveis"
                                                    : "Selecione o Horário"}
                                    </option>
                                    {horarios.map(h => (
                                        <option key={h.id} value={h.id} disabled={!h.disponivel}>
                                            {h.hora} {h.disponivel ? "" : "(ocupado)"}
                                        </option>
                                    ))}
                                </select>
                                {errors.horario_id && <span className="text-rose-500 text-xs font-medium">{errors.horario_id}</span>}
                            </div>

                            <button
                                type="submit"
                                className="w-full min-h-[40px] bg-green-500 hover:bg-green-600 rounded-lg text-white p-2 mt-4 transition-colors disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <Loader className="text-white w-5 h-5" />
                                    </span>
                                ) : "Salvar"}
                            </button>
                        </form>
                    </DialogPanel>
                </Dialog>
            </Transition>

            {/* Modal de edição */}
            <Transition show={edit}>
                <Dialog onClose={() => setEdit(false)} className="relative z-10">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 shadow-xl overflow-y-auto">
                        <DialogTitle className="font-bold mb-6 flex justify-between border-b pb-4">
                            Actualização da Marcação
                            <button onClick={() => setEdit(false)}>
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        <form onSubmit={update} className="space-y-6">
                            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                                <p><strong>Paciente:</strong> {item.paciente?.nome}</p>
                                <p><strong>Especialidade:</strong> {item.especialidade?.nome}</p>
                            </div>
                            <hr />

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">Médico</label>
                                <select
                                    value={data.medico_id}
                                    onChange={e => setData("medico_id", e.target.value)}
                                    className="w-full border rounded-lg p-2.5 mt-1"
                                >
                                    <option value="">Selecione o Médico</option>
                                    {medicos.map(m => (
                                        <option key={m.id} value={m.id}>{m.nome}</option>
                                    ))}
                                </select>
                                {errors.medico_id && <p className="text-red-500 text-xs">{errors.medico_id}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">Data disponível</label>
                                <select
                                    value={data.vaga_id}
                                    onChange={e => {
                                        const valor = e.target.value;
                                        setData({
                                            ...data,
                                            vaga_id: valor,
                                            horario_id: ""
                                        });
                                        carregarHorarios(valor);
                                    }}
                                    className="w-full border rounded-lg p-2.5 mt-1"
                                >
                                    <option value="">Selecione a Data</option>
                                    {vagas.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {new Date(v.data).toLocaleDateString()} — {v.vagas_disponiveis} vagas
                                        </option>
                                    ))}
                                </select>
                                {errors.vaga_id && <p className="text-red-500 text-xs">{errors.vaga_id}</p>}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2">Horário</label>
                                <select
                                    value={data.horario_id}
                                    onChange={e => setData("horario_id", parseInt(e.target.value))}
                                    className="w-full border rounded-lg p-2.5 mt-1"
                                >
                                    <option value="">Selecione o Horário</option>
                                    {horarios.map(h => (
                                        <option key={h.id} value={h.id} disabled={!h.disponivel && h.id !== item.horario_id}>
                                            {h.hora}
                                        </option>
                                    ))}
                                </select>
                                {errors.horario_id && <p className="text-red-500 text-xs">{errors.horario_id}</p>}
                            </div>

                            <button
                                className="w-full min-h-[40px] bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white p-2 mt-4 transition-colors disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <Loader className="text-white w-5 h-5" />
                                    </span>
                                ) : "Actualizar"}
                            </button>
                        </form>
                    </DialogPanel>
                </Dialog>
            </Transition>

            {/* Modal Para Detalhes da Marcação */}
            <Transition show={show}>
                <Dialog onClose={() => setShow(false)} className="relative z-10">

                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                                        <label>Paciente:</label>
                                        <label>{item.paciente?.nome}</label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label>Especialidade:</label>
                                        <label>{item.especialidade?.nome}</label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label>Data da Marcação:</label>
                                        <label>{item.vaga ? new Date(item.vaga.data).toLocaleDateString() : "-"}</label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label>Hora:</label>
                                        <label>{item.horario?.hora}</label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label>Contacto:</label>
                                        <label>{item.paciente?.contacto || "-"}</label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label>Morada:</label>
                                        <label>{item.paciente?.morada || "-"}</label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label>Medico:</label>
                                        <label>{item.medico?.nome || "-"}</label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label>Marcação Feita:</label>
                                        <label>{new Date(item.created_at).toLocaleDateString() || "-"}</label>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <label>Estado :</label>
                                        <label>{item.estado}</label>
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

                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                        <DialogTitle className="font-bold mb-4 flex justify-between items-center border-b pb-2">
                            Pesquisar Marcação
                            <button onClick={() => setFilter(false)}>
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        {filter && (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                get(route("marcacoes.index"), {
                                    especialidade_id: data.especialidade_id || "",
                                    paciente_id: data.paciente_id || "",
                                    data: data.data || "",
                                });
                            }} className="flex flex-col space-y-2">

                                {(auth.user.role !== 'medico') && (
                                    <div>
                                        <label>Especialidade:</label>
                                        <select
                                            value={data.especialidade_id}
                                            onChange={(e) => setData("especialidade_id", e.target.value)}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value=""> Todas </option>
                                            {especialidades.map((esp) => (
                                                <option key={esp.id} value={esp.id}>{esp.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {(auth.user.role === 'recepcionista') && (
                                    <div>
                                        <label>Paciente:</label>
                                        <select
                                            value={data.paciente_id}
                                            onChange={(e) => setData("paciente_id", e.target.value)}
                                            className="border rounded p-2 w-full"
                                        >
                                            <option value=""> Todos </option>
                                            {pacientes.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}


                                <div>
                                    <label>Data:</label>
                                    <input
                                        type="date"
                                        value={data.data || ""}
                                        onChange={(e) => setData("data", e.target.value)}
                                        className="border rounded p-2 w-full"
                                    />
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button className="w-full min-h-[40px]  bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white p-1" disabled={processing}>  {processing ? (
                                        <span className="flex items-center justify-center">
                                            <Loader />
                                        </span>
                                    ) : "Pesquisar"}</button>
                                </div>
                            </form>
                        )}

                    </DialogPanel>
                </Dialog>
            </Transition>

            {/* Modal Para Deletar dos medicos */}
            <Dialog open={destroier} onClose={setDestroier} className="relative z-10 transition">

                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
                                            <p className="text-center text-sm text-rose-600 my-4">É possivel que não seja possível reagendar!</p>
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
