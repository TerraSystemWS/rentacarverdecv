"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import PageHeader from "@/app/ui/front/PageHeader";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface VerificationResult {
	valid: boolean;
	documentNumber: string | null;
	customerName: string | null;
	customerNif: string | null;
	totalAmount: string | null;
	subtotal: string | null;
	ivaRate: string | null;
	ivaAmount: string | null;
	issuedAt: string | null;
}

function VerificarContent() {
	const searchParams = useSearchParams();
	const t = useTranslations("invoiceCheck");
	const doc = searchParams.get("doc");
	const sig = searchParams.get("sig");
	const [result, setResult] = useState<VerificationResult | null>(null);
	const [loading, setLoading] = useState(!!(doc && sig));

	useEffect(() => {
		if (!doc || !sig) return;
		(async () => {
			try {
				const res = await authFetch(endpoints.invoices.verify(doc, sig), { auth: false });
				setResult(await res.json());
			} catch {
				setResult({ valid: false, documentNumber: null, customerName: null, customerNif: null, totalAmount: null, subtotal: null, ivaRate: null, ivaAmount: null, issuedAt: null });
			} finally {
				setLoading(false);
			}
		})();
	}, [doc, sig]);

	return (
		<div className="bg-slate-50 min-h-screen pb-20">
			<PageHeader titulo={t("title")} descricao={t("desc")} />
			<div className="container mx-auto px-4 mt-10 max-w-xl">
				{!doc || !sig ? (
					<div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
						{t("openFromQr")}
					</div>
				) : loading ? (
					<div className="flex justify-center py-16">
						<Loader2 className="w-8 h-8 animate-spin text-green-500" />
					</div>
				) : result?.valid ? (
					<div className="bg-white border border-slate-200 rounded-lg p-8">
						<div className="text-center mb-6">
							<div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
							<h2 className="text-xl font-bold text-emerald-700">{t("validTitle")}</h2>
							<p className="text-slate-500 text-sm mt-1">{t("validText")}</p>
						</div>
						<table className="w-full text-sm">
							<tbody>
								<tr className="border-t border-slate-100">
									<td className="py-2 text-slate-500">{t("number")}</td>
									<td className="py-2 text-right font-bold">{result.documentNumber}</td>
								</tr>
								<tr className="border-t border-slate-100">
									<td className="py-2 text-slate-500">{t("customer")}</td>
									<td className="py-2 text-right">{result.customerName}</td>
								</tr>
								{result.customerNif && (
									<tr className="border-t border-slate-100">
										<td className="py-2 text-slate-500">{t("nif")}</td>
										<td className="py-2 text-right">{result.customerNif}</td>
									</tr>
								)}
								{result.subtotal && (
									<tr className="border-t border-slate-100">
										<td className="py-2 text-slate-500">{t("subtotal")}</td>
										<td className="py-2 text-right">{result.subtotal} CVE</td>
									</tr>
								)}
								{result.ivaAmount && (
									<tr className="border-t border-slate-100">
										<td className="py-2 text-slate-500">{t("vat", { rate: result.ivaRate ? `(${result.ivaRate}%)` : "" })}</td>
										<td className="py-2 text-right">{result.ivaAmount} CVE</td>
									</tr>
								)}
								<tr className="border-t border-slate-100">
									<td className="py-2 text-slate-500">{t("total")}</td>
									<td className="py-2 text-right font-bold">{result.totalAmount} CVE</td>
								</tr>
								<tr className="border-t border-slate-100">
									<td className="py-2 text-slate-500">{t("issuedAt")}</td>
									<td className="py-2 text-right">{result.issuedAt}</td>
								</tr>
							</tbody>
						</table>
					</div>
				) : (
					<div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
						<div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 text-2xl">✕</div>
						<h2 className="text-xl font-bold text-red-700">{t("invalidTitle")}</h2>
						<p className="text-slate-500 text-sm mt-1">
							{t.rich("invalidText", {
								email: (chunks) => <a href="mailto:reservas@rentacarverde.cv" className="text-green-600">{chunks}</a>,
							})}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default function VerificarFaturaPage() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>}>
			<VerificarContent />
		</Suspense>
	);
}
