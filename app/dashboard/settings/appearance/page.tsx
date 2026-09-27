"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { Palette, Check, Copy, Pencil, Trash2, Download, Upload, ExternalLink, ArrowLeft, Plus } from "lucide-react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints } from "@/lib/api/endpoints";
import type { SiteTheme } from "@/lib/api/types";
import { THEME_DEFAULTS, THEME_FILE_FORMAT, THEME_FILE_VERSION, THEME_TOKENS, cleanColors, contrastWarnings } from "@/lib/theme/tokens";
import ThemeEditor, { ThemeSample, type ThemeEditorData } from "./_components/theme-editor";

// Definições → Aparência: temas de cores do site público (visual v2).
// Um tema ativo de cada vez; os temas de base (Atlântico, Verde claro) não se
// alteram — duplicam-se. Um tema pode ser exportado/importado como ficheiro
// JSON (formato em lib/theme/tokens.ts) para o levar para outro site ou
// guardar uma cópia.
type Editing = { id: number | null; data: ThemeEditorData };

const siteUrl = (themeId: number) => `/?tema=${themeId}`;

const errText = (e: unknown) => (e instanceof Error ? e.message : undefined);

function slug(s: string) {
	return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tema";
}

export default function AppearancePage() {
	const { authFetch } = useAuth();
	const [themes, setThemes] = useState<SiteTheme[]>([]);
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState<string | null>(null);
	const [editing, setEditing] = useState<Editing | null>(null);
	const [busy, setBusy] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	async function load() {
		setLoading(true);
		setErr(null);
		try {
			const res = await authFetch(endpoints.themes.dashboard);
			if (!res.ok) throw new Error("Erro ao carregar os temas.");
			setThemes(await res.json());
		} catch (e) {
			setErr(errText(e) || "Erro ao carregar os temas.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fail = (text?: string) => Swal.fire({ icon: "error", title: "Erro", text, confirmButtonColor: "#3085d6" });

	async function message(res: Response, fallback: string) {
		const body = await res.json().catch(() => null);
		return body?.message || fallback;
	}

	async function activate(t: SiteTheme) {
		setBusy(true);
		try {
			const res = await authFetch(endpoints.themes.activate(t.id), { method: "POST" });
			if (!res.ok) throw new Error(await message(res, "Erro ao ativar o tema."));
			setThemes((prev) => prev.map((x) => ({ ...x, active: x.id === t.id })));
			Swal.fire({ icon: "success", title: `Tema «${t.name}» ativo`, text: "O site público já usa estas cores.", timer: 2200, showConfirmButton: false });
		} catch (e) {
			fail(errText(e));
		} finally {
			setBusy(false);
		}
	}

	async function save(data: ThemeEditorData) {
		if (!editing) return;
		setBusy(true);
		try {
			const id = editing.id;
			const res = await authFetch(id ? endpoints.themes.update(id) : endpoints.themes.create, {
				method: id ? "PUT" : "POST",
				body: JSON.stringify({ name: data.name, description: data.description, colors: cleanColors(data.colors) }),
			});
			if (!res.ok) throw new Error(await message(res, "Erro ao guardar o tema."));
			const saved: SiteTheme = await res.json();
			setThemes((prev) => (id ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved]));
			setEditing(null);
		} catch (e) {
			fail(errText(e));
		} finally {
			setBusy(false);
		}
	}

	async function remove(t: SiteTheme) {
		const ok = await Swal.fire({
			title: "Apagar tema?",
			text: `O tema «${t.name}» deixa de existir. Pode exportá-lo antes, para ter uma cópia.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sim, apagar",
			cancelButtonText: "Cancelar",
		});
		if (!ok.isConfirmed) return;
		const res = await authFetch(endpoints.themes.delete(t.id), { method: "DELETE" });
		if (!res.ok) return fail(await message(res, "Erro ao apagar o tema."));
		setThemes((prev) => prev.filter((x) => x.id !== t.id));
	}

	function duplicate(t: SiteTheme) {
		let name = `${t.name} (cópia)`;
		for (let n = 2; themes.some((x) => x.name.toLowerCase() === name.toLowerCase()); n++) name = `${t.name} (cópia ${n})`;
		setEditing({ id: null, data: { name, description: t.description ?? "", colors: { ...THEME_DEFAULTS, ...t.colors } } });
	}

	function exportTheme(t: SiteTheme) {
		const file = {
			format: THEME_FILE_FORMAT,
			version: THEME_FILE_VERSION,
			name: t.name,
			description: t.description ?? "",
			colors: { ...THEME_DEFAULTS, ...cleanColors(t.colors) },
		};
		const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: "application/json" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = `tema-${slug(t.name)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	// Importar: valida o ficheiro e abre-o no editor (nada é gravado sem confirmar).
	async function importFile(file: File) {
		try {
			if (file.size > 100_000) throw new Error("O ficheiro é demasiado grande para um tema.");
			const json = JSON.parse(await file.text());
			if (json?.format !== THEME_FILE_FORMAT) throw new Error(`Não é um ficheiro de tema (falta "format": "${THEME_FILE_FORMAT}").`);
			if (Number(json.version) > THEME_FILE_VERSION) throw new Error("Este ficheiro é de uma versão mais recente do formato de temas.");
			const colors = cleanColors(json.colors);
			if (Object.keys(colors).length === 0) throw new Error("O ficheiro não tem nenhuma cor válida (#rrggbb).");
			const missing = THEME_TOKENS.filter((t) => !colors[t.key]).map((t) => t.label);
			let name = String(json.name || file.name.replace(/\.json$/i, "")).slice(0, 80);
			for (let n = 2; themes.some((x) => x.name.toLowerCase() === name.toLowerCase()); n++) name = `${String(json.name).slice(0, 70)} (${n})`;
			setEditing({ id: null, data: { name, description: String(json.description ?? "").slice(0, 255), colors: { ...THEME_DEFAULTS, ...colors } } });
			if (missing.length) {
				Swal.fire({ icon: "info", title: "Tema importado", text: `Cores em falta, preenchidas com o tema Atlântico: ${missing.join(", ")}. Reveja e grave.` });
			}
		} catch (e) {
			fail(e instanceof SyntaxError ? "O ficheiro não é JSON válido." : errText(e));
		} finally {
			if (fileRef.current) fileRef.current.value = "";
		}
	}

	const active = themes.find((t) => t.active);

	return (
		<div className="pb-20">
			<TopNav
				title="Aparência do site"
				subtitle="Tema de cores do site público"
				right={
					!editing && (
						<div className="flex gap-2">
							<button
								onClick={() => fileRef.current?.click()}
								className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-zinc-700 transition-all hover:bg-zinc-50"
							>
								<Upload size={16} /> <span>Importar tema</span>
							</button>
							<button
								onClick={() => active && duplicate(active)}
								disabled={!active}
								className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
							>
								<Plus size={16} /> <span>Novo tema</span>
							</button>
						</div>
					)
				}
			/>
			<input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />

			<PageShell>
				<div className="mx-auto max-w-6xl space-y-6">
					<Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-primary">
						<ArrowLeft size={16} /> Definições
					</Link>

					{editing ? (
						<div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
							<h2 className="mb-6 text-xl font-black text-gray-900">{editing.id ? "Editar tema" : "Novo tema"}</h2>
							<ThemeEditor
								key={editing.id ?? `new-${editing.data.name}`}
								initial={editing.data}
								onSubmit={save}
								onCancel={() => setEditing(null)}
								isSubmitting={busy}
								submitLabel={editing.id ? "Guardar" : "Criar tema"}
							/>
						</div>
					) : loading ? (
						<div className="flex h-[40vh] flex-col items-center justify-center gap-6 rounded-3xl border border-zinc-200 bg-white">
							<Palette className="h-10 w-10 animate-pulse text-primary" />
							<p className="text-xs font-bold uppercase tracking-widest text-zinc-400">A carregar temas...</p>
						</div>
					) : err ? (
						<div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
							<p className="text-sm font-semibold text-destructive">{err}</p>
							<button onClick={load} className="btn-outline mt-4">Tentar novamente</button>
						</div>
					) : (
						<>
							<p className="text-sm text-zinc-500">
								O tema escolhido muda as cores de todo o site público (topo, cabeçalho das páginas, títulos, botões e rodapé).
								Use «Pré-visualizar» para ver o site com outro tema antes de o ativar — só muda no seu separador.
								Para criar um tema, duplique um existente ou importe um ficheiro de tema (.json).
							</p>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
								{themes.map((t) => {
									const warnings = contrastWarnings(t.colors).length;
									return (
										<article key={t.id} className={`flex flex-col rounded-3xl border bg-white p-5 shadow-sm ${t.active ? "border-primary ring-2 ring-primary/30" : "border-gray-100"}`}>
											<div className="mb-3 flex items-start justify-between gap-3">
												<div>
													<h3 className="text-lg font-black text-gray-900">{t.name}</h3>
													{t.description && <p className="text-xs text-gray-500">{t.description}</p>}
												</div>
												<div className="flex shrink-0 flex-col items-end gap-1">
													{t.active && <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">Em uso</span>}
													{t.builtIn && <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-500">Base</span>}
												</div>
											</div>
											<ThemeSample colors={t.colors} compact />
											{warnings > 0 && <p className="mt-2 text-xs font-semibold text-amber-700">{warnings} aviso(s) de contraste — veja em Editar/Duplicar.</p>}
											<div className="mt-4 flex flex-wrap gap-2">
												{!t.active && (
													<button disabled={busy} onClick={() => activate(t)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50">
														<Check size={14} /> Usar no site
													</button>
												)}
												<a href={siteUrl(t.id)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50">
													<ExternalLink size={14} /> Pré-visualizar
												</a>
												<button onClick={() => duplicate(t)} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50">
													<Copy size={14} /> Duplicar
												</button>
												{!t.builtIn && (
													<button onClick={() => setEditing({ id: t.id, data: { name: t.name, description: t.description ?? "", colors: t.colors } })} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50">
														<Pencil size={14} /> Editar
													</button>
												)}
												<button onClick={() => exportTheme(t)} className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50" title="Descarregar o ficheiro do tema (.json)">
													<Download size={14} /> Exportar
												</button>
												{!t.builtIn && !t.active && (
													<button onClick={() => remove(t)} className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
														<Trash2 size={14} /> Apagar
													</button>
												)}
											</div>
										</article>
									);
								})}
							</div>
						</>
					)}
				</div>
			</PageShell>
		</div>
	);
}
