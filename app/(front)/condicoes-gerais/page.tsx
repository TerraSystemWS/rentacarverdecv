import type { Metadata } from "next";
import PageHeader from "@/app/ui/front/PageHeader";
import RichText from "@/app/ui/front/RichText";
import LegalUnavailable from "@/app/ui/front/LegalUnavailable";
import { getLegalPage } from "@/lib/api/content";

export const metadata: Metadata = {
	title: "Condições Gerais de Aluguer | Rent a Car Verde",
	description: "Termos do contrato de aluguer de viaturas celebrado entre a Rent a Car Verde e o locatário.",
};

export const revalidate = 60;

// Texto editável no dashboard (Gestão de Conteúdo > Condições Gerais). Por
// omissão é a transcrição do documento em papel que acompanha o contrato
// (api: content-defaults/condicoes-gerais.html).
export default async function CondicoesGeraisPage() {
	const html = await getLegalPage("conditions");
	return (
		<div className="bg-slate-100 min-h-screen pb-20">
			<PageHeader titulo="Condições Gerais de Aluguer" descricao="Termos do contrato de aluguer" />
			<div className="container mx-auto px-4 mt-10 max-w-4xl">
				<article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm">
					{html ? <RichText html={html} /> : <LegalUnavailable />}
				</article>
			</div>
		</div>
	);
}
