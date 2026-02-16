"use client";

import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Bell, Search } from "lucide-react";

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
		<header className="sticky top-0 z-10 glass border-b border-border/40 px-8 py-5 flex items-center justify-between">
			<div className="flex items-center gap-12">
				<div>
					<h1 className="text-2xl font-black tracking-tight text-foreground/90">{title}</h1>
					{subtitle && (
						<p className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">{subtitle}</p>
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

			<div className="flex items-center gap-6">
				{right}

				<div className="flex items-center gap-4 border-l border-border/30 pl-6">
					<button className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group shadow-sm hover:shadow-primary/20 hover:-translate-y-0.5">
						<Bell className="w-5 h-5 group-hover:animate-swing" />
						<span className="absolute top-3 right-3 w-2.5 h-2.5 bg-destructive rounded-full ring-2 ring-background animate-pulse"></span>
					</button>

					<div className="flex items-center gap-3 bg-white/40 dark:bg-white/5 p-1.5 pr-4 rounded-2xl border border-white/20 shadow-sm transition-all duration-300 hover:border-primary/20">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/10 shadow-inner group-hover:scale-105 transition-transform">
							<UserIcon className="w-5 h-5" />
						</div>
						<div className="text-right leading-tight hidden sm:block">
							<div className="text-sm font-black text-foreground/80">{user?.username ?? "Admin"}</div>
							<div className="text-[9px] font-black uppercase tracking-tighter text-primary/60">
								{user?.roles?.length ? user.roles[0] : "ADMINISTRADOR"}
							</div>
						</div>
					</div>

					<button
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="btn-outline flex items-center gap-2.5 px-4 py-2.5 border-destructive/10 text-destructive/80 hover:bg-destructive hover:text-white hover:border-destructive group h-11"
					>
						{isLoggingOut ? (
							<span className="animate-pulse">...</span>
						) : (
							<>
								<LogOut className="w-4 h-4 transition-transform group-hover:rotate-12" />
								<span className="hidden lg:inline font-bold">Sair</span>
							</>
						)}
					</button>
				</div>
			</div>
		</header>
	);
}
