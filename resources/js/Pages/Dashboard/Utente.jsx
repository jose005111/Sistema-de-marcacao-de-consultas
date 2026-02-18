import { Head, usePage } from "@inertiajs/react";
import { LiaCalendarAltSolid, LiaUserCheckSolid } from "react-icons/lia";

export default function DashboardUtente({ proximaConsulta, totalConsultas }) {
    const { flash } = usePage().props;

    return (
        <div className="max-h-[85vh] overflow-y-auto transition-all ease-in-out p-6">
            <Head title="Dashboard Utente" />

            {flash?.message && (
                <div className="fixed top-24 right-6 bg-green-600 p-3 rounded-md shadow-lg text-sm text-white animate-pulse">
                    {flash.message}
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:-translate-y-1 bg-cyan-400">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-bl-full"></div>
                    <div className="p-6 text-white relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <LiaCalendarAltSolid size={50} />
                            <span className="text-4xl font-bold">
                                {proximaConsulta ? new Date(proximaConsulta.created_at).toLocaleDateString() : "-"}
                            </span>
                        </div>
                        <h3 className="text-lg font-medium tracking-wide">Próxima Consulta</h3>
                        {proximaConsulta && (
                            <p className="text-sm mt-1">
                                Com {proximaConsulta.medico_nome} às {new Date(proximaConsulta.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        )}
                    </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:-translate-y-1 bg-green-500">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-bl-full"></div>
                    <div className="p-6 text-white relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <LiaUserCheckSolid size={50} />
                            <span className="text-4xl font-bold">{totalConsultas}</span>
                        </div>
                        <h3 className="text-lg font-medium tracking-wide">Total de Consultas</h3>
                    </div>
                </div>
            </div>

            {/* Lista de consultas recentes (opcional) */}
            {proximaConsulta && (
                <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Detalhes da Próxima Consulta</h2>
                    <div className="text-gray-700">
                        <p><strong>Paciente:</strong> {proximaConsulta.paciente_nome}</p>
                        <p><strong>Médico:</strong> {proximaConsulta.medico_nome}</p>
                        <p><strong>Data:</strong> {new Date(proximaConsulta.created_at).toLocaleDateString()}</p>
                        <p><strong>Hora:</strong> {new Date(proximaConsulta.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><strong>Estado:</strong> {proximaConsulta.estado}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
