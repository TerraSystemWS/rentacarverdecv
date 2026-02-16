"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
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

	async function fetchRecipients() {
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
	}

	useEffect(() => {
		fetchRecipients();
	}, []);

	if (loading) {
		return (
			<PageShell>
				<div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
					<MessageSquare className="w-10 h-10 text-primary animate-pulse" />
					<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Abrindo Mensagens...</p>
				</div>
			</PageShell>
		);
	}

	if (err) {
		return (
			<PageShell>
				<div className="flex flex-col h-[60vh] items-center justify-center gap-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
					<div className="text-center max-w-lg px-6">
						<h2 className="text-xl font-extrabold text-destructive mb-3 uppercase tracking-tight">Erro de Comunicação</h2>
						<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed truncate">{err}</p>
						<button onClick={fetchRecipients} className="btn-primary px-10">Tentar Novamente</button>
					</div>
				</div>
			</PageShell>
		);
	}

	return (
		<div>
			<TopNav title="Mensagens" subtitle="Sistema/Admin → Utilizadores" />
			<PageShell>
				<div className="max-w-7xl mx-auto">
					<DataTable
						columns={[
							{ key: "id", label: "ID" },
							{ key: "sender_type", label: "Remetente" },
							{ key: "sender_name", label: "Nome" },
							{ key: "subject", label: "Assunto" },
							{ key: "delivery", label: "Canal" },
							{ key: "recipients", label: "Destinatários" },
							{ key: "created_at", label: "Criado em" },
						]}
						rows={rows as any}
					/>
				</div>
			</PageShell>
		</div>
	);
}
