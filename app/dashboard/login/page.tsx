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
		<div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
			<h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
				Login do Dashboard
			</h1>

			<form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
				<label style={{ display: "grid", gap: 6 }}>
					<span>Username</span>
					<input
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						autoComplete="username"
						style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
					/>
				</label>

				<label style={{ display: "grid", gap: 6 }}>
					<span>Password</span>
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						autoComplete="current-password"
						style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
					/>
				</label>

				{error && (
					<div
						style={{
							background: "#ffe5e5",
							border: "1px solid #ffb3b3",
							padding: 10,
							borderRadius: 8,
							fontSize: 14,
						}}
					>
						{error}
					</div>
				)}

				<button
					type="submit"
					disabled={submitting || isLoading}
					style={{
						padding: 10,
						borderRadius: 10,
						border: "none",
						cursor: "pointer",
						fontWeight: 700,
						opacity: submitting || isLoading ? 0.7 : 1,
					}}
				>
					{submitting || isLoading ? "A entrar..." : "Entrar"}
				</button>

				{/* se alguém logado mas não admin, o useEffect já redireciona para o front */}
			</form>
		</div>
	);
}
