import { Head, usePage } from "@inertiajs/react";
import { LiaUserCheckSolid, LiaCalendarAltSolid, LiaExclamationTriangleSolid } from "react-icons/lia";

export default function DashboardRecepcionista({ marcacoesHoje, pendentes, marcacoesRecentes = [] }) {
    const { flash } = usePage().props;

    return (
        <div className="max-h-[85vh] overflow-y-auto transition-all ease-in-out p-6">
            <Head title="Dashboard Recepcionista" />

            {flash?.message && (
                <div className="fixed top-24 right-6 bg-green-600 p-3 rounded-md shadow-lg text-sm text-white animate-pulse">
                    {flash.message}
                </div>
            )}

            {/* Cards de resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:-translate-y-1 bg-cyan-400">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-bl-full"></div>
                    <div className="p-6 text-white relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <LiaCalendarAltSolid size={50} />
                            <span className="text-4xl font-bold">{marcacoesHoje}</span>
                        </div>
                        <h3 className="text-lg font-medium tracking-wide">Marcações Hoje</h3>
                    </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:-translate-y-1 bg-yellow-500">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-bl-full"></div>
                    <div className="p-6 text-white relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <LiaExclamationTriangleSolid size={50} />
                            <span className="text-4xl font-bold">{pendentes}</span>
                        </div>
                        <h3 className="text-lg font-medium tracking-wide">Pendentes</h3>
                    </div>
                </div>
            </div>

            {/* Tabela de marcações recentes */}
            {marcacoesRecentes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Últimas Marcações</h2>
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-3 border">Paciente</th>
                                <th className="p-3 border">Médico</th>
                                <th className="p-3 border">Data</th>
                                <th className="p-3 border">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marcacoesRecentes.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="p-3 border">{m.paciente_nome}</td>
                                    <td className="p-3 border">{m.medico_nome}</td>
                                    <td className="p-3 border">{new Date(m.created_at).toLocaleString()}</td>
                                    <td className="p-3 border capitalize">{m.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
