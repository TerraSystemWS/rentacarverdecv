// lib/api/content.ts
import { SERVER_API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import { hasLegalTranslation } from "@/lib/i18n/contentFields";

// Conteúdo estático editável (gestão de conteúdos do dashboard), lido em
// Server Components. Cache de 60s: uma alteração no dashboard aparece no site
// até 1 minuto depois, sem pedir a API em cada visita.
// Em EN/FR usa a tradução gravada no dashboard; sem tradução, devolve o PT
// com translated=false (a página mostra um aviso).
export async function getLegalPage(
	key: "conditions" | "cancellation",
	locale = "pt",
): Promise<{ html: string; translated: boolean } | null> {
	try {
		const res = await fetch(`${SERVER_API_BASE_URL}${endpoints.content.public}`, { next: { revalidate: 60 } });
		if (!res.ok) return null;
		const data = await res.json();
		const translated = hasLegalTranslation(data, key, locale);
		const html = translated && locale !== "pt" ? data?.i18n?.[locale]?.legal?.[key] : data?.legal?.[key];
		return typeof html === "string" && html.trim() ? { html, translated } : null;
	} catch {
		return null;
	}
}
