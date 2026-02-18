import { route } from "ziggy-js";

import { useForm } from "@inertiajs/react";
import {
    LiaUserTieSolid,
    LiaUserCheckSolid,
    LiaUserInjuredSolid,
    LiaUserNurseSolid,
    LiaFilterSolid,
} from "react-icons/lia";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function Admin({
    totalMedicos,
    totalUsuarios,
    totalRecepcionistas,
    totalPacientes,
    distribuicaoEspecialidades,
    consultasPorDia,
    mesSelecionado,
    anoSelecionado,
}) {

    const { data, setData, get } = useForm({
        mes: mesSelecionado,
        ano: anoSelecionado,
    });

    function submit(e, filtro) {
        e.preventDefault();

        get(route("dashboard.index", {
            mes: data.mes,
            ano: data.ano,
            filtro,
        }), {
            preserveScroll: true,
            preserveState: true,
        });
    }

    const cards = [
        {
            title: "Médicos",
            total: totalMedicos,
            icon: <LiaUserNurseSolid size={40} />,
        },
        {
            title: "Usuários",
            total: totalUsuarios,
            icon: <LiaUserTieSolid size={40} />,
        },
        {
            title: "Recepcionistas",
            total: totalRecepcionistas,
            icon: <LiaUserCheckSolid size={40} />,
        },
        {
            title: "Pacientes",
            total: totalPacientes,
            icon: <LiaUserInjuredSolid size={40} />,
        },
    ];

    const totalDiasMes = new Date(data.ano, data.mes, 0).getDate();

    const consultasMap = consultasPorDia.reduce((acc, item) => {
        acc[item.dia] = item.total;
        return acc;
    }, {});

    const dadosLinha = [
        {
            id: "Consultas",
            data: Array.from({ length: totalDiasMes }, (_, i) => ({
                x: (i + 1).toString(),
                y: consultasMap[i + 1] || 0,
            })),
        },
    ];

    return (
        <div className="space-y-10 p-8">

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
                    >
                        <div className="flex justify-between items-center">
                            {card.icon}
                            <span className="text-4xl font-bold">
                                {card.total}
                            </span>
                        </div>
                        <h3 className="mt-4 text-lg font-medium">
                            {card.title}
                        </h3>
                    </div>
                ))}
            </div>

            {/* GRAFICO ESPECIALIDADES */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Marcações por Especialidade
                    </h2>

                    <form
                        onSubmit={(e) => submit(e, "especialidades")}
                        className="flex items-center space-x-4"
                    >
                        <select
                            value={data.mes}
                            onChange={(e) => setData("mes", e.target.value)}
                            className="border rounded px-2 py-1"
                        >
                            {meses.map((mes, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {mes}
                                </option>
                            ))}
                        </select>

                        <select
                            value={data.ano}
                            onChange={(e) => setData("ano", e.target.value)}
                            className="border rounded px-2 py-1"
                        >
                            {Array.from({ length: 5 }, (_, i) => 2025 + i).map(
                                (ano) => (
                                    <option key={ano} value={ano}>
                                        {ano}
                                    </option>
                                )
                            )}
                        </select>

                        <button className="bg-cyan-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-cyan-800 transition">
                            <LiaFilterSolid className="mr-2" />
                            Filtrar
                        </button>
                    </form>
                </div>

                <div className="h-[400px]">
                    {distribuicaoEspecialidades.length > 0 ? (
                        <ResponsivePie
                            data={distribuicaoEspecialidades}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            colors={{ scheme: "category10" }}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-400 font-semibold">
                            Sem dados
                        </div>
                    )}
                </div>
            </div>

            {/* GRAFICO CONSULTAS POR DIA */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Consultas por Dia
                </h2>

                <div className="h-[400px]">
                    {consultasPorDia.length > 0 ? (
                        <ResponsiveLine
                            data={dadosLinha}
                            margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                            yScale={{ type: "linear", stacked: false }}
                            axisBottom={{ legend: "Dias", legendOffset: 36 }}
                            axisLeft={{
                                legend: "Nº Consultas",
                                legendOffset: -40,
                            }}
                            pointSize={8}
                            colors={{ scheme: "category10" }}
                            useMesh
                        />
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-400 font-semibold">
                            Sem dados
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
