"use client";

import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLoginPage() {
	const router = useRouter();
	const { login, isLoading, isAuthenticated, user } = useAuth();

	const [username, setUsername] = useState("admin");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const roles: string[] =
		(user as any)?.roles ??
		(user as any)?.authorities?.map((a: any) => a.authority) ??
		[];

	const isAdmin =
		roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");

	// ✅ Se já estiver logado: admin → dashboard, não-admin → front
	React.useEffect(() => {
		if (isLoading || !isAuthenticated) return;
		router.replace(isAdmin ? "/dashboard" : "/");
	}, [isLoading, isAuthenticated, isAdmin, router]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			await login(username, password);
			// ✅ não redireciona aqui — o layout decide
		} catch (e: any) {
			setError(e?.message || "Falha no login");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 sm:p-10">
			<div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
				<div className="mb-12 text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-zinc-900 dark:bg-primary text-white mb-6 shadow-xl">
						<span className="text-2xl font-black">V</span>
					</div>
					<h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
						Acesso Admin
					</h1>
					<p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">
						Rent a Car Verde • Portal de Gestão
					</p>
				</div>

				<div className="card-solid p-10 shadow-sm border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

					<form onSubmit={onSubmit} className="space-y-6 relative z-10">
						<div className="space-y-2">
							<label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-0.5">
								Utilizador
							</label>
							<input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete="username"
								placeholder="admin"
								className="w-full h-12 px-4 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-zinc-900 dark:text-zinc-100 text-sm"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-0.5">
								Palavra-passe
							</label>
							<input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type="password"
								autoComplete="current-password"
								placeholder="••••••••"
								className="w-full h-12 px-4 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-zinc-900 dark:text-zinc-100 text-sm"
							/>
						</div>

						{error && (
							<div className="p-4 rounded-md bg-destructive/5 border border-destructive/20 text-destructive text-[11px] font-bold animate-in fade-in duration-300">
								{error}
							</div>
						)}

						<button
							type="submit"
							disabled={submitting || isLoading}
							className="btn-primary w-full h-12 text-xs tracking-widest shadow-sm rounded-md"
						>
							{submitting || isLoading ? (
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
									<span>Entrando...</span>
								</div>
							) : (
								"Entrar no Sistema"
							)}
						</button>
					</form>
				</div>

				<p className="mt-10 text-center text-sm font-black text-zinc-400 uppercase tracking-widest leading-loose">
					&copy; {new Date().getFullYear()} Rent a Car Verde.<br />
					Sistema de Gestão de Frota Premium.
				</p>
			</div>
		</div>
	);
}
