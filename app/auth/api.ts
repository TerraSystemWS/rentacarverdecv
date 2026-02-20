// app/auth/api.ts
export type Tokens = {
	accessToken: string;
	refreshToken: string;
	tokenType: string; // "Bearer"
};

export type Me = {
	id?: string;
	username: string;
	email?: string;
	enabled?: boolean;
	roles?: string[];
};

export type ApiError = {
	status: number;
	message: string;
	details?: any;
};

import { API_BASE_URL } from "@/lib/api/endpoints";

const API_BASE = API_BASE_URL;

// ✅ mesmas keys do teu AuthContext
const LS_ACCESS = "rcv_access";
const LS_REFRESH = "rcv_refresh";
const LS_TOKEN_TYPE = "rcv_token_type";

function getAccessToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(LS_ACCESS);
}
function getRefreshToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(LS_REFRESH);
}
function getTokenType() {
	if (typeof window === "undefined") return "Bearer";
	return localStorage.getItem(LS_TOKEN_TYPE) ?? "Bearer";
}

export function setTokens(tokens: Tokens) {
	if (typeof window === "undefined") return;
	localStorage.setItem(LS_ACCESS, tokens.accessToken);
	localStorage.setItem(LS_REFRESH, tokens.refreshToken);
	localStorage.setItem(LS_TOKEN_TYPE, tokens.tokenType ?? "Bearer");
}

export function clearTokens() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(LS_ACCESS);
	localStorage.removeItem(LS_REFRESH);
	localStorage.removeItem(LS_TOKEN_TYPE);
}

async function parseOrThrow<T>(res: Response): Promise<T> {
	if (res.ok) {
		if (res.status === 204) return null as T;
		const ct = res.headers.get("content-type") || "";
		if (ct.includes("application/json")) return (await res.json()) as T;
		return (await res.text()) as unknown as T;
	}

	let details: any = null;
	try {
		details = await res.json();
	} catch {
		details = await res.text().catch(() => null);
	}

	const err: ApiError = {
		status: res.status,
		message:
			(typeof details === "object" && details?.message) ||
			(typeof details === "object" && details?.error) ||
			res.statusText ||
			"API error",
		details,
	};
	throw err;
}

/**
 * ✅ authFetch
 * - Prefixa API_BASE
 * - Mete Authorization automaticamente
 * - Se 401 -> tenta refresh 1x -> repete request
 */
export async function authFetch(
	path: string,
	init: RequestInit & { auth?: boolean; retry?: boolean } = {},
): Promise<Response> {
	const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

	const headers = new Headers(init.headers);

	// define JSON se houver body e não for FormData
	if (
		init.body &&
		!(init.body instanceof FormData) &&
		!headers.has("Content-Type")
	) {
		headers.set("Content-Type", "application/json");
	}

	// auth por defeito: true
	if (init.auth !== false) {
		const access = getAccessToken();
		if (access) headers.set("Authorization", `${getTokenType()} ${access}`);
	}

	const res = await fetch(url, { ...init, headers, cache: "no-store" });

	// 401 -> tenta refresh e repete 1x
	if (res.status === 401 && init.auth !== false) {
		if (init.retry !== false) {
			const ok = await refreshTokens().catch(() => false);
			if (ok) {
				return authFetch(path, { ...init, retry: false });
			}
		}

		// Se chegamos aqui, ou refresh falhou, ou não havia token pra retry
		// -> Limpar storage e emitir evento para o AuthContext capturar
		clearTokens();
		if (typeof window !== "undefined") {
			window.dispatchEvent(new Event("auth:unauthorized"));
		}
	}

	return res;
}

/* ==========================
   Endpoints do AUTH
   ========================== */

export async function login(
	username: string,
	password: string,
): Promise<Tokens> {
	const res = await authFetch("/auth/login", {
		method: "POST",
		auth: false,
		body: JSON.stringify({ username, password }),
	});

	const data = await parseOrThrow<Tokens>(res);
	setTokens(data);
	return data;
}

/**
 * Refresh tokens usando o refreshToken do storage.
 * Retorna true/false (pra facilitar no authFetch).
 */
export async function refreshTokens(
	refreshTokenArg?: string,
): Promise<boolean> {
	const refreshToken = refreshTokenArg ?? getRefreshToken();
	if (!refreshToken) return false;

	const res = await authFetch("/auth/refresh", {
		method: "POST",
		auth: false,
		body: JSON.stringify({ refreshToken }),
	});

	const data = await parseOrThrow<Tokens>(res);
	setTokens(data);
	return true;
}

export async function logout(): Promise<void> {
	const refreshToken = getRefreshToken();

	// best effort: revoga no backend
	try {
		if (refreshToken) {
			await authFetch("/auth/logout", {
				method: "POST",
				auth: false,
				body: JSON.stringify({ refreshToken }),
			});
		}
	} catch {
		// ignora erro
	} finally {
		clearTokens();
	}
}

// export async function me(): Promise<Me> {
// 	const res = await authFetch("/auth/me", { method: "GET" });
// 	return parseOrThrow<Me>(res);
// }

export async function me(): Promise<Me> {
	const res = await authFetch("/auth/me", { method: "GET" });
	return parseOrThrow<Me>(res);
}
