"use client";

import { useEffect, useState } from "react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { UserRow } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

export default function UsersPage() {
	const [rows, setRows] = useState<UserRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			setLoading(true);
			setErr(null);
			try {
				const data = await apiFetch<UserRow[]>(endpoints.users.list(100));
				setRows(
					data.map((u) => ({
						...u,
						created_at: fmtDateTime(u.created_at),
					}))
				);
			} catch (e: any) {
				setErr(e?.message || "Erro ao carregar utilizadores.");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div>
			<TopNav title="Utilizadores" subtitle="Clientes registados" />
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
							{ key: "full_name", label: "Nome" },
							{ key: "email", label: "Email" },
							{ key: "phone", label: "Telefone" },
							{ key: "is_active", label: "Ativo" },
							{ key: "created_at", label: "Criado em" },
						]}
						rows={rows as any}
					/>
				)}
			</PageShell>
		</div>
	);
}
