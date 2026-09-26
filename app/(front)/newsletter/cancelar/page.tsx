import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/app/ui/front/PageHeader";
import UnsubscribeForm from "./UnsubscribeForm";

export const metadata: Metadata = {
	title: "Cancelar subscrição | Rent a Car Verde",
	robots: { index: false, follow: false },
};

// Destino do link "Cancelar a subscrição" dos emails da newsletter
// (NewsletterService). Pede confirmação com um botão em vez de cancelar ao
// abrir: alguns filtros de email (ex: Outlook Safe Links) abrem os links
// sozinhos e cancelariam a subscrição sem a pessoa querer.
export default function CancelarNewsletterPage() {
	return (
		<div className="bg-slate-100 min-h-screen pb-20">
			<PageHeader titulo="Newsletter" descricao="Cancelar a subscrição" />
			<div className="container mx-auto px-4 mt-10 max-w-xl">
				<Suspense fallback={null}>
					<UnsubscribeForm />
				</Suspense>
			</div>
		</div>
	);
}
