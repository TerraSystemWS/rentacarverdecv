// lib/api/client.ts
import { authFetch } from "@/app/auth/api";

/**
 * Fetch autenticado que retorna JSON parseado.
 * Usa authFetch do auth/api (com token, refresh, etc).
 */
export async function apiFetch<T>(
	path: string,
	init?: RequestInit
): Promise<T> {
	const res = await authFetch(path, init);

	if (!res.ok) {
		let message = res.statusText;
		try {
			const json = await res.json();
			message =
				(typeof json === "object" && (json?.message ?? json?.error)) ||
				message;
		} catch {
			const text = await res.text().catch(() => "");
			if (text) message = text;
		}
		throw new Error(message || `HTTP ${res.status}`);
	}

	const ct = res.headers.get("content-type") || "";
	if (ct.includes("application/json")) {
		return res.json() as Promise<T>;
	}
	return null as T;
}
