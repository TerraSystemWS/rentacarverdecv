"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import Swal from "sweetalert2";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { StaffRequest } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

// Pedidos entre Superadmins para desativar ou rebaixar (StaffDeactivationService
// na API): o visado aceita ou contesta; se contestar, votam os outros
// Superadmins; sem decisão em 7 dias, o pedido aplica-se.

const STATUS: Record<StaffRequest["status"], [string, string]> = {
	PENDING: ["À espera da resposta", "bg-amber-50 text-amber-700"],
	CONTESTED: ["Contestado: em votação", "bg-blue-50 text-blue-700"],
	APPLIED: ["Aplicado", "bg-red-50 text-red-600"],
	KEPT: ["Mantido", "bg-emerald-50 text-emerald-600"],
	CANCELLED: ["Cancelado", "bg-zinc-100 text-zinc-500"],
};

export function describeRequest(r: StaffRequest) {
	return r.action === "DEMOTE" ? `rebaixar para ${r.new_level_label ?? r.new_level}` : "desativar";
}

function escapeHtml(s: string) {
	return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

async function run(r: StaffRequest, action: "accept" | "contest" | "vote" | "cancel", body?: object) {
	try {
		await apiFetch(endpoints.users.staffRequestAction(r.id, action), { method: "POST", body: body ? JSON.stringify(body) : undefined });
		return true;
	} catch (e: any) {
		Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Não foi possível concluir.", confirmButtonColor: "#3085d6" });
		return false;
	}
}

/** Ações de um pedido (aceitar, contestar, votar, cancelar) com as confirmações. */
export async function staffRequestAction(r: StaffRequest, action: "accept" | "contest" | "vote" | "cancel"): Promise<boolean> {
	const what = describeRequest(r);
	if (action === "accept") {
		const ok = await Swal.fire({
			title: `Aceitar ${what}?`,
			text: r.action === "DEMOTE" ? "O seu nível muda já e terá de entrar de novo." : "A sua conta é desativada já e deixa de conseguir entrar.",
			icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#71717a",
			confirmButtonText: "Aceitar", cancelButtonText: "Voltar",
		});
		return ok.isConfirmed && run(r, "accept");
	}
	if (action === "contest") {
		const res = await Swal.fire({
			title: "Contestar o pedido",
			text: "Explique porque não concorda. Os outros Superadmins decidem; sem decisão até ao prazo, o pedido aplica-se.",
			input: "textarea", inputPlaceholder: "Motivo da contestação", showCancelButton: true,
			confirmButtonColor: "#3baa4e", cancelButtonColor: "#71717a", confirmButtonText: "Contestar", cancelButtonText: "Voltar",
			preConfirm: (v: string) => (v?.trim() ? v.trim() : (Swal.showValidationMessage("Escreva o motivo."), false)),
		});
		return res.isConfirmed && run(r, "contest", { note: res.value });
	}
	if (action === "vote") {
		const res = await Swal.fire({
			title: `Votar: ${what} ${r.target_name}?`,
			html: `<p style="text-align:left;font-size:14px"><b>Motivo do pedido:</b> ${escapeHtml(r.reason)}</p>`
				+ `<p style="text-align:left;font-size:14px;margin-top:8px"><b>Contestação:</b> ${escapeHtml(r.contest_note ?? "")}</p>`,
			showDenyButton: true, showCancelButton: true,
			confirmButtonText: r.action === "DEMOTE" ? "Rebaixar" : "Desativar", denyButtonText: "Manter", cancelButtonText: "Voltar",
			confirmButtonColor: "#d33", denyButtonColor: "#3baa4e", cancelButtonColor: "#71717a",
		});
		if (res.isDismissed) return false;
		return run(r, "vote", { decision: res.isConfirmed ? "DEACTIVATE" : "KEEP" });
	}
	const ok = await Swal.fire({
		title: "Cancelar o pedido?", icon: "question", showCancelButton: true,
		confirmButtonColor: "#3baa4e", cancelButtonColor: "#71717a", confirmButtonText: "Cancelar o pedido", cancelButtonText: "Voltar",
	});
	return ok.isConfirmed && run(r, "cancel");
}

export function useStaffRequests(enabled: boolean) {
	const [requests, setRequests] = useState<StaffRequest[]>([]);
	const reload = useCallback(async () => {
		if (!enabled) return;
		try {
			setRequests(await apiFetch<StaffRequest[]>(endpoints.users.staffRequests));
		} catch {
			setRequests([]);
		}
	}, [enabled]);
	useEffect(() => { reload(); }, [reload]);
	return { requests, reload };
}

/** Lista para os Superadmins (página Utilizadores). */
export default function StaffRequests({ requests, onChanged }: { requests: StaffRequest[]; onChanged: () => void }) {
	if (requests.length === 0) return null;
	const act = async (r: StaffRequest, a: "accept" | "contest" | "vote" | "cancel") => {
		if (await staffRequestAction(r, a)) onChanged();
	};
	return (
		<section className="card-solid p-5 border-zinc-200 space-y-4">
			<h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-500 flex items-center gap-2 m-0">
				<ShieldAlert size={16} /> Pedidos entre Superadmins
			</h3>
			{requests.map((r) => {
				const [label, cls] = STATUS[r.status];
				return (
					<div key={r.id} className="rounded-lg border border-zinc-200 p-4 space-y-2">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<p className="m-0 text-sm font-semibold text-zinc-800">
								{r.requested_by_name} pediu para {describeRequest(r)} <b>{r.target_name}</b>
							</p>
							<span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${cls}`}>{label}</span>
						</div>
						<p className="m-0 text-xs text-zinc-600"><b>Motivo:</b> {r.reason}</p>
						{r.contest_note && <p className="m-0 text-xs text-zinc-600"><b>Contestação:</b> {r.contest_note}</p>}
						<p className="m-0 text-xs text-zinc-500">
							{r.status === "PENDING" || r.status === "CONTESTED"
								? `Prazo: ${fmtDateTime(r.deadline_at)} (sem decisão até lá, aplica-se).`
								: `${r.resolution ?? ""}${r.resolved_at ? ` · ${fmtDateTime(r.resolved_at)}` : ""}`}
							{r.status === "CONTESTED" && ` Votos: ${r.votes_apply} a favor, ${r.votes_keep} contra, de ${r.voters}.`}
							{r.my_vote && ` O seu voto: ${r.my_vote === "KEEP" ? "manter" : "aplicar"}.`}
						</p>
						<div className="flex flex-wrap gap-2">
							{r.can_accept && <button className="btn-outline text-xs" onClick={() => act(r, "accept")}>Aceitar</button>}
							{r.can_contest && <button className="btn-primary text-xs" onClick={() => act(r, "contest")}>Contestar</button>}
							{r.can_vote && <button className="btn-primary text-xs" onClick={() => act(r, "vote")}>{r.my_vote ? "Mudar o voto" : "Votar"}</button>}
							{r.can_cancel && <button className="btn-outline text-xs" onClick={() => act(r, "cancel")}>Cancelar o pedido</button>}
						</div>
					</div>
				);
			})}
		</section>
	);
}

/** Aviso na página inicial do painel para o Superadmin visado por um pedido aberto. */
export function StaffRequestBanner({ enabled }: { enabled: boolean }) {
	const { requests, reload } = useStaffRequests(enabled);
	const mine = requests.filter((r) => r.can_accept);
	if (mine.length === 0) return null;
	return (
		<div className="space-y-3">
			{mine.map((r) => (
				<div key={r.id} role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 flex flex-col gap-3 sm:flex-row sm:items-center">
					<ShieldAlert className="w-6 h-6 shrink-0" aria-hidden="true" />
					<div className="flex-1 text-sm">
						<p className="m-0 font-bold">{r.requested_by_name} pediu para {describeRequest(r)} a sua conta.</p>
						<p className="m-0"><b>Motivo:</b> {r.reason}</p>
						<p className="m-0">
							{r.status === "CONTESTED"
								? "Contestou: os outros Superadmins decidem."
								: "Pode aceitar ou contestar; se contestar, decidem os outros Superadmins."}{" "}
							Sem decisão até {fmtDateTime(r.deadline_at)}, o pedido aplica-se.
						</p>
					</div>
					<div className="flex gap-2 shrink-0">
						{r.can_contest && <button className="btn-primary" onClick={async () => (await staffRequestAction(r, "contest")) && reload()}>Contestar</button>}
						<button className="btn-outline" onClick={async () => (await staffRequestAction(r, "accept")) && reload()}>Aceitar</button>
					</div>
				</div>
			))}
		</div>
	);
}
