"use client";

import { useEffect, useState } from "react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { VehicleRow } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

export default function VehiclesPage() {
	const [rows, setRows] = useState<VehicleRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			setLoading(true);
			setErr(null);
			try {
				const data = await apiFetch<VehicleRow[]>(endpoints.vehicles.list(100));
				setRows(
					data.map((v) => ({
						...v,
						created_at: fmtDateTime(v.created_at),
					}))
				);
			} catch (e: any) {
				setErr(e?.message || "Erro ao carregar veículos.");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div>
			<TopNav title="Veículos" subtitle="Lista de carros cadastrados" />
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
							{ key: "title", label: "Título" },
							{ key: "rent_per_day", label: "Preço/dia" },
							{ key: "rent_currency", label: "Moeda" },
							{ key: "created_at", label: "Criado em" },
						]}
						rows={rows as any}
					/>
				)}
			</PageShell>
		</div>
	);
}
