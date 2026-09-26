import type { Metadata } from "next";
import PageHeader from "@/app/ui/front/PageHeader";
import RichText from "@/app/ui/front/RichText";
import LegalUnavailable from "@/app/ui/front/LegalUnavailable";
import PaymentBrands from "@/app/ui/front/payment/PaymentBrands";
import { getLegalPage } from "@/lib/api/content";

export const metadata: Metadata = {
	title: "Política de Cancelamento e Reembolso | Rent a Car Verde",
	description: "Condições de pagamento online, cancelamento, reembolso, entrega e devolução das viaturas da Rent a Car Verde.",
};

export const revalidate = 60;

// Exigida pela checklist de validação do site da SISP (ponto 6) para aceitar
// pagamentos vinti4. Texto editável no dashboard (Gestão de Conteúdo >
// Cancelamento); por omissão vem de content-defaults/politica-cancelamento.html.
export default async function PoliticaCancelamentoPage() {
	const html = await getLegalPage("cancellation");
	return (
		<div className="bg-slate-100 min-h-screen pb-20">
			<PageHeader titulo="Cancelamento e Reembolso" descricao="Pagamento online, cancelamento, entrega e devolução" />
			<div className="container mx-auto px-4 mt-10 max-w-4xl">
				<article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8">
					{html ? <RichText html={html} /> : <LegalUnavailable />}
					<div className="border-t border-slate-200 pt-6">
						<PaymentBrands />
					</div>
				</article>
			</div>
		</div>
	);
}
