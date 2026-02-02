"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";

export default function AuthGate({ children }: { children: React.ReactNode }) {
	const { isLoading, isAuthenticated } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (isLoading) return;

		// permite a página de login do dashboard sem auth
		if (pathname === "/dashboard/login") return;

		if (!isAuthenticated) {
			router.replace("/dashboard/login");
		}
	}, [isLoading, isAuthenticated, pathname, router]);

	if (isLoading) return null;

	// se não estiver autenticado e não é login, o redirect vai acontecer
	if (!isAuthenticated && pathname !== "/dashboard/login") return null;

	return <>{children}</>;
}
