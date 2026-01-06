import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function ModalSlide({ show, onClose, title, icon, children, footer }) {
    return (
        <Transition show={show} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-10">
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
                    <Dialog.Panel className="fixed inset-y-0 right-0 w-full max-w-md bg-gray-200 shadow-lg flex flex-col">
                        <div className="flex items-center justify-between bg-gray-400 text-white p-3">
                            <Dialog.Title className="flex items-center space-x-2 text-base font-semibold">
                                {icon}
                                <p>{title}</p>
                            </Dialog.Title>
                            <button onClick={onClose} className="bg-rose-500 rounded p-1">
                                <LiaTimesSolid className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto">{children}</div>
                        {footer && <div className="p-2 border-t">{footer}</div>}
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
