import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { LiaEditSolid, LiaEyeSolid, LiaPlusCircleSolid, LiaTimesSolid, LiaTrashAltSolid, LiaUserInjuredSolid, LiaUserPlusSolid, LiaFilterSolid } from "react-icons/lia";
import { useRoute } from "../../../vendor/tightenco/ziggy/src/js";
import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { toast } from "react-toastify";
import Loader from "../components/loader";

export default function Recepcionista({ recepcionistas }) {
    const route = useRoute();
    const { delete: destroy } = useForm();
    const { component } = usePage();
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [edit, setEdit] = useState(false);
    const [filter, setFilter] = useState(false);
    const [destroier, setDestroier] = useState(false);
    let [item, setItem] = useState({});
    const { data, setData, get, post, put, errors, processing } = useForm({
        nome: "",
        nascimento: "",
        morada: "",
        contacto: "",
        bi: "",
        sexo: "",
    });

    //Create
    function submit(e) {
        e.preventDefault();
        post("/recepcionistas", {
            onSuccess: () => { setOpen(false); toast.success("Recepcionista adicionado com sucesso!"); },
            onError: () => toast.error("Erro ao adicionar recepcionista!")
        });
    }

    //Search
    function search(e) {
        e.preventDefault();
        get(route("recepcionistas.index"), item);
    }

    //Delete
    function destroing(e) {
        e.preventDefault();
        destroy(route("recepcionistas.destroy", item), {
            onSuccess: () => { setDestroier(false); toast.success("Recepcionista deletado com sucesso!"); },
            onError: () => toast.error("Erro ao deletar recepcionista!")
        });
    }

    //Update
    function update(e) {
        e.preventDefault();
        put(route("recepcionistas.update", data), {
            onSuccess: () => { setEdit(false); toast.success("Recepcionista atualizado com sucesso!"); },
            onError: () => toast.error("Erro ao atualizar recepcionista!")
        });
    }
    function search(e) {
        e.preventDefault();
        get(route("recepcionistas.index", data));
    }
    //Modals
    function showRecepcionista(data) { setItem(data); setShow(true); }
    function editRecepcionista(data) { setData(data); setEdit(true); }
    function deleteRecepcionista(data) { setItem(data); setDestroier(true); }
    return (
        <div className="p-6">
            <Head title={component} />

            {/* Ações */}
            <div className="flex items-center space-x-2 mb-4">
                <button onClick={() => setOpen(true)} className="flex items-center text-green-400 bg-green-100 p-2 hover:bg-green-400 hover:text-white rounded-lg">
                    <LiaUserPlusSolid className="text-2xl me-1" /> Adicionar
                </button>
                <button onClick={() => setFilter(true)} className="flex items-center text-yellow-400 bg-yellow-100 p-2 hover:bg-yellow-400 hover:text-white rounded-lg">
                    <LiaFilterSolid className="text-2xl me-1" /> Filtrar
                </button>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto rounded-2xl">
                <table className="min-w-full border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                            <td>Nome</td>
                            <td>Data de Nasc</td>
                            <td>Morada</td>
                            <td>Contacto</td>
                            <td>B.I.</td>
                            <td className="text-center">Acções</td>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {recepcionistas.data.map((r) => (
                            <tr key={r.id} className={`${r.id % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-cyan-50 transition`}>
                                <td>{r.nome}</td>
                                <td>{new Date(r.nascimento).toDateString()}</td>
                                <td>{r.morada}</td>
                                <td>{r.contacto}</td>
                                <td>{r.bi}</td>
                                <td className="flex items-center justify-center space-x-2">
                                    <button onClick={() => showRecepcionista(r)} className="bg-cyan-400 rounded-full p-1 text-white hover:bg-cyan-500"><LiaEyeSolid className="text-xl" /></button>
                                    <button onClick={() => editRecepcionista(r)} className="bg-yellow-400 rounded-full p-1 text-white hover:bg-yellow-500"><LiaEditSolid className="text-xl" /></button>
                                    <button onClick={() => deleteRecepcionista(r)} className="bg-rose-400 rounded-full p-1 text-white hover:bg-rose-500"><LiaTrashAltSolid className="text-xl" /></button>
                                </td>
                            </tr>
                        ))}
                        {recepcionistas.data.length === 0 && (
                            <tr className="text-center">
                                <td colSpan={6}>Nenhum recepcionista registrado!</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Paginação */}
                <div className="flex items-center justify-end pt-3 px-4">
                    {recepcionistas.links.map((link) =>
                        link.url ? (
                            <Link key={link.label} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-2 mx-1 rounded-lg border-2 border-cyan-600 font-bold ${link.active ? "bg-cyan-600 text-white" : "text-cyan-600"}`} />
                        ) : null
                    )}
                </div>
            </div>
            {/* Modal Adicionar */}
            <Transition show={open}>
                <Dialog onClose={() => setOpen(false)} className="relative z-10">
                    <Transition.Child enter="transition-opacity ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="transition-opacity ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                    </Transition.Child>
                    <Transition.Child enter="transition ease-out duration-300 transform" enterFrom="translate-x-full" enterTo="translate-x-0"
                        leave="transition ease-in duration-200 transform" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                        <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Adicionar Recepcionista</p>
                                    </DialogTitle>
                                    <button onClick={() => setOpen(false)} className="border rounded"><LiaTimesSolid className="text-2xl" /></button>
                                </div>
                                <div className="p-2">
                                    <form className="flex flex-col space-y-3" onSubmit={submit}>
                                        <div>
                                            <label className="font-bold">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} required maxLength={255} pattern="[a-zA-ZÀ-ÿ\s]+" />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold">B.I.:</label>
                                            <input type="text" onChange={(e) => setData("bi", e.target.value)} required pattern="^\d{9}[A-Z]{2}\d{3}$" />
                                            {errors.bi && <p className="error">{errors.bi}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold">Gênero:</label>
                                            <select value={data.sexo} onChange={(e) => setData("sexo", e.target.value)}>
                                                <option value="">-- Selecione --</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Feminino">Feminino</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="font-bold">Data de Nascimento:</label>
                                            <input type="date" onChange={(e) => setData("nascimento", e.target.value)} required
                                                min="1900-01-01"
                                                max="2100-12-31" />
                                        </div>
                                        <div>
                                            <label className="font-bold">Morada:</label>
                                            <input type="text" onChange={(e) => setData("morada", e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="font-bold">Contacto:</label>
                                            <input type="text" onChange={(e) => setData("contacto", e.target.value)} required pattern="9\d{8}" />
                                        </div>
                                        <div className="flex justify-end mt-6">
                                            <button className="w-full min-h-[40px]  bg-green-500 hover:bg-green-600 rounded-lg text-white p-1" disabled={processing}>  {processing ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader />
                                                </span>
                                            ) : "Salvar"}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {/* Modal Para Editar recepcionistas */}
            <Transition show={edit}>
                <Dialog onClose={() => setEdit(false)} className="relative z-10">
                    <Transition.Child enter="transition-opacity ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="transition-opacity ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                    </Transition.Child>
                    <Transition.Child enter="transition ease-out duration-300 transform" enterFrom="translate-x-full" enterTo="translate-x-0"
                        leave="transition ease-in duration-200 transform" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                        <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Editar dados do recepcionista</p>
                                    </DialogTitle>
                                    <button onClick={() => setEdit(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form className="flex flex-col space-y-3" onSubmit={update}>
                                        <div>
                                            <label className="font-bold">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} value={data.nome} required maxLength={255}
                                                pattern="[a-zA-ZÀ-ÿ\s]+" />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold">B.I.:</label>
                                            <input type="text" onChange={(e) => setData("bi", e.target.value)} value={data.bi} required pattern="^\d{9}[A-Z]{2}\d{3}$" />
                                            {errors.bi && <p className="error">{errors.bi}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold">Gênero:</label>
                                            <select value={data.sexo} onChange={(e) => setData("sexo", e.target.value)}>
                                                <option value="">-- Selecione --</option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Feminino">Feminino</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="font-bold">Data de Nascimento:</label>
                                            <input type="date" value={data.nascimento} onChange={(e) => setData("nascimento", e.target.value)}
                                                required
                                                min="1900-01-01"
                                                max="2100-12-31" />
                                        </div>
                                        <div>
                                            <label className="font-bold">Morada:</label>
                                            <input type="text" value={data.morada} onChange={(e) => setData("morada", e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="font-bold">Contacto:</label>
                                            <input type="text" value={data.contacto} onChange={(e) => setData("contacto", e.target.value)} required pattern="9\d{8}" />
                                        </div>
                                        <div className="flex justify-end mt-6">
                                            <button className="w-full min-h-[40px]  bg-green-500 hover:bg-green-600 rounded-lg text-white p-1" disabled={processing}>  {processing ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader />
                                                </span>
                                            ) : "Salvar"}</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {/* Modal Para Detalhes dos recepcionistas */}
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
                        <Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-md  bg-white p-6 overflow-y-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between space-x-2 p-3 border-b">
                                <Dialog.Title className="text-base font-semibold flex items-center space-x-2">
                                    <p>Detalhes do recepcionista</p>
                                </Dialog.Title>
                                <button onClick={() => setShow(false)} className="border rounded">
                                    <LiaTimesSolid className="text-2xl" />
                                </button>
                            </div>

                            {/* Conteúdo */}
                            <div className="flex flex-col space-y-2 mt-4 px-3 rounded">
                                <div className="flex justify-between items-center ">
                                    <label htmlFor="" className="font-bold">Nome:</label>
                                    <label htmlFor="" className="">{item.nome}</label>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <label htmlFor="" className="font-bold">BI:</label>
                                    <label htmlFor="" className="">{item.bi}</label>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <label htmlFor="" className="font-bold">Gênero:</label>
                                    <label htmlFor="" className="">{item.sexo}</label>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <label htmlFor="" className="font-bold">Data de Nascimento:</label>
                                    <label htmlFor="" className="">{item.nascimento}</label>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <label htmlFor="" className="font-bold">Morada:</label>
                                    <label htmlFor="" className="">{item.morada}</label>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <label htmlFor="" className="font-bold">Contacto:</label>
                                    <label htmlFor="" className="">{item.contacto}</label>
                                </div>

                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {/* Modal Para Pesquisar recepcionista */}
            <Transition show={filter}>
                <Dialog onClose={() => setFilter(false)} className="relative z-10">
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
                        <DialogPanel
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Pesquisar medicos</p>
                                    </DialogTitle>
                                    <button onClick={() => setFilter(false)} className="border  rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={search} className="flex flex-col space-y-4">
                                        <div>
                                            <label htmlFor="" className="font-bold">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} className={errors.nome && "!ring-red-500"} />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>

                                        <div>
                                            <label className="font-bold" htmlFor="">Nº do BI:</label>
                                            <input type="text" onChange={(e) => setData("bi", e.target.value)} />
                                            {errors.bi && <p className="error">{errors.bi}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Gênero:</label>
                                            <select name="sexo" id="sexo" value={data.sexo} onChange={(e) => setData("sexo", e.target.value)} className="bg-white">
                                                <option value=""> -- Selecione -- </option>
                                                <option value="Masculino">Masculino</option>
                                                <option value="Feminino">Feminino</option>
                                            </select>
                                        </div>

                                        <div className="flex justify-end mt-6">
                                            <button className="w-full min-h-[40px]  bg-green-500 hover:bg-green-600 rounded-lg text-white p-1" disabled={processing}>  {processing ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader />
                                                </span>
                                            ) : "Pesquisar"}</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
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
                                            <p>Deletar medico</p>
                                        </DialogTitle>
                                        <button onClick={() => setDestroier(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                    </div>
                                    <div className="p-4 max-w-sm">
                                        <form onSubmit={destroing}>
                                            <p className="text-center my-2">Tem certeza que pretende excluir o recepcionista {item.nome}?</p>
                                            <p className="text-center text-sm text-gray-600 my-4">Os Registos relacionados a ele serão perdidos!</p>
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
