import type { Translations } from "@/lib/api/types";

type Translatable = { translations?: Translations | null };

/**
 * Texto de um registo (post, viatura, anúncio...) na língua pedida: a
 * tradução gravada no dashboard ou, se não houver, o valor PT.
 */
export function tr<T extends Translatable>(entity: T | null | undefined, field: keyof T & string, locale: string): string {
	if (!entity) return "";
	const pt = entity[field];
	const ptText = typeof pt === "string" ? pt : "";
	if (locale === "pt") return ptText;
	const value = entity.translations?.[locale as "en" | "fr"]?.[field];
	return value && value.trim() ? value : ptText;
}

/** Listas guardadas como texto (uma por linha) nas traduções, ex: equipamento das viaturas. */
export function trList<T extends Translatable>(entity: T | null | undefined, field: keyof T & string, locale: string): string[] {
	if (!entity) return [];
	const pt = entity[field];
	const ptList = Array.isArray(pt) ? (pt as string[]) : [];
	if (locale === "pt") return ptList;
	const value = entity.translations?.[locale as "en" | "fr"]?.[field];
	const lines = value ? value.split("\n").map((l) => l.trim()).filter(Boolean) : [];
	return lines.length > 0 ? lines : ptList;
}
