"use client";

import { canOpen, isStaff } from "@/lib/auth/staffLevel";
import SideNav from "@/app/ui/dash/sidenav";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider } from "@/app/context/SidebarContext";

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

	// Equipa = permissão "dashboard.access"; cada página exige a sua permissão
	// (lib/auth/staffLevel.ts). Sem ela, volta ao Painel.
	const isAdmin = useMemo(() => isStaff(user), [user]);
	const agentBlocked = isAdmin && !canOpen(user, pathname);

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
		if (agentBlocked) router.replace("/dashboard");
	}, [isLoading, isAuthenticated, isAdmin, agentBlocked, isLoginPage, router]);

	// Página de login: mostra form (ou null se loading / já logado)
	if (isLoginPage) {
		if (isLoading || isAuthenticated) return null; // evita flash antes do redirect
		return <>{children}</>;
	}

	// Outras páginas: bloqueia até validar auth + admin
	if (isLoading || !isAuthenticated || !isAdmin || agentBlocked) {
		return null;
	}

	return (
		<SidebarProvider>
			<div className="min-h-screen bg-background dashboard-theme">
				<div className="flex flex-col lg:flex-row min-h-screen">
					<SideNav />
					<div className="flex-1 min-w-0">{children}</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
