"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, Gauge, Loader2, PauseCircle } from "lucide-react";

import { useAuth } from "@/app/auth/AuthContext";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import type { FleetOccupancy as FleetOccupancyData, VehicleOccupancy } from "@/lib/api/types";

// Ocupação da frota: dias alugados de cada viatura no período, receita
// (proporcional aos dias no período) e há quanto tempo está parada.
// O cálculo está na API (FleetOccupancyService).

const PERIODS = [7, 30, 90] as const;
// A partir de quantos dias parada a viatura fica a vermelho.
const IDLE_ALERT_DAYS = 14;

type SortKey = "occupancy" | "idle" | "revenue";

const formatCurrency = (val: number) =>
	new Intl.NumberFormat("pt-PT", { style: "currency", currency: "CVE", maximumFractionDigits: 0 }).format(val);

const fmtShortDate = (iso: string) =>
	new Date(iso).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit" });

const getImageSrc = (url: string) => (url.startsWith("/uploads") ? `${API_BASE_URL}${url}` : url);

// Parada há mais tempo primeiro; "nunca alugada" conta como a mais parada.
const idleRank = (v: VehicleOccupancy) => (v.rented_now ? -1 : v.idle_days ?? Number.MAX_SAFE_INTEGER);

function StateChip({ v }: { v: VehicleOccupancy }) {
	const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap";
	if (v.status === "MAINTENANCE") return <span className={`${base} bg-zinc-100 text-zinc-600`}>Manutenção</span>;
	if (v.rented_now) return <span className={`${base} bg-green-50 text-green-700`}>Alugada agora</span>;
	if (v.idle_days === null) return <span className={`${base} bg-zinc-100 text-zinc-600`}>Nunca alugada</span>;
	if (v.idle_days === 0) return <span className={`${base} bg-amber-50 text-amber-700`}>Devolvida hoje</span>;
	const alert = v.idle_days >= IDLE_ALERT_DAYS;
	return (
		<span className={`${base} ${alert ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
			Parada há {v.idle_days} {v.idle_days === 1 ? "dia" : "dias"}
		</span>
	);
}

function barColor(percent: number) {
	if (percent >= 60) return "bg-green-500";
	if (percent >= 30) return "bg-amber-500";
	return "bg-red-500";
}

export default function FleetOccupancy() {
	const { authFetch } = useAuth();
	const [days, setDays] = useState<number>(30);
	const [sort, setSort] = useState<SortKey>("occupancy");
	const [data, setData] = useState<FleetOccupancyData | null>(null);
	const [err, setErr] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setErr(null);
		(async () => {
			try {
				const res = await authFetch(endpoints.dashboard.fleetOccupancy(days));
				if (!res.ok) throw new Error(`Erro ao carregar a ocupação da frota (HTTP ${res.status}).`);
				const json = (await res.json()) as FleetOccupancyData;
				if (!cancelled) setData(json);
			} catch (e: any) {
				if (!cancelled) setErr(e?.message || "Erro ao carregar a ocupação da frota.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [days]);

	const rows = useMemo(() => {
		const list = [...(data?.vehicles ?? [])];
		if (sort === "idle") list.sort((a, b) => idleRank(b) - idleRank(a));
		else if (sort === "revenue") list.sort((a, b) => b.revenue - a.revenue);
		else list.sort((a, b) => b.occupancy_percent - a.occupancy_percent);
		return list;
	}, [data, sort]);

	const idleCount = (data?.vehicles ?? []).filter(
		(v) => !v.rented_now && (v.idle_days === null || v.idle_days >= IDLE_ALERT_DAYS),
	).length;

	return (
		<div className="card-solid p-5 md:p-6 border-zinc-200 dark:border-zinc-800">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
				<p className="text-sm font-medium text-zinc-500 m-0">
					Dias alugados de cada viatura, receita e há quanto tempo está parada.
				</p>
				<div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 self-start" role="group" aria-label="Período">
					{PERIODS.map((p) => (
						<button
							key={p}
							type="button"
							onClick={() => setDays(p)}
							aria-pressed={days === p}
							className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${days === p ? "bg-primary text-white" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"}`}
						>
							{p} dias
						</button>
					))}
				</div>
			</div>

			{err ? (
				<p className="text-sm font-semibold text-destructive">{err}</p>
			) : !data ? (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="w-6 h-6 text-primary animate-spin" />
				</div>
			) : (
				<div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
						<div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
							<div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
								<Gauge className="w-3.5 h-3.5" /> Ocupação média
							</div>
							<p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 m-0">{data.occupancy_percent.toLocaleString("pt-PT")}%</p>
						</div>
						<div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
							<div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
								<Car className="w-3.5 h-3.5" /> Receita da frota
							</div>
							<p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 m-0">{formatCurrency(data.revenue)}</p>
						</div>
						<div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
							<div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
								<PauseCircle className="w-3.5 h-3.5" /> Paradas há {IDLE_ALERT_DAYS}+ dias
							</div>
							<p className={`text-2xl font-black m-0 ${idleCount > 0 ? "text-red-600" : "text-zinc-900 dark:text-zinc-50"}`}>
								{idleCount} de {data.vehicles.length}
							</p>
						</div>
					</div>

					<div className="flex items-center justify-end gap-2 mb-3 text-xs text-zinc-500">
						<label htmlFor="fleet-sort">Ordenar por</label>
						<select
							id="fleet-sort"
							value={sort}
							onChange={(e) => setSort(e.target.value as SortKey)}
							className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-transparent px-2 py-1 text-xs font-semibold"
						>
							<option value="occupancy">Ocupação</option>
							<option value="idle">Mais tempo parada</option>
							<option value="revenue">Receita</option>
						</select>
					</div>

					{rows.length === 0 ? (
						<p className="text-sm text-zinc-500 text-center py-8">Sem viaturas na frota.</p>
					) : (
						<div className="overflow-x-auto -mx-5 md:mx-0">
							<table className="w-full min-w-[640px] text-sm">
								<thead>
									<tr className="text-left text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
										<th className="py-2 px-5 md:pl-0 font-bold">Viatura</th>
										<th className="py-2 pr-4 font-bold">Ocupação</th>
										<th className="py-2 pr-4 font-bold text-right">Dias</th>
										<th className="py-2 pr-4 font-bold text-right">Receita</th>
										<th className="py-2 pr-5 md:pr-0 font-bold">Estado</th>
									</tr>
								</thead>
								<tbody>
									{rows.map((v) => (
										<tr key={v.vehicle_id} className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
											<td className="py-3 px-5 md:pl-0">
												<div className="flex items-center gap-3">
													<div className="w-14 h-9 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
														{v.image_url ? (
															<img src={getImageSrc(v.image_url)} alt="" className="w-full h-full object-cover" />
														) : (
															<div className="flex items-center justify-center h-full">
																<Car className="w-4 h-4 text-zinc-300" />
															</div>
														)}
													</div>
													<div className="min-w-0">
														<p className="font-semibold text-zinc-900 dark:text-zinc-50 m-0 truncate">{v.name || `#${v.vehicle_id}`}</p>
														{v.license_plate && <p className="text-xs text-zinc-500 m-0">{v.license_plate}</p>}
													</div>
												</div>
											</td>
											<td className="py-3 pr-4">
												<div className="flex items-center gap-2">
													<div className="h-2 w-28 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
														<div className={`h-full rounded-full ${barColor(v.occupancy_percent)}`} style={{ width: `${Math.min(v.occupancy_percent, 100)}%` }} />
													</div>
													<span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">{v.occupancy_percent.toLocaleString("pt-PT")}%</span>
												</div>
											</td>
											<td className="py-3 pr-4 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
												{v.rented_days.toLocaleString("pt-PT")} / {data.days}
											</td>
											<td className="py-3 pr-4 text-right tabular-nums font-semibold text-zinc-900 dark:text-zinc-50">
												{formatCurrency(v.revenue)}
											</td>
											<td className="py-3 pr-5 md:pr-0">
												<div className="flex flex-col items-start gap-1">
													<StateChip v={v} />
													{v.next_start_at && !v.rented_now && (
														<span className="text-[11px] text-zinc-500">Próxima: {fmtShortDate(v.next_start_at)}</span>
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
					<p className="mt-4 text-[11px] text-zinc-400 m-0">
						Contam as reservas aprovadas, pagas, levantadas e devolvidas (não as por pagar nem as canceladas). A receita é a das reservas pagas, proporcional aos dias que caem no período.
					</p>
				</div>
			)}
		</div>
	);
}
