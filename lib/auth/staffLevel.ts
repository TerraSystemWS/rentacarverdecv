// Permissões de quem está a usar o painel. Vêm da base de dados (papéis e
// permissões, página Papéis e permissões) através do /auth/me; a API confirma
// sempre (@PreAuthorize). Aqui só se decide que menus, páginas e botões aparecem.

export type Me = { permissions?: string[]; rank?: number; level?: string; role_label?: string; roles?: string[] } | null | undefined;

export function can(me: Me | any, permission: string): boolean {
	return (me?.permissions ?? []).includes(permission);
}

export function canAny(me: Me | any, permissions: string[]): boolean {
	return permissions.some((p) => can(me, p));
}

/** Equipa = quem entra no painel e na app. */
export const isStaff = (me: Me | any) => can(me, "dashboard.access");

export const rankOf = (me: Me | any): number => me?.rank ?? 0;

/** Que permissão abre cada página do painel (a primeira que bate, por prefixo). */
const PAGE_PERMISSIONS: [string, string[]][] = [
	["/dashboard/bookings", ["bookings.view"]],
	["/dashboard/calendar", ["bookings.view"]],
	["/dashboard/vehicles", ["vehicles.view"]],
	["/dashboard/locations", ["locations.manage"]],
	["/dashboard/drivers", ["content.manage"]],
	["/dashboard/posts", ["content.manage"]],
	["/dashboard/gallery", ["content.manage"]],
	["/dashboard/destination-places", ["content.manage"]],
	["/dashboard/partners", ["content.manage"]],
	["/dashboard/media", ["content.manage"]],
	["/dashboard/reviews", ["reviews.manage"]],
	["/dashboard/ads", ["marketing.manage"]],
	["/dashboard/subscribers", ["marketing.manage"]],
	["/dashboard/vouchers", ["vouchers.manage"]],
	["/dashboard/invoices", ["finance.view"]],
	["/dashboard/company-settings", ["company.manage"]],
	["/dashboard/users", ["clients.view"]],
	["/dashboard/messages", ["messages.manage"]],
	["/dashboard/archived", ["archive.view"]],
	["/dashboard/roles", ["roles.manage"]],
	["/dashboard/settings", ["content.manage", "company.manage", "backup.manage"]],
];

export function canOpen(me: Me | any, pathname: string): boolean {
	if (!isStaff(me)) return false;
	const rule = PAGE_PERMISSIONS.find(([p]) => pathname === p || pathname.startsWith(p + "/"));
	return rule ? canAny(me, rule[1]) : pathname === "/dashboard";
}

/** Linha da lista de contas: nível e se é da equipa (vêm da API). */
type Row = { rank?: number; is_staff?: boolean };

/** Desativar/reativar, apagar dados, repor palavra-passe: só contas de nível abaixo, com a permissão certa. */
export function canManage(me: Me | any, row: Row): boolean {
	return rankOf(me) > (row.rank ?? 0) && can(me, row.is_staff ? "staff.manage" : "clients.manage");
}

/** Pedido com período probatório: alguém da equipa do mesmo nível. */
export function canRequest(me: Me | any, row: Row): boolean {
	return can(me, "staff.requests") && !!row.is_staff && rankOf(me) === (row.rank ?? 0);
}
