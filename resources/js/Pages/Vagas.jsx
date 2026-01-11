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

    function openDetalhes(vaga) {
        setVagaSelecionada(vaga);
        setShowDetalhes(true);
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
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-xs uppercase">
                        <tr>
                            <th>Especialidade</th>
                            <th>Data</th>
                            <th>Total</th>
                            <th>Disponíveis</th>
                            <th className="text-center">Acções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vagas?.data?.map((v) => (
                            <tr
                                key={v.id}
                                className="odd:bg-gray-50 hover:bg-green-50"
                            >
                                <td>{v.especialidade?.nome}</td>
                                <td>{new Date(v.data).toDateString()}</td>
                                <td>{v.total_vagas}</td>
                                <td className="font-bold text-green-600">
                                    {v.vagas_disponiveis}
                                </td>
                                <td className="flex items-center justify-center space-x-2">
                                    <button onClick={() => openDetalhes(v)} className="bg-cyan-400 rounded-full  p-1 text-white hover:bg-cyan-500"><LiaEyeSolid className="text-xl" /></button>
                                    <button onClick={() => openEdit(v)} className="bg-yellow-400 rounded-full p-1  text-white hover:bg-yellow-500"><LiaEditSolid className="text-xl" /></button>
                                    <button onClick={() => openDelete(v)} className="bg-rose-400 rounded-full p-1  text-white hover:bg-rose-500"><LiaTrashAltSolid className="text-xl" /></button>
                                </td>

                            </tr>
                        ))}

                        {(!vagas?.data || vagas.data.length === 0) && (
                            <tr>
                                <td colSpan={5} className="text-center py-4">
                                    Nenhuma vaga cadastrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

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
                    <div className="fixed inset-0 bg-black/40" />
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
                                className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 w-full"
                            >
                                {processing ? <Loader /> : "Salvar"}
                            </button>
                        </form>
                    </DialogPanel>
                </Dialog>
            </Transition>
            <Transition show={filter}>
                <Dialog onClose={() => setFilter(false)} className="relative z-10">
                    <div className="fixed inset-0 bg-black/40" />
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
                <Dialog
                    onClose={() => setShowDetalhes(false)}
                    className="relative z-10"
                >
                    <div className="fixed inset-0 bg-black/40" />

                    <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                        <DialogTitle className="font-bold mb-4 flex justify-between items-center border-b pb-2">
                            Detalhes da Vaga
                            <button onClick={() => setShowDetalhes(false)}>
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </DialogTitle>

                        {vagaSelecionada && (
                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className="font-semibold">Especialidade:</span>
                                    <p>{vagaSelecionada.especialidade?.nome}</p>
                                </div>

                                <div>
                                    <span className="font-semibold">Data:</span>
                                    <p>
                                        {new Date(vagaSelecionada.data).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-100 p-3 rounded">
                                        <span className="font-semibold block">
                                            Total de Vagas
                                        </span>
                                        <span className="text-lg font-bold">
                                            {vagaSelecionada.total_vagas}
                                        </span>
                                    </div>

                                    <div className="bg-green-100 p-3 rounded">
                                        <span className="font-semibold block">
                                            Disponíveis
                                        </span>
                                        <span className="text-lg font-bold text-green-700">
                                            {vagaSelecionada.vagas_disponiveis}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-red-100 p-3 rounded">
                                    <span className="font-semibold block">
                                        Ocupadas
                                    </span>
                                    <span className="text-lg font-bold text-red-600">
                                        {vagaSelecionada.total_vagas -
                                            vagaSelecionada.vagas_disponiveis}
                                    </span>
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
                    <div className="fixed inset-0 bg-black/40" />

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
                    <div className="fixed inset-0 bg-black/40" />
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
