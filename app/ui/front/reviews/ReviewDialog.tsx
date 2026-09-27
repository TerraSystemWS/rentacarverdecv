"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import type { MyReview } from "@/lib/api/types";
import { StarsInput } from "./Stars";

/** "Maria Tavares Silva" → "Maria S." — o mesmo que o backend usa por omissão. */
export function shortName(full?: string | null): string {
	const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "";
	if (parts.length === 1) return parts[0];
	return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

type Props = {
	bookingId: number;
	vehicle?: string | null;
	customerName?: string | null;
	existing?: MyReview | null;
	initialRating?: number;
	onClose: () => void;
	onSaved: (review: MyReview) => void;
};

// Janela para o cliente avaliar uma reserva concluída (área de cliente).
// A avaliação fica pendente até o admin aprovar (Conteúdo → Avaliações).
export default function ReviewDialog({ bookingId, vehicle, customerName, existing, initialRating, onClose, onSaved }: Props) {
	const t = useTranslations("reviews");
	const [rating, setRating] = useState(existing?.rating ?? initialRating ?? 0);
	const [comment, setComment] = useState(existing?.comment ?? "");
	const [displayName, setDisplayName] = useState(existing?.displayName ?? "");
	const [city, setCity] = useState(existing?.city ?? "");
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [done, setDone] = useState(false);
	const dialogRef = useRef<HTMLDivElement>(null);

	// Nome a mostrar por omissão: primeiro nome + inicial do apelido, do perfil
	// (a reserva só traz o nome de utilizador).
	useEffect(() => {
		if (existing) return;
		let cancelled = false;
		authFetch(endpoints.auth.profile)
			.then((res) => (res.ok ? res.json() : null))
			.then((p) => {
				if (cancelled) return;
				const name = shortName(p?.fullName) || shortName(customerName);
				setDisplayName((cur) => cur || name);
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [existing, customerName]);

	useEffect(() => {
		const prev = document.activeElement as HTMLElement | null;
		dialogRef.current?.querySelector<HTMLElement>("input, textarea, button")?.focus();
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
			prev?.focus?.();
		};
	}, [onClose]);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (rating < 1) {
			setError(t("ratingRequired"));
			return;
		}
		setSending(true);
		setError(null);
		try {
			const res = await authFetch(endpoints.reviews.mine, {
				method: "POST",
				body: JSON.stringify({ bookingId, rating, comment: comment.trim(), displayName: displayName.trim(), city: city.trim() }),
			});
			const body = await res.json().catch(() => null);
			if (!res.ok) throw new Error(body?.message || t("errorGeneric"));
			onSaved(body as MyReview);
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : t("errorGeneric"));
		} finally {
			setSending(false);
		}
	}

	return (
		<div className="rv-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
			<div ref={dialogRef} className="rv-dialog" role="dialog" aria-modal="true" aria-labelledby="rv-title">
				<button type="button" className="rv-dialog__close" onClick={onClose} aria-label={t("close")}>
					<X size={20} aria-hidden="true" />
				</button>
				{done ? (
					<div className="rv-dialog__done" role="status">
						<CheckCircle2 size={44} aria-hidden="true" />
						<h2 id="rv-title">{t("thanksTitle")}</h2>
						<p>{t("thanksText")}</p>
						<button type="button" className="btn-racv" onClick={onClose}>{t("close")}</button>
					</div>
				) : (
					<form onSubmit={submit}>
						<h2 id="rv-title" className="rv-dialog__title">{t("formTitle", { id: bookingId })}</h2>
						{vehicle && <p className="rv-dialog__vehicle">{t("formVehicle", { vehicle })}</p>}

						<fieldset className="rv-field">
							<legend>{t("ratingLabel")}</legend>
							<StarsInput value={rating} onChange={setRating} name={`rating-${bookingId}`} />
						</fieldset>

						<div className="rv-field">
							<label htmlFor="rv-comment">{t("commentLabel")}</label>
							<textarea
								id="rv-comment"
								required
								minLength={10}
								maxLength={1000}
								rows={5}
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								aria-describedby="rv-comment-hint"
							/>
							<p id="rv-comment-hint" className="rv-hint">{t("commentHint")} <span aria-hidden="true">({comment.length}/1000)</span></p>
						</div>

						<div className="rv-row">
							<div className="rv-field">
								<label htmlFor="rv-name">{t("nameLabel")}</label>
								<input id="rv-name" maxLength={80} value={displayName} onChange={(e) => setDisplayName(e.target.value)} aria-describedby="rv-name-hint" />
								<p id="rv-name-hint" className="rv-hint">{t("nameHint")}</p>
							</div>
							<div className="rv-field">
								<label htmlFor="rv-city">{t("cityLabel")}</label>
								<input id="rv-city" maxLength={80} value={city} onChange={(e) => setCity(e.target.value)} placeholder={t("cityPlaceholder")} />
							</div>
						</div>

						{error && <p role="alert" className="rv-error">{error}</p>}

						<div className="rv-actions">
							<button type="button" className="rv-cancel" onClick={onClose} disabled={sending}>{t("cancel")}</button>
							<button type="submit" className="btn-racv" disabled={sending}>
								{sending ? t("sending") : existing ? t("update") : t("submit")}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
