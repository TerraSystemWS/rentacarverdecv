// lib/api/testLogin.ts
import type { Role, SessionUser } from "@/lib/api/types";
import { setAccessToken } from "@/lib/api/client";

export function isTestLoginEnabled() {
	if (typeof window === "undefined") return false;
	return (
		process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === "true" &&
		process.env.NODE_ENV !== "production"
	);
}

export function doTestLogin(role?: Role) {
	const r = (role ??
		(process.env.NEXT_PUBLIC_TEST_ROLE as Role) ??
		"ADMIN") as Role;

	const user: SessionUser = {
		id: 999999,
		fullName: process.env.NEXT_PUBLIC_TEST_NAME ?? "Admin Teste",
		email: process.env.NEXT_PUBLIC_TEST_EMAIL ?? "admin@test.local",
		role: r,
	};

	// token fake (apenas para permitir o guard no front)
	setAccessToken(process.env.NEXT_PUBLIC_TEST_TOKEN ?? "dev-test-token");
	localStorage.setItem(
		"refresh_token",
		process.env.NEXT_PUBLIC_TEST_REFRESH_TOKEN ?? "dev-refresh-token",
	);
	localStorage.setItem("session_user", JSON.stringify(user));
}
