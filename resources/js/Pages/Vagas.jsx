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
    // const [show, setShow] = useState(false);
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


    const { data, setData, post, put, get, processing, errors, delete: destroy, reset, clearErrors } = useForm({
        data: "",
        vagas: especialidades.map((e) => ({
            especialidade_id: e.id,
            total_vagas: "",
        })),
    });

    function openDelete(vaga) {
        setVagaSelecionada(vaga);
        setShowDetalhes(false);
        setDestroyer(true);
    }

    function submit(e) {
        e.preventDefault();
        post(route("vagas.store"), {
            onSuccess: () => {
                toast.success("Vagas disponibilizadas com sucesso!");
                setOpen(false);
                reset();
            },
            onError: () => {
                toast.error("Erro ao disponibilizar vagas!")
            },
            onFinish: () => {

            }

        });
    }

    async function openDetalhes(vaga) {
        try {
            const response = await axios.get(`/vagas/${vaga.especialidade_id}/detalhes`);

            // Pegamos o nome da especialidade do primeiro registro retornado
            const nome = response.data.length > 0
                ? response.data[0].especialidade?.nome
                : (vaga.especialidade?.nome || "Especialidade");

            setVagaSelecionada({
                especialidade_id: vaga.especialidade_id, // Guardamos para reuso no edit/delete
                nomeEspecialidade: nome,
                datas: response.data
            });

            setShowDetalhes(true);
        } catch (error) {
            toast.error("Erro ao carregar detalhes");
        }
    }

    function destroing(e) {
        e.preventDefault();
        destroy(route("vagas.destroy", vagaSelecionada.id), {
            onSuccess: () => {
                toast.success("Vaga eliminada com sucesso!");
                openDetalhes({ especialidade_id: vagaSelecionada.especialidade_id });
            },
            onError: (errors) => {
                // Inertia envia os erros do Laravel na propriedade errors
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error("Erro ao adicionar marcação!");
                }
            },
            onFinish: () => {
                setDestroyer(false);
                setShowDetalhes(false);
            }
        });
    }
    function openEdit(vaga) {
        setVagaSelecionada(vaga);
        setData({
            data: vaga.data,
            total_vagas: vaga.total_vagas,
        });
        setShowDetalhes(false);
        setEdit(true);
    }





    return (
        <div className="p-6">
            <Head title={component} />

            {/* Botão */}

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => {
                        setData({ data: "", especialidade_id: "" });
                        setOpen(true);
                        clearErrors();
                    }}
                    className="flex items-center text-green-400 bg-green-100 p-2 hover:bg-green-400 hover:text-green-50 rounded-lg"
                >
                    <LiaPlusCircleSolid className="text-2xl me-1" />
                    Disponibilizar Vagas
                </button>
                {/* Botão filtro */}
                <button
                    onClick={() => setFilter(true)}
                    className="flex items-center text-yellow-400 bg-yellow-100 p-2 hover:bg-yellow-400 hover:text-yellow-50 rounded-lg"
                >
                    <LiaFilterSolid className="text-2xl me-1" /> Pesquisar
                </button>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-2xl mt-4">
                <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
                    <table>
                        <thead>
                            <tr>
                                <th className="text-left">Especialidade</th>
                                <th className="text-center">Vagas</th>
                                <th className="text-center">Estado</th>
                                <th className="text-center">Acções</th>
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
                                        <td>
                                            {v.especialidade?.nome}
                                        </td>

                                        <td className="text-center">
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
                                                className="bg-cyan-500 hover:bg-cyan-600 text-white p-1 rounded-full transition" title="Ver detalhes">
                                                <LiaEyeSolid className="text-xl" />
                                            </button>

                                            {/* <button onClick={() => openEdit(v)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white p-1 rounded-lg transition" title="Editar vaga">
                                                <LiaEditSolid className="text-xl" />
                                            </button>

                                            <button onClick={() => openDelete(v)}
                                                className="bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-lg transition" title="Excluir vaga">
                                                <LiaTrashAltSolid className="text-xl" />
                                            </button> */}
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
                {vagas.links && vagas.links.length >= 10 && (
                    <div className="flex items-center justify-end pt-3 px-4">
                        {vagas.links.map((link) =>
                            link.url ? (
                                <Link
                                    key={link.label}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-2 mx-1  rounded-lg border-2 font-sm ${link.active ? "bg-cyan-600 text-white border-cyan-600 " : "text-cyan-600 border-cyan-600 "
                                        }`}
                                />
                            ) : ("")
                        )}
                    </div>
                )}

            </div>

            {/* Modal para adicionar vaga */}
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

                        <form onSubmit={submit} className="space-y-6">
                            {/* 1. Selecionar Especialidade */}
                            <div>
                                <label>Especialidade</label>
                                <select
                                    className={`w-full border rounded-lg p-2.5 bg-gray-50 ${errors.especialidade_id ? 'border-red-500' : 'border-gray-300'}`}
                                    value={data.especialidade_id}
                                    onChange={(e) => setData("especialidade_id", e.target.value)}
                                >
                                    <option value="">Selecione a especialidade...</option>
                                    {especialidades.map((esp) => (
                                        <option key={esp.id} value={esp.id}>
                                            {esp.nome}
                                        </option>
                                    ))}
                                </select>
                                {errors.especialidade_id && <p className="text-red-500 text-sm mt-1">{errors.especialidade_id}</p>}
                            </div>

                            {/* 2. Selecionar Data */}
                            <div>
                                <label>Data disponível</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]} // Bloqueia visualmente datas passadas
                                    value={data.data}
                                    onChange={(e) => setData("data", e.target.value)}
                                    className={`w-full border rounded-lg p-2.5 bg-gray-50 ${errors.data ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {/* O erro de "Data já ocupada" vindo do Back-end aparecerá aqui */}
                                {errors.data && <p className="text-red-500 text-sm mt-1">{errors.data}</p>}
                            </div>

                            {/* 3. Quantidade de Vagas */}
                            <div>
                                <label>Quantidade de Vagas</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Ex: 10"
                                    value={data.total_vagas}
                                    onChange={(e) => setData("total_vagas", e.target.value)}
                                    className={`w-full border rounded-lg p-2.5 bg-gray-50 ${errors.total_vagas ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.total_vagas && <p className="text-red-500 text-sm mt-1">{errors.total_vagas}</p>}
                            </div>

                            {/* Botão de Submissão */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full min-h-[45px] bg-green-600 hover:bg-green-700 rounded-lg text-white transition-all flex items-center justify-center shadow-md"
                                >
                                    {processing ? <Loader /> : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </Dialog>
            </Transition>

            {/* Modal de Filtros */}
            <Transition show={filter}>
                <Dialog onClose={() => setFilter(false)} className="relative z-10">
                    {/* Fundo escuro com desfoque */}
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Painel Lateral Direito */}
                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto shadow-xl">
                        <DialogTitle className="font-bold mb-6 flex justify-between border-b pb-4">
                            Pesquisar Vagas
                            <button onClick={() => setFilter(false)} className="hover:text-red-500 transition-colors">
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // Usamos get para enviar os filtros via Query String
                                get(route("vagas.index"), {
                                    onSuccess: () => setFilter(false),
                                });
                            }}
                            className="space-y-6"
                        >
                            {/* Filtro por Especialidade */}
                            <div>
                                <label>Especialidade</label>
                                <select
                                    className=""
                                    value={data.especialidade_id}
                                    onChange={(e) => setData("especialidade_id", e.target.value)}
                                >
                                    <option value="">Todas as especialidades</option>
                                    {especialidades.map((e) => (
                                        <option key={e.id} value={e.id}>
                                            {e.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro por Data */}
                            <div>
                                <label>Data Específica</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50"
                                    value={data.data}
                                    onChange={(e) => setData("data", e.target.value)}
                                />
                            </div>

                            {/* Botões de Ação */}
                            <div className="pt-4 space-y-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full min-h-[45px] bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-all flex items-center justify-center shadow-md"
                                >
                                    {processing ? <Loader /> : "Pesquisar"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setData({ data: "", especialidade_id: "" });
                                        // Opcional: recarregar a página sem filtros
                                    }}
                                    className="w-full p-2 text-gray-500 hover:text-gray-700 text-sm font-semibold transition-colors"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
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

                        <div className="border-b">
                            <h2 className="text-lg font-bold text-gray-600 my-3">
                                {vagaSelecionada?.nomeEspecialidade}
                            </h2>
                            <p className="text-sm text-gray-500">Dias Disponíveis</p>
                        </div>
                        {/* Dentro do Modal de Detalhes */}
                        <div className="space-y-4 mt-4">
                            {vagaSelecionada?.datas?.map((vagaUnica) => {
                                const ocupadas = vagaUnica.total_vagas - vagaUnica.vagas_disponiveis;
                                const percentagem = Math.round((ocupadas / vagaUnica.total_vagas) * 100);

                                return (
                                    <div key={vagaUnica.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="font-bold text-slate-700 block">
                                                    {new Date(vagaUnica.data).toLocaleDateString()}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {vagaUnica.vagas_disponiveis} vagas livres de {vagaUnica.total_vagas}
                                                </span>
                                            </div>

                                            {/* AÇÕES MUDARAM PARA CÁ */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEdit(vagaUnica)}
                                                    className="p-1.5 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200"
                                                    title="Editar Vaga"
                                                >
                                                    <LiaEditSolid size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openDelete(vagaUnica)}
                                                    className="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200"
                                                    title="Eliminar Vaga"
                                                >
                                                    <LiaTrashAltSolid size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Barra de progresso */}
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${percentagem > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                                                style={{ width: `${percentagem}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </DialogPanel>
                </Dialog>
            </Transition>


            {/* Modal de edição de vaga */}
            <Transition show={edit}>
                <Dialog onClose={() => setEdit(false)} className="relative z-50">
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
                                    // Usamos o id que veio do vagaSelecionada (preenchido no openEdit)
                                    put(route('vagas.update', vagaSelecionada.id), {
                                        onSuccess: () => {
                                            toast.success('Vaga atualizada!');
                                        },
                                        onError: () => toast.error('Erro ao atualizar vaga'),
                                        onFinish: () => {
                                            setEdit(false);
                                            setShowDetalhes(false);
                                        }
                                    });
                                }}
                                className="space-y-4"
                            >
                                {/* Especialidade */}
                                <div>
                                    <label className="font-bold">Especialidade</label>
                                    <input
                                        value={vagaSelecionada.especialidade?.nome || "Especialidade"}
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


            <Dialog open={destroyer} onClose={setDestroyer} className="relative z-50">
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
                                            <div className="bg-gray-50 p-3 rounded text-center">
                                                <span className="text-sm font-medium">{vagaSelecionada?.especialidade?.nome}</span>
                                                {" - "}
                                                <span className="text-sm text-gray-500">{new Date(vagaSelecionada.data).toLocaleDateString()}</span>
                                            </div>
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
