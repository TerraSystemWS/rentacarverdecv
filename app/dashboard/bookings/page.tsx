"use client";

import { useEffect, useMemo, useState } from "react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import { CalendarCheck, Loader2, Plus, Trash2, Lock, Ban, KeyRound, CheckCircle2, Paperclip } from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api/client";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import type { BookingRow } from "@/lib/api/types";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";
import BookingDialog from "./_components/booking-dialog";
import BookingForm from "./_components/booking-form";

export default function BookingsPage() {
	const [rows, setRows] = useState<BookingRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);
	// Reservas CONCLUÍDAS (pagas, levantadas e devolvidas) saem da lista ativa
	// e ficam numa aba própria, normalmente oculta — já não podem ser editadas
	// nem apagadas (o backend bloqueia com 409, ver DashboardController).
	const [tab, setTab] = useState<"active" | "completed">("active");

	// Dialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const viewRows = useMemo(
		() =>
			rows.map((b) => ({
				...b,
				customer_name: (
					<div className="flex items-center gap-2">
						<span>{b.customer_name}</span>
						{b.has_extra_driver && (
							<span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap" title="Com Condutor Extra">
								+ Condutor
							</span>
						)}
					</div>
				),
				start_at: fmtDateTime(b.start_at),
				end_at: fmtDateTime(b.end_at),
				picked_up_at: b.picked_up_at ? fmtDateTime(b.picked_up_at) : <span className="text-zinc-300">—</span>,
				returned_at: b.returned_at ? fmtDateTime(b.returned_at) : <span className="text-zinc-300">—</span>,
				grand_total: (
					<span className="font-bold text-gray-900">
						{fmtMoney(b.grand_total, "CVE")}
					</span>
				),
				created_at: fmtDateTime(b.created_at),
				license_photo: b.has_license_photo ? (
					<button
						onClick={() => handleViewLicensePhoto(b.id)}
						className="flex items-center gap-1.5 text-green-700 hover:text-green-800 hover:underline text-[10px] font-bold uppercase tracking-tight"
						title="Ver foto da carta de condução do cliente"
					>
						<Paperclip size={13} />
						Carta
					</button>
				) : (
					<span className="text-zinc-300">—</span>
				),
				status: (
					<span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm border ${getStatusStyles(b.status)}`}>
						{b.status}
					</span>
				),
				payment_status: (
					<div className="flex items-center gap-2">
						<span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight shadow-sm border ${getPaymentStatusStyles(b.payment_status)}`}>
							{({ SUCCESS: "PAGO", FAILED: "FALHOU", CANCELLED: "CANCELADO", PENDING: "PENDENTE" } as Record<string, string>)[b.payment_status || "PENDING"] ?? b.payment_status}
						</span>
						{b.merchant_ref && (
							<span className="text-[8px] text-zinc-400 font-mono" title={`Ref: ${b.merchant_ref}`}>
								#{b.merchant_ref.slice(-4)}
							</span>
						)}
					</div>
				),
				actions: renderActions(b),
			})),
		[rows],
	);

	// Fluxo: Pendente/Aprovada/Paga ficam livres entre si (dropdown) + Cancelar.
	// A partir de Paga só progride passo a passo: "Pegou" (Em Curso) e depois
	// "Devolveu" (Concluída — sai da lista ativa). Concluída/Cancelada ficam
	// bloqueadas (o backend recusa qualquer edição a partir daí com 409).
	function renderActions(b: BookingRow) {
		if (b.status === "CONCLUÍDA") {
			return (
				<div className="flex justify-end items-center gap-1.5 text-zinc-400" title="Reserva concluída — já não pode ser alterada">
					<Lock size={14} />
					<span className="text-[10px] font-bold uppercase tracking-tight">Bloqueada</span>
				</div>
			);
		}
		if (b.status === "CANCELADA") {
			return (
				<div className="flex justify-end items-center gap-1.5 text-zinc-400" title="Reserva cancelada">
					<Ban size={14} />
					<span className="text-[10px] font-bold uppercase tracking-tight">Cancelada</span>
				</div>
			);
		}
		if (b.status === "PAGA") {
			return (
				<div className="flex justify-end">
					<button
						onClick={() => handleStatusChange(b.id, "EM_CURSO")}
						className="flex items-center gap-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors"
						title="Marcar como levantada pelo cliente"
					>
						<KeyRound size={13} />
						Pegou
					</button>
				</div>
			);
		}
		if (b.status === "EM_CURSO") {
			return (
				<div className="flex justify-end">
					<button
						onClick={() => handleStatusChange(b.id, "CONCLUÍDA")}
						className="flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors"
						title="Marcar como devolvida pelo cliente — conclui a reserva"
					>
						<CheckCircle2 size={13} />
						Devolveu
					</button>
				</div>
			);
		}
		// PENDENTE / APROVADA — ainda editável livremente.
		return (
			<div className="flex justify-end gap-2 items-center">
				<select
					className="text-[10px] font-bold uppercase tracking-tight border rounded px-2 py-1 bg-white hover:border-primary transition-colors cursor-pointer outline-none"
					value={b.status}
					onChange={(e) => handleStatusChange(b.id, e.target.value)}
				>
					<option value="PENDENTE">Pendente</option>
					<option value="APROVADA">Aprovada</option>
					<option value="PAGA">Paga</option>
				</select>
				<button
					onClick={() => handleCancel(b.id)}
					className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
					title="Cancelar reserva"
				>
					<Ban size={16} />
				</button>
				<button
					onClick={() => handleDelete(b.id)}
					className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
					title="Eliminar"
				>
					<Trash2 size={16} />
				</button>
			</div>
		);
	}

	function getStatusStyles(status: string) {
		switch (status) {
			case "PENDENTE": return "bg-amber-50 text-amber-600 border-amber-200/50";
			case "APROVADA": return "bg-blue-50 text-blue-600 border-blue-200/50";
			case "PAGA": return "bg-violet-50 text-violet-600 border-violet-200/50";
			case "EM_CURSO": return "bg-indigo-50 text-indigo-600 border-indigo-200/50";
			case "CONCLUÍDA": return "bg-emerald-50 text-emerald-600 border-emerald-200/50";
			case "CANCELADA": return "bg-red-50 text-red-600 border-red-200/50";
			default: return "bg-gray-50 text-gray-600 border-gray-200/50";
		}
	}

	function getPaymentStatusStyles(status?: string) {
		switch (status) {
			case "SUCCESS": return "bg-green-50 text-green-700 border-green-200";
			case "FAILED": return "bg-red-50 text-red-700 border-red-200";
			case "CANCELLED": return "bg-amber-50 text-amber-700 border-amber-200";
			case "PENDING":
			default: return "bg-zinc-50 text-zinc-500 border-zinc-200";
		}
	}

	// Foto da carta de condução do cliente, anexada ao perfil dele (não a
	// esta reserva) — mesmo padrão da fatura em blob: URL, porque o endpoint
	// exige o header Authorization, que <img>/<a href> normais não enviam.
	async function handleViewLicensePhoto(bookingId: number) {
		try {
			const res = await authFetch(endpoints.bookings.licensePhoto(bookingId));
			if (!res.ok) throw new Error();
			const blob = await res.blob();
			window.open(URL.createObjectURL(blob), "_blank");
		} catch {
			Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível abrir a foto da carta.", confirmButtonColor: "#3085d6" });
		}
	}

	async function fetchBookings(activeTab: "active" | "completed" = tab) {
		setLoading(true);
		setErr(null);
		try {
			const data = await apiFetch<BookingRow[]>(
				activeTab === "completed" ? endpoints.bookings.completed : endpoints.bookings.list(100)
			);
			setRows(data);
		} catch (e: any) {
			setErr(e?.message || "Erro ao carregar reservas.");
		} finally {
			setLoading(false);
		}
	}

	async function handleStatusChange(id: number, newStatus: string) {
		try {
			const updated = await apiFetch<BookingRow>(endpoints.bookings.updateStatus(id), {
				method: "PUT",
				body: JSON.stringify({ status: newStatus }),
			});
			if (newStatus === "CONCLUÍDA") {
				// Sai da lista ativa assim que é concluída — passa a viver só na
				// aba "Concluídas" (normalmente oculta).
				setRows(prev => prev.filter(r => r.id !== id));
			} else {
				// Usa a resposta completa do backend (não só o estado) para
				// picked_up_at/returned_at aparecerem de imediato na lista.
				setRows(prev => prev.map(r => r.id === id ? updated : r));
			}
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: "Falha ao atualizar estado: " + e.message, confirmButtonColor: "#3085d6" });
		}
	}

	async function handleCancel(id: number) {
		const result = await Swal.fire({
			title: "Cancelar reserva?",
			text: "O cliente será notificado e o voucher (se usado) é reposto.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sim, cancelar",
			cancelButtonText: "Voltar",
		});
		if (!result.isConfirmed) return;
		handleStatusChange(id, "CANCELADA");
	}

	async function handleDelete(id: number) {
		const result = await Swal.fire({
			title: "Tem a certeza?",
			text: "Deseja mesmo eliminar esta reserva?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sim, eliminar!",
			cancelButtonText: "Cancelar"
		});
		if (!result.isConfirmed) return;
		try {
			await apiFetch(endpoints.bookings.delete(id), { method: "DELETE" });
			setRows(prev => prev.filter(r => r.id !== id));
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: "Falha ao eliminar reserva: " + e.message, confirmButtonColor: "#3085d6" });
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
		fetchBookings(tab);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tab]);

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
				<div className="max-w-7xl mx-auto space-y-10">
					<div className="flex gap-2">
						<button
							onClick={() => setTab("active")}
							className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-tight transition-colors ${tab === "active" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}
						>
							Ativas
						</button>
						<button
							onClick={() => setTab("completed")}
							className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-tight transition-colors flex items-center gap-1.5 ${tab === "completed" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}
						>
							<Lock size={12} />
							Concluídas
						</button>
					</div>

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
								<button onClick={() => fetchBookings()} className="btn-primary px-10">Tentar Novamente</button>
							</div>
						</div>
					)}

					{!loading && !err && (
						<DataTable
							columns={[
								{ key: "customer_name", label: "Cliente" },
								{ key: "vehicle_title", label: "Veículo" },
								{ key: "status", label: "Estado" },
								{ key: "payment_status", label: "Pagamento" },
								{ key: "start_at", label: "Levantamento" },
								{ key: "end_at", label: "Entrega" },
								{ key: "picked_up_at", label: "Levantado em" },
								{ key: "returned_at", label: "Devolvido em" },
								{ key: "grand_total", label: "Total" },
								{ key: "license_photo", label: "Anexo" },
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
