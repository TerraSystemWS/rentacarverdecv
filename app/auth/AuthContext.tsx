"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useRouter } from "next/navigation";
import * as authApi from "./api";

type Me = authApi.Me;

type AuthContextValue = {
	user: Me | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refresh: () => Promise<void>;
	authFetch: (path: string, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<Me | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const router = useRouter();

	// Carrega os dados do usuário se o token for válido
	async function loadMe() {
		try {
			const me = await authApi.me();
			setUser(me);
			setIsAuthenticated(true);
		} catch (error) {
			setUser(null);
			setIsAuthenticated(false);
			authApi.clearTokens();
			throw error; // Repassa o erro para quem chamou
		}
	}

	// Tenta reautenticar o usuário ao carregar a página (F5)
	useEffect(() => {
		let isMounted = true;
		const initializeAuth = async () => {
			setIsLoading(true);
			try {
				await loadMe();
			} catch (e) {
				console.log("Sessão expirada ou sem token.");
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};

		initializeAuth();
		return () => {
			isMounted = false;
		};
	}, []);
	/*
	async function login(username: string, password: string) {
		setIsLoading(true);
		try {
			await authApi.login(username, password);
			await loadMe(); // Valida o login recém-feito
		} catch (error) {
			throw error; // Deixa a LoginPage tratar a mensagem de erro
		} finally {
			setIsLoading(false);
		}
	}
*/

	function isAdmin(me: any) {
		const roles: string[] =
			me?.roles ?? me?.authorities?.map((a: any) => a.authority) ?? [];
		return roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");
	}

	async function login(username: string, password: string) {
		setIsLoading(true);
		try {
			await authApi.login(username, password);
			const me = await authApi.me(); // ou loadMe() mas devolvendo o me
			setUser(me);
			setIsAuthenticated(true);

			// ✅ redireciona conforme o tipo de login
			if (isAdmin(me)) {
				router.replace("/dashboard"); // admin dashboard
			} else {
				router.replace("/"); // não-admin → front
			}
		} finally {
			setIsLoading(false);
		}
	}

	async function refresh() {
		setIsLoading(true);
		try {
			const ok = await authApi.refreshTokens();
			if (!ok) throw new Error("Falha no refresh");
			await loadMe();
		} finally {
			setIsLoading(false);
		}
	}

	async function logout() {
		setIsLoading(true);
		try {
			await authApi.logout();
		} finally {
			setUser(null);
			setIsAuthenticated(false);
			setIsLoading(false);
		}
	}

	async function authFetch(path: string, init: RequestInit = {}) {
		return authApi.authFetch(path, init);
	}

	const value = useMemo(
		() => ({
			user,
			isAuthenticated,
			isLoading,
			login,
			logout,
			refresh,
			authFetch,
		}),
		[user, isAuthenticated, isLoading],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
	return ctx;
}
