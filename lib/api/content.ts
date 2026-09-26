// lib/api/content.ts
import { SERVER_API_BASE_URL, endpoints } from "@/lib/api/endpoints";

// Conteúdo estático editável (gestão de conteúdos do dashboard), lido em
// Server Components. Cache de 60s: uma alteração no dashboard aparece no site
// até 1 minuto depois, sem pedir a API em cada visita.
export async function getLegalPage(key: "conditions" | "cancellation"): Promise<string | null> {
	try {
		const res = await fetch(`${SERVER_API_BASE_URL}${endpoints.content.public}`, { next: { revalidate: 60 } });
		if (!res.ok) return null;
		const data = await res.json();
		const html = data?.legal?.[key];
		return typeof html === "string" && html.trim() ? html : null;
	} catch {
		return null;
	}
}
