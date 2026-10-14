"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save, ShieldCheck, Trash2, Users } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { AppSettingRow, PermissionRow, RoleRow } from "@/lib/api/types";
import { useAuth } from "@/app/auth/AuthContext";
import { can, rankOf } from "@/lib/auth/staffLevel";

// Papéis e permissões (permissão "roles.manage"). Tudo isto está na base de
// dados: cada papel tem um nível (rank: só se gerem contas de nível abaixo) e
// as suas permissões. A API protege contra ficar sem ninguém que consiga voltar
// a mudar isto, contra dar níveis acima do seu e permissões que não se têm.

type Draft = { label: string; description: string; rank: number; permissions: Set<string> };

const toDraft = (r: RoleRow): Draft => ({ label: r.label, description: r.description ?? "", rank: r.rank, permissions: new Set(r.permissions) });

export default function RolesPage() {
	const { user } = useAuth();
	const [roles, setRoles] = useState<RoleRow[]>([]);
	const [perms, setPerms] = useState<PermissionRow[]>([]);
	const [settings, setSettings] = useState<AppSettingRow[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [draft, setDraft] = useState<Draft | null>(null);
	const [saving, setSaving] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	const myRank = rankOf(user);
	const myPerms = useMemo(() => new Set<string>((user as any)?.permissions ?? []), [user]);

	async function load(keep?: string) {
		try {
			const [r, p, st] = await Promise.all([
				apiFetch<RoleRow[]>(endpoints.dashboard.roles),
				apiFetch<PermissionRow[]>(endpoints.dashboard.permissions),
				apiFetch<AppSettingRow[]>(endpoints.dashboard.appSettings),
			]);
			setRoles(r);
			setPerms(p);
			setSettings(st);
			const id = keep ?? selected ?? r[0]?.id ?? null;
			setSelected(id);
			const role = r.find((x) => x.id === id);
			setDraft(role ? toDraft(role) : null);
		} catch (e: any) {
			setErr(e?.message || "Erro ao carregar os papéis.");
		}
	}

	useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

	const role = roles.find((r) => r.id === selected) ?? null;
	const groups = useMemo(() => {
		const m = new Map<string, PermissionRow[]>();
		perms.forEach((p) => m.set(p.group, [...(m.get(p.group) ?? []), p]));
		return [...m.entries()];
	}, [perms]);

	// Só se mexe em papéis de nível até ao seu.
	const editable = !!role && role.rank <= myRank && can(user, "roles.manage");

	function pick(r: RoleRow) {
		setSelected(r.id);
		setDraft(toDraft(r));
	}

	function toggle(code: string) {
		if (!draft) return;
		const next = new Set(draft.permissions);
		next.has(code) ? next.delete(code) : next.add(code);
		setDraft({ ...draft, permissions: next });
	}

	async function save() {
		if (!role || !draft) return;
		setSaving(true);
		try {
			await apiFetch(endpoints.dashboard.role(role.id), {
				method: "PUT",
				body: JSON.stringify({ label: draft.label, description: draft.description, rank: draft.rank, permissions: [...draft.permissions] }),
			});
			await load(role.id);
			Swal.fire({ icon: "success", title: "Guardado", text: "As permissões valem já para quem tem este papel.", confirmButtonColor: "#3baa4e", timer: 2500 });
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Não foi guardado", text: e?.message, confirmButtonColor: "#3085d6" });
		} finally {
			setSaving(false);
		}
	}

	async function create() {
		const res = await Swal.fire({
			title: "Novo papel",
			html: `<input id="nr-label" class="swal2-input" style="width:100%;margin:8px 0" placeholder="Nome (ex.: Contabilidade)">`
				+ `<input id="nr-rank" type="number" min="0" max="${myRank}" class="swal2-input" style="width:100%;margin:8px 0" placeholder="Nível (0 a ${myRank})">`
				+ `<p style="font-size:12px;color:#71717a;text-align:left;margin:4px 0 0">O nível decide quem gere quem: só se gerem contas de nível abaixo do seu. Referência: Superadmin 300, Admin 200, Agente 100, Cliente 0. As permissões escolhem-se a seguir.</p>`,
			showCancelButton: true, confirmButtonText: "Criar", cancelButtonText: "Voltar",
			confirmButtonColor: "#3baa4e", cancelButtonColor: "#71717a",
			preConfirm: () => {
				const label = (document.getElementById("nr-label") as HTMLInputElement).value.trim();
				const rank = Number((document.getElementById("nr-rank") as HTMLInputElement).value);
				if (!label) return Swal.showValidationMessage("Indique o nome."), false;
				if (!Number.isInteger(rank) || rank < 0 || rank > myRank) return Swal.showValidationMessage(`Nível entre 0 e ${myRank}.`), false;
				return { label, rank };
			},
		});
		if (!res.isConfirmed || !res.value) return;
		try {
			const created = await apiFetch<RoleRow>(endpoints.dashboard.roles, {
				method: "POST",
				body: JSON.stringify({ label: res.value.label, rank: res.value.rank, permissions: [] }),
			});
			await load(created.id);
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message, confirmButtonColor: "#3085d6" });
		}
	}

	async function remove() {
		if (!role) return;
		const ok = await Swal.fire({
			title: `Apagar o papel ${role.label}?`, icon: "warning", showCancelButton: true,
			confirmButtonColor: "#d33", cancelButtonColor: "#71717a", confirmButtonText: "Apagar", cancelButtonText: "Voltar",
		});
		if (!ok.isConfirmed) return;
		try {
			await apiFetch(endpoints.dashboard.role(role.id), { method: "DELETE" });
			setSelected(null);
			await load(roles.find((r) => r.id !== role.id)?.id);
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Não foi apagado", text: e?.message, confirmButtonColor: "#3085d6" });
		}
	}

	async function saveSetting(s: AppSettingRow, value: string) {
		try {
			await apiFetch(endpoints.dashboard.appSetting(s.key), { method: "PUT", body: JSON.stringify({ value }) });
			await load();
			Swal.fire({ icon: "success", title: "Guardado", confirmButtonColor: "#3baa4e", timer: 1800 });
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Não foi guardado", text: e?.message, confirmButtonColor: "#3085d6" });
		}
	}

	const dirty = !!role && !!draft && (draft.label !== role.label || draft.description !== (role.description ?? "") || draft.rank !== role.rank
		|| draft.permissions.size !== role.permissions.length || role.permissions.some((p) => !draft.permissions.has(p)));

	return (
		<div>
			<TopNav
				title="Papéis e permissões"
				subtitle="Quem pode fazer o quê (guardado na base de dados)"
				right={
					<button onClick={create} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
						<Plus size={16} />
						<span>Novo papel</span>
					</button>
				}
			/>
			<PageShell>
				<div className="max-w-7xl mx-auto space-y-8">
					{err && <p className="text-sm font-semibold text-destructive">{err}</p>}

					<div className="grid gap-6 lg:grid-cols-[280px_1fr]">
						{/* Lista dos papéis */}
						<div className="card-solid p-3 border-zinc-200 space-y-1 self-start">
							{roles.map((r) => (
								<button
									key={r.id}
									onClick={() => pick(r)}
									className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors ${r.id === selected ? "bg-primary/10 text-primary" : "hover:bg-zinc-50 text-zinc-700"}`}
								>
									<div className="flex items-center justify-between gap-2">
										<span className="font-bold text-sm">{r.label}</span>
										<span className="text-[10px] font-black text-zinc-400">NÍVEL {r.rank}</span>
									</div>
									<div className="flex items-center gap-2 text-[11px] text-zinc-500">
										<Users size={12} /> {r.users} {r.users === 1 ? "conta" : "contas"} · {r.permissions.length} permissões
										{r.is_staff ? " · painel" : " · site"}
									</div>
								</button>
							))}
						</div>

						{/* Papel escolhido */}
						{role && draft && (
							<div className="card-solid p-5 md:p-6 border-zinc-200 space-y-6">
								<div className="grid gap-4 sm:grid-cols-[1fr_140px]">
									<div className="space-y-1.5">
										<label htmlFor="role-label" className="text-xs font-bold uppercase tracking-tight text-gray-400">Nome</label>
										<input id="role-label" disabled={!editable} value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })}
											className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none" />
									</div>
									<div className="space-y-1.5">
										<label htmlFor="role-rank" className="text-xs font-bold uppercase tracking-tight text-gray-400">Nível</label>
										<input id="role-rank" type="number" min={0} max={myRank} disabled={!editable} value={draft.rank}
											onChange={(e) => setDraft({ ...draft, rank: Number(e.target.value) })}
											className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none" />
									</div>
								</div>
								<div className="space-y-1.5">
									<label htmlFor="role-desc" className="text-xs font-bold uppercase tracking-tight text-gray-400">Descrição</label>
									<input id="role-desc" disabled={!editable} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
										className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none" />
								</div>
								<p className="text-xs text-zinc-500 m-0">
									Código: <code>{role.name}</code>{role.system ? " · papel de base (não se apaga)" : ""}. Só se gerem contas de nível abaixo do seu; com o mesmo nível, só por pedido com período probatório.
									{!editable && " Este papel tem um nível acima do seu: só pode ver."}
								</p>

								{groups.map(([group, list]) => (
									<fieldset key={group} className="space-y-2">
										<legend className="text-sm font-extrabold text-zinc-700 mb-1">{group}</legend>
										<div className="grid gap-2 sm:grid-cols-2">
											{list.map((p) => {
												const checked = draft.permissions.has(p.code);
												// Não se dá o que não se tem (a API recusa igual).
												const blocked = !checked && !myPerms.has(p.code);
												return (
													<label key={p.code} className={`flex items-start gap-3 rounded-lg border p-3 ${checked ? "border-primary/40 bg-primary/5" : "border-zinc-200"} ${editable && !blocked ? "cursor-pointer" : "opacity-60"}`}>
														<input type="checkbox" className="mt-1" checked={checked} disabled={!editable || blocked} onChange={() => toggle(p.code)} />
														<span>
															<span className="block text-sm font-semibold text-zinc-800">{p.label}</span>
															<span className="block text-[11px] text-zinc-500">{p.description}</span>
															<code className="text-[10px] text-zinc-400">{p.code}</code>
														</span>
													</label>
												);
											})}
										</div>
									</fieldset>
								))}

								{editable && (
									<div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-zinc-100">
										{!role.system && (
											<button onClick={remove} className="btn-outline inline-flex items-center gap-2 text-red-600"><Trash2 size={16} /> Apagar papel</button>
										)}
										<button onClick={save} disabled={!dirty || saving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
											<Save size={16} /> {saving ? "A guardar…" : "Guardar"}
										</button>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Regras configuráveis (app_settings) */}
					{settings.length > 0 && (
						<section className="card-solid p-5 md:p-6 border-zinc-200 space-y-4">
							<h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-500 flex items-center gap-2 m-0">
								<ShieldCheck size={16} /> Regras
							</h3>
							{settings.map((s) => (
								<SettingField key={s.key} setting={s} roles={roles} onSave={(v) => saveSetting(s, v)} />
							))}
						</section>
					)}
				</div>
			</PageShell>
		</div>
	);
}

function SettingField({ setting, roles, onSave }: { setting: AppSettingRow; roles: RoleRow[]; onSave: (v: string) => void }) {
	const [value, setValue] = useState(setting.value);
	useEffect(() => setValue(setting.value), [setting.value]);
	const isRole = setting.key === "accounts.client_role";
	const cls = "w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none";
	return (
		<div className="grid gap-2 sm:grid-cols-[1fr_220px_auto] sm:items-end">
			<div>
				<label htmlFor={`st-${setting.key}`} className="block text-sm font-semibold text-zinc-800">{setting.label}</label>
				<p className="text-[11px] text-zinc-500 m-0">{setting.description}</p>
			</div>
			{isRole ? (
				<select id={`st-${setting.key}`} className={cls} value={value} onChange={(e) => setValue(e.target.value)}>
					{roles.filter((r) => !r.is_staff).map((r) => <option key={r.id} value={r.name}>{r.label}</option>)}
				</select>
			) : (
				<input id={`st-${setting.key}`} className={cls} value={value} onChange={(e) => setValue(e.target.value)} />
			)}
			<button className="btn-primary" disabled={value === setting.value} onClick={() => onSave(value)}>Guardar</button>
		</div>
	);
}
