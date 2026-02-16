"use client";

import { useEffect, useMemo, useState } from "react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import { CalendarCheck, Loader2 } from "lucide-react";
// import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { BookingRow } from "@/lib/api/types";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";

export default function BookingsPage() {
	const [rows, setRows] = useState<BookingRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);

	const viewRows = useMemo(
		() =>
			rows.map((b) => ({
				...b,
				start_at: fmtDateTime(b.start_at),
				end_at: fmtDateTime(b.end_at),
				grand_total: fmtMoney(b.grand_total, b.currency),
				created_at: fmtDateTime(b.created_at),
			})),
		[rows],
	);

	async function fetchBookings() {
		setLoading(true);
		setErr(null);
		try {
			// const data = await apiFetch<BookingRow[]>(endpoints.bookings.list(100));
			// setRows(data);
		} catch (e: any) {
			setErr(e?.message || "Erro ao carregar reservas.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchBookings();
	}, []);

	return (
		<div>
			<TopNav title="Reservas" subtitle="Reservas e estado atual" />
			<PageShell>
				<div className="max-w-7xl mx-auto">
					{loading && (
						<div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
							<Loader2 className="w-10 h-10 text-primary animate-spin" />
							<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sincronizando Reservas...</p>
						</div>
					)}

					{err && !loading && (
						<div className="flex flex-col h-[60vh] items-center justify-center gap-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
							<div className="text-center max-w-lg px-6">
								<h2 className="text-xl font-extrabold text-destructive mb-3 uppercase tracking-tight">Erro de Sistema</h2>
								<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed truncate">{err}</p>
								<button onClick={fetchBookings} className="btn-primary px-10">Tentar Novamente</button>
							</div>
						</div>
					)}

					{!loading && !err && (
						<DataTable
							columns={[
								{ key: "id", label: "ID" },
								{ key: "customer_name", label: "Cliente" },
								{ key: "vehicle_title", label: "Veículo" },
								{ key: "status", label: "Estado" },
								{ key: "start_at", label: "Início" },
								{ key: "end_at", label: "Fim" },
								{ key: "grand_total", label: "Total" },
								{ key: "currency", label: "Moeda" },
							]}
							rows={viewRows as any}
						/>
					)}
				</div>
			</PageShell>
		</div>
	);
}
