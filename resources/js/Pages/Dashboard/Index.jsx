import { Head, useForm, usePage } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
import {
    LiaUserTieSolid,
    LiaUserCheckSolid,
    LiaUserInjuredSolid,
    LiaUserNurseSolid,
    LiaFilterSolid,
} from "react-icons/lia";
import { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function Dashboard(props) {

    const route = useRoute();
    const { role, flash, mesSelecionado, anoSelecionado } = props;
    const [flashMsg, setFlashMsg] = useState(flash?.message || flash?.success || null);

    const { data: dataPie, setData: setDataPie, get: getPie } = useForm({
        mes: mesSelecionado,
        ano: anoSelecionado,
    });
    const { data: dataLine, setData: setDataLine, get: getLine } = useForm({
        mes: mesSelecionado,
        ano: anoSelecionado,
    });

    useEffect(() => {
        if (flashMsg) {
            const timer = setTimeout(() => setFlashMsg(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [flashMsg]);

    function submitPie(e) {
        e.preventDefault();
        getPie(route("dashboard.index", { mes: dataPie.mes, ano: dataPie.ano, filtro: "especialidades" }), {
            preserveScroll: true,
            preserveState: true,
            only: ["distribuicaoEspecialidades"],
        });
    }

    function submitLine(e) {
        e.preventDefault();
        getLine(route("dashboard.index", { mes: dataLine.mes, ano: dataLine.ano, filtro: "consultas" }), {
            preserveScroll: true,
            preserveState: true,
            only: ["consultasPorDia"],
        });
    }

    const cards = [];
    if (role === "admin") {
        cards.push(
            { title: "Médicos", total: props.totalMedicos, icon: <LiaUserNurseSolid size={50} /> },
            { title: "Usuários", total: props.totalUsuarios, icon: <LiaUserTieSolid size={50} /> },
            { title: "Recepcionistas", total: props.totalRecepcionistas, icon: <LiaUserCheckSolid size={50} /> },
            { title: "Pacientes", total: props.totalPacientes, icon: <LiaUserInjuredSolid size={50} /> }
        );
    } else if (role === "medico") {
        cards.push(
            { title: "Consultas este Mês", total: props.consultasMes, icon: <LiaUserNurseSolid size={50} /> },
            { title: "Consultas Realizadas", total: props.consultasRealizadas, icon: <LiaUserCheckSolid size={50} /> },
            { title: "Consultas Pendentes", total: props.consultasPendentes, icon: <LiaUserTieSolid size={50} /> }
        );
    } else if (role === "recepcionista") {
        cards.push(
            { title: "Marcações Hoje", total: props.marcacoesHoje, icon: <LiaUserInjuredSolid size={50} /> },
            { title: "Pendentes", total: props.pendentes, icon: <LiaUserTieSolid size={50} /> }
        );
    } else if (role === "utente") {
        cards.push(
            { title: "Total de Consultas", total: props.totalConsultas, icon: <LiaUserCheckSolid size={50} /> },
            { title: "Consultas Realizadas", total: props.consultasRealizadas, icon: <LiaUserInjuredSolid size={50} /> },
            { title: "Consultas Confirmadas", total: props.consultasConfirmadas, icon: <LiaUserTieSolid size={50} /> }
        );
    }

    const totalDiasMes = new Date(dataLine.ano, dataLine.mes, 0).getDate();
    const consultasMap = (props.consultasPorDia || []).reduce((acc, item) => {
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
        <div className="max-h-[85vh] overflow-y-auto p-6 space-y-10">
            <Head title="Dashboard" />

            {flashMsg && (
                <div className="fixed top-24 right-6 bg-green-600 p-3 rounded-md shadow-lg text-sm text-white animate-pulse">
                    {flashMsg}
                </div>
            )}

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all hover:-translate-y-1 bg-cyan-400"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-600 opacity-30 rounded-bl-full group-hover:opacity-50 transition-all"></div>
                        <div className="p-6 text-white relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                {card.icon}
                                <span className="text-4xl font-bold">{card.total}</span>
                            </div>
                            <h3 className="text-lg font-medium tracking-wide">{card.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* GRÁFICOS */}
            {role !== "utente" && props.distribuicaoEspecialidades && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex justify-between border-b pb-2">
                        <h2 className="text-xl font-semibold text-gray-700">Marcações por Especialidade</h2>
                        <form onSubmit={submitPie} className="flex space-x-4">
                            <select value={dataPie.mes} onChange={(e) => setDataPie("mes", e.target.value)} className="border rounded px-5 py-1">
                                {meses.map((mes, i) => <option key={i + 1} value={i + 1}>{mes}</option>)}
                            </select>
                            <select value={dataPie.ano} onChange={(e) => setDataPie("ano", e.target.value)} className="border rounded px-2 py-1">
                                {Array.from({ length: 5 }, (_, i) => 2025 + i).map((ano) => <option key={ano} value={ano}>{ano}</option>)}
                            </select>
                            <button className="flex items-center bg-cyan-600 hover:bg-cyan-800 text-white px-4 py-2 rounded-md transition">
                                <LiaFilterSolid className="mr-2" /> Filtrar
                            </button>
                        </form>
                    </div>
                    <div className="h-[400px] py-4">
                        {props.distribuicaoEspecialidades.length > 0 ? (
                            <ResponsivePie
                                data={props.distribuicaoEspecialidades}
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
                                legends={[{ anchor: "bottom", direction: "row", justify: false, translateY: 56, itemsSpacing: 10, itemWidth: 100, itemHeight: 18, itemTextColor: "#555", itemDirection: "left-to-right", symbolSize: 18, symbolShape: "circle", },]} />
                        ) : (
                            <div className="flex justify-center items-center h-full text-gray-400 font-semibold">Sem dados</div>
                        )}
                    </div>
                </div>
            )}

            {role !== "utente" && props.consultasPorDia && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex justify-between border-b pb-2">
                        <h2 className="text-xl font-semibold text-gray-700">Consultas por Dia</h2>
                        <form onSubmit={submitLine} className="flex space-x-4">
                            <select value={dataLine.mes} onChange={(e) => setDataLine("mes", e.target.value)} className="border rounded px-5 py-1">
                                {meses.map((mes, i) => <option key={i + 1} value={i + 1}>{mes}</option>)}
                            </select>
                            <select value={dataLine.ano} onChange={(e) => setDataLine("ano", e.target.value)} className="border rounded px-2 py-1">
                                {Array.from({ length: 5 }, (_, i) => 2025 + i).map((ano) => <option key={ano} value={ano}>{ano}</option>)}
                            </select>
                            <button className="flex items-center bg-cyan-600 hover:bg-cyan-800 text-white px-4 py-2 rounded-md transition">
                                <LiaFilterSolid className="mr-2" /> Filtrar
                            </button>
                        </form>
                    </div>
                    <div className="h-[400px]">
                        {props.consultasPorDia.length > 0 ? (
                            <ResponsiveLine
                                data={dadosLinha}
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
                            <div className="flex justify-center items-center h-full text-gray-400 font-semibold">Sem dados</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
