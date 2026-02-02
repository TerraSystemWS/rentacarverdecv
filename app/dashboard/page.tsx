"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import StatCard from "@/app/ui/dash/StatCard";

import { endpoints } from "@/lib/api/endpoints";
import type { DashboardSummary } from "@/lib/api/types";

import { useAuth } from "@/app/auth/AuthContext";

export default function DashboardHome() {
	const router = useRouter();
	const { authFetch, isLoading, isAuthenticated } = useAuth();

	const [data, setData] = useState<DashboardSummary | null>(null);
	const [err, setErr] = useState<string | null>(null);

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated) {
			setData(null);
			setErr(null);
			router.replace("/dashboard/login");
			return;
		}

		let cancelled = false;

		(async () => {
			try {
				setErr(null);

				// ⚠️ endpoints.dashboard.summary deve ser tipo "/dashboard/summary"
				const res = await authFetch(endpoints.dashboard.summary);

				if (res.status === 401) {
					if (!cancelled) {
						setData(null);
						router.replace("/dashboard/login");
					}
					return;
				}

				if (!res.ok) {
					const text = await res.text().catch(() => "");
					throw new Error(
						text || `Erro ao carregar resumo (HTTP ${res.status}).`,
					);
				}

				const json = (await res.json()) as DashboardSummary;
				if (!cancelled) setData(json);
			} catch (e: any) {
				if (!cancelled) setErr(e?.message || "Erro ao carregar resumo.");
			}
		})();

		return () => {
			cancelled = true;
		};
		// ⚠️ não colocar authFetch nas deps evita loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, isAuthenticated, router]);

	return (
		<div>
			<TopNav title="Resumo" subtitle="Visão geral do sistema" />
			<PageShell>
				{isLoading ? (
					<div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
						A validar sessão...
					</div>
				) : err ? (
					<div className="rounded-xl border bg-white p-4 text-sm text-red-600">
						{err}
					</div>
				) : !data ? (
					<div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
						A carregar...
					</div>
				) : (
					<div className="grid gap-4 md:grid-cols-4">
						<StatCard label="Utilizadores" value={data.users} />
						<StatCard label="Veículos" value={data.vehicles} />
						<StatCard label="Reservas ativas" value={data.activeBookings} />
						<StatCard
							label="Mensagens não lidas"
							value={data.unreadRecipients}
						/>
					</div>
				)}
			</PageShell>
		</div>
	);
}
