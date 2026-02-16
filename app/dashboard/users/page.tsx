"use client";

import { useEffect, useState, useMemo } from "react";
import { Users, Plus, Shield, User as UserIcon } from "lucide-react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import UserDialog from "./_components/user-dialog";
import UserForm from "./_components/user-form";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { UserRow } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

type TabType = "customers" | "admins";

export default function UsersPage() {
	const [rows, setRows] = useState<UserRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);

	// Tabs State
	const [activeTab, setActiveTab] = useState<TabType>("customers");

	// Dialog State
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

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
					<button
						onClick={() => setIsDialogOpen(true)}
						className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
					>
						<Plus size={16} />
						<span>Novo Administrador</span>
					</button>
				}
			/>

			<PageShell>
				<div className="max-w-7xl mx-auto space-y-6">

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
							{ key: "is_active", label: "Status" },
							{ key: "created_at", label: "Registado em" },
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
		</div>
	);
}
