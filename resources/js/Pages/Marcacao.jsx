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
    const { component } = usePage();

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);
    const [filter, setFilter] = useState(false);
    const [destroier, setDestroier] = useState(false);
    const [item, setItem] = useState({});

    const { data, setData, post, put, get, delete: destroy, errors, processing } = useForm({
        data: "",
        hora: "",
        especialidade_id: "",
        paciente_id: "",
    });

    // Criar marcação
    function submit(e) {
        e.preventDefault();
        post("/marcacoes", {
            onSuccess: () => {
                setOpen(false);
                toast.success("Marcação adicionada com sucesso!");
            },
            onError: () => toast.error("Erro ao adicionar marcação!"),
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
                    onClick={() => setOpen(true)}
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
                            <th>Hora</th>
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
                                <td>{new Date(marcacao.data).toLocaleDateString()}</td>
                                <td>{marcacao.hora}</td>
                                <td className="flex items-center justify-center space-x-2">
                                    <button
                                        onClick={() => { setItem(marcacao); setShow(true); }}
                                        className="bg-cyan-400 rounded-full p-1 text-white hover:bg-cyan-500"
                                    >
                                        <LiaEyeSolid className="text-xl" />
                                    </button>
                                    <button
                                        onClick={() => { setItem(marcacao); setEdit(true); }}
                                        className="bg-yellow-400 rounded-full p-1 text-white hover:bg-yellow-500"
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

                        <form onSubmit={submit} className="flex flex-col space-y-4">
                            {/* Paciente */}
                            <div>
                                <label className="font-bold">Paciente:</label>
                                <select
                                    onChange={(e) => setData("paciente_id", e.target.value)}
                                    className="bg-white w-full border rounded p-2"
                                >
                                    <option value="">-- Selecione --</option>
                                    {pacientes.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                                {errors.paciente_id && <p className="error">{errors.paciente_id}</p>}
                            </div>

                            {/* Especialidade */}
                            <div>
                                <label className="font-bold">Especialidade:</label>
                                <select
                                    onChange={(e) => setData("especialidade_id", e.target.value)}
                                    className="bg-white w-full border rounded p-2"
                                >
                                    <option value="">-- Selecione --</option>
                                    {especialidades.map((esp) => (
                                        <option key={esp.id} value={esp.id}>{esp.nome}</option>
                                    ))}
                                </select>
                                {errors.especialidade_id && <p className="error">{errors.especialidade_id}</p>}
                            </div>

                            {/* Data */}
                            <div>
                                <label className="font-bold">Data:</label>
                                <input
                                    type="date"
                                    onChange={(e) => setData("data", e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                                {errors.data && <p className="error">{errors.data}</p>}
                            </div>

                            {/* Hora */}
                            <div>
                                <label className="font-bold">Hora:</label>
                                <input
                                    type="time"
                                    onChange={(e) => setData("hora", e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                                {errors.hora && <p className="error">{errors.hora}</p>}
                            </div>

                            <button
                                disabled={processing}
                                className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 mt-4"
                            >
                                {processing ? <Loader /> : "Salvar"}
                            </button>
                        </form>
                    </DialogPanel>
                </Dialog>
            </Transition>
        </div>
    );
}
