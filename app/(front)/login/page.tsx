"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const { login, isLoading, isAuthenticated, user } = useAuth();
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState<string | null>(null);

	const roles: string[] =
		(user as any)?.roles ??
		(user as any)?.authorities?.map((a: any) => a.authority) ??
	[];
	const isAdmin =
		roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");

	// Se já logado: admin → dashboard, não-admin → front
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.replace(isAdmin ? "/dashboard" : "/");
		}
	}, [isLoading, isAuthenticated, isAdmin, router]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setErr(null);

		if (!username || !password) {
			setErr("Preencha todos os campos");
			return;
		}

		try {
			await login(username, password);
			// O useEffect acima cuidará do redirecionamento assim que o estado mudar
		} catch (error: any) {
			setErr(error?.message || "Usuário ou senha inválidos");
		}
	}

	return (
		/* Centralização usando Grid como discutimos */
		<main className="min-h-screen bg-slate-50 grid place-items-center p-6">
			<div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 border border-slate-200">
				<h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
					Login
				</h1>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Username
						</label>
						<input
							className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
							placeholder="seu_usuario"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							autoComplete="username"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Senha
						</label>
						<input
							className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
							placeholder="••••••••"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
						/>
					</div>

					{err && (
						<div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
							{err}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-indigo-600 text-white font-semibold rounded-lg px-4 py-2.5 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{isLoading ? "A entrar..." : "Entrar"}
					</button>
				</form>
			</div>
		</main>
	);
}
