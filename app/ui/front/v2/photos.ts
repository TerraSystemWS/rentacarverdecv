// Fotos de Cabo Verde do novo visual. O cliente envia as fotos; ficam em
// public/images/cabo-verde/ e basta pôr aqui o nome do ficheiro. Enquanto
// estiver null, o site mostra um espaço reservado com o nome da foto em falta.
export const CV_PHOTOS: Record<CvPhotoKey, string | null> = {
	hero: null, // grande, horizontal (≥ 2400 px de largura): estrada ou costa de Santiago
	tarrafal: null,
	cidadeVelha: null,
	serraMalagueta: null,
	assomada: null,
	pages: null, // faixa no topo das páginas interiores (Viaturas, Contacto…): horizontal, ≥ 2000 px
};

export type CvPhotoKey = "hero" | "tarrafal" | "cidadeVelha" | "serraMalagueta" | "assomada" | "pages";

export function cvPhotoSrc(key: CvPhotoKey): string | null {
	const file = CV_PHOTOS[key];
	return file ? `/images/cabo-verde/${file}` : null;
}
