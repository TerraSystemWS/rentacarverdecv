// O link do email da campanha traz ?voucher=CÓDIGO (para /cars ou para a
// página de uma viatura). Guarda-se na sessão para o código continuar
// pré-preenchido quando o cliente navega da lista para a viatura.
const KEY = "racv_voucher";

export function rememberedVoucher(): string {
	if (typeof window === "undefined") return "";
	const fromUrl = new URLSearchParams(window.location.search).get("voucher")?.trim().toUpperCase() ?? "";
	try {
		if (fromUrl) {
			sessionStorage.setItem(KEY, fromUrl);
			return fromUrl;
		}
		return sessionStorage.getItem(KEY) ?? "";
	} catch {
		return fromUrl;
	}
}
