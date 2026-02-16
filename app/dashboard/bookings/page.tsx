"use client";

import { useEffect, useMemo, useState } from "react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import { CalendarCheck, Loader2, Plus, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { BookingRow } from "@/lib/api/types";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";
import BookingDialog from "./_components/booking-dialog";
import BookingForm from "./_components/booking-form";

export default function BookingsPage() {
	const [rows, setRows] = useState<BookingRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);

	// Dialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const viewRows = useMemo(
		() =>
			rows.map((b) => ({
				...b,
				start_at: fmtDateTime(b.start_at),
				end_at: fmtDateTime(b.end_at),
				grand_total: (
					<span className="font-bold text-gray-900">
						{fmtMoney(b.grand_total, "CVE")}
					</span>
				),
				created_at: fmtDateTime(b.created_at),
				status: (
					<span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm border ${getStatusStyles(b.status)}`}>
						{b.status}
					</span>
				),
				actions: (
					<div className="flex justify-end gap-3 items-center">
						<select
							className="text-[10px] font-bold uppercase tracking-tight border rounded px-2 py-1 bg-white hover:border-primary transition-colors cursor-pointer outline-none"
							value={b.status}
							onChange={(e) => handleStatusChange(b.id, e.target.value)}
						>
							<option value="PENDENTE">Mudar para Pendente</option>
							<option value="CONFIRMADA">Confirmar Reserva</option>
							<option value="EM_CURSO">Em Curso</option>
							<option value="CONCLUÍDA">Concluir</option>
							<option value="CANCELADA">Cancelar</option>
						</select>
						<button
							onClick={() => handleDelete(b.id)}
							className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
							title="Eliminar"
						>
							<Trash2 size={16} />
						</button>
					</div>
				)
			})),
		[rows],
	);

	function getStatusStyles(status: string) {
		switch (status) {
			case "PENDENTE": return "bg-amber-50 text-amber-600 border-amber-200/50";
			case "CONFIRMADA": return "bg-blue-50 text-blue-600 border-blue-200/50";
			case "EM_CURSO": return "bg-indigo-50 text-indigo-600 border-indigo-200/50";
			case "CONCLUÍDA": return "bg-emerald-50 text-emerald-600 border-emerald-200/50";
			case "CANCELADA": return "bg-red-50 text-red-600 border-red-200/50";
			default: return "bg-gray-50 text-gray-600 border-gray-200/50";
		}
	}

	async function fetchBookings() {
		setLoading(true);
		setErr(null);
		try {
			const data = await apiFetch<BookingRow[]>(endpoints.bookings.list(100));
			setRows(data);
		} catch (e: any) {
			setErr(e?.message || "Erro ao carregar reservas.");
		} finally {
			setLoading(false);
		}
	}

	async function handleStatusChange(id: number, newStatus: string) {
		try {
			await apiFetch(endpoints.bookings.updateStatus(id), {
				method: "PUT",
				body: JSON.stringify({ status: newStatus }),
			});
			setRows(prev => prev.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
		} catch (e: any) {
			alert("Falha ao atualizar estado: " + e.message);
		}
	}

	async function handleDelete(id: number) {
		if (!window.confirm("Tem a certeza que deseja eliminar esta reserva?")) return;
		try {
			await apiFetch(endpoints.bookings.delete(id), { method: "DELETE" });
			setRows(prev => prev.filter(r => r.id !== id));
		} catch (e: any) {
			alert("Falha ao eliminar reserva: " + e.message);
		}
	}

	async function handleCreateBooking(bookingData: any) {
		setIsSubmitting(true);
		try {
			const created = await apiFetch<BookingRow>(endpoints.bookings.create, {
				method: "POST",
				body: JSON.stringify(bookingData),
			});
			setRows(prev => [created, ...prev]);
			setIsDialogOpen(false);
		} catch (e: any) {
			throw e;
		} finally {
			setIsSubmitting(false);
		}
	}

	useEffect(() => {
		fetchBookings();
	}, []);

	return (
		<div>
			<TopNav
				title="Reservas"
				subtitle="Gestão de alugueres e estados"
				right={
					<button
						onClick={() => setIsDialogOpen(true)}
						className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
					>
						<Plus size={16} />
						<span>Novo Aluguer</span>
					</button>
				}
			/>
			<PageShell>
				<div className="max-w-7xl mx-auto">
					{loading && (
						<div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white border border-zinc-200">
							<Loader2 className="w-10 h-10 text-primary animate-spin" />
							<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sincronizando Reservas...</p>
						</div>
					)}

					{err && !loading && (
						<div className="flex flex-col h-[60vh] items-center justify-center gap-8 bg-white border border-zinc-200">
							<div className="text-center max-w-lg px-6">
								<h2 className="text-xl font-extrabold text-destructive mb-3 uppercase tracking-tight">Erro de Sistema</h2>
								<p className="text-sm font-medium text-zinc-600 mb-8 leading-relaxed">{err}</p>
								<button onClick={fetchBookings} className="btn-primary px-10">Tentar Novamente</button>
							</div>
						</div>
					)}

					{!loading && !err && (
						<DataTable
							columns={[
								{ key: "customer_name", label: "Cliente" },
								{ key: "vehicle_title", label: "Veículo" },
								{ key: "status", label: "Estado" },
								{ key: "start_at", label: "Levantamento" },
								{ key: "end_at", label: "Entrega" },
								{ key: "grand_total", label: "Total" },
								{ key: "actions", label: "Ações" },
							]}
							rows={viewRows as any}
						/>
					)}
				</div>
			</PageShell>

			<BookingDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				title="Nova Reserva de Veículo"
			>
				<BookingForm
					onSubmit={handleCreateBooking}
					onCancel={() => setIsDialogOpen(false)}
					isSubmitting={isSubmitting}
				/>
			</BookingDialog>
		</div>
	);
}
