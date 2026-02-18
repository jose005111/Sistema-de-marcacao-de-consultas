import { Head, useForm, usePage, Link } from "@inertiajs/react";
import {
    LiaPlusCircleSolid,
    LiaTimesSolid,
    LiaFilterSolid,
    LiaEyeSolid,
    LiaEditSolid,
    LiaTrashAltSolid,
} from "react-icons/lia";
import { useRoute } from "../../../vendor/tightenco/ziggy/src/js";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import Loader from "../components/loader";
import axios from "axios";

export default function Vagas({ vagas, especialidades }) {
    const route = useRoute();
    const { component } = usePage();

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [show, setShow] = useState(false);
    const [filter, setFilter] = useState(false);
    const [destroyer, setDestroyer] = useState(false);

    const [showDetalhes, setShowDetalhes] = useState(false);
    const [vagaSelecionada, setVagaSelecionada] = useState(null);

    async function openDetalhes(vaga) {
        try {
            const response = await axios.get(
                `/vagas/${vaga.especialidade_id}/detalhes`
            );

            setVagaSelecionada({
                ...vaga,
                datas: response.data
            });

            setShowDetalhes(true);

        } catch (error) {
            console.error(error);
        }
    }


    const [item, setItem] = useState({});

    const { data, setData, post, put, processing, errors, delete: destroy } = useForm({
        data: "",
        vagas: especialidades.map((e) => ({
            especialidade_id: e.id,
            total_vagas: "",
        })),
    });

    function openDelete(vaga) {
        setVagaSelecionada(vaga);
        setDestroyer(true);
    }

    function submit(e) {
        e.preventDefault();

        post(route("vagas.store"), {
            onSuccess: () => {
                setOpen(false);
                toast.success("Vagas disponibilizadas com sucesso!");
            },
            onError: () => toast.error("Erro ao disponibilizar vagas!"),
        });
    }

    function updateVaga(index, value) {
        const newVagas = [...data.vagas];
        newVagas[index].total_vagas = value;
        setData("vagas", newVagas);
    }
    function destroing(e) {
        e.preventDefault();

        destroy(route("vagas.destroy", vagaSelecionada.id), {
            onSuccess: () => {
                setDestroyer(false);
                toast.success("Vaga eliminada com sucesso!");
            },
            onError: (errors) => {
                // Inertia envia os erros do Laravel na propriedade errors
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error("Erro ao adicionar marcação!");
                }


                setDestroyer(false);
            },
        });
    }
    function openEdit(vaga) {
        setVagaSelecionada(vaga);
        setData({
            data: vaga.data,
            total_vagas: vaga.total_vagas,
        });
        setEdit(true);
    }





    return (
        <div className="p-6">
            <Head title={component} />

            {/* Botão */}

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center text-green-400 bg-green-100 p-2 hover:bg-green-400 hover:text-white rounded-lg"
                >
                    <LiaPlusCircleSolid className="text-2xl me-1" />
                    Disponibilizar Vagas
                </button>
                {/* Botão filtro */}
                <button
                    onClick={() => setFilter(true)}
                    className="flex items-center text-yellow-400 bg-yellow-100 p-2 hover:bg-yellow-400 hover:text-white rounded-lg"
                >
                    <LiaFilterSolid className="text-2xl me-1" /> Filtrar
                </button>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-2xl mt-4">
                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gradient-to-r from-cyan-50 to-emerald-50 text-xs uppercase text-gray-600">
                            <tr>
                                <th className="px-6 py-4 text-left">Especialidade</th>
                                <th className="px-6 py-4 text-center">Vagas</th>
                                <th className="px-6 py-4 text-center">Estado</th>
                                <th className="px-6 py-4 text-center">Acções</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {vagas?.data?.map((v) => {
                                const ocupadas = v.total_vagas - v.vagas_disponiveis;
                                const percentagem = Math.round((ocupadas / v.total_vagas) * 100);

                                let statusColor = "bg-green-100 text-green-700";
                                if (percentagem == 100) statusColor = "bg-red-100 text-red-600";
                                if (percentagem >= 70 && percentagem < 100) statusColor = "bg-yellow-100 text-yellow-600";
                                else if (percentagem >= 40 && percentagem < 70) statusColor = "bg-yellow-100 text-yellow-700";

                                return (
                                    <tr key={v.especialidade_id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-2 font-semibold text-gray-700">
                                            {v.especialidade?.nome}
                                        </td>

                                        <td className="px-6 py-2 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="font-bold text-gray-700">
                                                    {v.vagas_disponiveis} / {v.total_vagas}
                                                </span>

                                                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-cyan-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${percentagem}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-2 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                                                {percentagem == 100
                                                    ? "Esgotada"
                                                    : (percentagem >= 70 && percentagem < 100)
                                                        ? "Alta Procura"
                                                        : (percentagem >= 40 && percentagem < 70)
                                                            ? "Média"
                                                            : "Disponível"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-2 flex justify-center space-x-2">
                                            <button onClick={() => openDetalhes(v)}
                                                className="bg-cyan-500 hover:bg-cyan-600 text-white p-1 rounded-full transition">
                                                <LiaEyeSolid className="text-xl" />
                                            </button>

                                            <button onClick={() => openEdit(v)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white p-1 rounded-full transition">
                                                <LiaEditSolid className="text-xl" />
                                            </button>

                                            <button onClick={() => openDelete(v)}
                                                className="bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-full transition">
                                                <LiaTrashAltSolid className="text-xl" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {(!vagas?.data || vagas.data.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">
                                        Nenhuma vaga cadastrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                {/* Paginação */}
                <div className="flex items-center justify-end pt-3 px-4">
                    {vagas.links.map((link) =>
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

            {/* Modal */}
            <Transition show={open}>
                <Dialog onClose={() => setOpen(false)} className="relative z-10">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                        <DialogTitle className="font-bold mb-4 flex justify-between border-b pb-2">
                            Disponibilizar Vagas
                            <button onClick={() => setOpen(false)}>
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Data */}
                            <div>
                                <label className="font-bold">Data</label>
                                <input
                                    type="date"
                                    onChange={(e) => setData("data", e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                                {errors.data && <p className="text-red-500">{errors.data}</p>}
                            </div>

                            {/* Especialidades */}
                            <div className="space-y-3">
                                {especialidades.map((esp, index) => (
                                    <div key={esp.id} className="flex items-center gap-2">
                                        <span className="w-1/2 font-semibold">
                                            {esp.nome}
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Qtd."
                                            onChange={(e) =>
                                                updateVaga(index, e.target.value)
                                            }
                                            className="w-1/2 border rounded p-2"
                                        />
                                    </div>
                                ))}
                                {errors.vagas && (
                                    <p className="text-red-500">{errors.vagas}</p>
                                )}
                            </div>

                            <button
                                disabled={processing}
                                className="w-full min-h-[40px] bg-green-500 hover:bg-green-600 rounded-lg text-white p-1"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <Loader />
                                    </span>
                                ) : "Salvar"}
                            </button>
                        </form>
                    </DialogPanel>
                </Dialog>
            </Transition>

            <Transition show={filter}>
                <Dialog onClose={() => setFilter(false)} className="relative z-10">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6">
                        <DialogTitle className="font-bold mb-4 border-b pb-2">
                            Pesquisar Vagas
                        </DialogTitle>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                get(route("vagas.index"), data);
                            }}
                            className="space-y-3"
                        >
                            <input
                                type="date"
                                className="border p-2 w-full"
                                onChange={(e) => setData("data", e.target.value)}
                            />

                            <select
                                className="border p-2 w-full"
                                onChange={(e) => setData("especialidade_id", e.target.value)}
                            >
                                <option value="">Todas</option>
                                {especialidades.map(e => (
                                    <option key={e.id} value={e.id}>{e.nome}</option>
                                ))}
                            </select>

                            <button className="bg-yellow-400 text-white w-full p-2 rounded">
                                Aplicar
                            </button>
                        </form>
                    </DialogPanel>
                </Dialog>
            </Transition>

            <Transition show={showDetalhes}>
                <Dialog onClose={() => setShowDetalhes(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto">

                        <DialogTitle className="flex justify-between items-center border-b pb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    Detalhes da Especialidade
                                </h2>
                            </div>

                            <button onClick={() => setShowDetalhes(false)}>
                                <LiaTimesSolid className="text-2xl text-gray-500 hover:text-gray-800" />
                            </button>
                        </DialogTitle>

                        {vagaSelecionada && (
                            <div className="mt-6 space-y-6">

                                <div>
                                    <h3 className="text-xl font-bold text-cyan-600">
                                        {vagaSelecionada.especialidade?.nome}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Distribuição por data
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {vagaSelecionada.datas?.map((item, index) => {

                                        const ocupadas = item.total_vagas - item.vagas_disponiveis;
                                        const percentagem = Math.round(
                                            (ocupadas / item.total_vagas) * 100
                                        );

                                        let corBarra = "bg-green-500";
                                        if (percentagem >= 70) corBarra = "bg-red-500";
                                        else if (percentagem >= 40) corBarra = "bg-yellow-500";

                                        return (
                                            <div
                                                key={index}
                                                className="bg-gray-50 p-4 rounded-2xl shadow-sm border border-gray-100"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-semibold text-gray-700">
                                                        {new Date(item.data).toLocaleDateString()}
                                                    </span>

                                                    <span className="text-xs text-gray-500">
                                                        {item.vagas_disponiveis} disponíveis
                                                    </span>
                                                </div>

                                                <div className="w-full bg-gray-200 h-3 rounded-full">
                                                    <div
                                                        className={`${corBarra} h-3 rounded-full transition-all`}
                                                        style={{ width: `${percentagem}%` }}
                                                    />
                                                </div>

                                                <div className="flex justify-between text-xs mt-2 text-gray-500">
                                                    <span>Total: {item.total_vagas}</span>
                                                    <span>Ocupadas: {ocupadas}</span>
                                                    <span>{percentagem}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        )}

                    </DialogPanel>
                </Dialog>
            </Transition>


            {/* Modal de edição de vaga */}
            <Transition show={edit}>
                <Dialog onClose={() => setEdit(false)} className="relative z-10">
                    {/* Fundo */}
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Painel lateral */}
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                        <DialogTitle className="font-bold mb-4 flex justify-between items-center border-b pb-2">
                            Editar Vaga
                            <button onClick={() => setEdit(false)}>
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        {vagaSelecionada && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    put(route('vagas.update', vagaSelecionada.id), {
                                        onSuccess: () => {
                                            setEdit(false);
                                            toast.success('Vaga atualizada com sucesso!');
                                        },
                                        onError: () => toast.error('Erro ao atualizar vaga'),
                                    });
                                }}
                                className="space-y-4"
                            >
                                {/* Especialidade */}
                                <div>
                                    <label className="font-bold">Especialidade</label>
                                    <input
                                        value={vagaSelecionada.especialidade?.nome}
                                        disabled
                                        className="w-full bg-gray-100 border rounded p-2"
                                    />
                                </div>

                                {/* Data */}
                                <div>
                                    <label className="font-bold">Data</label>
                                    <input
                                        type="date"
                                        value={data.data}
                                        onChange={(e) => setData('data', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    {errors.data && <p className="text-red-500">{errors.data}</p>}
                                </div>

                                {/* Total */}
                                <div>
                                    <label className="font-bold">Total de vagas</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.total_vagas}
                                        onChange={(e) => setData('total_vagas', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    {errors.total_vagas && (
                                        <p className="text-red-500">{errors.total_vagas}</p>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="text-sm bg-yellow-50 border border-yellow-300 rounded p-2">
                                    <p>
                                        <strong>Disponíveis:</strong>{" "}
                                        {vagaSelecionada.vagas_disponiveis}
                                    </p>
                                    <p>
                                        <strong>Já marcadas:</strong>{" "}
                                        {vagaSelecionada.total_vagas -
                                            vagaSelecionada.vagas_disponiveis}
                                    </p>
                                </div>

                                <button
                                    disabled={processing}
                                    className="w-full min-h-[40px] bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                >
                                    {processing ? <span className="flex items-center justify-center">
                                        <Loader />
                                    </span> : "Atualizar"}
                                </button>
                            </form>
                        )}
                    </DialogPanel>
                </Dialog>
            </Transition>


            <Dialog open={destroyer} onClose={setDestroyer} className="relative z-10">
                {/* Fundo escuro */}
                <Transition.Child
                    enter="transition-opacity ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                {/* Painel */}
                <Transition.Child
                    enter="transition ease-out duration-300 transform"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="transition ease-in duration-200 transform"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                >
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left max-w-sm w-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-3 border-b">
                                    <DialogTitle className="text-base font-semibold flex items-center space-x-2">
                                        <span className="bg-rose-500 rounded-full text-white p-1">
                                            <LiaTrashAltSolid className="text-2xl" />
                                        </span>
                                        <p>Eliminar Vaga</p>
                                    </DialogTitle>

                                    <button
                                        onClick={() => setDestroyer(false)}
                                        className="border rounded"
                                    >
                                        <LiaTimesSolid className="text-2xl" />
                                    </button>
                                </div>

                                {/* Conteúdo */}
                                <div className="p-4">
                                    <form onSubmit={destroing}>
                                        <p className="text-center my-2">
                                            Tem certeza que deseja eliminar esta vaga?
                                        </p>

                                        {vagaSelecionada && (
                                            <p className="text-center text-sm text-gray-600 my-3">
                                                {vagaSelecionada.especialidade?.nome} —{" "}
                                                {new Date(
                                                    vagaSelecionada.data
                                                ).toLocaleDateString()}
                                            </p>
                                        )}

                                        <p className="text-center text-sm text-rose-600 my-3">
                                            Esta ação não pode ser desfeita.
                                        </p>

                                        <div className="flex justify-end mt-4 space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setDestroyer(false)}
                                                className="w-full min-h-[40px] bg-gray-500 hover:bg-gray-600 rounded-lg text-white"
                                            >
                                                Cancelar
                                            </button>

                                            <button className="w-full min-h-[40px]  bg-rose-500 hover:bg-rose-600 rounded-lg text-white p-1" disabled={processing}>{processing ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader />
                                                </span>
                                            ) : "Confirmar"}</button>
                                        </div>
                                    </form>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>



        </div>
    );
}
