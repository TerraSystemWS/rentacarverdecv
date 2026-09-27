// Temas do site público (visual v2). Um tema é só uma lista de cores com
// nomes fixos (as "cores do tema" abaixo); o site transforma-as nas variáveis
// --v2-* de app/ui/front/v2/v2.css. Os temas guardam-se no backend
// (/dashboard/themes) e trocam-se em Definições → Aparência.
//
// Ficheiro de tema (importar/exportar no dashboard):
// {
//   "format": "rentacarverde-theme",
//   "version": 1,
//   "name": "Verde claro",
//   "description": "…",
//   "colors": { "primary": "#3baa4e", "brand": "#d4efd9", … }
// }
// Só cores #rrggbb; cores em falta ficam com o valor do tema Atlântico.

export const THEME_FILE_FORMAT = "rentacarverde-theme";
export const THEME_FILE_VERSION = 1;

export type ThemeColors = Record<string, string>;

export type ThemeToken = {
	key: string;
	cssVar: string;
	label: string;
	hint: string;
	group: "Ações" | "Cor principal" | "Rodapé" | "Texto" | "Fundos" | "Destaque e fotos";
	/** Valor no tema Atlântico (o padrão, igual ao v2.css). */
	default: string;
};

export const THEME_TOKENS: ThemeToken[] = [
	{ key: "primary", cssVar: "--v2-green", group: "Ações", label: "Botões", hint: "Botões principais, ex. \"Ver carros disponíveis\"", default: "#3baa4e" },
	{ key: "primaryDark", cssVar: "--v2-green-dark", group: "Ações", label: "Botões (rato por cima)", hint: "Botões ao passar o rato e ligações", default: "#2a8b46" },
	{ key: "onPrimary", cssVar: "--v2-on-primary", group: "Ações", label: "Texto dos botões", hint: "Texto sobre a cor dos botões", default: "#ffffff" },

	{ key: "brand", cssVar: "--v2-ocean", group: "Cor principal", label: "Cor principal", hint: "Barra do topo, cabeçalho das páginas, botões secundários", default: "#0b4f6c" },
	{ key: "brandLight", cssVar: "--v2-ocean-light", group: "Cor principal", label: "Cor principal clara", hint: "Início do degradê do cabeçalho das páginas", default: "#1d7390" },
	{ key: "onBrand", cssVar: "--v2-on-brand", group: "Cor principal", label: "Texto sobre a cor principal", hint: "Títulos do cabeçalho das páginas e ícones do topo", default: "#ffffff" },
	{ key: "onBrandMuted", cssVar: "--v2-on-brand-muted", group: "Cor principal", label: "Texto secundário sobre a cor principal", hint: "Telefone/email do topo e descrição das páginas", default: "#d7ebf0" },

	{ key: "footer", cssVar: "--v2-ocean-deep", group: "Rodapé", label: "Fundo do rodapé", hint: "", default: "#083a50" },
	{ key: "onFooter", cssVar: "--v2-on-footer", group: "Rodapé", label: "Títulos do rodapé", hint: "", default: "#ffffff" },
	{ key: "onFooterMuted", cssVar: "--v2-on-footer-muted", group: "Rodapé", label: "Texto do rodapé", hint: "Ligações, contactos e copyright", default: "#cfe3ea" },

	{ key: "heading", cssVar: "--v2-heading", group: "Texto", label: "Títulos", hint: "Títulos das secções, nomes das viaturas, menu", default: "#0b4f6c" },
	{ key: "text", cssVar: "--v2-basalt", group: "Texto", label: "Texto", hint: "Texto normal", default: "#2e3a3f" },
	{ key: "muted", cssVar: "--v2-muted", group: "Texto", label: "Texto secundário", hint: "Descrições e notas", default: "#5d6c72" },

	{ key: "surface", cssVar: "--v2-sea", group: "Fundos", label: "Secções claras", hint: "Fundo de \"Para onde ir\", motoristas, login", default: "#e8f4f6" },
	{ key: "surfaceAlt", cssVar: "--v2-surface-alt", group: "Fundos", label: "Fundo das páginas interiores", hint: "Viaturas, condições, pagamento", default: "#f4f9fa" },
	{ key: "line", cssVar: "--v2-line", group: "Fundos", label: "Linhas e contornos", hint: "Contornos dos cartões e separadores", default: "#dcebef" },
	{ key: "field", cssVar: "--v2-field", group: "Fundos", label: "Fundo dos campos", hint: "Campos da pesquisa da página inicial", default: "#f7fbfc" },

	{ key: "accent", cssVar: "--v2-sun", group: "Destaque e fotos", label: "Destaque", hint: "Tempos de carro, marcadores do rodapé, foco do teclado", default: "#f2b233" },
	{ key: "onAccent", cssVar: "--v2-on-accent", group: "Destaque e fotos", label: "Texto sobre o destaque", hint: "", default: "#3a2a00" },
	{ key: "overlay", cssVar: "--v2-overlay", group: "Destaque e fotos", label: "Sombra sobre as fotos", hint: "Escura: o texto sobre as fotos é sempre branco", default: "#083a50" },
];

export const THEME_DEFAULTS: ThemeColors = Object.fromEntries(THEME_TOKENS.map((t) => [t.key, t.default]));

const HEX = /^#[0-9a-fA-F]{6}$/;
export const isHexColor = (v: unknown): v is string => typeof v === "string" && HEX.test(v);

/** Só as cores conhecidas e válidas (#rrggbb), em minúsculas. */
export function cleanColors(input: unknown): ThemeColors {
	const out: ThemeColors = {};
	if (!input || typeof input !== "object") return out;
	for (const t of THEME_TOKENS) {
		const v = (input as Record<string, unknown>)[t.key];
		if (isHexColor(v)) out[t.key] = v.toLowerCase();
	}
	return out;
}

/** CSS com as variáveis do tema, para um <style> dentro do site (seguro: só #rrggbb). */
export function themeCss(colors: unknown, selector = ".site-v2"): string {
	const clean = cleanColors(colors);
	const decls = THEME_TOKENS.filter((t) => clean[t.key]).map((t) => `${t.cssVar}:${clean[t.key]}`);
	return decls.length ? `${selector}{${decls.join(";")}}` : "";
}

// ---- Contraste (avisos no dashboard) -----------------------------------------

function luminance(hex: string): number {
	const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
		.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function contrastRatio(a: string, b: string): number {
	if (!isHexColor(a) || !isHexColor(b)) return 21;
	const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (l1 + 0.05) / (l2 + 0.05);
}

/** Pares texto/fundo que têm de se ler bem (WCAG AA: 4.5, texto grande 3). */
export const CONTRAST_PAIRS: { text: string; bg: string; label: string; min: number }[] = [
	// Texto dos botões é grande e em negrito; o verde do logo com branco dá 2,97:1.
	{ text: "onPrimary", bg: "primary", label: "Texto dos botões sobre os botões", min: 2.9 },
	{ text: "onBrand", bg: "brand", label: "Texto sobre a cor principal", min: 4.5 },
	{ text: "onBrandMuted", bg: "brand", label: "Texto secundário sobre a cor principal", min: 3 },
	{ text: "onFooter", bg: "footer", label: "Títulos do rodapé", min: 4.5 },
	{ text: "onFooterMuted", bg: "footer", label: "Texto do rodapé", min: 4.5 },
	{ text: "heading", bg: "surface", label: "Títulos sobre as secções claras", min: 4.5 },
	{ text: "text", bg: "surfaceAlt", label: "Texto sobre o fundo das páginas", min: 4.5 },
	{ text: "muted", bg: "surface", label: "Texto secundário sobre as secções claras", min: 4.5 },
	{ text: "onAccent", bg: "accent", label: "Texto sobre o destaque", min: 4.5 },
];

export function contrastWarnings(colors: ThemeColors): string[] {
	const c = { ...THEME_DEFAULTS, ...cleanColors(colors) };
	return CONTRAST_PAIRS.filter((p) => contrastRatio(c[p.text], c[p.bg]) < p.min)
		.map((p) => `${p.label}: contraste ${contrastRatio(c[p.text], c[p.bg]).toFixed(2)}:1 (mínimo ${p.min}:1)`);
}
