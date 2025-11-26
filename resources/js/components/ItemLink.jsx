import { Link } from "@inertiajs/react"
export default function ItemLink({ text, to, icon, active }) {

    return (
        <li>
            <Link className={`text-gray-800  ${active ? "bg-gray-100" : " bg-gray-600"}`} href={to}>
                {icon} {text}
            </Link>
        </li>
    )
}