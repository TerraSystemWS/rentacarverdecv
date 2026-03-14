"use client";

import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Bell, Search, Menu } from "lucide-react";
import { useSidebar } from "@/app/context/SidebarContext";

export default function TopNav({
	title,
	subtitle,
	right,
}: {
	title: string;
	subtitle?: string;
	right?: React.ReactNode;
}) {
	const { user, logout } = useAuth();
	const router = useRouter();
	const { toggle } = useSidebar();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

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

	return (
		<header className="sticky top-0 z-10 glass border-b border-border/40 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4">
			<div className="flex items-center gap-4 md:gap-12 flex-1">
				{/* Hamburger Button */}
				<button
					onClick={toggle}
					className="lg:hidden p-2 rounded-xl bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
				>
					<Menu size={20} />
				</button>

				<div className="min-w-0 flex-1 lg:flex-none">
					<h1 className="text-lg md:text-2xl font-black tracking-tight text-foreground/90 truncate">{title}</h1>
					{subtitle && (
						<p className="hidden xs:block text-[9px] md:text-xs font-bold text-muted-foreground/50 uppercase tracking-widest truncate">{subtitle}</p>
					)}
				</div>

				{/* Global Search Mockup */}
				<div className="hidden md:flex items-center gap-3 bg-secondary/30 px-5 py-2.5 rounded-2xl border border-border/20 w-80 group focus-within:bg-secondary/50 focus-within:border-primary/30 transition-all duration-300">
					<Search className="w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
					<input
						type="text"
						placeholder="Pesquisar..."
						className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-muted-foreground/30"
					/>
				</div>
			</div>

			<div className="flex items-center gap-3 md:gap-6">
				{right}
				<div className="flex items-center gap-2 md:gap-4 border-l border-border/30 pl-2 md:pl-6">
					<button className="relative w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-xl md:rounded-2xl bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group shadow-sm hover:shadow-primary/20">
						<Bell className="w-4 h-4 md:w-5 md:h-5 group-hover:animate-swing" />
						<span className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 md:w-2.5 md:h-2.5 bg-destructive rounded-full ring-2 ring-background animate-pulse"></span>
					</button>

					<div className="flex items-center gap-2 md:gap-3 bg-white/40 dark:bg-white/5 p-1 md:p-1.5 pr-2 md:pr-4 rounded-xl md:rounded-2xl border border-white/20 shadow-sm">
						<div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10">
							<UserIcon className="w-4 h-4 md:w-5 md:h-5" />
						</div>
						<div className="text-right leading-tight hidden sm:block">
							<div className="text-[12px] md:text-sm font-black text-foreground/80">{user?.username ?? "Admin"}</div>
							<div className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-primary/60">
								{user?.roles?.length ? user.roles[0] : "ADMINISTRADOR"}
							</div>
						</div>
					</div>

					<button
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="btn-outline flex items-center gap-2 px-2.5 md:px-4 py-2 md:py-2.5 border-destructive/10 text-destructive/80 hover:bg-destructive hover:text-white hover:border-destructive group h-9 md:h-11"
					>
						{isLoggingOut ? (
							<span className="animate-pulse text-[10px]">...</span>
						) : (
							<>
								<LogOut className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
								<span className="hidden lg:inline font-bold">Sair</span>
							</>
						)}
					</button>
				</div>
			</div>
		</header>
	);
}
