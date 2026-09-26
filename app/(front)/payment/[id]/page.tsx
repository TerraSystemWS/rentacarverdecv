"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/app/auth/AuthContext";
import { authFetch } from "@/app/auth/api";
import { endpoints } from "@/lib/api/endpoints";
import { PaymentInitResponse, PaymentSummary } from "@/lib/api/types";
import { countryName } from "@/lib/countries";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";
import PageHeader from "@/app/ui/front/PageHeader";
import PaymentBrands from "@/app/ui/front/payment/PaymentBrands";

// Confirmação antes de ir para o gateway vinti4 (SISP). O cliente vê o resumo
// e a morada de faturação (vem do perfil — exigida pelo 3DSServer 2.2.0) e só
// depois o browser faz o POST para a SISP. O POST é top-level: a SISP não
// permite a página de pagamento dentro de um iframe.
export default function PaymentPage() {
	const params = useParams();
	const router = useRouter();
	const bookingId = Number(params?.id);
	const { isAuthenticated, isLoading } = useAuth();

	const [summary, setSummary] = useState<PaymentSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [redirecting, setRedirecting] = useState(false);
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [gateway, setGateway] = useState<PaymentInitResponse | null>(null);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isLoading, isAuthenticated, router, bookingId]);

	useEffect(() => {
		if (!isAuthenticated || !bookingId) return;
		authFetch(endpoints.payment.summary(bookingId))
			.then(async (res) => {
				if (!res.ok) {
					const body = await res.json().catch(() => null);
					throw new Error(body?.message || "Reserva não encontrada.");
				}
				return res.json();
			})
			.then((data: PaymentSummary) => setSummary(data))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [isAuthenticated, bookingId]);

	useEffect(() => {
		if (gateway && formRef.current) formRef.current.submit();
	}, [gateway]);

	async function handlePay() {
		setError(null);
		setRedirecting(true);
		try {
			const res = await authFetch(endpoints.payment.init(bookingId), { method: "POST" });
			const body = await res.json().catch(() => null);
			if (!res.ok) throw new Error(body?.message || "Não foi possível iniciar o pagamento.");
			setGateway(body as PaymentInitResponse);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível iniciar o pagamento.");
			setRedirecting(false);
		}
	}

	if (isLoading || loading) {
		return (
			<div className="flex justify-center py-32">
				<Loader2 className="w-8 h-8 animate-spin text-green-500" />
			</div>
		);
	}

	return (
		<div className="bg-slate-100 min-h-screen pb-20">
			<PageHeader titulo="Pagamento" descricao="Confirme a sua reserva e pague com cartão" />

			<div className="container mx-auto px-4 mt-10 max-w-3xl">
				{error && (
					<div className="flex items-center gap-2 mb-6 text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-semibold">
						<AlertTriangle className="w-5 h-5 shrink-0" />
						{error}
					</div>
				)}

				{summary && (
					<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
						<div>
							<h3 className="text-sm font-black uppercase tracking-wide text-slate-800 mb-4 pb-2 border-b-2 border-green-400 inline-block">
								Reserva #{summary.bookingId}
							</h3>
							<dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
								<Row label="Viatura" value={summary.vehicle} />
								<Row label="Estado" value={summary.status} />
								<Row label="Levantamento" value={fmtDateTime(summary.startDate)} />
								<Row label="Devolução" value={fmtDateTime(summary.endDate)} />
								{summary.hasExtraDriver && <Row label="Condutor adicional" value="Sim" />}
								{!!summary.discountPercent && <Row label="Desconto" value={`${summary.discountPercent}%`} />}
							</dl>
						</div>

						<div>
							<h3 className="text-sm font-black uppercase tracking-wide text-slate-800 mb-4 pb-2 border-b-2 border-green-400 inline-block">
								Dados de faturação
							</h3>
							<p className="text-sm text-slate-700">
								{summary.customerName}
								<br />
								{summary.customerEmail}
								<br />
								{summary.billingAddress}
								{summary.billingPostCode ? `, ${summary.billingPostCode}` : ""}
								{summary.billingCity ? ` ${summary.billingCity}` : ""}
								<br />
								{countryName(summary.billingCountryCode)}
							</p>
							<Link href="/profile" className="text-xs font-semibold text-green-700 hover:underline">
								Alterar no meu perfil
							</Link>
							{!summary.profileComplete && (
								<p className="mt-2 text-sm font-semibold text-amber-800">
									Complete a morada, cidade e país no seu perfil para poder pagar.
								</p>
							)}
						</div>

						<div className="flex items-center justify-between border-t border-slate-200 pt-4">
							<span className="text-sm font-bold uppercase text-slate-600">Total (IVA incluído)</span>
							<span className="text-2xl font-black text-slate-900">{fmtMoney(summary.amountCve, "CVE")}</span>
						</div>

						{summary.paymentStatus === "SUCCESS" ? (
							<p className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm font-semibold">
								Esta reserva já está paga.
							</p>
						) : !summary.payable ? (
							<p className="text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm font-semibold">
								Esta reserva já não pode ser paga (estado: {summary.status}).
							</p>
						) : (
							<div className="space-y-3">
								<label className="flex items-start gap-2 text-sm text-slate-700">
									<input
										type="checkbox"
										checked={acceptedTerms}
										onChange={(e) => setAcceptedTerms(e.target.checked)}
										className="mt-1"
									/>
									<span>
										Li e aceito as{" "}
										<Link href="/condicoes-gerais" target="_blank" className="text-green-700 font-semibold hover:underline">
											Condições Gerais de Aluguer
										</Link>{" "}
										e a{" "}
										<Link href="/politica-cancelamento" target="_blank" className="text-green-700 font-semibold hover:underline">
											Política de Cancelamento e Reembolso
										</Link>
										.
									</span>
								</label>
								<button
									onClick={handlePay}
									disabled={redirecting || !summary.profileComplete || !acceptedTerms}
									className="btn-racv w-full flex items-center justify-center gap-2 disabled:opacity-50"
								>
									{redirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
									{redirecting ? "A redirecionar para a vinti4..." : "Pagar com cartão"}
								</button>
								<p className="text-xs text-slate-500 text-center">
									Será redirecionado para a página segura da rede vinti4 (SISP). Os dados do cartão
									não passam pelo nosso site.
								</p>
							</div>
						)}

						<div className="flex justify-center">
							<PaymentBrands onLight />
						</div>
					</div>
				)}
			</div>

			{gateway && (
				<form ref={formRef} action={gateway.actionUrl} method="POST" className="hidden">
					{Object.entries(gateway.fields).map(([name, value]) => (
						<input key={name} type="hidden" name={name} value={value} />
					))}
				</form>
			)}
		</div>
	);
}

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt>
			<dd className="text-slate-900 font-semibold">{value}</dd>
		</div>
	);
}
