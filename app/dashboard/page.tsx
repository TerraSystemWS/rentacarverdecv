"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import StatCard from "@/app/ui/dash/StatCard";
import RevenueOverview from "@/app/dashboard/_components/RevenueOverview";

import { endpoints } from "@/lib/api/endpoints";
import type { DashboardSummary } from "@/lib/api/types";

import { useAuth } from "@/app/auth/AuthContext";
import {
	Users as UsersIcon,
	Car as CarIcon,
	CalendarCheck,
	MessageCircle,
	ArrowRight,
	Loader2
} from "lucide-react";

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
	}, [isLoading, isAuthenticated, router]);

	return (
		<main className="min-h-screen pb-20">
			<TopNav
				title="Bem-vindo de volta"
				subtitle="Aqui está o que está a acontecer com a Rent a Car Verde hoje."
			/>

			<PageShell>
				<div className="max-w-7xl mx-auto space-y-10">
					{isLoading || !data ? (
						<div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white/50 rounded-3xl border border-dashed border-border/60">
							<div className="relative">
								<div className="w-12 h-12 rounded-2xl bg-primary/20 animate-pulse"></div>
								<Loader2 className="w-6 h-6 text-primary animate-spin absolute inset-0 m-auto" />
							</div>
							<p className="text-sm font-medium text-muted-foreground animate-pulse">
								{isLoading ? "A validar sessão..." : "A carregar dados do dashboard..."}
							</p>
						</div>
					) : err ? (
						<div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 text-center">
							<p className="text-sm font-semibold text-destructive">{err}</p>
							<button
								onClick={() => window.location.reload()}
								className="mt-4 btn-outline border-destructive/20 text-destructive"
							>
								Tentar novamente
							</button>
						</div>
					) : (
						<section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
								<StatCard
									label="Utilizadores"
									value={data.users}
									icon={UsersIcon}
									trend="+12%"
								/>
								<StatCard
									label="Veículos"
									value={data.vehicles}
									icon={CarIcon}
								/>
								<StatCard
									label="Reservas Ativas"
									value={data.activeBookings}
									icon={CalendarCheck}
									trend="+5%"
								/>
								<StatCard
									label="Mensagens"
									value={data.unreadRecipients}
									icon={MessageCircle}
									hint="Não lidas"
								/>
							</div>

							{/* Revenue Overview Section - Full Width */}
							<div className="mt-8">
								<RevenueOverview
									monthlyRevenue={data.monthlyRevenue}
									revenueByStatus={data.revenueByStatus}
									totalIncome={data.totalIncome}
								/>
							</div>

							<div className="mt-12 grid gap-8 lg:grid-cols-2">
								<div className="card-solid p-8 group cursor-pointer overflow-hidden relative border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-md">
									<div className="relative z-10">
										<h3 className="text-2xl font-extrabold mb-3 tracking-tight text-zinc-900 dark:text-zinc-50">Atalhos Rápidos</h3>
										<p className="text-sm font-medium text-zinc-500 mb-8 max-w-sm">Gira a sua frota e reservas com ferramentas de alta performance.</p>
										<div className="flex flex-wrap gap-4">
											<button className="btn-primary h-12">
												Nova Reserva
											</button>
											<button className="btn-secondary h-12">
												Adicionar Veículo
											</button>
										</div>
									</div>
								</div>

								<div className="bg-zinc-900 p-8 text-white group cursor-pointer overflow-hidden relative shadow-sm transition-all duration-300 hover:shadow-lg border border-zinc-800 rounded-lg">
									<div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700"></div>

									<div className="relative z-10 flex flex-col h-full justify-between">
										<div>
											<h3 className="text-2xl font-extrabold mb-3 tracking-tight">Estado do Sistema</h3>
											<p className="text-sm font-medium text-zinc-400 mb-8">Todos os sistemas estão operacionais e seguros.</p>
										</div>

										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
												<span>Consultar Logs Detalhados</span>
												<ArrowRight className="w-5 h-5" />
											</div>
											<div className="flex gap-1.5">
												{[1, 2, 3, 4].map(i => (
													<div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					)}
				</div>
			</PageShell>
		</main>
	);
}
