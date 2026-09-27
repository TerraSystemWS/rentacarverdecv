"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import RichTextEditor from "@/app/ui/dash/RichTextEditor";
import type { Translations } from "@/lib/api/types";

export type TranslationField = {
	key: string;
	label: string;
	// text: uma linha · textarea: várias linhas · rich: editor de texto rico ·
	// lines: lista (um item por linha, ex: equipamento das viaturas)
	type?: "text" | "textarea" | "rich" | "lines";
	// Texto PT atual, mostrado como referência para quem traduz.
	source?: string;
};

const LOCALES = [
	{ code: "en", label: "English" },
	{ code: "fr", label: "Français" },
] as const;

const inputCls =
	"w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20";

/**
 * Secção "Traduções" dos formulários do dashboard: textos EN/FR de um
 * registo. Campos vazios = o site mostra o texto em português.
 * O valor é o mapa gravado na coluna "translations" do backend.
 */
export default function TranslationFields({
	fields,
	value,
	onChange,
}: {
	fields: TranslationField[];
	value: Translations | undefined;
	onChange: (next: Translations) => void;
}) {
	const [locale, setLocale] = useState<"en" | "fr">("en");
	const current = value?.[locale] ?? {};
	const filled = (code: "en" | "fr") =>
		fields.filter((f) => (value?.[code]?.[f.key] ?? "").replace(/<[^>]*>/g, "").trim()).length;

	function set(key: string, text: string) {
		onChange({ ...value, [locale]: { ...(value?.[locale] ?? {}), [key]: text } });
	}

	return (
		<fieldset className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-4">
			<legend className="flex items-center gap-2 px-1 text-sm font-bold text-gray-700">
				<Languages size={16} className="text-blue-600" /> Traduções
			</legend>
			<p className="text-xs text-gray-500 -mt-1">
				Opcional. O que ficar vazio aparece em português no site em inglês e em francês.
			</p>

			<div className="flex gap-2" role="tablist" aria-label="Língua da tradução">
				{LOCALES.map((l) => (
					<button
						key={l.code}
						type="button"
						role="tab"
						aria-selected={locale === l.code}
						onClick={() => setLocale(l.code)}
						className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
							locale === l.code ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
						}`}
					>
						{l.label}
						<span className={`ml-1.5 ${locale === l.code ? "text-blue-100" : "text-gray-400"}`}>
							{filled(l.code)}/{fields.length}
						</span>
					</button>
				))}
			</div>

			{fields.map((f) => {
				const id = `tr-${locale}-${f.key}`;
				const v = current[f.key] ?? "";
				return (
					<div key={f.key} className="space-y-1.5">
						<label htmlFor={id} className="text-sm font-medium text-gray-700">
							{f.label} <span className="text-gray-400 font-normal">({locale.toUpperCase()})</span>
						</label>
						{f.type === "rich" ? (
							<>
								{f.source && (
									<details className="rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-xs text-gray-500">
										<summary className="cursor-pointer font-semibold">Texto original em português</summary>
										<div className="rich-text mt-2 max-h-48 overflow-y-auto" dangerouslySetInnerHTML={{ __html: f.source }} />
									</details>
								)}
								<RichTextEditor key={id} value={v} onChange={(html) => set(f.key, html)} minHeight={160} />
							</>
						) : f.type === "textarea" || f.type === "lines" ? (
							<textarea
								id={id}
								rows={f.type === "lines" ? 5 : 3}
								value={v}
								placeholder={f.source}
								onChange={(e) => set(f.key, e.target.value)}
								className={inputCls}
							/>
						) : (
							<input id={id} type="text" value={v} placeholder={f.source} onChange={(e) => set(f.key, e.target.value)} className={inputCls} />
						)}
						{f.type === "lines" && <p className="text-xs text-gray-400">Um item por linha, pela mesma ordem do português.</p>}
					</div>
				);
			})}
		</fieldset>
	);
}
