import type { Metadata } from "next";
import NotFoundContent from "@/app/ui/front/NotFoundContent";

export const metadata: Metadata = {
	title: "Página não encontrada",
	robots: { index: false, follow: true },
};

// 404 dentro do layout público (cabeçalho, rodapé e CSS do site): endereços
// desconhecidos (ver [...notFound]/page.tsx) e notFound() das páginas, ex:
// uma novidade que não existe.
export default function FrontNotFound() {
	return <NotFoundContent />;
}
