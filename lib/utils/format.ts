// lib/utils/format.ts
import { isoToCv } from "./cvTime";

// Sempre em hora de Cabo Verde (ver lib/utils/cvTime.ts) — um cliente que
// reserva de Portugal tem de ver a mesma hora de levantamento que a agência.
export function fmtDateTime(iso: string) {
	try {
		const { date, time } = isoToCv(iso);
		const [y, m, d] = date.split("-");
		return `${d}/${m}/${y} ${time}`;
	} catch {
		return iso;
	}
}

// locale: tag BCP 47 (ex: "en-GB") — por omissão pt-PT (dashboard).
export function fmtMoney(amount: number, currency: string, locale = "pt-PT") {
	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
		}).format(amount);
	} catch {
		return `${amount} ${currency}`;
	}
}
