"use client";

import SideNav from "@/app/ui/dash/sidenav";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { usePathname, useRouter } from "next/navigation";

const DASH_LOGIN = "/dashboard/login";
const FRONT_HOME = "/"; // não-admin → redireciona para o front

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, isLoading, isAuthenticated } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const isLoginPage = pathname === DASH_LOGIN;

	const isAdmin = useMemo(() => {
		const roles: string[] =
			(user as any)?.roles ??
			(user as any)?.authorities?.map((a: any) => a.authority) ??
			[];
		return roles.includes("ROLE_ADMIN") || roles.includes("ADMIN");
	}, [user]);

	useEffect(() => {
		if (isLoading) return;

		// Na página de login: se já logado, redireciona (admin→dashboard, não-admin→front)
		if (isLoginPage) {
			if (isAuthenticated) {
				router.replace(isAdmin ? "/dashboard" : FRONT_HOME);
			}
			return;
		}

		// Nas outras páginas do dashboard: exige auth + admin
		if (!isAuthenticated) {
			router.replace(DASH_LOGIN);
			return;
		}
		if (!isAdmin) {
			router.replace(FRONT_HOME);
			return;
		}
	}, [isLoading, isAuthenticated, isAdmin, isLoginPage, router]);

	// Página de login: mostra form (ou null se loading / já logado)
	if (isLoginPage) {
		if (isLoading || isAuthenticated) return null; // evita flash antes do redirect
		return <>{children}</>;
	}

	// Outras páginas: bloqueia até validar auth + admin
	if (isLoading || !isAuthenticated || !isAdmin) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background dashboard-theme">
			<div className="flex min-h-screen">
				<SideNav />
				<div className="flex-1 overflow-hidden">{children}</div>
			</div>
		</div>
	);
}
