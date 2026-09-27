"use client";

import { useLocale } from "next-intl";
import { localeTags, isLocale } from "@/i18n/config";

// Preço em escudos: em PT no formato cabo-verdiano (6000$00); em EN/FR no
// formato da língua do visitante (CVE 6,000.00 / 6 000,00 CVE).
export function formatPrice(value: number | null | undefined, locale: string): string {
	if (value == null) return "";
	const tag = isLocale(locale) ? localeTags[locale] : localeTags.pt;
	return value.toLocaleString(tag, { style: "currency", currency: "CVE" });
}

export function useFormatPrice() {
	const locale = useLocale();
	return (value: number | null | undefined) => formatPrice(value, locale);
}
