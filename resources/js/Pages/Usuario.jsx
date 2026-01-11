import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { LiaEditSolid, LiaEyeSolid, LiaFilterSolid, LiaTimesSolid, LiaTrashAltSolid, LiaUserInjuredSolid, LiaUserPlusSolid } from "react-icons/lia";
import { useRoute } from "../../../vendor/tightenco/ziggy/src/js";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { toast } from "react-toastify";
import Loader from "../components/loader";

const perfis = ["admin", "utente", "medico", "recepcionista"]

export default function Usuario({ usuarios }) {
    const route = useRoute()
    const { flash } = usePage().props
    const { component } = usePage()
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
    const [filter, setFilter] = useState(false)
    const [destroier, setDestroier] = useState(false)
    let [item, setItem] = useState({
        name: "",
        email: "",
        role: "",
        password: "12345678",
    })
    const { data, setData, get, post, put, errors, processing, delete: destroy } = useForm({
        username: "",
        email: "",
        perfil: "",
        password: "12345678",
    });

    //Create
    function submit(e) {
        e.preventDefault();
        post("/usuarios", { data: { ...data, password: "12345678" } }, {
            onSuccess: () => {
                setOpen(false)
                toast.success("Usuário adicionado Com Sucesso!")
            },
            onError: () => {
                toast.error("Usuário adicionado Com Sucesso!")
            }
        });
    }
    //Create
    function search(e) {
        e.preventDefault();
        get(route("usuarios.index", data));
    }
    //destroier
    function destroing(e) {
        e.preventDefault();
        destroy(route("usuarios.destroy", item), {
            onSuccess: () => {
                console.log("Feito")
                toast.success("Usuário Deletado Com Sucesso!")
                setDestroier(false)
            },
            onError: () => {
                toast.error("Erro ao deletar usuário!")
            }

        });
    }
    //Update
    function update(e) {
        setData({ ...data, password: "12345678" })
        console.log(data)
        e.preventDefault();
        put(route("usuarios.update", data), {
            onSuccess: () => {
                setEdit(false)
                toast.success("Usuário Actualizado Com Sucesso!")
            },
            onError: () => {
                toast.error("Erro ao actualizar usuário!")
            }

        });
    }
    //SFunction Modal Show
    function showUsuario(data) {
        setItem(data)
        console.log(data)
        setShow(true)
    }
    //Function Modal Edit
    function editUsuario(data) {
        setData(data)
        // console.log(data)
        setEdit(true)
    }
    //Function Modal Delete
    function deleteUsuario(data) {
        setItem(data)
        setDestroier(true)
    }

    // console.log(errors);
    // console.log(medicos)

    return (
        <div className="p-6">
            <Head title={component} />
            <div className="flex items-center space-x-2">
                <button onClick={() => setOpen(true)} className="flex items-center text-green-400  bg-green-100 p-2 hover:bg-green-400 hover:text-white rounded-lg"> <LiaUserPlusSolid className="text-2xl me-1" /> Adicionar </button>

                <button onClick={() => setFilter(true)} className="flex items-center text-yellow-400  bg-yellow-100 p-2 hover:bg-yellow-400 hover:text-white rounded-lg"> <LiaFilterSolid className="text-2xl me-1" /> Filtrar </button>
            </div>
            <div className="max-h-[60vh] 2xl:max-h-[80vh] overflow-y-auto rounded-2xl my-4">
                <table className="border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-winder">
                            <td>Username</td>
                            <td>Email</td>
                            <td>Perfil</td>
                            <td className="text-center">Acções</td>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {usuarios.data.map((usuario, key) => (
                            <tr key={usuario.id} className={`${key % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 trasition `}>
                                <td>{usuario.username}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.role}</td>
                                <td className="flex items-center justify-center space-x-2">
                                    <button onClick={() => showUsuario(usuario)} className="bg-cyan-400 rounded-full  p-1 text-white hover:bg-cyan-500"><LiaEyeSolid className="text-xl" /></button>
                                    <button onClick={() => editUsuario(usuario)} className="bg-yellow-400 rounded-full p-1  text-white hover:bg-yellow-500"><LiaEditSolid className="text-xl" /></button>
                                    <button onClick={() => deleteUsuario(usuario)} className="bg-rose-400 rounded-full p-1  text-white hover:bg-rose-500"><LiaTrashAltSolid className="text-xl" /></button>
                                </td>
                            </tr>
                        ))}
                        {usuarios.data.length == 0 && (
                            <tr className="text-center">
                                <td colSpan={6}>Nenhuma Usuário registrado!</td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-end pt-3 px-4">
                {usuarios.links.map((link) =>
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

            {/* Modal Para Adicionar usuarios */}
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
                                        <p>Adicionar Usuário</p>
                                    </DialogTitle>
                                    <button onClick={() => setOpen(false)} className="border  rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={submit} className="flex flex-col space-y-4">
                                        <div>
                                            <label htmlFor="" className="font-bold">UserName:</label>
                                            <input type="text" onChange={(e) => setData("username", e.target.value)} className={errors.username && "!ring-red-500"} />
                                            {errors.username && <p className="error">{errors.uername}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Email:</label>
                                            <input type="email" onChange={(e) => setData("email", e.target.value)} required />
                                            {errors.email && <p className="error">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Tipo:</label>
                                            <select name="" id="" onChange={(e) => setData("role", e.target.value)} className="bg-white" >
                                                {perfis.map((perfil, key) => (
                                                    <option key={key} value={perfil}>{perfil}</option>
                                                ))}
                                            </select>
                                            {errors.perfil && <p className="error">{errors.perfil}</p>}
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
            {/* Modal Para Pesquisar usuarios */}
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
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Pesquisar Usuários</p>
                                    </DialogTitle>
                                    <button onClick={() => setFilter(false)} className="border  rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={search} className="flex flex-col space-y-4">
                                        <div>
                                            <label htmlFor="" className="font-bold">Username:</label>
                                            <input type="text" onChange={(e) => setData("username", e.target.value)} className={errors.username && "!ring-red-500"} />
                                            {errors.username && <p className="error">{errors.username}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Email:</label>
                                            <input type="email" onChange={(e) => setData("email", e.target.value)} />
                                            {errors.email && <p className="error">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Perfil:</label>
                                            <select name="" id="" onChange={(e) => setData("perfil", e.target.value)} className="bg-white" >
                                                {perfis.map((perfil, key) => (
                                                    <option key={key} value={perfil}>{perfil}</option>
                                                ))}
                                            </select>
                                            {errors.perfil && <p className="error">{errors.perfil}</p>}
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
            {/* Modal Para Editar medicos */}
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
                            className="fixed inset-y-0 right-0 w-full max-w-md  bg-white p-6">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Editar dados do Usuário</p>
                                    </DialogTitle>
                                    <button onClick={() => setEdit(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <form className="flex flex-col space-y-4 mt-2" onSubmit={update}>
                                    <div>
                                        <label htmlFor="" className="font-bold">Username:</label>
                                        <input type="text" value={data.username} onChange={(e) => setData("username", e.target.value)} className={errors.username && "!ring-red-500"} required />
                                        {errors.username && <p className="error">{errors.username}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="" className="font-bold">Email:</label>
                                        <input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} required />
                                        {errors.email && <p className="error">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="" className="font-bold">Perfil:</label>
                                        <select name="" id="" value={data.perfil} onChange={(e) => setData("perfil", e.target.value)} className="bg-white" >
                                            {perfis.map((perfil, key) => (
                                                <option key={key} value={perfil}>{perfil}</option>
                                            ))}
                                        </select>
                                        {errors.perfil && <p className="error">{errors.perfil}</p>}
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
                        </DialogPanel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {/* Modal Para Detalhes dos medicos */}
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
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 p-3  border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Detalhes do Usuário</p>
                                    </DialogTitle>
                                    <button onClick={() => setShow(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="flex flex-col space-y-2 mt-4 px-3 rounded">
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Nome</label>
                                        <label htmlFor="" className="">{item.username}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Email</label>
                                        <label htmlFor="" className="">{item.email}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Perfil</label>
                                        <label htmlFor="" className="">{item.perfil}</label>
                                    </div>
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
                                            <p>Deletar Usuário</p>
                                        </DialogTitle>
                                        <button onClick={() => setDestroier(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                    </div>
                                    <div className="p-4 max-w-sm">
                                        <form onSubmit={destroing}>
                                            <p className="text-center my-2">Tem certeza que pretende excluir o Usuário {item.username}?</p>
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
