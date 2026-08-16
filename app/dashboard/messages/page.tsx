"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Search, Mail, MailOpen, Trash2, Reply, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { MessageRow } from "@/lib/api/types";
import { fmtDateTime } from "@/lib/utils/format";

function timeAgo(iso: string) {
	const diffMs = Date.now() - new Date(iso).getTime();
	const minutes = Math.floor(diffMs / 60000);
	if (minutes < 1) return "agora";
	if (minutes < 60) return `há ${minutes}min`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `há ${hours}h`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `há ${days}d`;
	return fmtDateTime(iso).split(" ")[0];
}

function initials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join("");
}

export default function MessagesPage() {
	const [rows, setRows] = useState<MessageRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState<number | null>(null);

	async function fetchMessages() {
		setLoading(true);
		setErr(null);
		try {
			const data = await apiFetch<MessageRow[]>(endpoints.messages.list());
			setRows(data);
		} catch (e: any) {
			setErr(e?.message || "Erro ao carregar mensagens.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchMessages();
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter(
			(m) =>
				m.name.toLowerCase().includes(q) ||
				m.email.toLowerCase().includes(q) ||
				(m.subject ?? "").toLowerCase().includes(q) ||
				m.message.toLowerCase().includes(q)
		);
	}, [rows, query]);

	const selected = rows.find((m) => m.id === selectedId) ?? null;
	const unreadCount = rows.filter((m) => !m.read).length;

	async function handleSelect(row: MessageRow) {
		setSelectedId(row.id);
		if (!row.read) {
			setRows((prev) => prev.map((m) => (m.id === row.id ? { ...m, read: true } : m)));
			try {
				await apiFetch(endpoints.messages.markRead(row.id), { method: "PATCH" });
			} catch {
				setRows((prev) => prev.map((m) => (m.id === row.id ? { ...m, read: false } : m)));
			}
		}
	}

	async function handleToggleRead(row: MessageRow) {
		const nextRead = !row.read;
		setRows((prev) => prev.map((m) => (m.id === row.id ? { ...m, read: nextRead } : m)));
		try {
			await apiFetch(nextRead ? endpoints.messages.markRead(row.id) : endpoints.messages.markUnread(row.id), {
				method: "PATCH",
			});
		} catch {
			setRows((prev) => prev.map((m) => (m.id === row.id ? { ...m, read: !nextRead } : m)));
		}
	}

	async function handleDelete(row: MessageRow) {
		const result = await Swal.fire({
			title: "Apagar mensagem?",
			text: `A mensagem de ${row.name} será eliminada definitivamente.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sim, apagar",
			cancelButtonText: "Cancelar",
		});
		if (!result.isConfirmed) return;
		try {
			await apiFetch(endpoints.messages.delete(row.id), { method: "DELETE" });
			setRows((prev) => prev.filter((m) => m.id !== row.id));
			if (selectedId === row.id) setSelectedId(null);
		} catch (e: any) {
			Swal.fire({ icon: "error", title: "Erro", text: e?.message || "Erro ao apagar mensagem.", confirmButtonColor: "#3085d6" });
		}
	}

	function mailtoHref(row: MessageRow) {
		const subject = encodeURIComponent(row.subject ? `Re: ${row.subject}` : "Re: a sua mensagem");
		return `mailto:${row.email}?subject=${subject}`;
	}

	if (loading) {
		return (
			<div>
				<TopNav title="Mensagens" subtitle="Mensagens recebidas pelo formulário de contacto do site" />
				<PageShell>
					<div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
						<MessageSquare className="w-10 h-10 text-primary animate-pulse" />
						<p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Abrindo Mensagens...</p>
					</div>
				</PageShell>
			</div>
		);
	}

	if (err) {
		return (
			<div>
				<TopNav title="Mensagens" subtitle="Mensagens recebidas pelo formulário de contacto do site" />
				<PageShell>
					<div className="flex flex-col h-[60vh] items-center justify-center gap-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
						<div className="text-center max-w-lg px-6">
							<h2 className="text-xl font-extrabold text-destructive mb-3 uppercase tracking-tight">Erro de Comunicação</h2>
							<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed truncate">{err}</p>
							<button onClick={fetchMessages} className="btn-primary px-10">Tentar Novamente</button>
						</div>
					</div>
				</PageShell>
			</div>
		);
	}

	return (
		<div>
			<TopNav
				title="Mensagens"
				subtitle={`Caixa de entrada · ${unreadCount} não lida${unreadCount === 1 ? "" : "s"}`}
			/>
			<PageShell>
				<div className="max-w-7xl mx-auto">
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden flex h-[75vh] min-h-[500px]">
						{/* Lista de mensagens — estilo caixa de entrada */}
						<div className={`w-full md:w-[360px] shrink-0 border-r border-zinc-100 dark:border-zinc-800 flex flex-col ${selected ? "hidden md:flex" : "flex"}`}>
							<div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
									<input
										type="text"
										placeholder="Pesquisar mensagens..."
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary/20"
									/>
								</div>
							</div>
							<div className="flex-1 overflow-y-auto">
								{filtered.length === 0 ? (
									<div className="py-16 text-center text-zinc-400 text-sm font-medium px-6">
										{query ? "Nenhuma mensagem encontrada." : "Sem mensagens recebidas."}
									</div>
								) : (
									filtered.map((row) => (
										<button
											key={row.id}
											onClick={() => handleSelect(row)}
											className={`w-full text-left px-4 py-3.5 border-b border-zinc-50 dark:border-zinc-800/50 flex gap-3 transition-colors ${selectedId === row.id
												? "bg-primary/5"
												: row.read
													? "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
													: "bg-blue-50/50 dark:bg-blue-950/10 hover:bg-blue-50 dark:hover:bg-blue-950/20"
												}`}
										>
											<div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center text-xs font-black shrink-0 border border-primary/10">
												{initials(row.name)}
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex items-center justify-between gap-2">
													<span className={`text-sm truncate ${row.read ? "font-medium text-zinc-600 dark:text-zinc-300" : "font-black text-zinc-900 dark:text-zinc-50"}`}>
														{row.name}
													</span>
													<span className="text-[10px] text-zinc-400 shrink-0">{timeAgo(row.createdAt)}</span>
												</div>
												<div className={`text-xs truncate ${row.read ? "text-zinc-400" : "text-zinc-700 dark:text-zinc-300 font-bold"}`}>
													{row.subject || "(sem assunto)"}
												</div>
												<div className="text-[11px] text-zinc-400 truncate">{row.message}</div>
											</div>
											{!row.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
										</button>
									))
								)}
							</div>
						</div>

						{/* Painel de leitura */}
						<div className={`flex-1 flex-col ${selected ? "flex" : "hidden md:flex"}`}>
							{!selected ? (
								<div className="flex-1 flex flex-col items-center justify-center text-zinc-300 gap-3">
									<Mail className="w-16 h-16" />
									<p className="text-sm font-bold text-zinc-400">Selecione uma mensagem para ler</p>
								</div>
							) : (
								<>
									<div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4">
										<div className="flex items-start gap-3 min-w-0">
											<button
												onClick={() => setSelectedId(null)}
												className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-zinc-700"
											>
												<ArrowLeft size={18} />
											</button>
											<div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center text-sm font-black shrink-0 border border-primary/10">
												{initials(selected.name)}
											</div>
											<div className="min-w-0">
												<h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 truncate">{selected.subject || "(sem assunto)"}</h2>
												<p className="text-sm text-zinc-500 truncate">
													<span className="font-bold text-zinc-700 dark:text-zinc-300">{selected.name}</span> · {selected.email}
												</p>
												<p className="text-[11px] text-zinc-400 mt-0.5">{fmtDateTime(selected.createdAt)}</p>
											</div>
										</div>
										<div className="flex items-center gap-1.5 shrink-0">
											<a
												href={mailtoHref(selected)}
												title="Responder por email"
												className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 text-xs font-bold"
											>
												<Reply size={14} />
												<span className="hidden sm:inline">Responder</span>
											</a>
											<button
												onClick={() => handleToggleRead(selected)}
												title={selected.read ? "Marcar como não lida" : "Marcar como lida"}
												className="p-2.5 rounded-xl text-zinc-400 hover:text-primary hover:bg-primary/5 transition-colors"
											>
												{selected.read ? <Mail size={16} /> : <MailOpen size={16} />}
											</button>
											<button
												onClick={() => handleDelete(selected)}
												title="Apagar"
												className="p-2.5 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>
									<div className="flex-1 overflow-y-auto p-6">
										<p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
											{selected.message}
										</p>
									</div>
									<div className="p-5 border-t border-zinc-100 dark:border-zinc-800">
										<a
											href={mailtoHref(selected)}
											className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors py-3 text-sm font-bold text-zinc-700 dark:text-zinc-200"
										>
											<Reply size={15} />
											Responder a {selected.name} por email
										</a>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</PageShell>
		</div>
	);
}
