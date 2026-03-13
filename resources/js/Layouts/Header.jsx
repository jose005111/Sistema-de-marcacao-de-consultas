import { router, usePage, Link } from "@inertiajs/react";
import { BiBell } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { LiaUser, LiaTimesSolid } from "react-icons/lia";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'

export default function Header() {
    const { auth } = usePage().props;
    const [Logouting, setLogouting] = useState(false);

    // Variável que vem do HandleInertiaRequests
    const unreadCount = auth.unread_mensagens || 0;

    function logout() {
        router.post("/logout");
    }

    return (
        <div className="flex items-center justify-between bg-cyan-400 m-2 rounded">
            <div className="flex items-center p-2">
                <Link href="/perfil">
                    <LiaUser className="text-4xl bg-gray-100 rounded-full mx-1" />
                </Link>

                <Link href="/perfil">
                    <div className="flex flex-col mx-2">
                        <span className=" text-gray-600 font-bold ">{auth.user.username}</span>
                        <span className=" text-white text-sm">{auth.user.role}</span>
                    </div>
                </Link>
            </div>

            <div className="flex space-x-2 mx-1 items-center">
                {/* Botão de Mensagens / Notificações com o Link do Inertia */}
                <Link
                    href="/mensagens"
                    className="relative bg-gray-100 rounded-full p-2 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <BiBell className="text-2xl text-cyan-500" />

                    {/* Badge do Contador */}
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm border-2 border-cyan-400">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Link>

                {/* Botão de Logout */}
                <button onClick={() => setLogouting(true)} className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors">
                    <FiLogOut className="text-2xl text-rose-500" />
                </button>
            </div>

            {/* Modal Para Terminar Sessão */}
            <Dialog open={Logouting} onClose={setLogouting} className="relative z-10 transition">
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
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl"
                            >
                                <div className="">
                                    <div className="flex items-center justify-between p-3 border-b">
                                        <DialogTitle as="h3" className="text-base font-semibold flex items-center space-x-2">
                                            <span className=" bg-rose-500 rounded-full text-white p-1">
                                                <FiLogOut className="text-xl" />
                                            </span>
                                            <p>Terminar Sessão</p>
                                        </DialogTitle>
                                        <button onClick={() => setLogouting(false)} className="border rounded p-1 hover:bg-gray-100 text-gray-600">
                                            <LiaTimesSolid className="text-xl" />
                                        </button>
                                    </div>
                                    <div className="p-4 max-w-sm">
                                        <form>
                                            <p className="text-center my-2 text-gray-700">Tem certeza que pretende terminar sessão?</p>
                                            <div className="flex justify-end mt-4 space-x-2">
                                                <button type="button" onClick={() => setLogouting(false)} className="w-full min-h-[40px] bg-gray-500 hover:bg-gray-600 transition-colors rounded-lg text-white p-1 font-medium">Cancelar</button>
                                                <button type="button" onClick={() => logout()} className="w-full min-h-[40px] bg-rose-500 hover:bg-rose-600 transition-colors rounded-lg text-white p-1 font-medium">Confirmar</button>
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