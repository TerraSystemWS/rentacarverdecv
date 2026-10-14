"use client";

import { useEffect, useState, useMemo } from "react";
import { Users, Plus, Shield, User as UserIcon, Ban, CheckCircle2, UserX, MailCheck, UserPlus, KeyRound } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import UserDialog from "./_components/user-dialog";
import UserForm from "./_components/user-form";
import CreateClientDialog from "./_components/create-client-dialog";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { UserRow } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

type TabType = "customers" | "admins";

function escapeHtml(s: string) {
	return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export default function UsersPage() {
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
		return rows.filter((u) => {
			const isStaffOrAdmin = u.roles?.some(r => r === "ROLE_ADMIN" || r === "ROLE_STAFF");
			if (activeTab === "admins") return isStaffOrAdmin;
			return !isStaffOrAdmin;
		});
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
						<button
							onClick={() => setIsDialogOpen(true)}
							className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-zinc-700 hover:bg-zinc-50 transition-all active:scale-95"
						>
							<Plus size={16} />
							<span>Novo Administrador</span>
						</button>
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
								Clientes ({rows.filter(u => !u.roles?.some(r => r === "ROLE_ADMIN" || r === "ROLE_STAFF")).length})
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
								Administradores ({rows.filter(u => u.roles?.some(r => r === "ROLE_ADMIN" || r === "ROLE_STAFF")).length})
							</div>
							{activeTab === "admins" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
						</button>
					</div>

					<DataTable
						columns={[
							{ key: "full_name", label: "Utilizador / Nome" },
							{ key: "email", label: "Email" },
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
									const isAdmin = u.roles?.some(r => r === "ROLE_ADMIN" || r === "ROLE_STAFF");
									return (
										<div className="flex justify-end gap-2">
											{u.email_verified === false && u.is_active && (
												<button
													onClick={() => handleResendConfirmation(u)}
													className="p-2 rounded-lg text-zinc-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
													title="Reenviar o email de confirmação da conta"
												>
													<MailCheck size={18} />
												</button>
											)}
											{u.is_active && (
												<button
													onClick={() => handlePasswordReset(u)}
													className="p-2 rounded-lg text-zinc-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
													title="Enviar link para repor a palavra-passe"
												>
													<KeyRound size={18} />
												</button>
											)}
											<button
												onClick={() => handleToggleActive(u)}
												className={`p-2 rounded-lg transition-colors ${u.is_active ? "text-zinc-500 hover:bg-amber-50 hover:text-amber-600" : "text-zinc-500 hover:bg-emerald-50 hover:text-emerald-600"}`}
												title={u.is_active ? "Desativar conta" : "Reativar conta"}
											>
												{u.is_active ? <Ban size={18} /> : <CheckCircle2 size={18} />}
											</button>
											{!isAdmin && (
												<button
													onClick={() => handleAnonymize(u)}
													className="p-2 rounded-lg text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors"
													title="Apagar dados do cliente (anonimizar)"
												>
													<UserX size={18} />
												</button>
											)}
										</div>
									);
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
				title="Criar Novo Administrador"
			>
				<UserForm
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
