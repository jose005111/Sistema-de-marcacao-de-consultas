import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { LiaEditSolid, LiaEyeSolid, LiaPlusCircleSolid, LiaTimesSolid, LiaTrashAltSolid, LiaUserInjuredSolid, LiaUserPlusSolid, LiaFilterSolid } from "react-icons/lia";
import { useRoute } from "../../../vendor/tightenco/ziggy/src/js";
import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { toast } from "react-toastify";
import Loader from "../components/loader";

export default function Paciente({ pacientes }) {
    const route = useRoute()
    const { delete: destroy } = useForm();
    const { flash } = usePage().props
    const { component } = usePage()
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
    const [filter, setFilter] = useState(false)
    const [destroier, setDestroier] = useState(false)
    let [item, setItem] = useState({})
    const { data, setData, get, post, put, errors, processing } = useForm({
        nome: "",
        nascimento: "",
        morada: "",
        contacto: "",
    });

    //Create
    function submit(e) {
        e.preventDefault();
        post("/pacientes", {
            onSuccess: () => {
                setOpen(false)
                toast.success("Paciente adicionado Com Sucesso!")
            },
            onError: () => {
                toast.error("Erro ao adicionar paciente!")
            }

        });
    }
    //Search
    function search(e) {
        e.preventDefault()
        get(route("pacientes.index"), item)
    }
    //destroier
    function destroing(e) {
        e.preventDefault();
        destroy(route("pacientes.destroy", item), {
            onSuccess: () => {
                setDestroier(false)
                toast.success("Paciente Deletado Com Sucesso!")
            },
            onError: () => {
                toast.error("Erro ao deletar paciente!")
            }

        });
    }
    //Update
    function update(e) {
        console.log(data)
        e.preventDefault();
        put(route("pacientes.update", data), {
            onSuccess: () => {
                setEdit(false)
                toast.success("Paciente Actualizado Com Sucesso!")
            },
            onError: () => {
                toast.error("Erro ao actualizar paciente!")
            }

        });
    }
    //SFunction Modal Show
    function showPaciente(data) {
        setItem(data)
        // console.log(item.nome)
        setShow(true)
    }
    //Function Modal Edit
    function editPaciente(data) {
        setData(data)
        // console.log(item.nome)
        setEdit(true)
    }
    //Function Modal Delete
    function deletePaciente(data) {
        setItem(data)
        console.log(item)
        setDestroier(true)
    }

    // console.log(errors);
    // console.log(pacientes)

    return (
        <div className="p-6">
            <Head title={component} />
            <div className="flex items-center space-x-2">
                <button onClick={() => setOpen(true)} className="flex items-center text-green-400  bg-green-100 p-2 hover:bg-green-400 hover:text-white rounded-lg"> <LiaUserPlusSolid className="text-2xl me-1" /> Adicionar </button>

                <button onClick={() => setFilter(true)} className="flex items-center text-yellow-400  bg-yellow-100 p-2 hover:bg-yellow-400 hover:text-white rounded-lg"> <LiaFilterSolid className="text-2xl me-1" /> Filtrar </button>
            </div>
            <div className="overflow-x-auto rounded-2xl mt-4">
                <table className="min-w-full border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-winder">
                            <td>Nome</td>
                            <td>Data de Nasc</td>
                            <td>Morada</td>
                            <td>Contacto</td>
                            <td className="text-center">Acções</td>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {pacientes.data.map((paciente) => (
                            <tr key={paciente.id} className={`${paciente.id % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-cyan-50 trasition `}>
                                <td>{paciente.nome}</td>
                                <td>{new Date(paciente.nascimento).toDateString()}</td>
                                <td>{paciente.morada}</td>
                                <td>{paciente.contacto}</td>
                                <td className="flex items-center justify-center space-x-2">
                                    <button onClick={() => showPaciente(paciente)} className="bg-cyan-400 rounded-full  p-1 text-white hover:bg-cyan-500"><LiaEyeSolid className="text-xl" /></button>
                                    <button onClick={() => editPaciente(paciente)} className="bg-yellow-400 rounded-full p-1  text-white hover:bg-yellow-500"><LiaEditSolid className="text-xl" /></button>
                                    <button onClick={() => deletePaciente(paciente)} className="bg-rose-400 rounded-full p-1  text-white hover:bg-rose-500"><LiaTrashAltSolid className="text-xl" /></button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
                <div className="pt-3 px-4">
                    {pacientes.links.map((link) =>
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`p-1 mx-1 ${link.active ? "text-blue-500 font-bold" : ""
                                    }`}
                            />
                        ) : (
                            <span
                                key={link.label}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className="p-1 mx-1 text-slate-300"
                            ></span>
                        )
                    )}
                </div>
            </div>

            {/* Modal Para Adicionar Pacientes */}
            <Transition show={open}>
                <Dialog onClose={() => setOpen(false)} className="relative z-10">
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
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Adicionar Paciente</p>
                                    </DialogTitle>
                                    <button onClick={() => setOpen(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form className="flex flex-col space-y-3" onSubmit={submit}>
                                        <div>
                                            <label className="font-bold" htmlFor="">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} className={errors.nome && "!ring-red-500"} />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold" htmlFor="">Data de Nascimento:</label>
                                            <input type="date" onChange={(e) => setData("nascimento", e.target.value)} required />
                                            {errors.nascimento && <p className="error">{errors.nascimento}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold" htmlFor="">Morada:</label>
                                            <input type="text" onChange={(e) => setData("morada", e.target.value)} required />
                                            {errors.morada && <p className="error">{errors.morada}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold" htmlFor="">Contacto:</label>
                                            <input type="text" onChange={(e) => setData("contacto", e.target.value)} required />
                                            {errors.contacto && <p className="error">{errors.contacto}</p>}
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
            {/* Modal Para Pesquisar Pacientes */}
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
                            className="fixed inset-y-0 right-0 w-full max-w-md  bg-gray-200">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 bg-gray-400 text-white p-3">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <LiaPlusCircleSolid className="text-2xl" />
                                        <p>Pesquisar Paciente</p>
                                    </DialogTitle>
                                    <button onClick={() => setOpen(false)} className="bg-rose-500 rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={search}>
                                        <div>
                                            <label htmlFor="">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} className={errors.nome && "!ring-red-500"} />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="">Data de Nascimento:</label>
                                            <input type="date" onChange={(e) => setData("nascimento", e.target.value)} required />
                                            {errors.nascimento && <p className="error">{errors.nascimento}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="">Morada:</label>
                                            <input type="text" onChange={(e) => setData("morada", e.target.value)} required />
                                            {errors.morada && <p className="error">{errors.morada}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="">Contacto:</label>
                                            <input type="text" onChange={(e) => setData("contacto", e.target.value)} required />
                                            {errors.contacto && <p className="error">{errors.contacto}</p>}
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
            {/* Modal Para Editar Pacientes */}
            <Transition show={edit}>
                <Dialog onClose={() => setEdit(false)} className="relative z-10">
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
                            className="fixed inset-y-0 right-0 w-full max-w-md  bg-gray-200">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 bg-gray-400 text-white p-3">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <LiaPlusCircleSolid className="text-2xl" />
                                        <p>Editar dados do Paciente</p>
                                    </DialogTitle>
                                    <button onClick={() => setEdit(false)} className="bg-rose-500 rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={update}>
                                        <div>
                                            <label htmlFor="">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} value={data.nome} className={errors.nome && "!ring-red-500"} />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="">Data de Nascimento:</label>
                                            <input type="date" onChange={(e) => setData("nascimento", e.target.value)} value={data.nascimento} required />
                                            {errors.nascimento && <p className="error">{errors.nascimento}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="">Morada:</label>
                                            <input type="text" onChange={(e) => setData("morada", e.target.value)} value={data.morada} required />
                                            {errors.morada && <p className="error">{errors.morada}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="">Contacto:</label>
                                            <input type="text" onChange={(e) => setData("contacto", e.target.value)} value={data.contacto} required />
                                            {errors.contacto && <p className="error">{errors.contacto}</p>}
                                        </div>
                                        <div className="flex justify-end mt-2">
                                            <button className="bg-cyan-500 hover:bg-cyan-600 rounded text-white p-1" disabled={processing}>{processing ? "Salvando..." : "Salvar"}</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {/* Modal Para Detalhes dos Pacientes */}
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
                        <DialogPanel
                            className="fixed inset-y-0 right-0 w-full max-w-md  bg-gray-200">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 bg-gray-400 text-white p-3">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <LiaUserInjuredSolid className="text-2xl" />
                                        <p>Detalhes do Paciente</p>
                                    </DialogTitle>
                                    <button onClick={() => setShow(false)} className="bg-rose-500 rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <div>
                                        <div>
                                            <label htmlFor="">Nome:</label>
                                            <input type="text" className={errors.nome && "!ring-red-500"} value={item.nome} disabled />

                                        </div>
                                        <div>
                                            <label htmlFor="">Data de Nascimento:</label>
                                            <input type="date" value={item.nascimento} disabled />

                                        </div>
                                        <div>
                                            <label htmlFor="">Morada:</label>
                                            <input type="text" value={item.morada} disabled />

                                        </div>
                                        <div>
                                            <label htmlFor="">Contacto:</label>
                                            <input type="text" value={item.contacto} disabled />

                                        </div>
                                        <div className="flex justify-end mt-2">
                                            <button onClick={() => setShow(false)} className="bg-rose-500 hover:bg-rose-600 rounded text-white p-1">Fechar</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {/* Modal Para Deletar dos Pacientes */}
            <Dialog open={destroier} onClose={setDestroier} className="relative z-10 transition">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                        >
                            <div className="">
                                <div className="flex items-center justify-between bg-rose-500 text-white p-3">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <LiaTrashAltSolid className="text-2xl" />
                                        <p>Deletar Paciente</p>
                                    </DialogTitle>
                                    <button onClick={() => setDestroier(false)} className="bg-rose-500 rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2 bg-rose-100">
                                    <form onSubmit={destroing}>
                                        <p className="text-center my-2">Certeza que desejas deletar este registro?</p>
                                        <div className="flex justify-end mt-2 space-x-2">
                                            <button className="bg-rose-500 hover:bg-rose-600 rounded text-white p-1">Excluir</button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            {/* <div className="w-1/2 mx-auto">
                <form onSubmit={submit}>
                    <textarea
                        rows="10"
                        value={data.body}
                        onChange={(e) => setData("body", e.target.value)}
                        className={errors.body && "!ring-red-500"}
                    ></textarea>

                    {errors.body && <p className="error">{errors.body}</p>}

                    <button className="primary-btn mt-4" disabled={processing}>
                        Create Post
                    </button>
                </form>
            </div> */}
        </div >
    );
}
