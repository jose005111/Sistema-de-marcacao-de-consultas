import { Link, usePage } from "@inertiajs/react";
import img from "@/assets/logo.png";
import {
    LiaCalendarAltSolid,
    LiaChartBar,
    LiaGripLinesSolid,
    LiaUserCheckSolid,
    LiaUserInjuredSolid,
    LiaUserNurseSolid,
    LiaUserPlusSolid,
    LiaPlusCircleSolid
} from "react-icons/lia";
import { AiFillAlert } from "react-icons/ai";

export default function Sidebar() {
    const { url, props } = usePage();
    const can = props.auth?.can || {};
    const { auth } = usePage().props;
    const isActive = (href) => url.startsWith(href);
    const habilitar = (auth.user.role === 'admin') || auth.user.perfil.completo;

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: LiaChartBar, show: true },

        { name: "Pacientes", href: "/pacientes", icon: LiaUserInjuredSolid, show: can.viewPacientes },
        { name: "Médicos", href: "/medicos", icon: LiaUserNurseSolid, show: can.viewMedicos },
        { name: "Recepcionistas", href: "/recepcionistas", icon: LiaUserCheckSolid, show: can.viewRecepcionistas },
        { name: "Marcações", href: "/marcacoes", icon: LiaCalendarAltSolid, show: can.viewMarcacoes },
        { name: "Especialidades", href: "/especialidades", icon: LiaGripLinesSolid, show: can.viewEspecialidades },
        { name: "Usuários", href: "/usuarios", icon: LiaUserPlusSolid, show: can.viewUsuarios },
        { name: "Vagas", href: "/vagas", icon: LiaPlusCircleSolid, show: can.viewVagas },
    ];

    return (
        <div className="sidebar w-64 h-screen bg-cyan-400">
            <div className="flex items-center justify-center bg-white p-2 border-b">
                <img src={img} alt="logo" />
            </div>
            {links
                .filter(link => link.show)
                .map(link => (
                    <div className="mx-1" key={link.href}>
                        <Link
                            href={habilitar ? link.href : "#"}
                            className={`flex items-center rounded p-3 hover:bg-cyan-200 mt-1
                                ${isActive(link.href) ? "bg-cyan-200" : ""}`}
                        >
                            <link.icon className="text-xl mx-2" />
                            {link.name}
                        </Link>
                    </div>
                ))
            }
            {!habilitar && (
                <div className="flex justify-center my-4 animate-pulse mx-1">
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-1.5 shadow-sm">
                        <AiFillAlert className="text-amber-500 text-2xl" />
                        <span className="text-sm font-medium text-amber-700">
                            Ação necessária: Complete seu perfil para liberar o menu.
                        </span>
                    </div>
                </div>
            )}

        </div>
    );
}
