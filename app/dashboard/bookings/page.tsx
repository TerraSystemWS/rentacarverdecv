"use client";

import { useEffect, useMemo, useState } from "react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import { CalendarCheck, Loader2, Plus, Trash2, Lock, Ban, KeyRound, CheckCircle2, Paperclip, SearchCheck } from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api/client";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import type { BookingRow } from "@/lib/api/types";
import { useAuth } from "@/app/auth/AuthContext";
import { can } from "@/lib/auth/staffLevel";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";
import BookingDialog from "./_components/booking-dialog";
import BookingForm from "./_components/booking-form";

const escapeHtml = (v?: string | null) =>
	(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Dia (dd/mm/aaaa) em hora de Cabo Verde, como a regra da API.
const fmtDay = (iso?: string | null) =>
	iso ? new Date(iso).toLocaleDateString("pt-PT", { timeZone: "Atlantic/Cape_Verde" }) : "—";

/** Atraso em horas e minutos: "5h20", "1d 3h05". */
function fmtLate(minutes: number): string {
	const d = Math.floor(minutes / 1440), h = Math.floor((minutes % 1440) / 60), m = minutes % 60;
	const hm = `${h}h${String(m).padStart(2, "0")}`;
	return d > 0 ? `${d}d ${hm}` : hm;
}

export default function BookingsPage() {
	// Apagar reservas: só com "bookings.delete" (a API recusa; o botão nem aparece).
	const isAgent = !can(useAuth().user, "bookings.delete");
	const [rows, setRows] = useState<BookingRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);
	// Reservas CONCLUÍDAS (pagas, levantadas e devolvidas) saem da lista ativa
	// e ficam numa aba própria, normalmente oculta — já não podem ser editadas
	// nem apagadas (o backend bloqueia com 409, ver DashboardController).
	// CANCELADAS também saem de "Ativas" para a sua própria aba.
	type Tab = "active" | "completed" | "cancelled";
	const [tab, setTab] = useState<Tab>("active");

	// Dialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Atalho "Nova Reserva" da página inicial do painel: /dashboard/bookings?novo=1 abre logo o formulário.
	useEffect(() => {
		if (new URLSearchParams(window.location.search).get("novo") === "1") {
			setIsDialogOpen(true);
			window.history.replaceState(null, "", window.location.pathname);
		}
	}, []);

	const viewRows = useMemo(
		() =>
			rows.map((b) => ({
				...b,
				customer_name: (
					<div className="flex items-center gap-2">
						<span>{b.customer_name}</span>
						{b.extends_booking_id && b.charge_type === "LATE_FEE" ? (
							<span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap" title="Cobrança do atraso na devolução, recebida no balcão">
								Atraso de #{b.extends_booking_id}
							</span>
						) : b.extends_booking_id && (
							<span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap" title="Extensão de aluguer: dias extra pagos à parte">
								Extensão de #{b.extends_booking_id}
							</span>
						)}
						{b.has_extra_driver && (
							<span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase whitespace-nowrap" title="Com Condutor Extra">
								+ Condutor
							</span>
						)}
					</div>
				),
				start_at: fmtDateTime(b.start_at),
				end_at: b.status === "EM_CURSO" && (b.late_minutes ?? 0) > 0 ? (
					<div className="flex flex-col">
						<span>{fmtDateTime(b.rental_end_at || b.end_at)}</span>
						<span className="font-bold text-red-700" title="Atraso na devolução: períodos de 24 h, 2 h de tolerância">
							Atraso {fmtLate(b.late_minutes ?? 0)}{(b.late_fee ?? 0) > 0 ? ` · cobrar ${fmtMoney(b.late_fee ?? 0, "CVE")}` : ""}
						</span>
					</div>
				) : b.rental_end_at && b.rental_end_at !== b.end_at ? (
					<div className="flex flex-col">
						<span className="line-through text-zinc-400">{fmtDateTime(b.end_at)}</span>
						<span className="font-bold text-green-700" title="Fim do aluguer com as extensões">
							{fmtDateTime(b.rental_end_at)} <span className="text-[9px] uppercase">estendida</span>
						</span>
					</div>
				) : (
					fmtDateTime(b.end_at)
				),
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
		if (b.extends_booking_id && (b.status === "PAGA" || b.status === "EM_CURSO")) {
			// Extensão de aluguer: levanta e devolve com a reserva original.
			return (
				<div className="flex justify-end items-center gap-1.5 text-zinc-400" title="Pegou/Devolveu marcam-se na reserva original">
					<KeyRound size={13} />
					<span className="text-[10px] font-bold uppercase tracking-tight">Segue a #{b.extends_booking_id}</span>
				</div>
			);
		}
		if (b.status === "PAGA") {
			// "Pegou" só aparece a partir do dia reservado (can_pick_up vem da API).
			if (!b.can_pick_up) {
				return (
					<div className="flex justify-end items-center gap-1.5 text-zinc-400" title="A viatura só pode ser levantada a partir do dia reservado">
						<KeyRound size={13} />
						<span className="text-[10px] font-bold uppercase tracking-tight">
							Levanta a {fmtDay(b.pickup_from || b.start_at)}
						</span>
					</div>
				);
			}
			return (
				<div className="flex justify-end">
					<button
						onClick={() => handlePickupReturn(b, "EM_CURSO")}
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
			// "Devolveu" só depois de levantada (can_return vem da API).
			if (!b.can_return) {
				return (
					<div className="flex justify-end items-center gap-1.5 text-zinc-400" title="Só pode ser devolvida depois de levantada">
						<Lock size={14} />
						<span className="text-[10px] font-bold uppercase tracking-tight">Sem levantamento</span>
					</div>
				);
			}
			return (
				<div className="flex justify-end">
					<button
						onClick={() => handlePickupReturn(b, "CONCLUÍDA")}
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
				{b.payment_status !== "SUCCESS" && (
					<button
						onClick={() => handleCheckPayment(b.id)}
						className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
						title="Verificar pagamento na SISP"
					>
						<SearchCheck size={16} />
					</button>
				)}
				<button
					onClick={() => handleCancel(b.id)}
					className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
					title="Cancelar reserva"
				>
					<Ban size={16} />
				</button>
				{!isAgent && (
					<button
						onClick={() => handleDelete(b.id)}
						className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
						title="Eliminar"
					>
						<Trash2 size={16} />
					</button>
				)}
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

	async function fetchBookings(activeTab: Tab = tab) {
		setLoading(true);
		setErr(null);
		try {
			const data = await apiFetch<BookingRow[]>(
				activeTab === "completed" ? endpoints.bookings.completed
					: activeTab === "cancelled" ? endpoints.bookings.cancelled
					: endpoints.bookings.list(100)
			);
			setRows(activeTab === "active" ? data.filter(b => b.status !== "CANCELADA") : data);
		} catch (e: any) {
			setErr(e?.message || "Erro ao carregar reservas.");
		} finally {
			setLoading(false);
		}
	}

	async function handleStatusChange(id: number, newStatus: string, lateFeeCollected = false) {
		try {
			const updated = await apiFetch<BookingRow>(endpoints.bookings.updateStatus(id), {
				method: "PUT",
				body: JSON.stringify({ status: newStatus, lateFeeCollected }),
			});
			if (newStatus === "CONCLUÍDA" || newStatus === "CANCELADA") {
				// Sai da lista ativa assim que é concluída/cancelada — passa a
				// viver só na aba "Concluídas"/"Canceladas".
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

	// Pergunta à SISP pelo último pagamento online da reserva (ex.: página da SISP
	// parada no telemóvel e a resposta nunca chegou). Se a SISP confirmar, a
	// reserva fica paga e o recibo é enviado, como numa resposta normal.
	async function handleCheckPayment(id: number) {
		try {
			const r = await apiFetch<{ outcome: string; message: string }>(endpoints.bookings.paymentStatus(id), { method: "POST" });
			Swal.fire({
				icon: r.outcome === "PAID" ? "success" : r.outcome === "FAILED" || r.outcome === "ERROR" ? "error" : "info",
				title: "Pagamento na SISP",
				text: r.message,
				confirmButtonColor: "#3baa4e",
			});
			if (r.outcome === "PAID" || r.outcome === "FAILED") fetchBookings();
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Não foi possível consultar a SISP.", confirmButtonColor: "#3085d6" });
		}
	}

	// "Pegou"/"Devolveu" não se podem desfazer no painel: pede sempre confirmação
	// (a 16/10 uma reserva paga de dezembro foi dada como levantada e devolvida por engano).
	async function handlePickupReturn(b: BookingRow, newStatus: "EM_CURSO" | "CONCLUÍDA") {
		const pickup = newStatus === "EM_CURSO";
		// Atraso na devolução (regra das 24 h): mostra o valor e deixa registar a cobrança no balcão.
		const lateFee = !pickup && (b.late_minutes ?? 0) > 0 ? Number(b.late_fee ?? 0) : 0;
		const lateHtml = pickup || !(b.late_minutes ?? 0) ? "" :
			`<p style="margin-top:8px;color:#b91c1c"><b>Atraso de ${fmtLate(b.late_minutes ?? 0)}` +
			(lateFee > 0 ? ` → cobrar ${fmtMoney(lateFee, "CVE")}` : " (dentro da tolerância de 2 h, nada a cobrar)") + `</b></p>`;
		const result = await Swal.fire({
			title: pickup ? "O cliente levantou a viatura?" : "O cliente devolveu a viatura?",
			html:
				`<p><b>Reserva #${b.id}</b> — ${escapeHtml(b.vehicle_title)}<br/>${escapeHtml(b.customer_name)}</p>` +
				`<p style="margin-top:8px">${pickup ? "Levantamento previsto" : "Devolução prevista"}: <b>${fmtDateTime(pickup ? b.start_at : (b.rental_end_at || b.end_at))}</b></p>` +
				lateHtml +
				`<p style="margin-top:8px;font-size:13px;color:#71717a">${pickup
					? "A reserva passa a Em curso. Não se pode desfazer."
					: "A reserva fica Concluída, sai da lista e o cliente recebe o pedido de avaliação. Não se pode desfazer."}</p>`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: pickup ? "#4f46e5" : "#059669",
			cancelButtonColor: "#71717a",
			confirmButtonText: pickup ? "Sim, levantou" : "Sim, devolveu",
			cancelButtonText: "Voltar",
			focusCancel: true,
			...(lateFee > 0 ? {
				input: "checkbox" as const,
				inputValue: 0,
				inputPlaceholder: `Cobrança do atraso (${fmtMoney(lateFee, "CVE")}) recebida no balcão: registar com recibo`,
			} : {}),
		});
		if (!result.isConfirmed) return;
		handleStatusChange(b.id, newStatus, lateFee > 0 && Number(result.value) === 1);
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
						<button
							onClick={() => setTab("cancelled")}
							className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-tight transition-colors flex items-center gap-1.5 ${tab === "cancelled" ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"}`}
						>
							<Ban size={12} />
							Canceladas
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
