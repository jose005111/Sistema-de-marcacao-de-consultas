import { router, usePage, Link } from "@inertiajs/react";
import { BiBell } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { LiaUser } from "react-icons/lia";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { LiaTimesSolid } from "react-icons/lia";

export default function Header() {
    const { auth } = usePage().props
    const [Logouting, setLogouting] = useState(false);


    function logout() {
        router.post("/logout")
    }
    return (
        <div className="flex items-center justify-between bg-cyan-400 m-2 rounded">
            <div className="flex items-center p-2">
                <Link
                    href="/perfil">
                    <LiaUser className="text-4xl bg-gray-100 rounded-full mx-1" />
                </Link>

                <Link
                    href="/perfil">
                    <div className="flex flex-col mx-2">
                        <span className=" text-gray-600 font-bold ">{auth.user.username}</span>
                        <span className=" text-white text-sm">{auth.user.role}</span>
                    </div>
                </Link>
            </div>
            <div className="flex space-x-2 mx-1">
                <button onClick={logout} className="bg-gray-100 rounded-full p-2">
                    <BiBell className="text-2xl text-cyan-500" />
                </button>
                <button onClick={() => setLogouting(true)} className="bg-gray-100 rounded-full p-2">
                    <FiLogOut className="text-2xl text-rose-500" />
                </button>
            </div>
            {/* Modal Para Deletar dos medicos */}
            <Dialog open={Logouting} onClose={setLogouting} className="relative z-10 transition">
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
                                                <FiLogOut className="text-2xl" />
                                            </span>
                                            <p>Terminar Sessão</p>
                                        </DialogTitle>
                                        <button onClick={() => setLogouting(false)} className="border rounded"> <LiaTimesSolid className="text-2xl" /> </button>
                                    </div>
                                    <div className="p-4 max-w-sm">
                                        <form>
                                            <p className="text-center my-2">Tem certeza que pretende terminar sessão?</p>
                                            <div className="flex justify-end mt-2 space-x-2">
                                                <button type="button" onClick={() => setLogouting(false)} className="w-full min-h-[40px]  bg-gray-500 hover:bg-gray-600 rounded-lg text-white p-1">Cancelar</button>
                                                <button type="button" onClick={() => logout()} className="w-full min-h-[40px]  bg-rose-500 hover:bg-rose-600 rounded-lg text-white p-1">Confirmar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </div>
    )
}