// lib/utils/format.ts
export function fmtDateTime(iso: string) {
	try {
		return new Date(iso).toLocaleString("pt-PT", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return iso;
	}
}

export function fmtMoney(amount: number, currency: string) {
	try {
		return new Intl.NumberFormat("pt-PT", {
			style: "currency",
			currency,
		}).format(amount);
	} catch {
		return `${amount} ${currency}`;
	}
}
