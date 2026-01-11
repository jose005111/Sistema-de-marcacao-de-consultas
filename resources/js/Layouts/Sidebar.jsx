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

export default function Sidebar() {
    const { url, props } = usePage();
    const can = props.auth?.can || {};

    const isActive = (href) => url.startsWith(href);

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
                            href={link.href}
                            className={`flex items-center rounded p-3 hover:bg-cyan-200 mt-1
                                ${isActive(link.href) ? "bg-cyan-200" : ""}`}
                        >
                            <link.icon className="text-xl mx-2" />
                            {link.name}
                        </Link>
                    </div>
                ))
            }
        </div>
    );
}
