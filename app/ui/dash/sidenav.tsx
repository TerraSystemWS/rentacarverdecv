"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import {
	LayoutDashboard,
	CalendarDays,
	Car,
	Users,
	MessageSquare,
	ChevronRight,
	ChevronLeft,
	TrendingUp,
	Handshake,
	FileText,
	Image,
	Images,
	Megaphone,
	UserSquare2,
	MapPin,
	X,
	LogOut,
	User as UserIcon,
	Ticket,
	Mail,
	Receipt,
	Settings2,
	Briefcase,
	Archive,
} from "lucide-react";
import { useSidebar } from "@/app/context/SidebarContext";

type Item = { label: string; href: string; icon: any };
type Group = { label: string; icon: any; items: Item[] };

// Item de topo — sempre visível, nunca dentro de um grupo.
const rootItem: Item = { label: "Painel", href: "/dashboard", icon: LayoutDashboard };

// Grupos temáticos — clicar num grupo abre uma vista só com os seus itens
// (tasks.md: "qd um grupo recebe um clique ele abre um subgroup onde o side
// menu apenas tera esses menus e um ultimo 'Voltar'").
const groups: Group[] = [
	{
		label: "Operações",
		icon: Briefcase,
		items: [
			{ label: "Reservas", href: "/dashboard/bookings", icon: CalendarDays },
			{ label: "Veículos", href: "/dashboard/vehicles", icon: Car },
			{ label: "Calendário", href: "/dashboard/calendar", icon: CalendarDays },
			{ label: "Motoristas", href: "/dashboard/drivers", icon: UserSquare2 },
			{ label: "Locais", href: "/dashboard/locations", icon: MapPin },
		],
	},
	{
		label: "Conteúdo",
		icon: FileText,
		items: [
			{ label: "Blog", href: "/dashboard/posts", icon: FileText },
			{ label: "Galeria", href: "/dashboard/gallery", icon: Image },
			{ label: "Parceiros", href: "/dashboard/partners", icon: Handshake },
			{ label: "Media Library", href: "/dashboard/media", icon: Images },
		],
	},
	{
		label: "Marketing",
		icon: Megaphone,
		items: [
			{ label: "Publicidade", href: "/dashboard/ads", icon: Megaphone },
			{ label: "Vouchers", href: "/dashboard/vouchers", icon: Ticket },
			{ label: "Subscritores", href: "/dashboard/subscribers", icon: Mail },
		],
	},
	{
		label: "Conta",
		icon: Receipt,
		items: [
			{ label: "Faturação", href: "/dashboard/invoices", icon: Receipt },
			{ label: "Configuração da Empresa", href: "/dashboard/company-settings", icon: Settings2 },
		],
	},
	{
		label: "Sistema",
		icon: Settings2,
		items: [
			{ label: "Utilizadores", href: "/dashboard/users", icon: Users },
			{ label: "Mensagens", href: "/dashboard/messages", icon: MessageSquare },
			{ label: "Arquivados", href: "/dashboard/archived", icon: Archive },
			{ label: "Definições", href: "/dashboard/settings", icon: LayoutDashboard },
		],
	},
];

export default function SideNav() {
	const pathname = usePathname();
	const router = useRouter();
	const { isOpen, close } = useSidebar();
	const { user, logout } = useAuth();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// Se a rota atual pertence a um grupo, abre já nesse grupo em vez de
	// obrigar o admin a navegar de novo pela raiz do menu depois de um refresh.
	const activeGroup = groups.find((g) => g.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/")));
	const [openGroup, setOpenGroup] = useState<Group | null>(activeGroup || null);

	useEffect(() => {
		const match = groups.find((g) => g.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/")));
		if (match) setOpenGroup(match);
	}, [pathname]);

	const mountedRef = useRef(true);
	useEffect(() => {
		return () => {
			mountedRef.current = false;
		};
	}, []);

	async function handleLogout() {
		if (isLoggingOut) return;
		setIsLoggingOut(true);

		try {
			await logout();
		} finally {
			router.replace("/dashboard/login");
			if (mountedRef.current) setIsLoggingOut(false);
		}
	}

	function renderLink(item: Item, onNavigate: () => void) {
		const active = pathname === item.href || pathname.startsWith(item.href + "/");
		const Icon = item.icon;
		return (
			<Link
				key={item.href}
				href={item.href}
				onClick={onNavigate}
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
	}

	return (
		<>
			{/* Mobile Overlay */}
			<div
				className={[
					"fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
					isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				].join(" ")}
				onClick={close}
			/>

			<aside className={[
				"fixed inset-y-0 left-0 lg:sticky lg:top-0 h-screen w-72 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-[4px_0_24px_rgba(0,0,0,0.1)] z-[70] transition-all duration-300 transform lg:translate-x-0",
				isOpen ? "translate-x-0" : "-translate-x-full"
			].join(" ")}>
				<div className="px-6 py-10 flex items-center justify-between">
					<Link href="/dashboard" className="flex items-center gap-3.5 group" onClick={close}>
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

					{/* Mobile Close Button */}
					<button
						onClick={close}
						className="lg:hidden p-2 rounded-xl bg-sidebar-accent/50 text-sidebar-foreground/50 hover:text-primary transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				<nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar py-2">
					{openGroup ? (
						<>
							<button
								onClick={() => setOpenGroup(null)}
								className="w-full flex items-center gap-3 rounded-2xl px-5 py-3 mb-2 text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 transition-colors"
							>
								<ChevronLeft className="w-4 h-4" />
								Voltar
							</button>
							<div className="px-5 pb-2 text-[10px] uppercase tracking-[0.25em] text-sidebar-foreground/30 font-black">
								{openGroup.label}
							</div>
							{openGroup.items.map((item) => renderLink(item, close))}
						</>
					) : (
						<>
							{renderLink(rootItem, close)}
							{groups.map((group) => {
								const Icon = group.icon;
								const isGroupActive = group.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"));
								return (
									<button
										key={group.label}
										onClick={() => setOpenGroup(group)}
										className={[
											"w-full group flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300",
											isGroupActive
												? "bg-sidebar-accent/50 text-sidebar-foreground"
												: "text-sidebar-foreground/50 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground hover:translate-x-1",
										].join(" ")}
									>
										<div className="flex items-center gap-4">
											<Icon className="w-5 h-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
											<span className="tracking-wide">{group.label}</span>
										</div>
										<ChevronRight className="w-4 h-4 text-sidebar-foreground/30" />
									</button>
								);
							})}
						</>
					)}
				</nav>

				<div className="p-6 space-y-6">
					{/* User Profile & Logout - Visible ONLY on mobile in SideNav */}
					<div className="pt-6 border-t border-sidebar-border/50 lg:hidden">
						<div className="flex items-center gap-3 bg-sidebar-accent/30 p-3 rounded-2xl border border-sidebar-border/50 group transition-all duration-300 hover:border-primary/30">
							<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner group-hover:scale-105 transition-transform">
								<UserIcon className="w-5 h-5" />
							</div>
							<div className="min-w-0 flex-1">
								<div className="text-base font-black text-sidebar-foreground/80 truncate">{user?.username ?? "Admin"}</div>
								<div className="text-xs font-black uppercase tracking-tighter text-primary/60 truncate">
									{user?.roles?.length ? user.roles[0] : "ADMINISTRADOR"}
								</div>
							</div>
						</div>

						<button
							onClick={handleLogout}
							disabled={isLoggingOut}
							className="mt-3 w-full group flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-300 bg-destructive/5 text-destructive hover:bg-destructive hover:text-white"
						>
							{isLoggingOut ? (
								<span className="animate-pulse">...</span>
							) : (
								<>
									<LogOut className="w-4 h-4 transition-transform group-hover:rotate-12" />
									<span>Sair do Painel</span>
								</>
							)}
						</button>
					</div>

					<div className="relative overflow-hidden bg-gradient-to-br from-sidebar-accent/30 to-sidebar-accent/10 rounded-3xl p-5 border border-sidebar-border/50">
						<div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
						<div className="flex items-start gap-3 relative z-10">
							<div className="p-2 rounded-lg bg-primary/20 text-primary">
								<TrendingUp className="w-4 h-4" />
							</div>
							<div>
								<div className="text-xs font-bold text-sidebar-foreground/80 mb-1">Suporte técnico</div>
								<div className="text-[10px] text-sidebar-foreground/50 leading-relaxed font-medium">
									Precisa de ajuda? Contacte-nos:<br />
									<span className="text-primary font-bold">terra.systemltd@gmail.com</span>
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
		</>
	);
}
