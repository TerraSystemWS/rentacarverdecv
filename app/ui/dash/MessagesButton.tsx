"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";

// Acesso rápido às Mensagens a partir de qualquer página do dashboard — o
// menu agrupado escondeu "Mensagens" dentro do grupo "Sistema" (2 cliques
// para lá chegar), por isso fica também aqui ao lado do sino de
// notificações, sempre visível e a 1 clique.
export default function MessagesButton() {
	const router = useRouter();
	const pathname = usePathname();
	const [unreadCount, setUnreadCount] = useState(0);

	async function loadCount() {
		try {
			const data = await apiFetch<{ count: number }>(endpoints.messages.unreadCount);
			setUnreadCount(data.count);
		} catch {
			// silencioso — o ícone só fica sem contagem, não vale a pena um toast de erro
		}
	}

	useEffect(() => {
		loadCount();
		const interval = setInterval(loadCount, 30000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	return (
		<button
			onClick={() => router.push("/dashboard/messages")}
			title="Mensagens"
			className="relative w-10 h-10 md:w-11 md:h-11 p-0 flex items-center justify-center rounded-xl md:rounded-2xl bg-secondary/50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group shadow-sm hover:shadow-primary/20"
		>
			<Mail className="w-5 h-5" />
			{unreadCount > 0 && (
				<span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-black text-white ring-2 ring-background">
					{unreadCount > 9 ? "9+" : unreadCount}
				</span>
			)}
		</button>
	);
}
