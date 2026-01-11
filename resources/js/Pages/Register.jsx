import { toast, ToastContainer } from "react-toastify";
import { useForm, usePage, Link } from "@inertiajs/react";
// import img from "@/assets/logo.png"
import { FiEye, FiEyeOff, FiMail, FiUser } from "react-icons/fi";
import { useState } from "react";
import { LiaTrashAlt, LiaUserCircle } from "react-icons/lia";
import Loader from "../components/loader";

export default function Register({ action }) {
    const { auth } = usePage().props
    const [showPass, setShowPass] = useState(false)
    const [showPassC, setShowPassC] = useState(false)
    const { data, setData, post, errors, processing, reset } = useForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "utente"
    })

    function submit(e) {
        e.preventDefault()
        if (data.password != data.confirmPassword) {
            toast.error("As senhas não são iguais!")
        }
        else {

            post("/register", {
                onSuccess: () => {
                    toast.success("Seja bem Vindo".auth.user.email)
                    reset()
                    action()
                },
                onError: () => { }
            })
        }
    }
    return (
        <div className="flex items-center justify-center w-full">
            <form className="w-96 bg-gray-100 rounded-lg p-6 shadow-lg shadow-gray-200" onSubmit={submit}>
                <div className="flex justify-center">
                    <LiaUserCircle className="text-8xl text-cyan-600" />
                </div>
                <div>
                    <label className="font-bold text-gray-600" htmlFor="">UserName:</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 pe-1">
                            <FiUser className="text-2xl" />
                        </span>
                        <input className="" type="text" value={data.username} onChange={(e) => setData("username", e.target.value)}
                            required />
                    </div>
                </div>
                <div>
                    <label className="font-bold text-gray-600" htmlFor="">Email:</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 right-0 flex items-center text-gray-500 pe-1">
                            <FiMail className="text-2xl" />
                        </span>
                        <input className="" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)}
                            required />
                    </div>
                </div>
                <div>
                    <label className="font-bold text-gray-600" htmlFor="">Senha:</label>
                    <div className="relative">
                        <span onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-0 flex items-center text-gray-500 pe-1 cursor-pointer">
                            {showPass ? (<FiEyeOff className="text-2xl" />) : (<FiEye className="text-2xl" />)}
                        </span>
                        <input type={showPass ? 'text' : 'password'} value={data.password} onChange={(e) => setData("password", e.target.value)}
                            required />
                    </div>
                </div>
                <div>
                    <label className="font-bold text-gray-600" htmlFor="">Confirmar Senha:</label>
                    <div className="relative">
                        <span onClick={() => setShowPassC(!showPassC)} className="absolute inset-y-0 right-0 flex items-center text-gray-500 pe-1 cursor-pointer">
                            {showPassC ? (<FiEyeOff className="text-2xl" />) : (<FiEye className="text-2xl" />)}
                        </span>
                        <input type={showPassC ? 'text' : 'password'} value={data.confirmPassword} onChange={(e) => setData("confirmPassword", e.target.value)}
                            required />
                    </div>
                </div>
                <div className="flex items-center justify-end text-sm" >

                    <button type="button" onClick={() => reset()} className="flex items-center text-sm bg-rose-500 text-white hover:bg-rose-600 rounded px-2 py-1 mt-2">
                        <LiaTrashAlt />
                        Limpar</button>
                </div>
                {errors.credenciais && (
                    <p className="text-rose-600 py-1 text-center">{errors.credenciais}</p>
                )}
                <div className="flex justify-center mt-6">
                    <button className="w-full  min-h-[40px] bg-cyan-600 text-white hover:bg-cyan-400 rounded-lg p-2" disabled={processing}>{processing ? (<span className="flex items-center justify-center">
                        <Loader />
                    </span>) : "Cadastrar"}</button>

                </div>
                <button type="button" onClick={action} className="w-full bg-gray-600 text-white hover:bg-gray-400 rounded-lg p-2 mt-2">Fazer login</button>

            </form>
            <ToastContainer />
        </div>
    )
}

