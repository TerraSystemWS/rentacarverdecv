"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { Subscriber } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

export default function SubscribersPage() {
	const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
	const [loading, setLoading] = useState(true);

	async function load() {
		setLoading(true);
		try {
			setSubscribers(await apiFetch<Subscriber[]>(endpoints.subscribers.list));
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao carregar subscritores.", confirmButtonColor: "#3085d6" });
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	const handleDelete = async (id: number) => {
		const result = await Swal.fire({
			title: "Remover subscritor?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sim, remover",
			cancelButtonText: "Cancelar",
		});
		if (!result.isConfirmed) return;
		try {
			await apiFetch(endpoints.subscribers.delete(id), { method: "DELETE" });
			setSubscribers((prev) => prev.filter((s) => s.id !== id));
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao remover.", confirmButtonColor: "#3085d6" });
		}
	};

	if (loading) {
		return (
			<div>
				<TopNav title="Subscritores" subtitle="Newsletter" />
				<PageShell>
					<div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
						<Mail className="w-10 h-10 text-primary animate-pulse" />
						<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listando Subscritores...</p>
					</div>
				</PageShell>
			</div>
		);
	}

	return (
		<div>
			<TopNav title="Subscritores" subtitle={`${subscribers.length} subscritores da newsletter`} />
			<PageShell>
				<div className="max-w-7xl mx-auto space-y-10">
					<DataTable
						columns={[
							{ key: "email", label: "Email" },
							{ key: "createdAt", label: "Subscrito em", render: (row: Subscriber) => fmtDateTime(row.createdAt) },
							{
								key: "actions",
								label: "Ações",
								render: (row: Subscriber) => (
									<div className="flex justify-end gap-2">
										<button
											onClick={() => handleDelete(row.id)}
											className="p-2 hover:bg-red-50 rounded-lg text-zinc-500 hover:text-red-600 transition-colors"
											title="Remover"
										>
											<Trash2 size={18} />
										</button>
									</div>
								),
							},
						]}
						rows={subscribers as any}
					/>
				</div>
			</PageShell>
		</div>
	);
}
