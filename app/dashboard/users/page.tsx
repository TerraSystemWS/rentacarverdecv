"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
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

	async function fetchUsers() {
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
	}

	useEffect(() => {
		fetchUsers();
	}, []);

	if (loading) {
		return (
			<PageShell>
				<div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
					<Users className="w-10 h-10 text-primary animate-pulse" />
					<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listando Utilizadores...</p>
				</div>
			</PageShell>
		);
	}

	if (err) {
		return (
			<PageShell>
				<div className="flex flex-col h-[60vh] items-center justify-center gap-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
					<div className="text-center max-w-lg px-6">
						<h2 className="text-xl font-extrabold text-destructive mb-3 uppercase tracking-tight">Falha na Base de Dados</h2>
						<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed truncate">{err}</p>
						<button onClick={fetchUsers} className="btn-primary px-10">Tentar Novamente</button>
					</div>
				</div>
			</PageShell>
		);
	}

	return (
		<div>
			<TopNav title="Utilizadores" subtitle="Clientes registados" />
			<PageShell>
				<div className="max-w-7xl mx-auto">
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
				</div>
			</PageShell>
		</div>
	);
}
