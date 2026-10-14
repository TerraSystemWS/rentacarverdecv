"use client";

import { useEffect, useState, useMemo } from "react";
import { Users, Plus, Shield, User as UserIcon, Ban, CheckCircle2, UserX, MailCheck, UserPlus, KeyRound, ArrowUpDown, ShieldAlert } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import UserDialog from "./_components/user-dialog";
import UserForm from "./_components/user-form";
import CreateClientDialog from "./_components/create-client-dialog";
import StaffRequests, { useStaffRequests } from "./_components/staff-requests";
import { useAuth } from "@/app/auth/AuthContext";
import { LEVEL_LABEL, canManage, creatableLevels, levelOf, levelOfRoles, type StaffLevel } from "@/lib/auth/staffLevel";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { UserRow } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

type TabType = "customers" | "admins";

function escapeHtml(s: string) {
	return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

// Nível de uma linha (a API devolve "level"; respostas antigas só trazem os papéis).
const rowLevel = (u: UserRow): StaffLevel => u.level ?? levelOfRoles(u.roles);

const LEVEL_BADGE: Record<StaffLevel, string> = {
	SUPERADMIN: "bg-purple-50 text-purple-700",
	ADMIN: "bg-blue-50 text-blue-700",
	AGENT: "bg-teal-50 text-teal-700",
	CLIENT: "bg-zinc-100 text-zinc-500",
};

export default function UsersPage() {
	const { user } = useAuth();
	// Quem está a usar o painel: decide que botões aparecem (a API confirma sempre).
	const myLevel = levelOf(user);
	const myId = String((user as any)?.id ?? "");
	const { requests, reload: reloadRequests } = useStaffRequests(myLevel === "SUPERADMIN");
	const [rows, setRows] = useState<UserRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);

	// Tabs State
	const [activeTab, setActiveTab] = useState<TabType>("customers");

	// Dialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

	async function fetchUsers() {
		setLoading(true);
		setErr(null);
		try {
			const data = await apiFetch<UserRow[]>(endpoints.users.list(100));
			setRows(
				data.map((u) => ({
					...u,
					created_at: fmtDateTime(u.created_at),
				}))
			);
		} catch (e: any) {
			setErr(e?.message || "Erro ao carregar utilizadores.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchUsers();
	}, []);

	const filteredRows = useMemo(() => {
		return rows.filter((u) => (activeTab === "admins") === (rowLevel(u) !== "CLIENT"));
	}, [rows, activeTab]);

	// Atualiza a linha com a resposta da API (mantém a data já formatada).
	const replaceRow = (updated: UserRow) =>
		setRows(prev => prev.map(r => r.id === updated.id ? { ...updated, created_at: r.created_at } : r));

	async function handleToggleActive(u: UserRow) {
		const disabling = u.is_active;
		const result = await Swal.fire({
			title: disabling ? "Desativar conta?" : "Reativar conta?",
			text: disabling
				? `${u.full_name} deixa de conseguir entrar e é desligado já de todas as sessões (site e app). As reservas não mudam.`
				: `${u.full_name} volta a conseguir entrar com a palavra-passe que tinha.`,
			icon: disabling ? "warning" : "question",
			showCancelButton: true,
			confirmButtonColor: disabling ? "#d33" : "#3baa4e",
			cancelButtonColor: "#71717a",
			confirmButtonText: disabling ? "Sim, desativar" : "Sim, reativar",
			cancelButtonText: "Voltar",
		});
		if (!result.isConfirmed) return;
		try {
			replaceRow(await apiFetch<UserRow>(endpoints.users.setActive(u.id), {
				method: "PATCH",
				body: JSON.stringify({ active: !u.is_active }),
			}));
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Não foi possível alterar a conta.", confirmButtonColor: "#3085d6" });
		}
	}

	// Irreversível: pede para escrever APAGAR.
	async function handleAnonymize(u: UserRow) {
		const result = await Swal.fire({
			title: "Apagar dados do cliente?",
			html: `<p style="text-align:left;font-size:14px;line-height:1.5">Os dados pessoais de <b>${escapeHtml(u.full_name)}</b> (nome, email, telefone, morada, documentos e foto da carta) são <b>apagados para sempre</b> e a conta fica desativada.</p>`
				+ `<p style="text-align:left;font-size:14px;line-height:1.5;margin-top:8px">As reservas e os recibos ficam guardados como <i>Cliente removido</i>, para a contabilidade. <b>Não é possível desfazer.</b></p>`
				+ `<p style="font-size:13px;margin-top:12px">Escreva <b>APAGAR</b> para confirmar:</p>`,
			input: "text",
			inputPlaceholder: "APAGAR",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#71717a",
			confirmButtonText: "Apagar dados",
			cancelButtonText: "Voltar",
			preConfirm: (value: string) => {
				if ((value || "").trim().toUpperCase() !== "APAGAR") {
					Swal.showValidationMessage("Escreva APAGAR para confirmar.");
					return false;
				}
				return true;
			},
		});
		if (!result.isConfirmed) return;
		try {
			replaceRow(await apiFetch<UserRow>(endpoints.users.anonymize(u.id), { method: "POST" }));
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Não foi possível apagar os dados.", confirmButtonColor: "#3085d6" });
		}
	}

	async function handleResendConfirmation(u: UserRow) {
		try {
			const res = await apiFetch<{ message: string }>(endpoints.users.resendConfirmation(u.id), { method: "POST" });
			Swal.fire({ icon: "success", title: "Email reenviado", text: res?.message, confirmButtonColor: "#3baa4e" });
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Não foi possível reenviar o email.", confirmButtonColor: "#3085d6" });
		}
	}

	// Link por email para o utilizador escolher uma palavra-passe nova (válido 1 hora).
	async function handlePasswordReset(u: UserRow) {
		const result = await Swal.fire({
			title: "Repor a palavra-passe?",
			html: `<p style="text-align:left;font-size:14px;line-height:1.5">Enviamos para <b>${escapeHtml(u.email || "")}</b> um link para escolher uma palavra-passe nova.</p>`
				+ `<p style="text-align:left;font-size:14px;line-height:1.5;margin-top:8px">O link é válido durante <b>1 hora</b> e só serve uma vez. A palavra-passe atual continua a funcionar até ser trocada; ao trocar, as sessões abertas noutros dispositivos terminam.</p>`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#3baa4e",
			cancelButtonColor: "#71717a",
			confirmButtonText: "Enviar link",
			cancelButtonText: "Voltar",
		});
		if (!result.isConfirmed) return;
		try {
			const res = await apiFetch<{ message: string }>(endpoints.users.passwordReset(u.id), { method: "POST" });
			Swal.fire({ icon: "success", title: "Link enviado", text: res?.message, confirmButtonColor: "#3baa4e" });
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Não foi possível enviar o link.", confirmButtonColor: "#3085d6" });
		}
	}

	// Promover/rebaixar Admins e Agentes (só Superadmin; um Superadmin só por pedido).
	async function handleChangeLevel(u: UserRow) {
		const current = rowLevel(u);
		const { value: level } = await Swal.fire({
			title: `Nível de ${escapeHtml(u.full_name)}`,
			input: "select",
			inputOptions: { SUPERADMIN: "Superadmin", ADMIN: "Admin", AGENT: "Agente" },
			inputValue: current,
			text: "As sessões abertas desta conta terminam; o novo nível vale a partir do próximo login.",
			showCancelButton: true,
			confirmButtonColor: "#3baa4e",
			cancelButtonColor: "#71717a",
			confirmButtonText: "Mudar nível",
			cancelButtonText: "Voltar",
			inputValidator: (v) => (v === current ? "Escolha um nível diferente." : null),
		});
		if (!level) return;
		try {
			replaceRow(await apiFetch<UserRow>(endpoints.users.setLevel(u.id), { method: "PATCH", body: JSON.stringify({ level }) }));
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Não foi possível mudar o nível.", confirmButtonColor: "#3085d6" });
		}
	}

	// Desativar ou rebaixar outro Superadmin: pedido com 7 dias de período probatório.
	async function handleStaffRequest(u: UserRow) {
		const res = await Swal.fire({
			title: "Pedido sobre um Superadmin",
			html: `<p style="text-align:left;font-size:14px;line-height:1.5"><b>${escapeHtml(u.full_name)}</b> fica <b>7 dias em período probatório</b>: pode aceitar ou contestar. Se contestar, decidem os outros Superadmins (sem contar consigo). Sem decisão em 7 dias, o pedido aplica-se.</p>`
				+ `<select id="sr-action" class="swal2-select" style="width:100%;margin:12px 0 0"><option value="DEACTIVATE">Desativar a conta</option><option value="DEMOTE:ADMIN">Rebaixar para Admin</option><option value="DEMOTE:AGENT">Rebaixar para Agente</option></select>`
				+ `<textarea id="sr-reason" class="swal2-textarea" style="width:100%;margin:12px 0 0" placeholder="Motivo (obrigatório)"></textarea>`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#71717a",
			confirmButtonText: "Fazer o pedido",
			cancelButtonText: "Voltar",
			preConfirm: () => {
				const action = (document.getElementById("sr-action") as HTMLSelectElement).value;
				const reason = (document.getElementById("sr-reason") as HTMLTextAreaElement).value.trim();
				if (!reason) {
					Swal.showValidationMessage("Escreva o motivo.");
					return false;
				}
				return { action, reason };
			},
		});
		if (!res.isConfirmed || !res.value) return;
		const [action, newLevel] = (res.value.action as string).split(":");
		try {
			await apiFetch(endpoints.users.staffRequest(u.id), {
				method: "POST",
				body: JSON.stringify({ action, newLevel: newLevel ?? null, reason: res.value.reason }),
			});
			reloadRequests();
			Swal.fire({ icon: "success", title: "Pedido feito", text: `${u.full_name} foi avisado e tem 7 dias para responder.`, confirmButtonColor: "#3baa4e" });
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Não foi possível fazer o pedido.", confirmButtonColor: "#3085d6" });
		}
	}

	const handleClientCreated = (created: UserRow) => {
		setRows(prev => [{ ...created, created_at: fmtDateTime(created.created_at) }, ...prev]);
		setActiveTab("customers");
		Swal.fire({
			icon: "success",
			title: "Cliente criado",
			text: `Enviámos um email para ${created.email} confirmar a conta e escolher a palavra-passe. A reserva em nome do cliente fica possível depois de ele confirmar.`,
			confirmButtonColor: "#3baa4e",
		});
	};

	const handleCreateAdmin = async (userData: any) => {
		setIsSubmitting(true);
		try {
			const created = await apiFetch<UserRow>(endpoints.users.create, {
				method: "POST",
				body: JSON.stringify(userData),
			});

			const formatted = {
				...created,
				created_at: fmtDateTime(created.created_at),
			};

			setRows(prev => [formatted, ...prev]);
			setIsDialogOpen(false);
		} catch (e: any) {
			throw e; // Let UserForm handle it
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div>
				<TopNav title="Utilizadores" subtitle="Gestão de acesso" />
				<PageShell>
					<div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
						<Users className="w-10 h-10 text-primary animate-pulse" />
						<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listando Utilizadores...</p>
					</div>
				</PageShell>
			</div>
		);
	}

	if (err) {
		return (
			<div>
				<TopNav title="Utilizadores" subtitle="Gestão de acesso" />
				<PageShell>
					<div className="flex flex-col h-[60vh] items-center justify-center gap-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
						<div className="text-center max-w-lg px-6">
							<h2 className="text-xl font-extrabold text-destructive mb-3 uppercase tracking-tight">Falha na Base de Dados</h2>
							<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed truncate">{err}</p>
							<button onClick={fetchUsers} className="btn-primary px-10">Tentar Novamente</button>
						</div>
					</div>
				</PageShell>
			</div>
		);
	}

	return (
		<div>
			<TopNav
				title="Utilizadores"
				subtitle="Gestão de acesso"
				right={
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setIsClientDialogOpen(true)}
							className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
						>
							<UserPlus size={16} />
							<span>Novo Cliente</span>
						</button>
						{creatableLevels(myLevel).length > 0 && (
							<button
								onClick={() => setIsDialogOpen(true)}
								className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-zinc-700 hover:bg-zinc-50 transition-all active:scale-95"
							>
								<Plus size={16} />
								<span>Novo membro da equipa</span>
							</button>
						)}
					</div>
				}
			/>

			<PageShell>
				<div className="max-w-7xl mx-auto space-y-10">

					{/* Tabs */}
					<div className="flex border-b border-gray-200 gap-8">
						<button
							onClick={() => setActiveTab("customers")}
							className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === "customers" ? "text-primary" : "text-gray-400 hover:text-gray-600"
								}`}
						>
							<div className="flex items-center gap-2">
								<UserIcon size={14} />
								Clientes ({rows.filter(u => rowLevel(u) === "CLIENT").length})
							</div>
							{activeTab === "customers" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
						</button>
						<button
							onClick={() => setActiveTab("admins")}
							className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === "admins" ? "text-primary" : "text-gray-400 hover:text-gray-600"
								}`}
						>
							<div className="flex items-center gap-2">
								<Shield size={14} />
								Equipa ({rows.filter(u => rowLevel(u) !== "CLIENT").length})
							</div>
							{activeTab === "admins" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
						</button>
					</div>

					{myLevel === "SUPERADMIN" && activeTab === "admins" && (
						<StaffRequests requests={requests} onChanged={() => { reloadRequests(); fetchUsers(); }} />
					)}

					<DataTable
						columns={[
							{ key: "full_name", label: "Utilizador / Nome" },
							{ key: "email", label: "Email" },
							...(activeTab === "admins" ? [{
								key: "level",
								label: "Nível",
								render: (u: UserRow) => {
									const l = rowLevel(u);
									const pending = requests.some(r => r.target_id === u.id && (r.status === "PENDING" || r.status === "CONTESTED"));
									return (
										<div className="flex flex-wrap gap-1">
											<span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${LEVEL_BADGE[l]}`}>{LEVEL_LABEL[l]}</span>
											{pending && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600">Período probatório</span>}
										</div>
									);
								},
							}] : []),
							{
								key: "is_active",
								label: "Estado",
								render: (u: UserRow) => {
									const [label, cls] = u.anonymized_at
										? ["Removido", "bg-zinc-100 text-zinc-500"]
										: !u.is_active ? ["Desativado", "bg-red-50 text-red-600"]
										: u.email_verified === false ? ["Por confirmar", "bg-amber-50 text-amber-700"]
										: ["Ativo", "bg-emerald-50 text-emerald-600"];
									return <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${cls}`}>{label}</span>;
								},
							},
							{ key: "created_at", label: "Registado em" },
							{
								key: "actions",
								label: "Ações",
								render: (u: UserRow) => {
									if (u.anonymized_at) return <span className="text-xs text-zinc-400">—</span>;
									const l = rowLevel(u);
									const manage = canManage(myLevel, l) && u.id !== myId;
									const otherSuper = myLevel === "SUPERADMIN" && l === "SUPERADMIN" && u.id !== myId;
									const btn = "p-2 rounded-lg text-zinc-500 transition-colors";
									const actions = [
										u.email_verified === false && u.is_active && (l === "CLIENT" || manage) && (
											<button key="resend" onClick={() => handleResendConfirmation(u)} className={`${btn} hover:bg-blue-50 hover:text-blue-600`} title="Reenviar o email de confirmação da conta"><MailCheck size={18} /></button>
										),
										u.is_active && manage && (
											<button key="reset" onClick={() => handlePasswordReset(u)} className={`${btn} hover:bg-blue-50 hover:text-blue-600`} title="Enviar link para repor a palavra-passe"><KeyRound size={18} /></button>
										),
										myLevel === "SUPERADMIN" && (l === "ADMIN" || l === "AGENT") && u.id !== myId && (
											<button key="level" onClick={() => handleChangeLevel(u)} className={`${btn} hover:bg-purple-50 hover:text-purple-600`} title="Mudar o nível (promover ou rebaixar)"><ArrowUpDown size={18} /></button>
										),
										otherSuper && u.is_active && !requests.some(r => r.target_id === u.id && (r.status === "PENDING" || r.status === "CONTESTED")) && (
											<button key="request" onClick={() => handleStaffRequest(u)} className={`${btn} hover:bg-red-50 hover:text-red-600`} title="Pedir desativação ou rebaixamento (período probatório de 7 dias)"><ShieldAlert size={18} /></button>
										),
										(manage || (otherSuper && !u.is_active)) && (
											<button key="active" onClick={() => handleToggleActive(u)} className={`${btn} ${u.is_active ? "hover:bg-amber-50 hover:text-amber-600" : "hover:bg-emerald-50 hover:text-emerald-600"}`} title={u.is_active ? "Desativar conta" : "Reativar conta"}>
												{u.is_active ? <Ban size={18} /> : <CheckCircle2 size={18} />}
											</button>
										),
										l === "CLIENT" && manage && (
											<button key="anon" onClick={() => handleAnonymize(u)} className={`${btn} hover:bg-red-50 hover:text-red-600`} title="Apagar dados do cliente (anonimizar)"><UserX size={18} /></button>
										),
									].filter(Boolean);
									if (actions.length === 0) return <span className="text-xs text-zinc-400">—</span>;
									return (
										<div className="flex justify-end gap-2">
											{actions}
										</div>									);
								},
							},
						]}
						rows={filteredRows as any}
					/>
				</div>
			</PageShell>

			<UserDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				title="Novo membro da equipa"
			>
				<UserForm
					levels={creatableLevels(myLevel)}
					onSubmit={handleCreateAdmin}
					onCancel={() => setIsDialogOpen(false)}
					isSubmitting={isSubmitting}
				/>
			</UserDialog>

			<CreateClientDialog
				isOpen={isClientDialogOpen}
				onClose={() => setIsClientDialogOpen(false)}
				onCreated={handleClientCreated}
			/>
		</div>
	);
}
