import { Head, usePage } from "@inertiajs/react";
import { LiaUserCheckSolid, LiaCalendarAltSolid, LiaExclamationTriangleSolid } from "react-icons/lia";
import { ResponsiveLine } from "@nivo/line";

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function DashboardMedico({ consultasMes, consultasRealizadas, consultasPendentes, consultasPorDia, mesSelecionado, anoSelecionado }) {
    const { flash } = usePage().props;

    const totalDiasMes = new Date(anoSelecionado, mesSelecionado, 0).getDate();
    const consultasMap = consultasPorDia.reduce((acc, item) => {
        acc[item.dia] = item.total;
        return acc;
    }, {});
    const dadosCompletos = Array.from({ length: totalDiasMes }, (_, i) => ({
        x: (i + 1).toString(),
        y: consultasMap[i + 1] ? consultasMap[i + 1].toString() : "0",
    }));
    const dadosGraficoLinha = [
        { id: "Consultas", color: "hsl(150, 70%, 50%)", data: dadosCompletos },
    ];

    return (
        <div className="max-h-[85vh] overflow-y-auto transition-all ease-in-out p-6">
            <Head title="Dashboard Médico" />

            {flash?.message && (
                <div className="fixed top-24 right-6 bg-green-600 p-3 rounded-md shadow-lg text-sm text-white animate-pulse">
                    {flash.message}
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:-translate-y-1 bg-cyan-400">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-bl-full"></div>
                    <div className="p-6 text-white relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <LiaCalendarAltSolid size={50} />
                            <span className="text-4xl font-bold">{consultasMes}</span>
                        </div>
                        <h3 className="text-lg font-medium tracking-wide">Consultas Este Mês</h3>
                    </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:-translate-y-1 bg-green-500">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-bl-full"></div>
                    <div className="p-6 text-white relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <LiaUserCheckSolid size={50} />
                            <span className="text-4xl font-bold">{consultasRealizadas}</span>
                        </div>
                        <h3 className="text-lg font-medium tracking-wide">Consultas Realizadas</h3>
                    </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:-translate-y-1 bg-yellow-500">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-20 rounded-bl-full"></div>
                    <div className="p-6 text-white relative z-10">
                        <div className="flex items-center justify-between mb-3">
                            <LiaExclamationTriangleSolid size={50} />
                            <span className="text-4xl font-bold">{consultasPendentes}</span>
                        </div>
                        <h3 className="text-lg font-medium tracking-wide">Consultas Pendentes</h3>
                    </div>
                </div>
            </div>

            {/* Gráfico de Consultas por Dia */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">Consultas por Dia</h2>
                {consultasPorDia.length > 0 ? (
                    <div className="h-[400px]">
                        <ResponsiveLine
                            data={dadosGraficoLinha}
                            animate
                            motionConfig="gentle"
                            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                            yScale={{ type: "linear", stacked: false }}
                            axisBottom={{ legend: "Dias", legendOffset: 36 }}
                            axisLeft={{ legend: "Nº de Consultas", legendOffset: -40 }}
                            pointSize={10}
                            colors={{ scheme: "category10" }}
                            useMesh
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <p className="font-bold text-gray-400 text-2xl">Sem Consultas</p>
                    </div>
                )}
            </div>
        </div>
    );
}
