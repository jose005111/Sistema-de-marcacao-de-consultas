import { Head, useForm, usePage, Link } from "@inertiajs/react"
import { LiaEditSolid, LiaEyeSolid, LiaPlusCircleSolid, LiaTimesSolid, LiaTrashAltSolid, LiaFilterSolid } from "react-icons/lia"
import { useRoute } from "../../../vendor/tightenco/ziggy/src/js"
import { useState } from "react"
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { toast } from "react-toastify"
import Loader from "../components/loader"

export default function Especialidade({ especialidades }) {
    const route = useRoute()
    const { flash } = usePage().props
    const { component } = usePage()
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
    const [filter, setFilter] = useState(false)
    const [destroier, setDestroier] = useState(false)
    let [item, setItem] = useState({})
    const { data, setData, post, get, put, errors, processing, delete: destroy, reset } = useForm({
        nome: ""
    });

    //Create
    function submit(e) {
        e.preventDefault();
        post("/especialidades", {
            onSuccess: () => {
                setOpen(false)
                toast.success("Item adicionado Com Sucesso!")
            },
            onError: () => {

            }

        });
    }


    function search(e) {
        e.preventDefault();
        get(route("especialidades.index"), data)
    }

    //destroier
    function destroing(e) {
        e.preventDefault();
        if (item.medicos_count > 0) {
            toast.error("Exitem médicos nesta especialidade")
            setDestroier(false)
        }
        else {
            destroy(route("especialidades.destroy", item), {
                onSuccess: () => {
                    setDestroier(false)
                    toast.success("Item Deletado Com Sucesso!")
                },
                onError: () => {
                    toast.error("Erro ao deletar especialidade!")
                }

            });
        }
    }
    //Update
    function update(e) {
        e.preventDefault();
        put(route("especialidades.update", data), {
            onSuccess: () => {
                setEdit(false)
                toast.success("Item Actualizado Com Sucesso!")
            },
            onError: () => {
                toast.error("Erro ao actualizar especialidade!")
            }

        });
    }
    //SFunction Modal Show
    function openModal() {
        errors.nome = ""
        // console.log(item.nome)
        setOpen(true)
    }
    //SFunction Modal Show
    function showEspecialidade(data) {
        setItem(data)
        // console.log(item.nome)
        setShow(true)
    }
    //Function Modal Edit
    function editEspecialidade(data) {
        setData(data)
        // console.log(item.nome)
        setEdit(true)
    }
    //Function Modal Delete
    function deleteEspecialidade(data) {
        setItem(data)
        console.log(item)
        setDestroier(true)
    }

    // console.log(errors);
    // console.log(especialidades)

    return (
        <div className="p-6">
            <Head title={component} />

            <div className="flex items-center space-x-2">
                <button onClick={() => openModal()} className="flex items-center text-green-400  bg-green-100 p-2 hover:bg-green-400 hover:text-white rounded-lg"> <LiaPlusCircleSolid className="text-2xl me-1" /> Adicionar </button>

                <button onClick={() => setFilter(true)} className="flex items-center text-yellow-400  bg-yellow-100 p-2 hover:bg-yellow-400 hover:text-white rounded-lg"> <LiaFilterSolid className="text-2xl me-1" /> Filtrar </button>
            </div>
            <div className="overflow-x-auto rounded-2xl mt-4">
                <table className="min-w-full border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-winder">
                            <td>Nome</td>
                            <td>Total de Medicos</td>
                            <td className="text-center">Acções</td>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {especialidades.data.map((especialdade) => (
                            <tr key={especialdade.id} className={`${especialdade.id % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 trasition `}>
                                <td>{especialdade.nome}</td>
                                <td>{especialdade.medicos_count}</td>
                                <td>
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => showEspecialidade(especialdade)} className="bg-cyan-400 rounded-full  p-1 text-white hover:bg-cyan-500"><LiaEyeSolid className="text-xl" /></button>
                                        <button onClick={() => editEspecialidade(especialdade)} className="bg-yellow-400 rounded-full p-1  text-white hover:bg-yellow-500"><LiaEditSolid className="text-xl" /></button>
                                        <button onClick={() => deleteEspecialidade(especialdade)} className="bg-rose-400 rounded-full p-1  text-white hover:bg-rose-500"><LiaTrashAltSolid className="text-xl" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {especialidades.data == 0 && (
                            <tr className="text-center">
                                <td colSpan={3}>Nenhuma especialidade registrada!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex items-center justify-end pt-3 px-4">
                    {especialidades.links.map((link) =>
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

            {/* Modal Para Adicionar especialidades */}
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
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Adicionar Especialdade</p>
                                    </DialogTitle>
                                    <button onClick={() => setOpen(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={submit}>
                                        <div>
                                            <label className="font-bold text-gray-600" htmlFor="">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} required maxLength={50} />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button className="w-full min-h-[40px] bg-green-500 hover:bg-green-600 rounded-lg text-white p-1" disabled={processing}>  {processing ? (
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


            {/* Modal Para pesquisar especialidades */}
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
                                        <p>Adicionar Especialdade</p>
                                    </DialogTitle>
                                    <button onClick={() => setFilter(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={search}>
                                        <div>
                                            <label className="font-bold text-gray-600" htmlFor="">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} required maxLength={50} />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button className="w-full min-h-[40px] bg-green-500 hover:bg-green-600 rounded-lg text-white p-1" disabled={processing}>  {processing ? (
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
            {/* Modal Para Editar especialidades */}
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
                            className="fixed inset-y-0 right-0 w-full max-w-md  bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Editar dados do especialdade</p>
                                    </DialogTitle>
                                    <button onClick={() => setEdit(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={update}>
                                        <div>
                                            <label className="font-bold text-gray-600" htmlFor="">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} value={data.nome} className={errors.nome && "!ring-red-500"} />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button className="w-full min-h-[40px] bg-green-500 hover:bg-green-600 rounded-lg text-white p-1" disabled={processing}>  {processing ? (
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
            {/* Modal Para Detalhes dos especialidades */}
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
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 p-3  border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Detalhes da Especialidade</p>
                                    </DialogTitle>
                                    <button onClick={() => setShow(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <div>
                                        <div className="flex justify-between">
                                            <label className="font-bold text-gray-600" htmlFor="">Nome:</label>
                                            <label htmlFor="">{item.nome}</label>
                                        </div>
                                        <div className="flex justify-between">
                                            <label className="font-bold text-gray-600" htmlFor="">Total de Medicos:</label>
                                            <label htmlFor="">{item.medicos_count}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {/* Modal Para Deletar dos especialidades */}
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
                                            <p>Excluir Especialidade</p>
                                        </DialogTitle>
                                        <button onClick={() => setDestroier(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                    </div>
                                    <div className="p-2">
                                        <form onSubmit={destroing}>
                                            <p className="text-center my-4">Certeza que desejas deletar esta especialidade?</p>
                                            <p className="text-center text-sm text-gray-600 my-4">Os Registos relacionados a ele serão perdidos!</p>
                                            <div className="flex mt-2 space-x-2">
                                                <button type="button" onClick={() => setDestroier(false)} className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-lg">
                                                    Cancelar
                                                </button>
                                                <button className="w-full min-h-[40px]  bg-rose-500 hover:bg-rose-600 rounded-lg text-white p-1" disabled={processing}>{processing ? (
                                                    <span className="flex items-center justify-center">
                                                        <Loader />
                                                    </span>
                                                ) : "Excluir"}</button>
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
