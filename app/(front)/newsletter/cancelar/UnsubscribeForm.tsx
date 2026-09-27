"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MailX, Loader2 } from "lucide-react";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import { useTranslations } from "next-intl";
import { clientLocale } from "@/lib/i18n/clientLocale";

export default function UnsubscribeForm() {
	const search = useSearchParams();
	const t = useTranslations("unsubscribe");
	const email = search.get("email") ?? "";
	const token = search.get("token") ?? "";
	const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

	async function cancel() {
		setState("busy");
		try {
			const res = await fetch(`${API_BASE_URL}${endpoints.subscribers.unsubscribe}`, {
				method: "POST",
				headers: { "Content-Type": "application/json", "Accept-Language": clientLocale() },
				body: JSON.stringify({ email, token }),
			});
			setState(res.ok ? "done" : "error");
		} catch {
			setState("error");
		}
	}

	const card = "bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center space-y-4";

	if (!email || !token) {
		return (
			<div className={card}>
				<p className="text-slate-600">{t("incompleteLink")}</p>
			</div>
		);
	}

	if (state === "done") {
		return (
			<div className={card}>
				<CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
				<h2 className="text-xl font-bold text-slate-900">{t("doneTitle")}</h2>
				<p className="text-slate-600 text-sm">
					{t.rich("doneText", { email, strong: (chunks) => <strong>{chunks}</strong> })}
				</p>
				<Link href="/" className="btn-racv inline-block px-8">{t("backToSite")}</Link>
			</div>
		);
	}

	return (
		<div className={card}>
			<MailX className="w-12 h-12 mx-auto text-slate-400" />
			<h2 className="text-xl font-bold text-slate-900">{t("confirmTitle")}</h2>
			<p className="text-slate-600 text-sm">
				{t.rich("confirmText", { email, strong: (chunks) => <strong>{chunks}</strong> })}
			</p>
			{state === "error" && (
				<p role="alert" className="text-sm font-semibold text-red-600">{t("error")}</p>
			)}
			<button onClick={cancel} disabled={state === "busy"} className="btn-racv px-8 inline-flex items-center gap-2 disabled:opacity-50">
				{state === "busy" && <Loader2 className="w-4 h-4 animate-spin" />}
				{t("button")}
			</button>
		</div>
	);
}
