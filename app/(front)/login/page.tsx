"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
	const { login, isLoading, isAuthenticated, user } = useAuth();
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [err, setErr] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get("registered") === "true") {
				setSuccessMsg("Conta criada com sucesso! Faça login para continuar.");
			}
		}
	}, []);

	const roles: string[] =
		(user as any)?.roles ??
		(user as any)?.authorities?.map((a: any) => a.authority) ??
		[];
	const isAdmin =
		roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");

	// Se já logado: admin → dashboard, não-admin → profile
	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.replace(isAdmin ? "/dashboard" : "/profile");
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
		/* Centralização usando bg-slate-50 flex items-center justify-center p-6 */
		<main className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-6">
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

					{successMsg && (
						<div className="bg-green-50 text-green-700 text-sm p-3 rounded-md border border-green-200">
							{successMsg}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-indigo-600 text-white font-semibold rounded-lg px-4 py-2.5 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
					>
						{isLoading ? "A entrar..." : "Entrar"}
					</button>

					<div className="text-center text-sm text-slate-600 mt-4">
						Ainda não tem conta?{" "}
						<Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
							Criar Conta
						</Link>
					</div>
				</form>
			</div>
		</main>
	);
}
