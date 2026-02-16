// lib/utils/format.ts
export function fmtDateTime(iso: string) {
	try {
		const d = new Date(iso);
		const day = String(d.getDate()).padStart(2, "0");
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const year = d.getFullYear();
		const hours = String(d.getHours()).padStart(2, "0");
		const minutes = String(d.getMinutes()).padStart(2, "0");
		return `${day}/${month}/${year} ${hours}:${minutes}`;
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
