import type { Metadata } from "next";
import Link from "next/link";
import NotFoundContent from "@/app/ui/front/NotFoundContent";

export const metadata: Metadata = {
	title: "Página não encontrada",
	robots: { index: false, follow: true },
};

// Fallback fora do layout público (normalmente os endereços desconhecidos
// passam por app/(front)/[...notFound] e mostram a 404 com o cabeçalho do
// site). NotFoundContent não depende do CSS do template, por isso fica bem
// formatado aqui também.
export default function NotFound() {
	return (
		<>
			<div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px", textAlign: "center" }}>
				<Link href="/">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/logo_b.svg" alt="Rent a Car Verde" style={{ height: 40, width: "auto", display: "inline-block" }} />
				</Link>
			</div>
			<NotFoundContent />
		</>
	);
}
