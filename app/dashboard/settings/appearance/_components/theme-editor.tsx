"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
	THEME_DEFAULTS,
	THEME_TOKENS,
	contrastWarnings,
	isHexColor,
	type ThemeColors,
	type ThemeToken,
} from "@/lib/theme/tokens";

export type ThemeEditorData = { name: string; description: string; colors: ThemeColors };

const inputCls = "w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20";

/** Mini-página com as cores do tema, para ver o resultado antes de gravar. */
export function ThemeSample({ colors, compact = false }: { colors: ThemeColors; compact?: boolean }) {
	const c = { ...THEME_DEFAULTS, ...colors };
	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 text-[11px] leading-tight" aria-hidden="true">
			<div style={{ background: c.brand, color: c.onBrandMuted }} className="flex justify-between px-3 py-1.5">
				<span>+238 581 09 45</span>
				<span style={{ color: c.onBrand }}>PT · EN · FR</span>
			</div>
			<div className="flex items-center justify-between bg-white px-3 py-2">
				<span className="font-black" style={{ color: c.heading }}>Rent a Car Verde</span>
				<span style={{ color: c.heading }}>Início · Viaturas</span>
			</div>
			<div style={{ background: `linear-gradient(150deg, ${c.brandLight}, ${c.brand})`, color: c.onBrand }} className="px-3 py-3">
				<p className="text-sm font-black">Viaturas</p>
				<p style={{ color: c.onBrandMuted }}>Todos os nossos carros</p>
			</div>
			{!compact && (
				<div style={{ background: c.surface }} className="space-y-2 px-3 py-3">
					<p className="text-sm font-black" style={{ color: c.heading }}>Para onde ir a partir da Praia</p>
					<p style={{ color: c.muted }}>Destinos a menos de duas horas de carro.</p>
					<div className="flex items-center gap-2">
						<span className="rounded-full px-3 py-1 font-bold" style={{ background: c.primary, color: c.onPrimary }}>Ver carros</span>
						<span className="rounded-full px-2 py-0.5 font-bold" style={{ background: c.accent, color: c.onAccent }}>cerca de 1h30</span>
					</div>
					<div className="rounded-lg px-2 py-3 font-bold text-white" style={{ background: `linear-gradient(180deg, ${c.overlay}22, ${c.overlay})` }}>
						Tarrafal
					</div>
				</div>
			)}
			<div style={{ background: c.footer, color: c.onFooterMuted }} className="px-3 py-2">
				<span className="font-bold" style={{ color: c.onFooter }}>Contacto</span> · reservas@rentacarverde.cv
			</div>
		</div>
	);
}

function ColorField({ token, value, onChange }: { token: ThemeToken; value: string; onChange: (v: string) => void }) {
	const [text, setText] = useState(value);
	const id = `theme-color-${token.key}`;
	return (
		<div className="flex items-start gap-3">
			<input
				type="color"
				value={value}
				onChange={(e) => {
					setText(e.target.value);
					onChange(e.target.value);
				}}
				className="h-10 w-12 shrink-0 cursor-pointer rounded border border-gray-300 bg-white p-0.5"
				aria-label={token.label}
			/>
			<div className="min-w-0 flex-1">
				<label htmlFor={id} className="block text-sm font-medium text-gray-700">{token.label}</label>
				<input
					id={id}
					value={text}
					onChange={(e) => {
						const v = e.target.value.trim();
						setText(v);
						if (isHexColor(v)) onChange(v.toLowerCase());
					}}
					className={`mt-1 w-28 rounded-md border px-2 py-1 font-mono text-xs ${isHexColor(text) ? "border-gray-300" : "border-red-400"}`}
					aria-describedby={token.hint ? `${id}-hint` : undefined}
				/>
				{token.hint && <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{token.hint}</p>}
			</div>
		</div>
	);
}

export default function ThemeEditor({
	initial,
	onSubmit,
	onCancel,
	isSubmitting = false,
	submitLabel,
}: {
	initial: ThemeEditorData;
	onSubmit: (data: ThemeEditorData) => void;
	onCancel: () => void;
	isSubmitting?: boolean;
	submitLabel: string;
}) {
	const [name, setName] = useState(initial.name);
	const [description, setDescription] = useState(initial.description);
	const [colors, setColors] = useState<ThemeColors>({ ...THEME_DEFAULTS, ...initial.colors });
	const warnings = useMemo(() => contrastWarnings(colors), [colors]);
	const groups = Array.from(new Set(THEME_TOKENS.map((t) => t.group)));

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit({ name: name.trim(), description: description.trim(), colors });
			}}
			className="space-y-6"
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<label htmlFor="theme-name" className="text-sm font-medium text-gray-700">Nome do tema *</label>
					<input id="theme-name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
				</div>
				<div className="space-y-2">
					<label htmlFor="theme-desc" className="text-sm font-medium text-gray-700">Descrição</label>
					<input id="theme-desc" maxLength={255} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
				</div>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
				<div className="space-y-6">
					{groups.map((g) => (
						<fieldset key={g} className="space-y-4">
							<legend className="mb-2 text-xs font-black uppercase tracking-wider text-gray-400">{g}</legend>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{THEME_TOKENS.filter((t) => t.group === g).map((t) => (
									<ColorField
										key={t.key}
										token={t}
										value={colors[t.key]}
										onChange={(v) => setColors((prev) => ({ ...prev, [t.key]: v }))}
									/>
								))}
							</div>
						</fieldset>
					))}
				</div>
				<div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
					<p className="text-xs font-black uppercase tracking-wider text-gray-400">Pré-visualização</p>
					<ThemeSample colors={colors} />
					{warnings.length > 0 ? (
						<div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
							<p className="flex items-center gap-1.5 font-bold"><AlertTriangle size={14} /> Pode ser difícil de ler</p>
							{warnings.map((w) => <p key={w}>{w}</p>)}
						</div>
					) : (
						<p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">Contraste bom em todos os textos.</p>
					)}
				</div>
			</div>

			<div className="flex items-center justify-end gap-3 border-t pt-4">
				<button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg px-6 py-2.5 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-100">
					Cancelar
				</button>
				<button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-8 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50">
					{isSubmitting ? "A guardar..." : submitLabel}
				</button>
			</div>
		</form>
	);
}
