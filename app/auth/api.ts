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
import { clientLocale } from "@/lib/i18n/clientLocale";

const API_BASE = API_BASE_URL;

// ✅ mesmas keys do teu AuthContext
const LS_ACCESS = "rcv_access";
const LS_REFRESH = "rcv_refresh";
const LS_TOKEN_TYPE = "rcv_token_type";

// Exportado para o EventSource das notificações em tempo real — a API
// EventSource do browser não permite definir o header Authorization, por isso
// o token vai por parâmetro de query (o JwtAuthFilter do backend já aceita
// isto em qualquer rota, não só na de streaming).
export function getAccessToken() {
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
	// Avisa quem tiver uma ligação de longa duração presa ao token antigo (ex:
	// o EventSource das notificações, que não passa por authFetch e por isso
	// nunca saberia sozinho que o token mudou) para se reconectar com o novo.
	window.dispatchEvent(new Event("auth:tokens-updated"));
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
	// Mensagens da API e emails na língua escolhida no site.
	if (!headers.has("Accept-Language")) headers.set("Accept-Language", clientLocale());

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
	email: string,
	password: string,
	turnstileToken: string,
): Promise<Tokens> {
	const res = await authFetch("/auth/login", {
		method: "POST",
		auth: false,
		body: JSON.stringify({ email, password, turnstileToken }),
	});

	const data = await parseOrThrow<Tokens>(res);
	setTokens(data);
	return data;
}

/**
 * Refresh tokens usando o refreshToken do storage.
 * Retorna true/false (pra facilitar no authFetch).
 *
 * O backend faz *rotação* do refresh token a cada uso (revoga o antigo,
 * emite um par novo — ver AuthService.refresh()). Sem isto, quando o access
 * token expira e várias chamadas de authFetch levam 401 ao mesmo tempo (ex:
 * o dashboard a carregar resumo + reservas + notificações em paralelo), cada
 * uma tentava um refresh próprio com o MESMO refresh token — só a primeira
 * tinha sucesso, as restantes caíam num refresh token já revogado, e cada
 * falha dessas fazia logout (clearTokens + "auth:unauthorized"), mesmo a
 * sessão tendo acabado de ser renovada com sucesso um instante antes. Um
 * único pedido de refresh "em voo" partilhado por todos os chamadores
 * resolve isto — todos esperam pelo mesmo resultado em vez de cada um
 * disparar o seu.
 */
let refreshInFlight: Promise<boolean> | null = null;

export async function refreshTokens(
	refreshTokenArg?: string,
): Promise<boolean> {
	if (refreshInFlight) return refreshInFlight;

	refreshInFlight = doRefresh(refreshTokenArg).finally(() => {
		refreshInFlight = null;
	});
	return refreshInFlight;
}

async function doRefresh(refreshTokenArg?: string): Promise<boolean> {
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
