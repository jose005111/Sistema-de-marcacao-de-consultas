import { Link, usePage } from "@inertiajs/react";
import img from "@/assets/logo.png"
import { LiaCalendarAltSolid, LiaChartBar, LiaGripLinesSolid, LiaUserCheckSolid, LiaUserInjuredSolid, LiaUserNurseSolid, LiaUserPlusSolid, LiaPlusCircleSolid } from "react-icons/lia";
export default function Sidebar() {
    const { url } = usePage();
    const isActive = (href) => url.startsWith(href);
    const links = [
        { name: "Dashboard", href: "/dashboard", icon: LiaChartBar },
        { name: "Pacientes", href: "/pacientes", icon: LiaUserInjuredSolid },
        { name: "Médicos", href: "/medicos", icon: LiaUserNurseSolid },
        { name: "Recepcionistas", href: "/recepcionistas", icon: LiaUserCheckSolid },
        { name: "Marcações", href: "/marcacoes", icon: LiaCalendarAltSolid },
        { name: "Especialidades", href: "/especialidades", icon: LiaGripLinesSolid },
        { name: "Usuários", href: "/usuarios", icon: LiaUserPlusSolid },
        { name: "Vagas", href: "/vagas", icon: LiaPlusCircleSolid }
    ]
    return (
        <div className="sidebar w-64 h-screen bg-cyan-400">
            <div className="flex items-center justify-center bg-white p-2 border-b">
                <img src={img} alt="logo" className="rotate-x-50 rotate-z-45" />
            </div>
            {links.map(link => (
                <div className="mx-1" key={link.href}>
                    <Link
                        className={`flex items-center rounded p-3 hover:bg-cyan-200 mt-1 ${isActive(link.href) ? "bg-cyan-200" : ""
                            }`}
                        href={link.href}
                    >
                        <link.icon className="text-xl mx-2" />
                        {link.name}
                    </Link>
                </div>
            )
            )}
        </div>
    )
}