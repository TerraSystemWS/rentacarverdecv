"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
	{ label: "Resumo", href: "/dashboard" },
	{ label: "Reservas", href: "/dashboard/bookings" },
	{ label: "Veículos", href: "/dashboard/vehicles" },
	{ label: "Utilizadores", href: "/dashboard/users" },
	{ label: "Mensagens", href: "/dashboard/messages" },
];

export default function SideNav() {
	const pathname = usePathname();

	return (
		<aside className="h-full w-64 border-r bg-white">
			<div className="px-4 py-4">
				<div className="text-lg font-semibold">Rent a Car Verde</div>
				<div className="text-sm text-gray-500">Dashboard</div>
			</div>

			<nav className="px-2 pb-4">
				{items.map((item) => {
					const active = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={[
								"block rounded-md px-3 py-2 text-sm transition",
								active
									? "bg-gray-900 text-white"
									: "text-gray-700 hover:bg-gray-100",
							].join(" ")}
						>
							{item.label}
						</Link>
					);
				})}
			</nav>

			<div className="mt-auto border-t px-4 py-3 text-xs text-gray-500">
				© {new Date().getFullYear()}
			</div>
		</aside>
	);
}
