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
import { useLocale, useTranslations } from "next-intl";
import { localeTags, isLocale } from "@/i18n/config";

// Confirmação antes de ir para o gateway vinti4 (SISP). O cliente vê o resumo
// e a morada de faturação (vem do perfil — exigida pelo 3DSServer 2.2.0) e só
// depois o browser faz o POST para a SISP. O POST é top-level: a SISP não
// permite a página de pagamento dentro de um iframe.
export default function PaymentPage() {
	const params = useParams();
	const router = useRouter();
	const t = useTranslations("payment");
	const tStatus = useTranslations("bookingStatus");
	const locale = useLocale();
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
					throw new Error(body?.message || t("notFound"));
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
			if (!res.ok) throw new Error(body?.message || t("initError"));
			setGateway(body as PaymentInitResponse);
		} catch (err) {
			setError(err instanceof Error ? err.message : t("initError"));
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
			<PageHeader titulo={t("title")} descricao={t("subtitle")} />

			<div className="container mx-auto px-4 mt-10 max-w-3xl">
				{error && (
					<div role="alert" className="flex items-center gap-2 mb-6 text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-semibold">
						<AlertTriangle className="w-5 h-5 shrink-0" />
						{error}
					</div>
				)}

				{summary && (
					<div className="v2-card space-y-6">
						<div>
							<h3 className="v2-card__title">
								{t("booking", { id: summary.bookingId })}
							</h3>
							<dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
								<Row label={t("vehicle")} value={summary.vehicle} />
								<Row label={t("status")} value={tStatus.has(summary.status) ? tStatus(summary.status) : summary.status} />
								<Row label={t("pickup")} value={fmtDateTime(summary.startDate)} />
								<Row label={t("return")} value={fmtDateTime(summary.endDate)} />
								{summary.hasExtraDriver && <Row label={t("extraDriver")} value={t("yes")} />}
								{!!summary.discountPercent && <Row label={t("discount")} value={`${summary.discountPercent}%`} />}
							</dl>
						</div>

						<div>
							<h3 className="v2-card__title">
								{t("billing")}
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
								{t("changeInProfile")}
							</Link>
							{!summary.profileComplete && (
								<p className="mt-2 text-sm font-semibold text-amber-800">
									{t("completeProfile")}
								</p>
							)}
						</div>

						<div className="flex items-center justify-between border-t border-slate-200 pt-4">
							<span className="text-base font-semibold text-slate-600">{t("total")}</span>
							<span className="v2-card__amount">{fmtMoney(summary.amountCve, "CVE", isLocale(locale) ? localeTags[locale] : "pt-PT")}</span>
						</div>

						{summary.paymentStatus === "SUCCESS" ? (
							<p className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm font-semibold">
								{t("alreadyPaid")}
							</p>
						) : !summary.payable ? (
							<p className="text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm font-semibold">
								{t("notPayable", { status: tStatus.has(summary.status) ? tStatus(summary.status) : summary.status })}
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
										{t.rich("acceptTerms", {
											terms: (chunks) => <Link href="/condicoes-gerais" target="_blank" className="text-green-700 font-semibold hover:underline">{chunks}</Link>,
											cancel: (chunks) => <Link href="/politica-cancelamento" target="_blank" className="text-green-700 font-semibold hover:underline">{chunks}</Link>,
										})}
									</span>
								</label>
								<button
									onClick={handlePay}
									disabled={redirecting || !summary.profileComplete || !acceptedTerms}
									className="btn-racv w-full flex items-center justify-center gap-2 disabled:opacity-50"
								>
									{redirecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
									{redirecting ? t("redirecting") : t("payByCard")}
								</button>
								<p className="text-xs text-slate-500 text-center">
									{t("redirectInfo")}
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
			<dt className="text-sm text-slate-500">{label}</dt>
			<dd className="text-slate-900 font-semibold">{value}</dd>
		</div>
	);
}
