"use client";

import { useEffect, useState } from "react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
// import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { MessageRow } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

export default function MessagesPage() {
	const [rows, setRows] = useState<MessageRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			setLoading(true);
			setErr(null);
			// try {
			// 	// const data = await apiFetch<MessageRow[]>(endpoints.messages.list(100));
			// 	setRows(
			// 		data.map((m) => ({
			// 			...m,
			// 			created_at: fmtDateTime(m.created_at),
			// 		}))
			// 	);
			// } catch (e: any) {
			// 	setErr(e?.message || "Erro ao carregar mensagens.");
			// } finally {
			// 	setLoading(false);
			// }
		})();
	}, []);

	return (
		<div>
			<TopNav title="Mensagens" subtitle="Sistema/Admin → Utilizadores" />
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
							{ key: "sender_type", label: "Remetente" },
							{ key: "sender_name", label: "Nome remetente" },
							{ key: "subject", label: "Assunto" },
							{ key: "delivery", label: "Canal" },
							{ key: "recipients", label: "Destinatários" },
							{ key: "created_at", label: "Criado em" },
						]}
						rows={rows as any}
					/>
				)}
			</PageShell>
		</div>
	);
}
