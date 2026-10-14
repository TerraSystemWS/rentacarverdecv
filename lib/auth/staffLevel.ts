// Níveis da equipa (mesmas regras que StaffPolicy na API, que é quem decide;
// aqui só servem para mostrar ou esconder botões e menus).
//   SUPERADMIN > ADMIN > AGENT > CLIENT
export type StaffLevel = "SUPERADMIN" | "ADMIN" | "AGENT" | "CLIENT";

const RANK: Record<StaffLevel, number> = { CLIENT: 0, AGENT: 1, ADMIN: 2, SUPERADMIN: 3 };

export const LEVEL_LABEL: Record<StaffLevel, string> = {
	SUPERADMIN: "Superadmin",
	ADMIN: "Admin",
	AGENT: "Agente",
	CLIENT: "Cliente",
};

export function rolesOf(me: any): string[] {
	return me?.roles ?? me?.authorities?.map((a: any) => a.authority) ?? [];
}

export function levelOfRoles(roles: string[] | undefined | null): StaffLevel {
	const r = roles ?? [];
	if (r.includes("ROLE_SUPERADMIN")) return "SUPERADMIN";
	if (r.includes("ROLE_ADMIN") || r.includes("ADMIN")) return "ADMIN";
	if (r.includes("ROLE_AGENT")) return "AGENT";
	return "CLIENT";
}

export const levelOf = (me: any): StaffLevel => levelOfRoles(rolesOf(me));
export const isStaffLevel = (l: StaffLevel) => l !== "CLIENT";

/** Desativar/reativar, apagar dados, repor palavra-passe: só a níveis abaixo do seu (Admin ou Superadmin). */
export function canManage(actor: StaffLevel, target: StaffLevel) {
	return RANK[actor] >= RANK.ADMIN && RANK[actor] > RANK[target];
}

/** Níveis de equipa que cada um pode criar: Superadmin qualquer um, Admin só Agentes. */
export function creatableLevels(actor: StaffLevel): StaffLevel[] {
	if (actor === "SUPERADMIN") return ["SUPERADMIN", "ADMIN", "AGENT"];
	if (actor === "ADMIN") return ["AGENT"];
	return [];
}

/** Páginas do painel abertas aos Agentes (só operações). */
export const AGENT_PAGES = ["/dashboard", "/dashboard/bookings", "/dashboard/vehicles", "/dashboard/calendar", "/dashboard/messages", "/dashboard/users"];

export function agentCanOpen(pathname: string) {
	return AGENT_PAGES.some((p) => pathname === p || (p !== "/dashboard" && pathname.startsWith(p + "/")));
}
