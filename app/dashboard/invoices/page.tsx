"use client";

import { useEffect, useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import { apiFetch } from "@/lib/api/client";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import { Invoice } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

export default function InvoicesPage() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");

	async function load() {
		setLoading(true);
		try {
			setInvoices(await apiFetch<Invoice[]>(endpoints.invoices.list));
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao carregar faturas.", confirmButtonColor: "#3085d6" });
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return invoices;
		return invoices.filter(
			(inv) =>
				inv.documentNumber.toLowerCase().includes(q) ||
				inv.customerName.toLowerCase().includes(q) ||
				(inv.customerNif ?? "").toLowerCase().includes(q)
		);
	}, [invoices, query]);

	async function handleOpenPdf(invoice: Invoice) {
		try {
			const res = await authFetch(endpoints.invoices.pdf(invoice.id));
			if (!res.ok) throw new Error("Não foi possível abrir a fatura.");
			const blob = await res.blob();
			window.open(URL.createObjectURL(blob), "_blank");
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao abrir a fatura.", confirmButtonColor: "#3085d6" });
		}
	}

	if (loading) {
		return (
			<div>
				<TopNav title="Faturação" subtitle="Faturas-recibo emitidas" />
				<PageShell>
					<div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
						<Receipt className="w-10 h-10 text-primary animate-pulse" />
						<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listando Faturas...</p>
					</div>
				</PageShell>
			</div>
		);
	}

	return (
		<div>
			<TopNav title="Faturação" subtitle="Faturas-recibo emitidas automaticamente quando uma reserva é confirmada" />
			<PageShell>
				<div className="max-w-7xl mx-auto space-y-6">
					<input
						className="w-full max-w-md rounded-lg border border-zinc-200 px-3 py-2 text-sm"
						placeholder="Pesquisar por número, cliente ou NIF..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<DataTable
						columns={[
							{ key: "documentNumber", label: "Nº" },
							{ key: "vehicleTitle", label: "Viatura" },
							{
								key: "customerName",
								label: "Cliente",
								render: (row: Invoice) => (
									<div>
										<div>{row.customerName}</div>
										<div className="text-xs text-zinc-400">{row.customerEmail ?? "—"}</div>
									</div>
								),
							},
							{ key: "customerNif", label: "NIF", render: (row: Invoice) => row.customerNif ?? <span className="italic text-zinc-400">Consumidor Final</span> },
							{
								key: "subtotal",
								label: "Subtotal",
								render: (row: Invoice) => row.subtotal ? `${Number(row.subtotal).toLocaleString("pt-PT", { minimumFractionDigits: 2 })} CVE` : "—",
							},
							{
								key: "ivaAmount",
								label: "IVA",
								render: (row: Invoice) => row.ivaAmount ? `${Number(row.ivaAmount).toLocaleString("pt-PT", { minimumFractionDigits: 2 })} CVE (${row.ivaRate ? Number(row.ivaRate) : "—"}%)` : "—",
							},
							{ key: "totalAmount", label: "Total", render: (row: Invoice) => `${Number(row.totalAmount).toLocaleString("pt-PT", { minimumFractionDigits: 2 })} CVE` },
							{ key: "createdAt", label: "Data", render: (row: Invoice) => fmtDateTime(row.createdAt) },
							{
								key: "actions",
								label: "Ações",
								render: (row: Invoice) => (
									<button onClick={() => handleOpenPdf(row)} className="text-primary hover:underline text-sm font-bold">
										Ver PDF
									</button>
								),
							},
						]}
						rows={filtered as any}
					/>
					{filtered.length === 0 && (
						<p className="text-center text-sm text-zinc-400 py-6">Sem faturas.</p>
					)}
				</div>
			</PageShell>
		</div>
	);
}
