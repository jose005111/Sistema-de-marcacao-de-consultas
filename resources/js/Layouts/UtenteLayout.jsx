import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";

export default function UtenteLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <div className="flex-1 overflow-y-auto p-4">{children}</div>

            {/* Footer mobile-friendly */}
            <div className="fixed bottom-0 w-full bg-white flex justify-around border-t p-2 shadow md:hidden">
                <a href="/utente/profile" className="text-cyan-500 font-semibold">Perfil</a>
                <a href="/utente/marcar" className="text-cyan-500 font-semibold">Marcar</a>
                <a href="/utente/consultas" className="text-cyan-500 font-semibold">Minhas Consultas</a>
            </div>

            <ToastContainer position="bottom-right" />
        </div>
    );
}
