import { toast, ToastContainer } from "react-toastify";
import { useForm, usePage } from "@inertiajs/react";
import img from "@/assets/logo.png"
import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";
import { useState } from "react";
import Loader from "../components/loader";


export default function Login({ action }) {
    const { auth } = usePage().props
    const [showPass, setShowPass] = useState(false)
    const { data, setData, post, errors, processing } = useForm({
        email: "",
        password: ""
    })

    function submit(e) {
        e.preventDefault()
        post("/login")
    }

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <form className="w-96 bg-gray-200 rounded-lg p-6 shadow-lg shadow-gray-200" onSubmit={submit}>
                <div className="flex justify-center my-3">
                    <img src={img} alt="" />
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
                <div className="my-3">

                    {errors.credenciais && (
                        <p className="text-rose-600 py-1 text-center">{errors.credenciais}</p>
                    )}
                </div>
                <div className="flex justify-center mt-6">
                    <button className="w-full  min-h-[40px] bg-cyan-600 text-white hover:bg-cyan-400 rounded-lg p-2" disabled={processing}>{processing ? (<span className="flex items-center justify-center">
                        <Loader />
                    </span>) : "Login"}</button>

                </div>

                <button type="button" onClick={action} className="w-full bg-gray-600 text-white hover:bg-gray-400 rounded-lg p-2 mt-2"> Criar Conta</button>

            </form>

            <ToastContainer />
        </div>
    )
}

