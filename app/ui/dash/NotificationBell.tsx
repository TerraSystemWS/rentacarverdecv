"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { AppNotification } from "@/lib/api/types";
import { getAccessToken } from "@/app/auth/api";

export default function NotificationBell() {
	const router = useRouter();
	const [notifications, setNotifications] = useState<AppNotification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const [list, count] = await Promise.all([
					apiFetch<AppNotification[]>(endpoints.notifications.list),
					apiFetch<{ count: number }>(endpoints.notifications.unreadCount),
				]);
				if (!cancelled) {
					setNotifications(list);
					setUnreadCount(count.count);
				}
			} catch {
				// silencioso — o sino só fica sem dados, não vale a pena um toast de erro aqui
			}
		}
		load();

		// EventSource não passa pelo authFetch — nunca saberia sozinho que o
		// access token expirou/rodou. Sem isto, uma vez o token embutido no URL
		// da ligação ficar velho, o EventSource reconectava-se sozinho (o
		// comportamento nativo dele) sempre com o MESMO URL/token morto, para
		// sempre, gerando erros 401 em loop no backend sem o utilizador notar.
		let source: EventSource | null = null;
		let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

		function connect() {
			if (cancelled) return;
			const token = getAccessToken();
			if (!token) return;

			source = new EventSource(`${API_BASE_URL}${endpoints.notifications.stream}?token=${encodeURIComponent(token)}`);
			source.addEventListener("notification", (event: MessageEvent) => {
				try {
					const notification = JSON.parse(event.data) as AppNotification;
					setNotifications((prev) => [notification, ...prev].slice(0, 50));
					setUnreadCount((prev) => prev + 1);
					Swal.fire({
						toast: true,
						position: "top-end",
						icon: "info",
						title: notification.title,
						text: notification.body ?? undefined,
						showConfirmButton: false,
						timer: 5000,
						timerProgressBar: true,
					});
				} catch {
					// ignora eventos malformados
				}
			});
			source.onerror = () => {
				source?.close();
				if (cancelled) return;
				// Tenta de novo dentro de instantes com o token mais recente do
				// storage — se a sessão continuar válida, authFetch já o terá
				// renovado entretanto noutro pedido qualquer.
				reconnectTimer = setTimeout(connect, 5000);
			};
		}
		connect();

		function handleTokensUpdated() {
			source?.close();
			connect();
		}
		window.addEventListener("auth:tokens-updated", handleTokensUpdated);

		return () => {
			cancelled = true;
			if (reconnectTimer) clearTimeout(reconnectTimer);
			source?.close();
			window.removeEventListener("auth:tokens-updated", handleTokensUpdated);
		};
	}, []);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	async function handleMarkRead(notification: AppNotification) {
		if (!notification.read) {
			setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
			setUnreadCount((prev) => Math.max(0, prev - 1));
			apiFetch(endpoints.notifications.markRead(notification.id), { method: "PATCH" }).catch(() => {});
		}
		setOpen(false);
		if (notification.linkUrl) {
			router.push(notification.linkUrl);
		}
	}

	async function handleMarkAllRead() {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		setUnreadCount(0);
		try {
			await apiFetch(endpoints.notifications.markAllRead, { method: "PATCH" });
		} catch {
			// falha silenciosa — o próximo load() corrige o estado
		}
	}

	return (
		<div className="relative" ref={containerRef}>
			<button
				onClick={() => setOpen((v) => !v)}
				className="relative w-10 h-10 md:w-11 md:h-11 p-0 flex items-center justify-center rounded-xl md:rounded-2xl bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group shadow-sm hover:shadow-primary/20"
			>
				<Bell className="w-5 h-5 group-hover:animate-swing" />
				{unreadCount > 0 && (
					<span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-black text-white ring-2 ring-background">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{open && (
				<div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-border/40 bg-white dark:bg-zinc-900 shadow-xl z-50">
					<div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
						<span className="text-xs font-black uppercase tracking-wider text-foreground/70">Notificações</span>
						{unreadCount > 0 && (
							<button onClick={handleMarkAllRead} className="text-[10px] font-bold text-primary hover:underline">
								Marcar todas como lidas
							</button>
						)}
					</div>
					{notifications.length === 0 ? (
						<div className="px-4 py-6 text-center text-xs text-muted-foreground/60">Sem notificações.</div>
					) : (
						notifications.map((n) => (
							<button
								key={n.id}
								onClick={() => handleMarkRead(n)}
								className={`block w-full text-left px-4 py-3 border-b border-border/10 last:border-0 hover:bg-secondary/30 transition-colors ${n.read ? "" : "bg-primary/5"}`}
							>
								<div className="text-xs font-bold text-foreground/90">{n.title}</div>
								{n.body && <div className="text-[11px] text-muted-foreground/70 mt-0.5">{n.body}</div>}
								<div className="text-[9px] text-muted-foreground/40 mt-1 uppercase tracking-wider">
									{new Date(n.createdAt).toLocaleString("pt-PT")}
								</div>
							</button>
						))
					)}
				</div>
			)}
		</div>
	);
}
