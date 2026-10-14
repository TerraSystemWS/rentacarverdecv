// Imagens de /uploads: a API serve WebP e, com ?w=, uma versão com essa
// largura máxima (320/640/1280/1920, ver UploadsController). Endereços de fora
// ficam como estão.
export function withWidth(src: string | null | undefined, width: 320 | 640 | 1280 | 1920): string {
	if (!src) return "";
	if (!src.includes("/uploads/")) return src;
	const base = src.trim().replace(/\?w=\d+$/, "");
	return `${base}?w=${width}`;
}
