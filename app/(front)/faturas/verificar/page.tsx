"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import PageHeader from "@/app/ui/front/PageHeader";
import { Loader2 } from "lucide-react";

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
			<PageHeader titulo="Verificação de Fatura" descricao="Confirme a autenticidade de um documento emitido pela RentaCarVerde" />
			<div className="container mx-auto px-4 mt-10 max-w-xl">
				{!doc || !sig ? (
					<div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500">
						Este link deve ser aberto a partir do QR code impresso no rodapé de uma fatura da RentaCarVerde.
						Digitaliza o código com a câmara do telemóvel para verificar a autenticidade do documento.
					</div>
				) : loading ? (
					<div className="flex justify-center py-16">
						<Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
					</div>
				) : result?.valid ? (
					<div className="bg-white border border-slate-200 rounded-lg p-8">
						<div className="text-center mb-6">
							<div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-2xl">✓</div>
							<h2 className="text-xl font-bold text-emerald-700">Documento Autêntico</h2>
							<p className="text-slate-500 text-sm mt-1">Este documento foi emitido pela RentaCarVerde e não foi alterado.</p>
						</div>
						<table className="w-full text-sm">
							<tbody>
								<tr className="border-t border-slate-100">
									<td className="py-2 text-slate-500">Nº do Documento</td>
									<td className="py-2 text-right font-bold">{result.documentNumber}</td>
								</tr>
								<tr className="border-t border-slate-100">
									<td className="py-2 text-slate-500">Cliente</td>
									<td className="py-2 text-right">{result.customerName}</td>
								</tr>
								{result.customerNif && (
									<tr className="border-t border-slate-100">
										<td className="py-2 text-slate-500">NIF</td>
										<td className="py-2 text-right">{result.customerNif}</td>
									</tr>
								)}
								{result.subtotal && (
									<tr className="border-t border-slate-100">
										<td className="py-2 text-slate-500">Sub Total</td>
										<td className="py-2 text-right">{result.subtotal} CVE</td>
									</tr>
								)}
								{result.ivaAmount && (
									<tr className="border-t border-slate-100">
										<td className="py-2 text-slate-500">Imposto IVA {result.ivaRate ? `(${result.ivaRate}%)` : ""}</td>
										<td className="py-2 text-right">{result.ivaAmount} CVE</td>
									</tr>
								)}
								<tr className="border-t border-slate-100">
									<td className="py-2 text-slate-500">Total</td>
									<td className="py-2 text-right font-bold">{result.totalAmount} CVE</td>
								</tr>
								<tr className="border-t border-slate-100">
									<td className="py-2 text-slate-500">Data de Emissão</td>
									<td className="py-2 text-right">{result.issuedAt}</td>
								</tr>
							</tbody>
						</table>
					</div>
				) : (
					<div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
						<div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 text-2xl">✕</div>
						<h2 className="text-xl font-bold text-red-700">Documento Inválido</h2>
						<p className="text-slate-500 text-sm mt-1">
							Não foi possível confirmar a autenticidade deste documento — o código não corresponde a nenhuma fatura
							emitida pela RentaCarVerde, ou os valores foram alterados. Contacte{" "}
							<a href="mailto:reservas@rentacarverde.cv" className="text-yellow-600">reservas@rentacarverde.cv</a> se
							acredita que isto é um erro.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default function VerificarFaturaPage() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-yellow-500" /></div>}>
			<VerificarContent />
		</Suspense>
	);
}
