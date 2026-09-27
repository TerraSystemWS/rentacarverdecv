// Campos do content.json (Gestão de Conteúdo) que têm tradução EN/FR.
// As traduções ficam em content.i18n.<língua> com o mesmo caminho
// (ex: i18n.en.about.p1). Telefone, email, números e definições não se
// traduzem.
export const TRANSLATABLE_CONTENT_FIELDS = [
	"about.headerTitle", "about.headerDesc", "about.mainTitle", "about.mainSubtitle", "about.bigTitle", "about.p1", "about.p2",
	"contact.headerTitle", "contact.headerSubtitle", "contact.directTitle", "contact.address",
	"contact.mapTitle", "contact.mapSubtitle", "contact.mapDesc",
	"home.app.topSubtitle", "home.app.title", "home.app.subtitle",
	"home.funFacts.f1", "home.funFacts.f2", "home.funFacts.f3", "home.funFacts.f4",
	"legal.conditions", "legal.cancellation",
] as const;

export const CONTENT_TRANSLATION_LOCALES = ["en", "fr"] as const;

type Json = Record<string, unknown>;

export function getPath(obj: unknown, path: string): unknown {
	return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Json)[k] : undefined), obj);
}

export function setPath<T extends Json>(obj: T, path: string, value: unknown): T {
	const keys = path.split(".");
	const copy: Json = { ...obj };
	let cur = copy;
	keys.slice(0, -1).forEach((k) => {
		const next = cur[k];
		cur[k] = next && typeof next === "object" ? { ...(next as Json) } : {};
		cur = cur[k] as Json;
	});
	cur[keys[keys.length - 1]] = value;
	return copy as T;
}

const isFilled = (v: unknown) => typeof v === "string" && v.replace(/<[^>]*>/g, "").trim().length > 0;

/**
 * Conteúdo na língua pedida. Em EN/FR, cada campo traduzível passa a ser a
 * tradução gravada (i18n.<língua>) ou "" se não houver — os componentes caem
 * então no texto por omissão da língua (messages/*.json), nunca no PT.
 * Exceção: páginas legais sem tradução mostram o PT (com aviso), porque
 * não há texto por omissão traduzido do contrato.
 */
export function localizeContent<T extends Json>(content: T, locale: string): T {
	if (locale === "pt" || !content) return content;
	const translated = getPath(content, `i18n.${locale}`);
	let out = content;
	for (const field of TRANSLATABLE_CONTENT_FIELDS) {
		if (field.startsWith("legal.")) {
			const value = getPath(translated, field);
			if (isFilled(value)) out = setPath(out, field, value);
			continue;
		}
		const value = getPath(translated, field);
		out = setPath(out, field, isFilled(value) ? value : "");
	}
	return out;
}

/** A página legal tem tradução gravada para esta língua? */
export function hasLegalTranslation(content: unknown, key: "conditions" | "cancellation", locale: string): boolean {
	return locale === "pt" || isFilled(getPath(content, `i18n.${locale}.legal.${key}`));
}
