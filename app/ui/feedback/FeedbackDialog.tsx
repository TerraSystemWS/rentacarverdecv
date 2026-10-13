"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bug, CheckCircle2, ImagePlus, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { authFetch } from "@/app/auth/api";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints } from "@/lib/api/endpoints";

export type FeedbackSource = "SITE" | "DASHBOARD";
type FeedbackType = "BUG" | "PROBLEM" | "IMPROVEMENT";

const MAX_SCREENSHOT = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const TYPES: FeedbackType[] = ["BUG", "PROBLEM", "IMPROVEMENT"];

// Inline: o CSS antigo do site (style.css, sem camada) muda a cor, o tamanho e
// a letra de button/h2/legend e ganha às classes do Tailwind.
const HEADING: React.CSSProperties = { margin: 0, fontFamily: "inherit", fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: "#0f172a" };
const LEGEND: React.CSSProperties = { marginBottom: 6, padding: 0, border: 0, width: "auto", fontSize: 14, fontWeight: 600, color: "#1e293b" };
const TYPE_BASE: React.CSSProperties = { fontFamily: "inherit", fontSize: 14, fontWeight: 600, lineHeight: 1.2, textTransform: "none" };
const TYPE_ON: React.CSSProperties = { ...TYPE_BASE, color: "#166534", background: "#f0fdf4", borderColor: "#16a34a" };
const TYPE_OFF: React.CSSProperties = { ...TYPE_BASE, color: "#475569", background: "#ffffff", borderColor: "#cbd5e1" };
const BTN_PRIMARY: React.CSSProperties = { ...TYPE_BASE, color: "#ffffff" };
const BTN_GHOST: React.CSSProperties = { ...TYPE_BASE, color: "#475569", background: "transparent" };
const BTN_DANGER: React.CSSProperties = { ...TYPE_BASE, color: "#dc2626", background: "transparent", padding: 0 };
const BTN_ICON: React.CSSProperties = { color: "#64748b", background: "transparent", lineHeight: 0 };

/** Versão publicada (commit da Vercel) para a TerraSystem saber em que build aconteceu. */
const APP_VERSION = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev";

// Janela para reportar um bug, problema ou melhoria. Usada no site (rodapé) e
// no painel (barra de cima). Segue por email para a TerraSystem, com a página,
// o browser e a versão juntos automaticamente (POST /public/feedback).
export default function FeedbackDialog({ source, onClose }: { source: FeedbackSource; onClose: () => void }) {
	const t = useTranslations("feedback");
	const locale = useLocale();
	const { isAuthenticated, user } = useAuth();
	const [type, setType] = useState<FeedbackType>("BUG");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [contactEmail, setContactEmail] = useState("");
	const [website, setWebsite] = useState(""); // campo-armadilha para bots
	const [screenshot, setScreenshot] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [done, setDone] = useState(false);
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const prev = document.activeElement as HTMLElement | null;
		dialogRef.current?.querySelector<HTMLElement>("button[aria-pressed='true']")?.focus();
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
			prev?.focus?.();
		};
	}, [onClose]);

	useEffect(() => () => {
		if (preview) URL.revokeObjectURL(preview);
	}, [preview]);

	function pickScreenshot(file: File | null) {
		setError(null);
		if (preview) URL.revokeObjectURL(preview);
		if (!file) {
			setScreenshot(null);
			setPreview(null);
			return;
		}
		if (!IMAGE_TYPES.includes(file.type) || file.size > MAX_SCREENSHOT) {
			setError(t("screenshotInvalid"));
			return;
		}
		setScreenshot(file);
		setPreview(URL.createObjectURL(file));
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setSending(true);
		setError(null);
		try {
			const report = {
				type,
				source,
				title: title.trim(),
				description: description.trim(),
				page: window.location.href,
				appVersion: APP_VERSION,
				platform: `${navigator.userAgent} · ${window.innerWidth}x${window.innerHeight}`,
				locale,
				contactEmail: isAuthenticated ? undefined : contactEmail.trim() || undefined,
				website,
			};
			const form = new FormData();
			form.append("report", new Blob([JSON.stringify(report)], { type: "application/json" }));
			if (screenshot) form.append("screenshot", screenshot);
			const res = await authFetch(endpoints.feedback.create, { method: "POST", body: form, auth: isAuthenticated });
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(body?.message || t(res.status === 429 ? "tooMany" : "errorGeneric"));
			}
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : t("errorGeneric"));
		} finally {
			setSending(false);
		}
	}

	const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20";

	// Portal para o <body>: dentro do rodapé do site, o CSS antigo do template
	// (cores e fundos do footer) sobrepunha-se à janela.
	return createPortal(
		<div
			className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
			onMouseDown={(e) => e.target === e.currentTarget && onClose()}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="fb-title"
				className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-6 text-left text-slate-800 shadow-xl"
			>
				<button type="button" onClick={onClose} aria-label={t("close")} className="absolute right-3 top-3 rounded-full p-2 hover:bg-slate-100" style={BTN_ICON}>
					<X size={20} aria-hidden="true" />
				</button>

				{done ? (
					<div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
						<CheckCircle2 size={44} className="text-green-600" aria-hidden="true" />
						<h2 id="fb-title" style={HEADING}>{t("thanksTitle")}</h2>
						<p className="text-sm text-slate-600">{t("thanksText")}</p>
						<button type="button" onClick={onClose} className="mt-2 rounded-lg bg-green-600 px-5 py-2 hover:bg-green-700" style={BTN_PRIMARY}>
							{t("close")}
						</button>
					</div>
				) : (
					<form onSubmit={submit} className="styled-form space-y-4">
						<div className="flex items-center gap-2 pr-8">
							<Bug size={20} className="text-green-600" aria-hidden="true" />
							<h2 id="fb-title" style={HEADING}>{t("title")}</h2>
						</div>
						<p className="text-sm text-slate-600">{t("intro")}</p>

						<fieldset>
							<legend style={LEGEND}>{t("typeLabel")}</legend>
							<div className="grid grid-cols-3 gap-2">
								{TYPES.map((k) => (
									<button
										key={k}
										type="button"
										aria-pressed={type === k}
										onClick={() => setType(k)}
										className="rounded-lg border px-2 py-2 transition"
										style={type === k ? TYPE_ON : TYPE_OFF}
									>
										{t(`type.${k}`)}
									</button>
								))}
							</div>
						</fieldset>

						<div>
							<label htmlFor="fb-summary" className="mb-1.5 block text-sm font-semibold">{t("summaryLabel")}</label>
							<input id="fb-summary" required maxLength={150} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("summaryPlaceholder")} className={input} />
						</div>

						<div>
							<label htmlFor="fb-description" className="mb-1.5 block text-sm font-semibold">{t("descriptionLabel")}</label>
							<textarea id="fb-description" required maxLength={5000} rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("descriptionPlaceholder")} className={input} />
						</div>

						<div>
							<span className="mb-1.5 block text-sm font-semibold">{t("screenshotLabel")}</span>
							{preview ? (
								<div className="flex items-center gap-3">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={preview} alt="" className="h-16 w-24 rounded-md border border-slate-200 object-cover" />
									<button type="button" onClick={() => pickScreenshot(null)} className="hover:underline" style={BTN_DANGER}>{t("screenshotRemove")}</button>
								</div>
							) : (
								<label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600 hover:bg-slate-50">
									<ImagePlus size={18} aria-hidden="true" />
									{t("screenshotPick")}
									<input type="file" accept={IMAGE_TYPES.join(",")} className="sr-only" onChange={(e) => pickScreenshot(e.target.files?.[0] ?? null)} />
								</label>
							)}
							<p className="mt-1 text-xs text-slate-500">{t("screenshotHint")}</p>
						</div>

						{!isAuthenticated && (
							<div>
								<label htmlFor="fb-email" className="mb-1.5 block text-sm font-semibold">{t("emailLabel")}</label>
								<input id="fb-email" type="email" maxLength={255} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="nome@exemplo.com" className={input} />
								<p className="mt-1 text-xs text-slate-500">{t("emailHint")}</p>
							</div>
						)}

						{/* Armadilha para bots: invisível e fora da ordem de tabulação. */}
						<div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
							<label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
						</div>

						<p className="text-xs text-slate-500">
							{isAuthenticated && user?.email ? t("contextLoggedIn", { email: user.email }) : t("context")}
						</p>

						{error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}

						<div className="flex justify-end gap-2 pt-1">
							<button type="button" onClick={onClose} disabled={sending} className="rounded-lg px-4 py-2 hover:bg-slate-100" style={BTN_GHOST}>
								{t("cancel")}
							</button>
							<button type="submit" disabled={sending} className="rounded-lg bg-green-600 px-5 py-2 hover:bg-green-700 disabled:opacity-60" style={BTN_PRIMARY}>
								{sending ? t("sending") : t("submit")}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>,
		document.body,
	);
}
