// Línguas do site público. A escolha fica num cookie (mesmo URL em todas as
// línguas); sem cookie, usa a língua do browser (Accept-Language), senão PT.
export const locales = ["pt", "en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
	pt: "Português",
	en: "English",
	fr: "Français",
};

// Para Intl (datas, moeda) e para o <html lang>.
export const localeTags: Record<Locale, string> = {
	pt: "pt-CV",
	en: "en-GB",
	fr: "fr-FR",
};

export function isLocale(value: string | undefined | null): value is Locale {
	return !!value && (locales as readonly string[]).includes(value);
}

/** Primeira língua suportada no cabeçalho Accept-Language (ex: "fr-FR,fr;q=0.9,en;q=0.8"). */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
	if (!acceptLanguage) return defaultLocale;
	const ranked = acceptLanguage
		.split(",")
		.map((part) => {
			const [tag, q] = part.trim().split(";q=");
			return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
		})
		.filter((x) => x.lang && !Number.isNaN(x.q))
		.sort((a, b) => b.q - a.q);
	return ranked.map((x) => x.lang).find(isLocale) ?? defaultLocale;
}
