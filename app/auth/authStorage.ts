export type Tokens = {
	accessToken: string;
	refreshToken?: string;
	tokenType?: string; // "Bearer"
};

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function getTokens(): Tokens | null {
	if (typeof window === "undefined") return null;
	const accessToken = localStorage.getItem(ACCESS_KEY);
	const refreshToken = localStorage.getItem(REFRESH_KEY);
	if (!accessToken) return null;
	return {
		accessToken,
		refreshToken: refreshToken ?? undefined,
		tokenType: "Bearer",
	};
}

export function setTokens(tokens: Tokens) {
	if (typeof window === "undefined") return;
	localStorage.setItem(ACCESS_KEY, tokens.accessToken);
	if (tokens.refreshToken)
		localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function clearTokens() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(ACCESS_KEY);
	localStorage.removeItem(REFRESH_KEY);
}
