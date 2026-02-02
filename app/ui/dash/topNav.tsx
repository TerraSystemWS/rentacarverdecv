"use client";

import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";

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
			await logout(); // limpa tokens + chama backend (best effort)
		} finally {
			router.replace("/dashboard/login");
			// evita warning caso o componente seja desmontado após o redirect
			if (mountedRef.current) setIsLoggingOut(false);
		}
	}

	return (
		<header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
			<div className="flex items-center justify-between px-6 py-4">
				<div>
					<h1 className="text-lg font-semibold">{title}</h1>
					{subtitle ? (
						<p className="text-sm text-gray-500">{subtitle}</p>
					) : null}
				</div>

				<div className="flex items-center gap-3">
					{right}

					<div className="text-right text-sm leading-tight">
						<div className="text-gray-700">{user?.username ?? "—"}</div>
						<div className="text-xs text-gray-400">
							{user?.roles?.length ? user.roles.join(", ") : "—"}
						</div>
					</div>

					<button
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isLoggingOut ? "A sair..." : "Sair"}
					</button>
				</div>
			</div>
		</header>
	);
}
