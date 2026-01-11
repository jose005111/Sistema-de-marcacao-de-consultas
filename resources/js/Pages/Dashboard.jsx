import { useRoute } from "../../../vendor/tightenco/ziggy/src/js";
import { Head, useForm, usePage } from "@inertiajs/react";
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

    const { data: dataPie, setData: setDataPie, get: getPie } = useForm({
        mes: mesSelecionado,
        ano: anoSelecionado,
    });

    const { data: dataLine, setData: setDataLine, get: getLine } = useForm({
        mes: mesSelecionado,
        ano: anoSelecionado,
    });
    const cards = [
        {
            title: "Médicos",
            total: totalMedicos,
            color: "bg-green-600",
            icon: <LiaUserNurseSolid size={50} />,
        },
        {
            title: "Usuários",
            total: totalUsuarios,
            color: "bg-green-600",
            icon: <LiaUserTieSolid size={50} />,
        },
        {
            title: "Recepcionistas",
            total: totalRecepcionistas,
            color: "bg-green-600",
            icon: <LiaUserCheckSolid size={50} />,
        },
        {
            title: "Pacientes",
            total: totalPacientes,
            color: "bg-green-600",
            icon: <LiaUserInjuredSolid size={50} />,
        },
    ];

    useEffect(() => {
        if (flashMsg) {
            const timer = setTimeout(() => setFlashMsg(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [flashMsg]);

    function submitPie(e) {
        e.preventDefault();
        getPie(route("dashboard.index", {
            mes: dataPie.mes,
            ano: dataPie.ano,
            filtro: "especialidades",
        }), {
            preserveScroll: true,
            preserveState: true,
            only: ["distribuicaoEspecialidades"],
        });
    }
    function submitLine(e) {
        e.preventDefault();
        getLine(route("dashboard.index", {
            mes: dataLine.mes,
            ano: dataLine.ano,
            filtro: "consultas",
        }), {
            preserveScroll: true,
            preserveState: true,
            only: ["consultasPorDia"],
        });
    }

    const totalDiasMes = new Date(dataLine.ano, dataLine.mes, 0).getDate();
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
            borderColor={{ from: "color", modifiers: [["darker", 0.2]], }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]], }}
            motionConfig="wobbly"
            transitionMode="middleAngle"
            legends={[{ anchor: "bottom", direction: "row", justify: false, translateY: 56, itemsSpacing: 10, itemWidth: 100, itemHeight: 18, itemTextColor: "#555", itemDirection: "left-to-right", symbolSize: 18, symbolShape: "circle", },]} />);

    return (
        <div className="max-h-[85vh] overflow-y-auto transition-all ease-in-out">
            <Head title="Dashboard" />

            {flashMsg && (
                <div className="fixed top-24 right-6 bg-green-600 p-3 rounded-md shadow-lg text-sm text-white animate-pulse">
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
                        <div
                            className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-30 rounded-bl-full group-hover:opacity-50 transition-all`}
                        ></div>
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

            <div className="h-auto bg-white rounded-2xl shadow-md m-8 p-6">
                <div className="flex justify-between border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Marcações por Especialidade
                    </h2>
                    <form onSubmit={submitPie} className="flex space-x-4">
                        <div className="flex items-center">
                            <label className="block text-sm font-bold text-gray-600 me-1">Mês: </label>
                            <select value={dataPie.mes} onChange={(e) => setDataPie("mes", e.target.value)} className="bg-white" >
                                {meses.map((mes, i) => <option key={i + 1} value={i + 1}>{mes}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="block text-sm font-bold text-gray-600 me-1">Ano: </label>
                            <select value={dataPie.ano} onChange={(e) => setDataPie("ano", e.target.value)} className="bg-white">
                                {Array.from({ length: 5 }, (_, i) => 2025 + i).map((ano) => <option key={ano} value={ano}>{ano}</option>)}
                            </select>
                        </div>
                        <button className="flex items-center bg-cyan-400 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded-md transition-all">
                            <LiaFilterSolid className="text-xl me-2" /> Filtrar
                        </button>
                    </form>
                </div>
                <div className="p-4 h-[400px] transition-all duration-500">
                    {distribuicaoEspecialidades.length > 0 ? (
                        <MyPie data={distribuicaoEspecialidades} />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full transition-all duration-500 ease-in-out">
                            <p className="font-bold text-gray-400 text-2xl">Sem Marcações</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-auto bg-white rounded-2xl shadow-md m-8 p-6">
                <div className="flex justify-between border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-700 text-center">
                        Marcações por Dia
                    </h2>
                    <form onSubmit={submitLine} className="flex space-x-4">
                        <div className="flex items-center">
                            <label className="block text-sm font-bold text-gray-600 me-1">Mês: </label>
                            <select value={dataLine.mes} onChange={(e) => setDataLine("mes", e.target.value)} className="bg-white" >
                                {meses.map((mes, i) => <option key={i + 1} value={i + 1}>{mes}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label className="block text-sm font-bold text-gray-600 me-1">Ano: </label>
                            <select value={dataLine.ano} onChange={(e) => setDataLine("ano", e.target.value)} className="bg-white">
                                {Array.from({ length: 5 }, (_, i) => 2025 + i).map((ano) => <option key={ano} value={ano}>{ano}</option>)}
                            </select>
                        </div>
                        <button className="flex items-center bg-cyan-400 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded-md transition-all">
                            <LiaFilterSolid className="text-xl me-2" /> Filtrar
                        </button>
                    </form>
                </div>
                <div className="p-4 h-[400px] transition-all duration-500">
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
                        <div className="flex items-center justify-center h-full w-full transition-all duration-500 ease-in-out">
                            <p className="font-bold text-gray-400 text-2xl">Sem Marcações</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
