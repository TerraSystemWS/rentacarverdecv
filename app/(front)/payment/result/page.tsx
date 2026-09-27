"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Ban, Loader2, Printer } from "lucide-react";
import { useAuth } from "@/app/auth/AuthContext";
import { authFetch } from "@/app/auth/api";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import { CompanyProfile, PaymentSummary } from "@/lib/api/types";
import { fmtDateTime, fmtMoney } from "@/lib/utils/format";
import PageHeader from "@/app/ui/front/PageHeader";
import PaymentBrands from "@/app/ui/front/payment/PaymentBrands";
import { useLocale, useTranslations } from "next-intl";
import { localeTags, isLocale } from "@/i18n/config";

// Contacto de apoio ao cliente (o mesmo do rodapé) — o CompanyProfile ainda
// não tem campo de telefone.
const SUPPORT_PHONE = "(+238) 581 09 45";

// Destino do redirect do backend depois da resposta da SISP
// (PaymentController.paymentCallback): ?status=success|failed|cancelled&id=&msg=
export default function PaymentResultPage() {
	return (
		<Suspense fallback={<Spinner />}>
			<PaymentResult />
		</Suspense>
	);
}

function PaymentResult() {
	const search = useSearchParams();
	const t = useTranslations("payment");
	const status = search.get("status");
	const bookingId = Number(search.get("id"));
	const sispMessage = search.get("msg");
	const { isAuthenticated, isLoading } = useAuth();

	const [summary, setSummary] = useState<PaymentSummary | null>(null);
	const [company, setCompany] = useState<CompanyProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${API_BASE_URL}${endpoints.companyProfile.public}`)
			.then((res) => (res.ok ? res.json() : null))
			.then(setCompany)
			.catch(() => { /* recibo mostra os contactos fixos */ });
	}, []);

	useEffect(() => {
		if (isLoading) return;
		if (!isAuthenticated || !bookingId) {
			setLoading(false);
			return;
		}
		authFetch(endpoints.payment.summary(bookingId))
			.then((res) => (res.ok ? res.json() : null))
			.then(setSummary)
			.finally(() => setLoading(false));
	}, [isLoading, isAuthenticated, bookingId]);

	if (isLoading || loading) return <Spinner />;

	// O estado real vem sempre do backend — o "status" da URL só serve de
	// fallback (ex: sessão expirada entretanto).
	const paid = summary ? summary.paymentStatus === "SUCCESS" : status === "success";

	return (
		<div className="bg-slate-100 min-h-screen pb-20">
			<PageHeader titulo={t("title")} descricao={paid ? t("confirmed") : t("notCompleted")} />

			<div className="container mx-auto px-4 mt-10 max-w-3xl">
				{paid ? (
					<Receipt summary={summary} company={company} />
				) : (
					<div className="v2-card text-center space-y-4">
						{status === "cancelled" ? (
							<>
								<Ban className="w-12 h-12 mx-auto text-amber-500" />
								<h2 className="text-xl font-bold text-slate-900">{t("cancelledTitle")}</h2>
								<p className="text-slate-600 text-sm">{t("cancelledText")}</p>
							</>
						) : (
							<>
								<XCircle className="w-12 h-12 mx-auto text-red-500" />
								<h2 className="text-xl font-bold text-slate-900">{t("failedTitle")}</h2>
								<p className="text-slate-600 text-sm">
									{sispMessage || t("failedText")}
								</p>
							</>
						)}
						{summary?.payable && (
							<Link href={`/payment/${summary.bookingId}`} className="btn-racv inline-block px-8">
								{t("tryAgain")}
							</Link>
						)}
						<p className="text-xs text-slate-500">
							{t("needHelp")} {company?.email || "reservas@rentacarverde.cv"} · {SUPPORT_PHONE}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

// Recibo — requisitos da checklist SISP (ponto 7): nome, telefone e email do
// comerciante, URL da loja, contactos de apoio, valor, datas, referência
// única do pagamento e descrição do serviço.
function Receipt({ summary, company }: { summary: PaymentSummary | null; company: CompanyProfile | null }) {
	const attempt = summary?.lastAttempt;
	const t = useTranslations("payment");
	const locale = useLocale();
	return (
		// "receipt-print": ao imprimir só este bloco aparece (ver @media print
		// em globals.css) — sem cabeçalho/rodapé do site nem botões.
		<div className="receipt-print v2-card space-y-6">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src="/logo_b.svg" alt="Rent a Car Verde" className="receipt-logo" />
			<div className="flex items-center gap-3 text-emerald-800">
				<CheckCircle2 className="w-8 h-8 shrink-0" />
				<div>
					<h2 className="text-xl font-bold">{t("receiptTitle")}</h2>
					<p className="text-sm text-slate-600">{t("receiptText")}</p>
				</div>
			</div>

			{summary && (
				<dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm border-t border-slate-200 pt-4">
					<Row label={t("reference")} value={attempt?.merchantRef || summary.merchantRef || "—"} />
					<Row label={t("paymentDate")} value={attempt?.respondedAt ? fmtDateTime(attempt.respondedAt) : "—"} />
					<Row label={t("service")} value={t("serviceValue", { vehicle: summary.vehicle, id: summary.bookingId })} />
					<Row label={t("card")} value={attempt?.panMasked || "—"} />
					<Row label={t("pickup")} value={fmtDateTime(summary.startDate)} />
					<Row label={t("return")} value={fmtDateTime(summary.endDate)} />
					{summary.hasExtraDriver && <Row label={t("extraDriver")} value={t("included")} />}
					{!!summary.discountPercent && <Row label={t("discount")} value={`${summary.discountPercent}%`} />}
				</dl>
			)}

			{summary && (
				<div className="flex items-center justify-between border-t border-slate-200 pt-4">
					<span className="text-base font-semibold text-slate-600">{t("totalPaid")}</span>
					<span className="v2-card__amount">{fmtMoney(summary.amountCve, "CVE", isLocale(locale) ? localeTags[locale] : "pt-PT")}</span>
				</div>
			)}

			<div className="border-t border-slate-200 pt-4 text-xs text-slate-600 space-y-0.5">
				<p className="font-bold text-slate-800">{company?.legalName || company?.name || "Rent a Car Verde"}</p>
				{company?.nif && <p>{t("vatNumber", { nif: company.nif })}</p>}
				{company?.address && <p>{company.address}</p>}
				<p>{company?.email || "reservas@rentacarverde.cv"} · {SUPPORT_PHONE}</p>
				<p>{typeof window !== "undefined" ? window.location.host : "www.rentacarverde.cv"}</p>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
				<PaymentBrands onLight />
				<div className="flex gap-2">
					<button onClick={() => window.print()} className="h-10 px-4 border border-slate-300 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
						<Printer className="w-4 h-4" /> {t("print")}
					</button>
					<Link href="/profile" className="btn-racv px-6">{t("myBookings")}</Link>
				</div>
			</div>
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

function Spinner() {
	return (
		<div className="flex justify-center py-32">
			<Loader2 className="w-8 h-8 animate-spin text-green-500" />
		</div>
	);
}
