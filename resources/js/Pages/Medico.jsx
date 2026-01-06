import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { LiaEditSolid, LiaEyeSolid, LiaFilterSolid, LiaPlusCircleSolid, LiaTimesSolid, LiaTrashAltSolid, LiaUserInjuredSolid, LiaUserPlusSolid } from "react-icons/lia";
import { useRoute } from "../../../vendor/tightenco/ziggy/src/js";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { toast } from "react-toastify";
import Loader from "../components/loader";

export default function Medico({ medicos, especialidades }) {
    const route = useRoute()
    const { flash } = usePage().props
    const { component } = usePage()
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [edit, setEdit] = useState(false)
    const [filter, setFilter] = useState(false)
    const [destroier, setDestroier] = useState(false)
    let [item, setItem] = useState({
        nome: "",
        nascimento: "",
        morada: "",
        contacto: "",
        ordem: "",
        especialidade: {}
    })
    const { data, setData, get, post, put, errors, processing, delete: destroy } = useForm({
        nome: "",
        nascimento: "",
        morada: "",
        contacto: "",
        ordem: "",
        especialidade_id: "",
        bi: "",
        sexo: ""
    });

    //Create
    function submit(e) {
        e.preventDefault();
        post("/medicos", {
            onSuccess: () => {
                setOpen(false)
                toast.success("Medico adicionado Com Sucesso!")
            },
            onError: () => {
            }

        });
    }
    //Create
    function search(e) {
        e.preventDefault();
        get(route("medicos.index", data));
    }
    //destroier
    function destroing(e) {
        e.preventDefault();
        destroy(route("medicos.destroy", item), {
            onSuccess: () => {
                setDestroier(false)
                toast.success("Medico Deletado Com Sucesso!")
            },
            onError: () => {
                toast.error("Erro ao deletar medico!")
            }

        });
    }
    //Update
    function update(e) {
        console.log(data)
        e.preventDefault();
        put(route("medicos.update", data), {
            onSuccess: () => {
                setEdit(false)
                toast.success("Medico Actualizado Com Sucesso!")
            },
            onError: () => {
                toast.error("Erro ao actualizar medico!")
            }

        });
    }
    //SFunction Modal Show
    function showMedico(data) {
        setItem(data)
        console.log(data)
        setShow(true)
    }
    //Function Modal Edit
    function editMedico(data) {
        setData(data)
        // console.log(data)
        setEdit(true)
    }
    //Function Modal Delete
    function deleteMedico(data) {
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
            <div className="overflow-x-auto rounded-2xl mt-4">
                <table className="min-w-full border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-winder">
                            <td>Nº de Ordem</td>
                            <td>Nome</td>
                            <td>Especialidade</td>
                            <td>Contacto</td>
                            <td className="text-center">Acções</td>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {medicos.data.map((medico) => (
                            <tr key={medico.id} className={`${medico.id % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-green-50 trasition `}>
                                <td className="font-bold">{medico.ordem}</td>
                                <td>{medico.nome}</td>
                                <td>{medico.especialidade.nome}</td>
                                <td>{medico.contacto}</td>
                                <td className="flex items-center justify-center space-x-2">
                                    <button onClick={() => showMedico(medico)} className="bg-cyan-400 rounded-full  p-1 text-white hover:bg-cyan-500"><LiaEyeSolid className="text-xl" /></button>
                                    <button onClick={() => editMedico(medico)} className="bg-yellow-400 rounded-full p-1  text-white hover:bg-yellow-500"><LiaEditSolid className="text-xl" /></button>
                                    <button onClick={() => deleteMedico(medico)} className="bg-rose-400 rounded-full p-1  text-white hover:bg-rose-500"><LiaTrashAltSolid className="text-xl" /></button>
                                </td>
                            </tr>
                        ))}
                        {medicos.data.length == 0 && (
                            <tr className="text-center">
                                <td colSpan={6}>Nenhuma medico registrado!</td>
                            </tr>
                        )}

                    </tbody>
                </table>
                <div className="flex items-center justify-end pt-3 px-4">
                    {medicos.links.map((link) =>
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

            {/* Modal Para Adicionar medicos */}
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
                                        <p>Adicionar medico</p>
                                    </DialogTitle>
                                    <button onClick={() => setOpen(false)} className="border  rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="p-2">
                                    <form onSubmit={submit} className="flex flex-col space-y-4">
                                        <div>
                                            <label htmlFor="" className="font-bold">Nº de Ordem:</label>
                                            <input type="text" onChange={(e) => setData("ordem", e.target.value)} className={errors.ordem && "!ring-red-500"} required />
                                            {errors.ordem && <p className="error">{errors.ordem}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Nome:</label>
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
                                            <label htmlFor="" className="font-bold">Especialidade:</label>
                                            <select name="especialidade_id" id="" onChange={(e) => setData("especialidade_id", e.target.value)} className="bg-white">
                                                <option value=""> -- Selecione -- </option>
                                                {especialidades.map((especialidade) => (
                                                    <option key={especialidade.id} value={especialidade.id}>{especialidade.nome}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                        <div>

                                            <label htmlFor="" className="font-bold">Data de Nascimento:</label>
                                            <input type="date" onChange={(e) => setData("nascimento", e.target.value)} required
                                                min="1900-01-01"
                                                max="2100-12-31" />
                                            {errors.nascimento && <p className="error">{errors.nascimento}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Morada:</label>
                                            <input type="text" onChange={(e) => setData("morada", e.target.value)} required />
                                            {errors.morada && <p className="error">{errors.morada}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Contacto:</label>
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
            {/* Modal Para Pesquisar medicos */}
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
                                            <label htmlFor="" className="font-bold">Nº de Ordem:</label>
                                            <input type="text" onChange={(e) => setData("ordem", e.target.value)} className={errors.ordem && "!ring-red-500"} />
                                            {errors.ordem && <p className="error">{errors.ordem}</p>}
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
                                            <label htmlFor="" className="font-bold">Nome:</label>
                                            <input type="text" onChange={(e) => setData("nome", e.target.value)} className={errors.nome && "!ring-red-500"} />
                                            {errors.nome && <p className="error">{errors.nome}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Especialidade:</label>
                                            <select name="especialidade_id" id="" onChange={(e) => setData("especialidade_id", e.target.value)} className="bg-white">
                                                <option value=""> -- Selecione -- </option>
                                                {especialidades.map((especialidade) => (
                                                    <option key={especialidade.id} value={especialidade.id}>{especialidade.nome}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                        {/* <div>
                                            <label htmlFor="" className="font-bold">Morada:</label>
                                            <input type="text" onChange={(e) => setData("morada", e.target.value)} />
                                            {errors.morada && <p className="error">{errors.morada}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="" className="font-bold">Contacto:</label>
                                            <input type="text" onChange={(e) => setData("contacto", e.target.value)} required pattern="9\d{8}" />
                                            {errors.contacto && <p className="error">{errors.contacto}</p>}
                                        </div> */}
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
                            className="fixed inset-y-0 right-0 w-full max-w-md  bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 p-3 border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Editar dados do medico</p>
                                    </DialogTitle>
                                    <button onClick={() => setEdit(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <form className="flex flex-col space-y-4 mt-2" onSubmit={update}>
                                    <div>
                                        <label htmlFor="" className="font-bold">Nº de Ordem:</label>
                                        <input type="text" onChange={(e) => setData("ordem", e.target.value)} value={data.ordem} className={errors.ordem && "!ring-red-500"} />
                                        {errors.ordem && <p className="error">{errors.ordem}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="" className="font-bold">Nome:</label>
                                        <input type="text" onChange={(e) => setData("nome", e.target.value)} value={data.nome} className={errors.nome && "!ring-red-500"}
                                            required
                                            maxLength={255}
                                            pattern="[a-zA-ZÀ-ÿ\s]+" />
                                        {errors.nome && <p className="error">{errors.nome}</p>}
                                    </div>
                                    <div>
                                        <label className="font-bold" htmlFor="">Nº do BI:</label>
                                        <input type="text" onChange={(e) => setData("bi", e.target.value)} value={data.bi} required pattern="^\d{9}[A-Z]{2}\d{3}$" />
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
                                        <div>
                                            <label htmlFor="" className="font-bold">Especialidade:</label>
                                            <select name="especialidade_id" id="especialidade_id" value={data.especialidade_id} onChange={(e) => setData("especialidade_id", e.target.value)} className="bg-white">
                                                <option value=""> -- Selecione -- </option>
                                                {especialidades.map((especialidade) => (
                                                    <option key={especialidade.id} value={especialidade.id}>{especialidade.nome}</option>
                                                ))
                                                }
                                            </select>
                                        </div>
                                        <label htmlFor="" className="font-bold">Data de Nascimento:</label>
                                        <input type="date" onChange={(e) => setData("nascimento", e.target.value)} value={data.nascimento} required
                                            min="1900-01-01"
                                            max="2100-12-31" />
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
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-white p-6 overflow-y-auto">
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between space-x-2 p-3  border-b">
                                    <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                        <p>Detalhes do medico</p>
                                    </DialogTitle>
                                    <button onClick={() => setShow(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                </div>
                                <div className="flex flex-col space-y-2 mt-4 px-3 rounded">
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Número de Ordem</label>
                                        <label htmlFor="" className="">{item.ordem}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Especialidade</label>
                                        <label htmlFor="" className="">{item.especialidade.nome}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Nome</label>
                                        <label htmlFor="" className="">{item.nome}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">BI:</label>
                                        <label htmlFor="" className="">{item.bi}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Gênero</label>
                                        <label htmlFor="" className="">{item.sexo}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Data de Nascimento</label>
                                        <label htmlFor="" className="">{new Date(item.nascimento).toLocaleDateString()}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Contacto</label>
                                        <label htmlFor="" className="">{item.contacto}</label>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <label htmlFor="" className="font-bold">Morada</label>
                                        <label htmlFor="" className="">{item.morada}</label>
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
                                            <p>Deletar medico</p>
                                        </DialogTitle>
                                        <button onClick={() => setDestroier(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                    </div>
                                    <div className="p-4 max-w-sm">
                                        <form onSubmit={destroing}>
                                            <p className="text-center my-2">Tem certeza que pretende excluir o médico {item.nome}?</p>
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
