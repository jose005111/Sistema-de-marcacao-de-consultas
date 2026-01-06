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
        bi: "",
        sexo: "",
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
                        {pacientes.data.length == 0 && (
                            <tr className="text-center">
                                <td colSpan={6}>Nenhuma paciente registrado!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="flex items-center justify-end pt-3 px-4">
                    {pacientes.links.map((link) =>
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-2 mx-1 rounded-lg border-cyan-600 font-bold border-2  ${link.active ? "bg-cyan-600 text-white" : "text-cyan-600 "
                                    }`}
                            />
                        ) : ("")
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
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
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
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} className={errors.nome && "!ring-red-500"}
                                                required
                                                maxLength={255}
                                                pattern="[a-zA-ZÀ-ÿ\s]+" />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold" htmlFor="">Nº do BI:</label>
                                            <input type="text" onChange={(e) => setData("bi", e.target.value)} required pattern="^\d{9}[A-Z]{2}\d{3}$" />
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
                                            <input type="text" onChange={(e) => setData("contacto", e.target.value)} required pattern="9\d{8}" />
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
                            className="fixed inset-y-0 right-0 w-full max-w-md  bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Pesquisar Paciente</p>
                                    </DialogTitle>
                                    <button onClick={() => setFilter(false)} className="border  rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={search}>
                                        <div>
                                            <label htmlFor="" className="font-bold">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} className={errors.nome && "!ring-red-500"} />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">B.I.:</label>
                                            <input type="text" onChange={(e) => setData("bi", e.target.value)} className={errors.bi && "!ring-red-500"} />
                                            {errors.bi && <p className="error">{errors.bi}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Data de Nascimento:</label>
                                            <input type="date" onChange={(e) => setData("nascimento", e.target.value)} required />
                                            {errors.nascimento && <p className="error">{errors.nascimento}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Morada:</label>
                                            <input type="text" onChange={(e) => setData("morada", e.target.value)} required />
                                            {errors.morada && <p className="error">{errors.morada}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Contacto:</label>
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
                            className="fixed inset-y-0 right-0 w-full max-w-md  bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Editar dados do Paciente</p>
                                    </DialogTitle>
                                    <button onClick={() => setEdit(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={update}>
                                        <div>
                                            <label htmlFor="" className="font-bold">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} value={data.nome} className={errors.nome && "!ring-red-500"}
                                                required
                                                maxLength={255}
                                                pattern="[a-zA-ZÀ-ÿ\s]+"
                                            />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label className="font-bold" htmlFor="">Nº do BI:</label>
                                            <input type="text" onChange={(e) => setData("bi", e.target.value)} required
                                                pattern="^\d{9}[A-Z]{2}\d{3}$"
                                                value={data.bi} />
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
                                        <div>
                                            <label htmlFor="" className="font-bold">Data de Nascimento:</label>
                                            <input type="date" onChange={(e) => setData("nascimento", e.target.value)} value={data.nascimento} required />
                                            {errors.nascimento && <p className="error">{errors.nascimento}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Morada:</label>
                                            <input type="text" onChange={(e) => setData("morada", e.target.value)} value={data.morada} required />
                                            {errors.morada && <p className="error">{errors.morada}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Contacto:</label>
                                            <input type="text" onChange={(e) => setData("contacto", e.target.value)} value={data.contacto} required pattern="9\d{8}" />
                                            {errors.contacto && <p className="error">{errors.contacto}</p>}
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
                            className="fixed inset-y-0 right-0 w-full max-w-md  bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 p-3  border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Detalhes do Paciente</p>
                                    </DialogTitle>
                                    <button onClick={() => setShow(false)} className="border  rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="flex flex-col space-y-2 mt-4 px-3 rounded">
                                    <div className="flex justify-between items-center ">
                                        <label className="font-bold">Nome:</label>
                                        <label >{item.nome} </label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label className="font-bold">B.I.:</label>
                                        <label >{item.bi} </label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label className="font-bold">Gênero:</label>
                                        <label > {item.sexo}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label className="font-bold">Data de Nascimento:</label>
                                        <label > {new Date(item.nascimento).toLocaleDateString()}</label>

                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label className="font-bold">Morada:</label>
                                        <label>{item.morada} </label>

                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label className="font-bold">Contacto:</label>
                                        <label>{item.contacto} </label>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </Dialog>
            </Transition>
            {/* Modal Para Deletar dos Pacientes */}
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
                                            <p>Deletar Paciente</p>
                                        </DialogTitle>
                                        <button onClick={() => setDestroier(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                    </div>
                                    <div className="p-4 max-w-sm">
                                        <form onSubmit={destroing}>
                                            <p className="text-center my-2">Tem certeza que pretende excluir o paciente {item.nome}?</p>
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
