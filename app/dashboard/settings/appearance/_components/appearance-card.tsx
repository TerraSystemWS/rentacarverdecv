"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Palette, Loader2 } from "lucide-react";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints } from "@/lib/api/endpoints";
import type { SiteTheme } from "@/lib/api/types";
import { ThemeSample } from "./theme-editor";

// Cartão em Definições: escolher o tema de cores do site sem sair da página.
// Criar, editar, importar e exportar temas fica em Definições → Aparência.
export default function AppearanceCard() {
	const { authFetch } = useAuth();
	const [themes, setThemes] = useState<SiteTheme[] | null>(null);
	const [selected, setSelected] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

	useEffect(() => {
		authFetch(endpoints.themes.dashboard)
			.then((res) => (res.ok ? res.json() : []))
			.then((data: SiteTheme[]) => {
				setThemes(data);
				setSelected(data.find((t) => t.active)?.id ?? null);
			})
			.catch(() => setThemes([]));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const active = themes?.find((t) => t.active) ?? null;
	const chosen = themes?.find((t) => t.id === selected) ?? null;

	async function apply() {
		if (!chosen || chosen.active) return;
		setSaving(true);
		setMsg(null);
		try {
			const res = await authFetch(endpoints.themes.activate(chosen.id), { method: "POST" });
			if (!res.ok) throw new Error();
			setThemes((prev) => prev?.map((t) => ({ ...t, active: t.id === chosen.id })) ?? prev);
			setMsg({ ok: true, text: `O site público usa agora o tema «${chosen.name}».` });
		} catch {
			setMsg({ ok: false, text: "Não foi possível mudar o tema." });
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
			<div className="mb-6 flex flex-wrap items-start justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
						<Palette size={24} />
					</div>
					<div>
						<h3 className="text-xl font-black text-gray-900">Aparência do site</h3>
						<p className="text-sm font-medium text-gray-500">Tema de cores do site público (topo, títulos, botões e rodapé).</p>
					</div>
				</div>
				<Link href="/dashboard/settings/appearance" className="text-sm font-bold text-primary hover:underline">
					Gerir temas
				</Link>
			</div>

			{themes === null ? (
				<div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
			) : themes.length === 0 ? (
				<p className="text-sm text-gray-500">Não há temas. Crie um em «Gerir temas».</p>
			) : (
				<div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_260px]">
					<div className="space-y-3">
						<label htmlFor="site-theme" className="text-sm font-medium text-gray-700">Tema em uso</label>
						<select
							id="site-theme"
							value={selected ?? ""}
							onChange={(e) => { setSelected(Number(e.target.value)); setMsg(null); }}
							className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
						>
							{themes.map((t) => (
								<option key={t.id} value={t.id}>{t.name}{t.active ? " (em uso)" : ""}</option>
							))}
						</select>
						{chosen?.description && <p className="text-xs text-gray-500">{chosen.description}</p>}
						<div className="flex flex-wrap gap-2">
							<button
								onClick={apply}
								disabled={saving || !chosen || chosen.id === active?.id}
								className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-50"
							>
								{saving ? "A aplicar..." : "Usar este tema"}
							</button>
							{chosen && (
								<a href={`/?tema=${chosen.id}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-50">
									Pré-visualizar
								</a>
							)}
						</div>
						{msg && <p role="status" className={`text-sm font-semibold ${msg.ok ? "text-emerald-700" : "text-red-600"}`}>{msg.text}</p>}
					</div>
					{chosen && <ThemeSample colors={chosen.colors} compact />}
				</div>
			)}
		</div>
	);
}
