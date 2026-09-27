import { LOCALE_COOKIE, isLocale, negotiateLocale, type Locale } from "@/i18n/config";

/**
 * Língua escolhida no site, lida no browser (cookie NEXT_LOCALE ou, sem ele,
 * a língua do browser). Enviada à API em Accept-Language — o cookie não
 * chega à API (outro domínio) — para as mensagens de erro e os emails
 * (confirmação de reserva/pagamento, newsletter) virem na mesma língua.
 */
export function clientLocale(): Locale {
	if (typeof document === "undefined") return "pt";
	const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
	const fromCookie = match ? decodeURIComponent(match[1]) : null;
	if (isLocale(fromCookie)) return fromCookie;
	return negotiateLocale(typeof navigator !== "undefined" ? navigator.languages?.join(",") || navigator.language : null);
}
