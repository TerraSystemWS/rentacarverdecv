"use client";

import { useEffect, useMemo, useState } from "react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
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

	useEffect(() => {
		(async () => {
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
		})();
	}, []);

	return (
		<div>
			<TopNav title="Reservas" subtitle="Reservas e estado atual" />
			<PageShell>
				{loading ? (
					<div className="rounded-xl border bg-white p-4 text-sm text-gray-600">
						A carregar...
					</div>
				) : err ? (
					<div className="rounded-xl border bg-white p-4 text-sm text-red-600">
						{err}
					</div>
				) : (
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
			</PageShell>
		</div>
	);
}
