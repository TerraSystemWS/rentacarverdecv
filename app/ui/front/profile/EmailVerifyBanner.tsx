"use client";

import { useEffect, useState } from "react";
import { MailWarning } from "lucide-react";
import { useTranslations } from "next-intl";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";

// Conta por confirmar: aviso na área de cliente com o botão para reenviar o
// email (só se pode reservar depois de confirmar — ver AccountVerificationService).
export default function EmailVerifyBanner() {
	const t = useTranslations("accountConfirm");
	const [pending, setPending] = useState(false);
	const [sending, setSending] = useState(false);
	const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

	useEffect(() => {
		authFetch(endpoints.auth.profile)
			.then((r) => (r.ok ? r.json() : null))
			.then((p) => setPending(p != null && p.emailVerified === false))
			.catch(() => {});
	}, []);

	if (!pending) return null;

	const resend = async () => {
		setSending(true);
		setResult(null);
		try {
			const res = await authFetch(endpoints.auth.verifyEmailResend, { method: "POST" });
			const body = await res.json().catch(() => null);
			setResult({ ok: res.ok, text: body?.message || (res.ok ? t("resent") : t("error")) });
		} catch {
			setResult({ ok: false, text: t("error") });
		} finally {
			setSending(false);
		}
	};

	return (
		<div role="status" className="mb-6 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 sm:flex-row sm:items-center">
			<MailWarning className="h-5 w-5 shrink-0" aria-hidden="true" />
			<div className="flex-1 text-sm">
				<p className="m-0 font-semibold">{t("bannerTitle")}</p>
				<p className="m-0">{t("bannerText")}</p>
				{result && <p className={`m-0 mt-1 font-semibold ${result.ok ? "text-green-700" : "text-red-700"}`}>{result.text}</p>}
			</div>
			<button type="button" onClick={resend} disabled={sending} className="btn-racv shrink-0 self-start sm:self-center">
				{sending ? t("sending") : t("resend")}
			</button>
		</div>
	);
}
