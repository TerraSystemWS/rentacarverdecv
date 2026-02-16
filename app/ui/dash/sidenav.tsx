"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	CalendarDays,
	Car,
	Users,
	MessageSquare,
	ChevronRight,
	TrendingUp
} from "lucide-react";

const items = [
	{ label: "Painel", href: "/dashboard", icon: LayoutDashboard },
	{ label: "Reservas", href: "/dashboard/bookings", icon: CalendarDays },
	{ label: "Veículos", href: "/dashboard/vehicles", icon: Car },
	{ label: "Utilizadores", href: "/dashboard/users", icon: Users },
	{ label: "Mensagens", href: "/dashboard/messages", icon: MessageSquare },
];

export default function SideNav() {
	const pathname = usePathname();

	return (
		<aside className="h-screen w-72 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-[4px_0_24px_rgba(0,0,0,0.1)] z-20 transition-all duration-300">
			<div className="px-6 py-10">
				<Link href="/dashboard" className="flex items-center gap-3.5 group">
					<div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
						<Car className="text-primary-foreground w-7 h-7" />
					</div>
					<div>
						<div className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sidebar-foreground to-sidebar-foreground/70">
							Verde CV
						</div>
						<div className="text-[10px] uppercase tracking-[0.3em] text-sidebar-foreground/40 font-bold">
							Premium Admin
						</div>
					</div>
				</Link>
			</div>

			<nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar py-2">
				{items.map((item) => {
					const active = pathname === item.href;
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={[
								"group flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300",
								active
									? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
									: "text-sidebar-foreground/50 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground hover:translate-x-1",
							].join(" ")}
						>
							<div className="flex items-center gap-4">
								<Icon className={[
									"w-5 h-5 transition-all duration-300",
									active ? "text-primary-foreground scale-110" : "group-hover:scale-110 group-hover:rotate-3"
								].join(" ")} />
								<span className="tracking-wide">{item.label}</span>
							</div>
							{active ? (
								<ChevronRight className="w-4 h-4 text-primary-foreground/50" />
							) : (
								<ChevronRight className="w-4 h-4 text-sidebar-foreground/10 group-hover:text-sidebar-foreground/30 transition-colors" />
							)}
						</Link>
					);
				})}
			</nav>

			<div className="p-6 space-y-6">
				<div className="relative overflow-hidden bg-gradient-to-br from-sidebar-accent/30 to-sidebar-accent/10 rounded-3xl p-5 border border-sidebar-border/50">
					<div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
					<div className="flex items-start gap-3 relative z-10">
						<div className="p-2 rounded-lg bg-primary/20 text-primary">
							<TrendingUp className="w-4 h-4" />
						</div>
						<div>
							<div className="text-xs font-bold text-sidebar-foreground/80 mb-1">Dica Pro</div>
							<div className="text-[10px] text-sidebar-foreground/50 leading-relaxed font-medium">
								Analise as tendências de reserva para otimizar a sua frota.
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between text-[10px] text-sidebar-foreground/20 font-black tracking-widest uppercase px-2">
					<span>V 2.0.4</span>
					<span>© {new Date().getFullYear()}</span>
				</div>
			</div>
		</aside>
	);
}
