"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { fmtDateTime } from "@/lib/utils/format";

/** "1 h 23 min" / "23 min" / "menos de 1 min". */
function remaining(ms: number, t: (k: string, v?: Record<string, number>) => string) {
	const minutes = Math.floor(ms / 60_000);
	if (minutes < 1) return t("lessThanMinute");
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return h > 0 ? t("hoursMinutes", { h, m }) : t("minutes", { m });
}

// Aviso de que uma reserva por pagar é cancelada automaticamente (o servidor
// cancela as PENDENTE ao fim de app.bookings.pending-expiry-minutes, ver
// BookingExpiryService). expiresAt vem da API com a hora exata.
export default function UnpaidExpiryNotice({ expiresAt, compact = false }: { expiresAt?: string | null; compact?: boolean }) {
	const t = useTranslations("unpaidExpiry");
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		if (!expiresAt) return;
		const id = setInterval(() => setNow(Date.now()), 30_000);
		return () => clearInterval(id);
	}, [expiresAt]);

	if (!expiresAt) return null;
	const left = new Date(expiresAt).getTime() - now;
	const expired = left <= 0;

	return (
		<div
			role="note"
			className={`flex items-start gap-2 rounded-lg border ${expired ? "border-red-200 bg-red-50 text-red-800" : "border-amber-200 bg-amber-50 text-amber-900"} ${compact ? "p-2.5 text-xs" : "p-3 text-sm"}`}
		>
			<Clock className={`${compact ? "h-4 w-4" : "h-5 w-5"} mt-0.5 shrink-0`} aria-hidden="true" />
			<p className="m-0">
				{expired
					? t("expired")
					: t(compact ? "short" : "long", { time: fmtDateTime(expiresAt), left: remaining(left, t) })}
			</p>
		</div>
	);
}
