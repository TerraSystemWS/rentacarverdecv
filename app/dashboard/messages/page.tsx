"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	MessageSquare, Search, Mail, MailOpen, Trash2, ArrowLeft, Send, Paperclip, PenSquare,
	AlertTriangle, RotateCw, Bot, Globe, AtSign, X, Loader2, ChevronDown, ChevronUp,
} from "lucide-react";
import Swal from "sweetalert2";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import RichTextEditor from "@/app/ui/dash/RichTextEditor";
import { apiFetch } from "@/lib/api/client";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import type { MessageItem, MessageThread, MessageThreadSummary, MessageAttachment } from "@/lib/api/types";
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
	return (name || "?")
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join("");
}

function fmtSize(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const isBlankHtml = (html: string) => !html || html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim() === "";

function SourceBadge({ source }: { source: MessageThreadSummary["source"] }) {
	const map = {
		FORM: { label: "Site", icon: Globe, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
		EMAIL: { label: "Email", icon: AtSign, cls: "bg-blue-50 text-blue-700 border-blue-200" },
		REPLY: { label: "Enviado", icon: Send, cls: "bg-zinc-50 text-zinc-600 border-zinc-200" },
		SYSTEM: { label: "Automático", icon: Bot, cls: "bg-amber-50 text-amber-700 border-amber-200" },
	}[source] ?? { label: source, icon: Mail, cls: "bg-zinc-50 text-zinc-600 border-zinc-200" };
	return (
		<span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-bold ${map.cls}`}>
			<map.icon size={10} />
			{map.label}
		</span>
	);
}

export default function MessagesPage() {
	const [rows, setRows] = useState<MessageThreadSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [thread, setThread] = useState<MessageThread | null>(null);
	const [threadLoading, setThreadLoading] = useState(false);
	const [composing, setComposing] = useState(false);
	const [mailStatus, setMailStatus] = useState<{ canSend: boolean; canReceive: boolean } | null>(null);

	const fetchList = useCallback(async (silent = false) => {
		if (!silent) setLoading(true);
		setErr(null);
		try {
			setRows(await apiFetch<MessageThreadSummary[]>(endpoints.messages.list()));
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Erro ao carregar mensagens.");
		} finally {
			if (!silent) setLoading(false);
		}
	}, []);

	const fetchThread = useCallback(async (id: number) => {
		setThreadLoading(true);
		try {
			setThread(await apiFetch<MessageThread>(endpoints.messages.thread(id)));
		} catch (e) {
			Swal.fire({ icon: "error", title: "Erro", text: e instanceof Error ? e.message : "Erro ao abrir a conversa.", confirmButtonColor: "#3085d6" });
		} finally {
			setThreadLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchList();
		apiFetch<{ canSend: boolean; canReceive: boolean }>(endpoints.messages.mailStatus).then(setMailStatus).catch(() => setMailStatus(null));
		// Emails novos chegam pelo IMAP em segundo plano — atualizar a lista.
		const timer = setInterval(() => fetchList(true), 60000);
		return () => clearInterval(timer);
	}, [fetchList]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter(
			(m) =>
				(m.name ?? "").toLowerCase().includes(q) ||
				(m.email ?? "").toLowerCase().includes(q) ||
				(m.subject ?? "").toLowerCase().includes(q) ||
				(m.preview ?? "").toLowerCase().includes(q)
		);
	}, [rows, query]);

	const selected = rows.find((m) => m.id === selectedId) ?? null;
	const unreadCount = rows.reduce((n, m) => n + m.unread, 0);

	async function handleSelect(row: MessageThreadSummary) {
		setComposing(false);
		setSelectedId(row.id);
		setThread(null);
		fetchThread(row.id);
		if (row.unread > 0) {
			setRows((prev) => prev.map((m) => (m.id === row.id ? { ...m, read: true, unread: 0 } : m)));
			try {
				await apiFetch(endpoints.messages.markRead(row.id), { method: "PATCH" });
			} catch {
				fetchList(true);
			}
		}
	}

	async function handleToggleRead(row: MessageThreadSummary) {
		const nextRead = !row.read;
		setRows((prev) => prev.map((m) => (m.id === row.id ? { ...m, read: nextRead, unread: nextRead ? 0 : Math.max(1, m.unread) } : m)));
		try {
			await apiFetch(nextRead ? endpoints.messages.markRead(row.id) : endpoints.messages.markUnread(row.id), { method: "PATCH" });
		} finally {
			fetchList(true);
		}
	}

	async function handleDelete(row: MessageThreadSummary) {
		const result = await Swal.fire({
			title: "Apagar conversa?",
			text: `A conversa com ${row.name} será removida das Mensagens (os emails continuam na caixa de email).`,
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
			if (selectedId === row.id) {
				setSelectedId(null);
				setThread(null);
			}
		} catch (e) {
			Swal.fire({ icon: "error", title: "Erro", text: e instanceof Error ? e.message : "Erro ao apagar.", confirmButtonColor: "#3085d6" });
		}
	}

	const subtitle = `Formulário do site e email reservas@ · ${unreadCount} não lida${unreadCount === 1 ? "" : "s"}`;

	if (loading) {
		return (
			<div>
				<TopNav title="Mensagens" subtitle="Formulário do site e email reservas@" />
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
				<TopNav title="Mensagens" subtitle="Formulário do site e email reservas@" />
				<PageShell>
					<div className="flex flex-col h-[60vh] items-center justify-center gap-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
						<div className="text-center max-w-lg px-6">
							<h2 className="text-xl font-extrabold text-destructive mb-3 uppercase tracking-tight">Erro de Comunicação</h2>
							<p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed truncate">{err}</p>
							<button onClick={() => fetchList()} className="btn-primary px-10">Tentar Novamente</button>
						</div>
					</div>
				</PageShell>
			</div>
		);
	}

	const showDetail = composing || selected;

	return (
		<div>
			<TopNav title="Mensagens" subtitle={subtitle} />
			<PageShell>
				<div className="max-w-7xl mx-auto">
					{mailStatus && !mailStatus.canSend && (
						<div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
							<AlertTriangle size={16} className="shrink-0" />
							A ligação ao email reservas@ não está configurada no servidor — só aparecem as mensagens do formulário do site e não é possível responder daqui.
						</div>
					)}
					<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden flex h-[75vh] min-h-[500px]">
						{/* Lista de conversas */}
						<div className={`w-full md:w-[360px] shrink-0 border-r border-zinc-100 dark:border-zinc-800 flex flex-col ${showDetail ? "hidden md:flex" : "flex"}`}>
							<div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex gap-2">
								<div className="relative flex-1">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
									<input
										type="text"
										placeholder="Pesquisar mensagens..."
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary/20"
									/>
								</div>
								{mailStatus?.canSend && (
									<button
										onClick={() => { setComposing(true); setSelectedId(null); setThread(null); }}
										title="Escrever email"
										className="shrink-0 px-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
									>
										<PenSquare size={16} />
									</button>
								)}
							</div>
							<div className="flex-1 overflow-y-auto">
								{filtered.length === 0 ? (
									<div className="py-16 text-center text-zinc-400 text-sm font-medium px-6">
										{query ? "Nenhuma mensagem encontrada." : "Sem mensagens."}
									</div>
								) : (
									filtered.map((row) => {
										const unread = row.unread > 0;
										return (
											<button
												key={row.id}
												onClick={() => handleSelect(row)}
												className={`w-full text-left px-4 py-3.5 border-b border-zinc-50 dark:border-zinc-800/50 flex gap-3 transition-colors ${selectedId === row.id
													? "bg-primary/5"
													: !unread
														? "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
														: "bg-blue-50/50 dark:bg-blue-950/10 hover:bg-blue-50 dark:hover:bg-blue-950/20"
													}`}
											>
												<div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center text-xs font-black shrink-0 border border-primary/10">
													{initials(row.name)}
												</div>
												<div className="min-w-0 flex-1">
													<div className="flex items-center justify-between gap-2">
														<span className={`text-sm truncate ${!unread ? "font-medium text-zinc-600 dark:text-zinc-300" : "font-black text-zinc-900 dark:text-zinc-50"}`}>
															{row.name}
														</span>
														<span className="text-[10px] text-zinc-400 shrink-0">{timeAgo(row.lastAt)}</span>
													</div>
													<div className={`text-xs truncate ${!unread ? "text-zinc-400" : "text-zinc-700 dark:text-zinc-300 font-bold"}`}>
														{row.subject || "(sem assunto)"}
													</div>
													<div className="text-[11px] text-zinc-400 truncate">
														{row.lastDirection === "OUT" && <span className="font-bold">Você: </span>}
														{row.preview}
													</div>
													<div className="flex items-center gap-1.5 mt-1">
														<SourceBadge source={row.source} />
														{row.count > 1 && <span className="text-[10px] font-bold text-zinc-400">{row.count} mensagens</span>}
														{row.lastFailed && <span className="text-[10px] font-bold text-red-600">Envio falhou</span>}
													</div>
												</div>
												{unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
											</button>
										);
									})
								)}
							</div>
						</div>

						{/* Painel da direita: conversa ou email novo */}
						<div className={`flex-1 flex-col min-w-0 ${showDetail ? "flex" : "hidden md:flex"}`}>
							{composing ? (
								<ComposePanel
									onClose={() => setComposing(false)}
									onSent={async (rootId) => {
										setComposing(false);
										await fetchList(true);
										setSelectedId(rootId);
										fetchThread(rootId);
									}}
								/>
							) : !selected ? (
								<div className="flex-1 flex flex-col items-center justify-center text-zinc-300 gap-3">
									<Mail className="w-16 h-16" />
									<p className="text-sm font-bold text-zinc-400">Selecione uma conversa</p>
								</div>
							) : (
								<>
									<div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4">
										<div className="flex items-start gap-3 min-w-0">
											<button onClick={() => { setSelectedId(null); setThread(null); }} className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-zinc-700">
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
											</div>
										</div>
										<div className="flex items-center gap-1.5 shrink-0">
											<button
												onClick={() => handleToggleRead(selected)}
												title={selected.read ? "Marcar como não lida" : "Marcar como lida"}
												className="p-2.5 rounded-xl text-zinc-400 hover:text-primary hover:bg-primary/5 transition-colors"
											>
												{selected.read ? <Mail size={16} /> : <MailOpen size={16} />}
											</button>
											<button
												onClick={() => handleDelete(selected)}
												title="Apagar conversa"
												className="p-2.5 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</div>

									<div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/20">
										{threadLoading && !thread ? (
											<div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
										) : (
											thread?.messages.map((m) => (
												<MessageBubble key={m.id} m={m} onResent={() => { fetchThread(selected.id); fetchList(true); }} />
											))
										)}
									</div>

									{thread && (
										<ReplyBox
											thread={thread}
											onSent={() => { fetchThread(thread.id); fetchList(true); }}
										/>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</PageShell>
		</div>
	);
}

function MessageBubble({ m, onResent }: { m: MessageItem; onResent: () => void }) {
	const out = m.direction === "OUT";
	const system = m.source === "SYSTEM";
	const [showEmail, setShowEmail] = useState(false);
	const [resending, setResending] = useState(false);

	async function resend() {
		setResending(true);
		try {
			await apiFetch(endpoints.messages.resend(m.id), { method: "POST" });
		} catch (e) {
			Swal.fire({ icon: "error", title: "Não foi possível enviar", text: e instanceof Error ? e.message : "", confirmButtonColor: "#3085d6" });
		} finally {
			setResending(false);
			onResent();
		}
	}

	return (
		<div className={`flex ${out ? "justify-end" : "justify-start"}`}>
			<div className={`max-w-[85%] rounded-2xl border px-4 py-3 shadow-sm ${system
				? "bg-amber-50/60 border-amber-200 dark:bg-amber-950/10"
				: out
					? "bg-primary/5 border-primary/20"
					: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
				}`}>
				<div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-1.5">
					{system ? <Bot size={12} /> : out ? <Send size={12} /> : <Mail size={12} />}
					<span className="font-bold text-zinc-700 dark:text-zinc-300">
						{system ? "Email automático" : out ? `Enviado${m.sentBy ? ` por ${m.sentBy}` : ""}` : m.name}
					</span>
					{out && m.toEmail && <span>para {m.toEmail}</span>}
					<span>· {fmtDateTime(m.createdAt)}</span>
				</div>

				{system ? (
					<>
						<p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{m.subject}</p>
						<button onClick={() => setShowEmail((v) => !v)} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary">
							{showEmail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
							{showEmail ? "Esconder email" : "Ver email enviado"}
						</button>
						{showEmail && m.html && (
							// Email com layout próprio: isolado num iframe sem scripts.
							<iframe title={m.subject ?? "email"} sandbox="" srcDoc={m.html} className="mt-3 w-full h-[520px] rounded-xl border border-zinc-200 bg-white" />
						)}
					</>
				) : m.html ? (
					<div className="rich-text text-sm" dangerouslySetInnerHTML={{ __html: m.html }} />
				) : (
					<p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{m.message}</p>
				)}

				{m.attachments.length > 0 && (
					<div className="mt-3 flex flex-wrap gap-2">
						{m.attachments.map((a) => <AttachmentChip key={a.id} a={a} />)}
					</div>
				)}

				{out && m.deliveryStatus === "FAILED" && (
					<div className="mt-3 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
						<span className="flex items-start gap-1.5"><AlertTriangle size={14} className="shrink-0 mt-0.5" />Não foi enviado{m.deliveryError ? `: ${m.deliveryError}` : ""}</span>
						<button onClick={resend} disabled={resending} className="shrink-0 inline-flex items-center gap-1 font-bold hover:underline disabled:opacity-50">
							<RotateCw size={12} className={resending ? "animate-spin" : ""} /> Reenviar
						</button>
					</div>
				)}
				{out && m.deliveryStatus === "PENDING" && <p className="mt-2 text-[11px] font-bold text-zinc-400">A enviar…</p>}
			</div>
		</div>
	);
}

function AttachmentChip({ a }: { a: MessageAttachment }) {
	const [busy, setBusy] = useState(false);
	async function download() {
		setBusy(true);
		try {
			// O endpoint exige o header Authorization — por isso blob: URL, não <a href>.
			const res = await authFetch(endpoints.messages.attachment(a.id));
			if (!res.ok) throw new Error();
			const url = URL.createObjectURL(await res.blob());
			const link = document.createElement("a");
			link.href = url;
			link.download = a.filename;
			link.click();
			setTimeout(() => URL.revokeObjectURL(url), 10000);
		} catch {
			Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível descarregar o anexo.", confirmButtonColor: "#3085d6" });
		} finally {
			setBusy(false);
		}
	}
	return (
		<button onClick={download} disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
			{busy ? <Loader2 size={12} className="animate-spin" /> : <Paperclip size={12} />}
			<span className="max-w-[200px] truncate">{a.filename}</span>
			<span className="text-zinc-400">{fmtSize(a.size)}</span>
		</button>
	);
}

function ReplyBox({ thread, onSent }: { thread: MessageThread; onSent: () => void }) {
	const [html, setHtml] = useState("");
	const [sending, setSending] = useState(false);
	const [editorKey, setEditorKey] = useState(0);

	if (!thread.canReply) {
		return (
			<div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
				<a
					href={`mailto:${thread.email}?subject=${encodeURIComponent(thread.subject ? `Re: ${thread.subject}` : "Re: a sua mensagem")}`}
					className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 transition-colors py-3 text-sm font-bold text-zinc-700 dark:text-zinc-200"
				>
					<Mail size={15} />
					Responder a {thread.name} no programa de email
				</a>
			</div>
		);
	}

	async function send() {
		if (isBlankHtml(html)) return;
		setSending(true);
		try {
			await apiFetch(endpoints.messages.reply(thread.id), { method: "POST", body: JSON.stringify({ html }) });
			setHtml("");
			setEditorKey((k) => k + 1);
		} catch (e) {
			Swal.fire({ icon: "error", title: "Não foi possível enviar", text: e instanceof Error ? e.message : "", confirmButtonColor: "#3085d6" });
		} finally {
			setSending(false);
			onSent();
		}
	}

	return (
		<div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
			<p className="text-xs text-zinc-500">
				Responder a <span className="font-bold text-zinc-700 dark:text-zinc-300">{thread.name}</span> ({thread.email}) — sai do email reservas@
			</p>
			<RichTextEditor key={editorKey} value={html} onChange={setHtml} minHeight={110} />
			<div className="flex justify-end">
				<button
					onClick={send}
					disabled={sending || isBlankHtml(html)}
					className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
				>
					{sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
					Enviar
				</button>
			</div>
		</div>
	);
}

function ComposePanel({ onClose, onSent }: { onClose: () => void; onSent: (rootId: number) => void }) {
	const [to, setTo] = useState("");
	const [subject, setSubject] = useState("");
	const [html, setHtml] = useState("");
	const [sending, setSending] = useState(false);

	async function send() {
		setSending(true);
		try {
			const sent = await apiFetch<MessageItem>(endpoints.messages.compose, {
				method: "POST",
				body: JSON.stringify({ to, subject, html }),
			});
			onSent(sent.id);
		} catch (e) {
			Swal.fire({ icon: "error", title: "Não foi possível enviar", text: e instanceof Error ? e.message : "", confirmButtonColor: "#3085d6" });
		} finally {
			setSending(false);
		}
	}

	const inputCls = "w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-primary/20";
	return (
		<div className="flex-1 flex flex-col overflow-y-auto">
			<div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
				<h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50">Novo email</h2>
				<button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50" title="Fechar"><X size={18} /></button>
			</div>
			<div className="p-5 space-y-4">
				<div className="space-y-1.5">
					<label className="text-xs font-black uppercase text-zinc-400 tracking-widest">Para</label>
					<input type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="cliente@exemplo.com" className={inputCls} />
				</div>
				<div className="space-y-1.5">
					<label className="text-xs font-black uppercase text-zinc-400 tracking-widest">Assunto</label>
					<input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} />
				</div>
				<RichTextEditor value={html} onChange={setHtml} minHeight={220} />
				<div className="flex justify-end">
					<button
						onClick={send}
						disabled={sending || !to.trim() || !subject.trim() || isBlankHtml(html)}
						className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
					>
						{sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
						Enviar
					</button>
				</div>
			</div>
		</div>
	);
}
