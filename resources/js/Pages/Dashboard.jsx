import { useRoute } from "../../../vendor/tightenco/ziggy/src/js";
import { Head, router, usePage } from "@inertiajs/react"; // <-- Importamos o router
import {
    LiaUserTieSolid,
    LiaUserCheckSolid,
    LiaUserInjuredSolid,
    LiaUserNurseSolid,
    LiaFilterSolid,
} from "react-icons/lia";
import { useState, useEffect } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import Loader from "../components/loader";

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function Dashboard({
    totalMedicos,
    totalUsuarios,
    totalRecepcionistas,
    totalPacientes,
    distribuicaoEspecialidades,
    consultasPorDia,
    mesSelecionado,
    anoSelecionado,
}) {
    const route = useRoute();
    const { flash } = usePage().props;
    const [flashMsg, setFlashMsg] = useState(flash?.message || flash?.success || null);

    // Estados locais para os formulários de filtro
    const [filterPie, setFilterPie] = useState({ mes: mesSelecionado, ano: anoSelecionado });
    const [filterLine, setFilterLine] = useState({ mes: mesSelecionado, ano: anoSelecionado });

    // Estados locais para os loaders dos gráficos
    const [loadingPie, setLoadingPie] = useState(false);
    const [loadingLine, setLoadingLine] = useState(false);

    const cards = [
        { title: "Médicos", total: totalMedicos, color: "bg-green-600", icon: <LiaUserNurseSolid size={50} /> },
        { title: "Usuários", total: totalUsuarios, color: "bg-green-600", icon: <LiaUserTieSolid size={50} /> },
        { title: "Recepcionistas", total: totalRecepcionistas, color: "bg-green-600", icon: <LiaUserCheckSolid size={50} /> },
        { title: "Pacientes", total: totalPacientes, color: "bg-green-600", icon: <LiaUserInjuredSolid size={50} /> },
    ];

    useEffect(() => {
        if (flashMsg) {
            const timer = setTimeout(() => setFlashMsg(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [flashMsg]);

    // Requisição assíncrona para o Gráfico de Pizza
    function submitPie(e) {
        e.preventDefault();
        router.get(
            route("dashboard.index"),
            { mes: filterPie.mes, ano: filterPie.ano, filtro: "especialidades" },
            {
                preserveScroll: true,
                preserveState: true,
                only: ["distribuicaoEspecialidades"],
                onBefore: () => setLoadingPie(true),
                onFinish: () => setLoadingPie(false),
            }
        );
    }

    // Requisição assíncrona para o Gráfico de Linha
    function submitLine(e) {
        e.preventDefault();
        router.get(
            route("dashboard.index"),
            { mes: filterLine.mes, ano: filterLine.ano, filtro: "consultas" },
            {
                preserveScroll: true,
                preserveState: true,
                only: ["consultasPorDia"],
                onBefore: () => setLoadingLine(true),
                onFinish: () => setLoadingLine(false),
            }
        );
    }

    const totalDiasMes = new Date(filterLine.ano, filterLine.mes, 0).getDate();
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

    const MyPie = ({ data }) => (
        <ResponsivePie
            data={data}
            animate
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.6}
            cornerRadius={4}
            activeOuterRadiusOffset={8}
            colors={{ scheme: "category10" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            motionConfig="wobbly"
            transitionMode="middleAngle"
            legends={[{ anchor: "bottom", direction: "row", justify: false, translateY: 56, itemsSpacing: 10, itemWidth: 100, itemHeight: 18, itemTextColor: "#555", itemDirection: "left-to-right", symbolSize: 18, symbolShape: "circle" }]}
        />
    );

    return (
        <div className="max-h-[85vh] overflow-y-auto transition-all ease-in-out relative">
            <Head title="Dashboard" />

            {flashMsg && (
                <div className="fixed top-24 right-6 bg-green-600 p-3 rounded-md shadow-lg text-sm text-white animate-pulse z-50">
                    {flashMsg}
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
                {cards.map((item, index) => (
                    <div
                        key={index}
                        className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:-translate-y-1 bg-cyan-400"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-30 rounded-bl-full group-hover:opacity-50 transition-all`}></div>
                        <div className="p-6 text-white relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-4xl">{item.icon}</div>
                                <span className="text-4xl font-bold">{item.total}</span>
                            </div>
                            <h3 className="text-lg font-medium tracking-wide">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráfico 1: Marcações por Especialidade */}
            <div className="h-auto bg-white rounded-2xl shadow-md m-8 p-6">
                <div className="flex justify-between border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-700">Marcações por Especialidade</h2>
                    <form onSubmit={submitPie} className="flex space-x-4">
                        <div className="flex items-center">
                            <label className="block text-sm font-bold text-gray-600 me-1">Mês: </label>
                            <select value={filterPie.mes} onChange={(e) => setFilterPie({ ...filterPie, mes: e.target.value })} className="bg-white border rounded p-1">
                                {meses.map((mes, i) => <option key={i + 1} value={i + 1}>{mes}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="block text-sm font-bold text-gray-600 me-1">Ano: </label>
                            <select value={filterPie.ano} onChange={(e) => setFilterPie({ ...filterPie, ano: e.target.value })} className="bg-white border rounded p-1">
                                {Array.from({ length: 5 }, (_, i) => 2025 + i).map((ano) => <option key={ano} value={ano}>{ano}</option>)}
                            </select>
                        </div>
                        <button disabled={loadingPie} className="flex items-center bg-cyan-400 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded-md transition-all disabled:opacity-60">
                            <LiaFilterSolid className="text-xl me-2" /> Pesquisar
                        </button>
                    </form>
                </div>

                {/* DIV DO GRÁFICO - Com estado relative para posicionar o loader */}
                <div className="p-4 h-[400px] transition-all duration-500 relative">

                    {/* OVERLAY DO LOADER */}
                    {loadingPie && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                            <Loader className="w-12 h-12 text-cyan-500 mb-2" />
                            <span className="text-cyan-600 font-semibold animate-pulse">A atualizar dados...</span>
                        </div>
                    )}

                    {distribuicaoEspecialidades.length > 0 ? (
                        <MyPie data={distribuicaoEspecialidades} />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            <p className="font-bold text-gray-400 text-2xl">Sem Marcações neste período</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Gráfico 2: Marcações por Dia */}
            <div className="h-auto bg-white rounded-2xl shadow-md m-8 p-6">
                <div className="flex justify-between border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-700 text-center">Marcações por Dia</h2>
                    <form onSubmit={submitLine} className="flex space-x-4">
                        <div className="flex items-center">
                            <label className="block text-sm font-bold text-gray-600 me-1">Mês: </label>
                            <select value={filterLine.mes} onChange={(e) => setFilterLine({ ...filterLine, mes: e.target.value })} className="bg-white border rounded p-1">
                                {meses.map((mes, i) => <option key={i + 1} value={i + 1}>{mes}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="block text-sm font-bold text-gray-600 me-1">Ano: </label>
                            <select value={filterLine.ano} onChange={(e) => setFilterLine({ ...filterLine, ano: e.target.value })} className="bg-white border rounded p-1">
                                {Array.from({ length: 5 }, (_, i) => 2025 + i).map((ano) => <option key={ano} value={ano}>{ano}</option>)}
                            </select>
                        </div>
                        <button disabled={loadingLine} className="flex items-center bg-cyan-400 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded-md transition-all disabled:opacity-60">
                            <LiaFilterSolid className="text-xl me-2" /> Pesquisar
                        </button>
                    </form>
                </div>

                {/* DIV DO GRÁFICO - Com estado relative para posicionar o loader */}
                <div className="p-4 h-[400px] transition-all duration-500 relative">

                    {/* OVERLAY DO LOADER */}
                    {loadingLine && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                            <Loader className="w-12 h-12 text-cyan-500 mb-2" />
                            <span className="text-cyan-600 font-semibold animate-pulse">A atualizar dados...</span>
                        </div>
                    )}

                    {consultasPorDia.length > 0 ? (
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
                    ) : (
                        <div className="flex items-center justify-center h-full w-full">
                            <p className="font-bold text-gray-400 text-2xl">Sem Marcações neste período</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}