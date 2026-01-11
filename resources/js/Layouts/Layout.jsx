import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

export default function Layout({ children }) {
    const { auth } = usePage().props;
    const { flash } = usePage().props

    const [login, setLogin] = useState(true);
    useEffect(() => {
        if (flash?.toast) {
            console.log("toast", flash.toast)
            toast.success(flash.toast)
        }
    }, [flash])
    return (
        <div className="flex min-h-screen bg-gray-100">
            {auth.user === null ? (
                <div className="relative w-full flex items-center justify-center bg-gradient-to-t from-gray-700 to-cyan-500 p-2 overflow-hidden">
                    {/* Login */}
                    <div
                        className={`absolute transition-all duration-700 ease-in-out transform ${login
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-[-100%]"
                            }`}
                    >
                        <Login action={() => setLogin(false)} />
                    </div>
                    {/* Register */}
                    <div
                        className={`absolute transition-all duration-700 ease-in-out transform ${login
                            ? "opacity-0 translate-y-[100%]"
                            : "opacity-100 translate-y-0"
                            }`}
                    >
                        <Register action={() => setLogin(true)} />
                    </div>
                </div>
            ) : (
                <div className="flex w-full">
                    <Sidebar />
                    <div className="flex-1 flex-col bg-gray-100">
                        <Header />
                        <div className="overflow-y-auto mt-6 bg-white rounded mx-2">
                            {children}
                        </div>
                    </div>
                    <ToastContainer position="bottom-right" />
                </div>
            )}
        </div>
    );
}
