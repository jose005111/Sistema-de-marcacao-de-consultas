import { Head, useForm } from "@inertiajs/react";
import { LiaUserCheckSolid } from "react-icons/lia";
import { useRoute } from "../../../../vendor/tightenco/ziggy/src/js";
import { toast } from "react-toastify";
import Loader from "@/components/loader";

export default function Recepcionista({ recepcionista }) {

    const route = useRoute();

    const { data, setData, post, put, processing, errors } = useForm({
        nome: recepcionista?.nome || "",
        nascimento: recepcionista?.nascimento || "",
        morada: recepcionista?.morada || "",
        contacto: recepcionista?.contacto || "",
    });

    function submit(e) {
        e.preventDefault();

        if (recepcionista) {
            // Atualizar perfil
            put(route("recepcionista.update"), {
                onSuccess: () => {
                    toast.success("Perfil atualizado com sucesso!");
                    setOpen(false);
                },
                onError: () => toast.error("Erro ao atualizar o perfil!")
            });
        } else {
            // Criar perfil
            post(route("recepcionista.store"), {
                onSuccess: () => {
                    toast.success("Perfil criado com sucesso!");
                    setOpen(false);
                },
                onError: () => toast.error("Erro ao criar o perfil!")
            });
        }
    }

    return (
        <div className="p-4">
            <Head title="Perfil do Recepcionista" />

            <div className="text-lg font-medium flex items-center gap-2 border-b pb-2 mb-4">
                <LiaUserCheckSolid className="text-cyan-400 text-4xl" />
                {recepcionista ? "Editar Perfil do Recepcionista" : "Completar Perfil do Recepcionista"}
            </div>

            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Nome */}
                <div>
                    <label className="font-semibold text-sm">Nome</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.nome}
                        onChange={(e) => setData("nome", e.target.value)}
                    />
                    {errors.nome && <span className="text-red-600 text-xs">{errors.nome}</span>}
                </div>

                {/* Data de nascimento */}
                <div>
                    <label className="font-semibold text-sm">Data de nascimento</label>
                    <input
                        type="date"
                        className="w-full border rounded p-2"
                        value={data.nascimento}
                        onChange={(e) => setData("nascimento", e.target.value)}
                    />
                    {errors.nascimento && <span className="text-red-600 text-xs">{errors.nascimento}</span>}
                </div>

                {/* Contacto */}
                <div>
                    <label className="font-semibold text-sm">Contacto</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.contacto}
                        onChange={(e) => setData("contacto", e.target.value)}
                    />
                    {errors.contacto && <span className="text-red-600 text-xs">{errors.contacto}</span>}
                </div>

                {/* Morada */}
                <div>
                    <label className="font-semibold text-sm">Morada</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={data.morada}
                        onChange={(e) => setData("morada", e.target.value)}
                    />
                    {errors.morada && <span className="text-red-600 text-xs">{errors.morada}</span>}
                </div>

                {/* Botão */}
                <div className="md:col-span-2 flex justify-end mt-4">
                    <button
                        disabled={processing}
                        className="min-w-[150px] min-h-[40px] bg-cyan-400 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg"
                    >
                        {processing ?
                            (
                                <span className="flex justify-center">
                                    <Loader />
                                </span>
                            ) : recepcionista ? "Atualizar" : "Salvar"}
                    </button>
                </div>

            </form>
        </div>
    );
}
