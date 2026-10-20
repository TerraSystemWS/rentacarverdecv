import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/ui/front/PageHeader";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("deleteAccount");
	return { title: t("metaTitle"), description: t("meta") };
}

// Link "eliminação de conta" exigido pela Google Play (Segurança dos dados)
// para a app RCV Gestão. Descreve o que UserAccountService.anonymize faz
// (clientes) e a desativação das contas da equipa.
export default async function EliminarContaPage() {
	const t = await getTranslations("deleteAccount");
	const email = (chunks: React.ReactNode) => (
		<a href="mailto:reservas@rentacarverde.cv?subject=Eliminar%20conta" className="font-semibold text-green-800 underline">
			{chunks}
		</a>
	);
	return (
		<div className="bg-slate-100 min-h-screen pb-20">
			<PageHeader titulo={t("title")} descricao={t("desc")} />
			<div className="container mx-auto px-4 mt-10 max-w-4xl">
				<article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-700">
					<p>{t("intro")}</p>
					<section>
						<h2 className="text-xl font-bold text-slate-900 mb-3">{t("howTitle")}</h2>
						<ol className="list-decimal pl-6 space-y-2">
							<li>{t.rich("step1", { email })}</li>
							<li>{t("step2")}</li>
							<li>{t("step3")}</li>
						</ol>
						<p className="mt-3">{t("staff")}</p>
					</section>
					<section>
						<h2 className="text-xl font-bold text-slate-900 mb-3">{t("deletedTitle")}</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>{t("deleted1")}</li>
							<li>{t("deleted2")}</li>
							<li>{t("deleted3")}</li>
							<li>{t("deleted4")}</li>
						</ul>
					</section>
					<section>
						<h2 className="text-xl font-bold text-slate-900 mb-3">{t("keptTitle")}</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>{t("kept1")}</li>
							<li>{t("kept2")}</li>
						</ul>
					</section>
					<p>
						{t.rich("more", {
							link: (chunks) => (
								<Link href="/politica-privacidade" className="font-semibold text-green-800 underline">
									{chunks}
								</Link>
							),
						})}
					</p>
				</article>
			</div>
		</div>
	);
}
