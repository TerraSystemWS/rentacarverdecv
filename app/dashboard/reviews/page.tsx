"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { Star, Check, X, Trash2, RotateCcw, MessageSquareQuote } from "lucide-react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints } from "@/lib/api/endpoints";
import type { AdminReview, ReviewStatus } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

// Conteúdo → Avaliações: avaliações que os clientes deixam depois de devolver
// o carro (área de cliente / email pós-devolução). Só as aprovadas aparecem no
// site, em "O que dizem os nossos clientes". O texto é do cliente — aqui só se
// aprova, rejeita ou apaga.
const TABS: { key: ReviewStatus; label: string }[] = [
	{ key: "PENDING", label: "Por aprovar" },
	{ key: "APPROVED", label: "Publicadas" },
	{ key: "REJECTED", label: "Rejeitadas" },
];

const errText = (e: unknown) => (e instanceof Error ? e.message : undefined);

function Stars({ n }: { n: number }) {
	return (
		<span className="inline-flex gap-0.5" role="img" aria-label={`${n} de 5 estrelas`}>
			{[1, 2, 3, 4, 5].map((i) => (
				<Star key={i} size={16} aria-hidden="true" className={i <= n ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"} />
			))}
		</span>
	);
}

export default function ReviewsPage() {
	const { authFetch } = useAuth();
	const [reviews, setReviews] = useState<AdminReview[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);
	const [tab, setTab] = useState<ReviewStatus>("PENDING");
	const [busy, setBusy] = useState<number | null>(null);

	async function load() {
		setLoading(true);
		setErr(null);
		try {
			const res = await authFetch(endpoints.reviews.dashboard);
			if (!res.ok) throw new Error("Erro ao carregar as avaliações.");
			setReviews(await res.json());
		} catch (e) {
			setErr(errText(e) || "Erro ao carregar as avaliações.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function setStatus(r: AdminReview, status: ReviewStatus) {
		setBusy(r.id);
		try {
			const res = await authFetch(endpoints.reviews.status(r.id), { method: "PUT", body: JSON.stringify({ status }) });
			if (!res.ok) throw new Error("Não foi possível alterar a avaliação.");
			const saved: AdminReview = await res.json();
			setReviews((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
		} catch (e) {
			Swal.fire({ icon: "error", title: "Erro", text: errText(e), confirmButtonColor: "#3085d6" });
		} finally {
			setBusy(null);
		}
	}

	async function remove(r: AdminReview) {
		const ok = await Swal.fire({
			title: "Apagar avaliação?",
			text: `A avaliação de ${r.displayName} (reserva #${r.bookingId}) é apagada de vez. O cliente pode voltar a avaliar a reserva. Para só a esconder do site, use «Rejeitar».`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sim, apagar",
			cancelButtonText: "Cancelar",
		});
		if (!ok.isConfirmed) return;
		const res = await authFetch(endpoints.reviews.delete(r.id), { method: "DELETE" });
		if (!res.ok) return Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível apagar.", confirmButtonColor: "#3085d6" });
		setReviews((prev) => prev.filter((x) => x.id !== r.id));
	}

	const count = (s: ReviewStatus) => reviews.filter((r) => r.status === s).length;
	const shown = reviews.filter((r) => r.status === tab);
	const approved = reviews.filter((r) => r.status === "APPROVED");
	const average = approved.length ? approved.reduce((a, r) => a + r.rating, 0) / approved.length : 0;

	return (
		<div className="pb-20">
			<TopNav title="Avaliações" subtitle="Avaliações dos clientes depois de devolverem o carro" />
			<PageShell>
				<div className="mx-auto max-w-5xl space-y-6">
					<p className="text-sm text-zinc-500">
						Quando uma reserva passa a <strong>Concluída</strong> («Devolveu»), o cliente recebe um email a pedir uma avaliação.
						As avaliações aprovadas aparecem na página inicial, em «O que dizem os nossos clientes».
						{approved.length > 0 && <> Média publicada: <strong>{average.toFixed(1)}</strong> de 5 ({approved.length}).</>}
						{" "}<Link href="/" target="_blank" className="font-semibold text-primary hover:underline">Ver no site</Link>
					</p>

					<div role="tablist" aria-label="Estado das avaliações" className="inline-flex gap-1 rounded-xl border border-zinc-200 bg-white p-1">
						{TABS.map((tb) => (
							<button
								key={tb.key}
								role="tab"
								aria-selected={tab === tb.key}
								onClick={() => setTab(tb.key)}
								className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${tab === tb.key ? "bg-primary text-white" : "text-zinc-600 hover:bg-zinc-50"}`}
							>
								{tb.label} <span className="ml-1 opacity-70">{count(tb.key)}</span>
							</button>
						))}
					</div>

					{loading ? (
						<div className="flex h-[30vh] flex-col items-center justify-center gap-4 rounded-3xl border border-zinc-200 bg-white">
							<MessageSquareQuote className="h-10 w-10 animate-pulse text-primary" />
							<p className="text-xs font-bold uppercase tracking-widest text-zinc-400">A carregar avaliações...</p>
						</div>
					) : err ? (
						<div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
							<p className="text-sm font-semibold text-destructive">{err}</p>
							<button onClick={load} className="btn-outline mt-4">Tentar novamente</button>
						</div>
					) : shown.length === 0 ? (
						<div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">
							{tab === "PENDING" ? "Não há avaliações por aprovar." : tab === "APPROVED" ? "Ainda não há avaliações publicadas." : "Não há avaliações rejeitadas."}
						</div>
					) : (
						<ul className="space-y-4">
							{shown.map((r) => (
								<li key={r.id} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
									<div className="flex flex-wrap items-start justify-between gap-3">
										<div>
											<div className="flex items-center gap-3">
												<Stars n={r.rating} />
												<span className="text-xs font-bold uppercase text-zinc-400">{r.locale}</span>
											</div>
											<p className="mt-1 text-sm text-zinc-500">
												<strong className="text-zinc-900">{r.displayName}</strong>
												{r.city && <> · {r.city}</>}
												{" · "}reserva <strong className="text-zinc-700">#{r.bookingId}</strong>
												{r.vehicle && <> · {r.vehicle}</>}
											</p>
											<p className="text-xs text-zinc-400">
												{r.customerName || "—"} {r.customerEmail && <>({r.customerEmail})</>} · {fmtDateTime(r.createdAt)}
											</p>
										</div>
										<div className="flex flex-wrap gap-2">
											{r.status !== "APPROVED" && (
												<button disabled={busy === r.id} onClick={() => setStatus(r, "APPROVED")} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
													<Check size={14} /> Aprovar
												</button>
											)}
											{r.status !== "REJECTED" && (
												<button disabled={busy === r.id} onClick={() => setStatus(r, "REJECTED")} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
													<X size={14} /> {r.status === "APPROVED" ? "Retirar do site" : "Rejeitar"}
												</button>
											)}
											{r.status === "REJECTED" && (
												<button disabled={busy === r.id} onClick={() => setStatus(r, "PENDING")} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
													<RotateCcw size={14} /> Voltar a rever
												</button>
											)}
											<button onClick={() => remove(r)} className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
												<Trash2 size={14} /> Apagar
											</button>
										</div>
									</div>
									<p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-zinc-800">{r.comment}</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</PageShell>
		</div>
	);
}
