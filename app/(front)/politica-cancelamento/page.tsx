import type { Metadata } from "next";
import PageHeader from "@/app/ui/front/PageHeader";
import RichText from "@/app/ui/front/RichText";
import LegalUnavailable from "@/app/ui/front/LegalUnavailable";
import PaymentBrands from "@/app/ui/front/payment/PaymentBrands";
import { getLegalPage } from "@/lib/api/content";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("legal");
	return { title: t("cancellationMetaTitle"), description: t("cancellationMeta") };
}

export const revalidate = 60;

// Exigida pela checklist de validação do site da SISP (ponto 6) para aceitar
// pagamentos vinti4. Texto editável no dashboard (Gestão de Conteúdo >
// Cancelamento); por omissão vem de content-defaults/politica-cancelamento.html.
export default async function PoliticaCancelamentoPage() {
	const locale = await getLocale();
	const doc = await getLegalPage("cancellation", locale);
	const t = await getTranslations("legal");
	return (
		<div className="bg-slate-100 min-h-screen pb-20">
			<PageHeader titulo={t("cancellationTitle")} descricao={t("cancellationDesc")} />
			<div className="container mx-auto px-4 mt-10 max-w-4xl">
				<article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8">
					{doc && !doc.translated && (
						<p lang={locale} className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
							{t("translationNotice")}
						</p>
					)}
					{doc ? <div lang={doc.translated ? locale : "pt"}><RichText html={doc.html} /></div> : <LegalUnavailable />}
					<div className="border-t border-slate-200 pt-6">
						<PaymentBrands onLight />
					</div>
				</article>
			</div>
		</div>
	);
}
